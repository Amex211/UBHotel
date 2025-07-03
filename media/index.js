const express = require('express');
const path = require('path');
const Minio = require('minio');

const app = express();
const PORT = 3000;

// EJS konfigurieren
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MinIO-Client konfigurieren
const minioClient = new Minio.Client({
  endPoint: 'media-minio',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

// Bucket public machen
async function makeBucketPublic(bucketName) {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };
  
  try {
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`Bucket '${bucketName}' ist jetzt public!`);
  } catch (err) {
    console.error('Fehler beim Public-machen des Buckets:', err);
  }
}

// Route: Media-Galerie anzeigen
app.get('/', async (req, res) => {
  const bucketName = 'uploads';
  
  try {
    // Check if bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      console.log('Bucket does not exist, creating it...');
      await minioClient.makeBucket(bucketName);
      await makeBucketPublic(bucketName);
    } else {
      // Make sure bucket is public
      await makeBucketPublic(bucketName);
    }

    // Get all objects
    const objects = [];
    const stream = minioClient.listObjectsV2(bucketName, '', true);
    
    for await (const obj of stream) {
      objects.push(obj);
    }

    // Generate PUBLIC URLs instead of presigned URLs
    const imageList = objects.map(obj => {
      // Public URL format: http://localhost:9100/bucket-name/object-name
      const publicUrl = `http://localhost:9100/${bucketName}/${obj.name}`;
      return { 
        name: obj.name, 
        url: publicUrl 
      };
    });
    
    console.log(`Loaded ${imageList.length} images from MinIO`);
    res.render('index', { images: imageList });

  } catch (err) {
    console.error('Fehler beim Laden der Bilder aus MinIO:', err);
    res.render('index', { images: [] });
  }
});

// Debug route
app.get('/debug', async (req, res) => {
  const bucketName = 'uploads';
  
  try {
    const buckets = await minioClient.listBuckets();
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      return res.json({ 
        error: `Bucket '${bucketName}' does not exist`,
        availableBuckets: buckets 
      });
    }
    
    const objects = [];
    const stream = minioClient.listObjectsV2(bucketName, '', true);
    
    for await (const obj of stream) {
      objects.push(obj);
    }
    
    const imageList = objects.map(obj => ({
      name: obj.name,
      size: obj.size,
      lastModified: obj.lastModified,
      publicUrl: `http://localhost:9100/${bucketName}/${obj.name}`
    }));
    
    res.json({
      status: 'OK',
      bucketExists,
      objectCount: objects.length,
      images: imageList,
      minioEndpoint: 'localhost:9100'
    });
    
  } catch (err) {
    res.json({ 
      error: err.message,
      stack: err.stack 
    });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Media-Service läuft auf http://localhost:${PORT}`);
});