// === EVENTS SERVICE MIT MARIADB ===
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// === DATENBANK KONFIGURATION ===
const dbConfig = {
  host: process.env.DB_HOST || 'events-mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ubhotel_events',
  charset: 'utf8mb4'
};

// === DATENBANK VERBINDUNG ===
let db;

// === RETRY-FUNKTION FÜR DB-VERBINDUNG ===
async function connectWithRetry(maxRetries = 10, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 Verbindungsversuch ${i + 1}/${maxRetries} zur Events-DB...`);
      db = await mysql.createConnection(dbConfig);
      console.log('✅ Erfolgreich mit Events-DB verbunden');
      return db;
    } catch (error) {
      console.error(`❌ Verbindungsversuch ${i + 1} fehlgeschlagen:`, error.message);
      
      if (i === maxRetries - 1) {
        console.error('💥 Maximale Anzahl von Verbindungsversuchen erreicht');
        process.exit(1);
      }
      
      console.log(`⏳ Warte ${delay/1000} Sekunden vor dem nächsten Versuch...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// === DATENBANK INITIALISIERUNG ===
async function initializeDB() {
  try {
    // Nur Tabelle erstellen falls nicht vorhanden - keine automatischen Inserts
    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        location VARCHAR(255),
        date VARCHAR(255),
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Events-Tabelle bereit - Daten werden von init.sql verwaltet');
    
  } catch (error) {
    console.error('❌ DB-Initialisierung fehlgeschlagen:', error);
  }
}

// === ALLE EVENTS ABRUFEN ===
async function getAllEvents() {
  try {
    const [rows] = await db.execute('SELECT * FROM events ORDER BY created_at DESC');
    
    // JSON-Tags parsen
    return rows.map(event => ({
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : []
    }));
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Events:', error);
    return [];
  }
}

// === EXPRESS KONFIGURATION ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === ROUTES ===

// Events-Seite anzeigen (ersetzt die alte JSON-basierte Route)
app.get('/', async (req, res) => {
  try {
    const events = await getAllEvents();
    res.render('events', { events });
  } catch (error) {
    console.error('❌ Fehler beim Laden der Events-Seite:', error);
    res.status(500).render('error', { 
      message: 'Fehler beim Laden der Events',
      error: error 
    });
  }
});

// API: Alle Events als JSON
app.get('/api/events', async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('❌ API-Fehler:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Events' });
  }
});

// API: Event erstellen
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, image, location, date, tags } = req.body;
    
    await db.execute(
      'INSERT INTO events (title, description, image, location, date, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, location, date, JSON.stringify(tags || [])]
    );
    
    res.json({ success: true, message: 'Event erstellt' });
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Events:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Events' });
  }
});

// === HEALTH CHECK ===
app.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'healthy', service: 'events' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// === SERVER STARTEN ===
async function startServer() {
  await connectWithRetry();
  await initializeDB();
  
  app.listen(PORT, () => {
    console.log(`🎉 Events-Service läuft auf http://localhost:${PORT}`);
    console.log(`📊 Events werden jetzt aus der Datenbank geladen!`);
  });
}

// === GRACEFUL SHUTDOWN ===
process.on('SIGTERM', async () => {
  console.log('🔄 Events-Service wird beendet...');
  if (db) {
    await db.end();
  }
  process.exit(0);
});

// Server starten
startServer().catch(console.error);