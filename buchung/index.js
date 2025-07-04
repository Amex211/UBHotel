//  BUCHUNG SERVICE MIT MARIADB 
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

//  DATENBANK KONFIGURATION 
const dbConfig = {
  host: process.env.DB_HOST || 'buchung-mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ubhotel_buchung',
  charset: 'utf8mb4'
};

//  DATENBANK VERBINDUNG 
let db;

//  RETRY-FUNKTION FÜR DB-VERBINDUNG 
async function connectWithRetry(maxRetries = 10, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(` Verbindungsversuch ${i + 1}/${maxRetries} zur Buchung-DB...`);
      db = await mysql.createConnection(dbConfig);
      console.log(' Erfolgreich mit Buchung-DB verbunden');
      return db;
    } catch (error) {
      console.error(` Verbindungsversuch ${i + 1} fehlgeschlagen:`, error.message);
      
      if (i === maxRetries - 1) {
        console.error(' Maximale Anzahl von Verbindungsversuchen erreicht');
        process.exit(1);
      }
      
      console.log(` Warte ${delay/1000} Sekunden vor dem nächsten Versuch...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

//  DATENBANK INITIALISIERUNG 
async function initializeDB() {
  try {
    // Buchungen-Tabelle erstellen
    await db.execute(`
      CREATE TABLE IF NOT EXISTS buchungen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        adresse TEXT NOT NULL,
        zimmer ENUM('standard', 'deluxe', 'suite') NOT NULL,
        anreise DATE NOT NULL,
        abreise DATE NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log(' Buchungen-Tabelle bereit');
    
  } catch (error) {
    console.error(' DB-Initialisierung fehlgeschlagen:', error);
  }
}

//  BUCHUNG ERSTELLEN 
async function createBuchung(buchungsDaten) {
  try {
    const { name, email, adresse, zimmer, anreise, abreise } = buchungsDaten;
    
    const [result] = await db.execute(
      `INSERT INTO buchungen (name, email, adresse, zimmer, anreise, abreise) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, adresse, zimmer, anreise, abreise]
    );
    
    console.log(` Buchung erstellt mit ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error(' Fehler beim Erstellen der Buchung:', error);
    throw error;
  }
}

//  ALLE BUCHUNGEN ABRUFEN 
async function getAllBuchungen() {
  try {
    const [rows] = await db.execute('SELECT * FROM buchungen ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error(' Fehler beim Abrufen der Buchungen:', error);
    return [];
  }
}

//  EXPRESS KONFIGURATION 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES 

// Buchungsformular anzeigen
app.get('/', (req, res) => {
  res.render('index');
});

// Buchung erstellen (POST)
app.post('/api/buchung', async (req, res) => {
  try {
    const { name, email, adresse, zimmer, anreise, abreise } = req.body;
    
    // Validierung
    if (!name || !email || !adresse || !zimmer || !anreise || !abreise) {
      return res.status(400).json({ 
        error: 'Alle Felder sind erforderlich' 
      });
    }
    
    // Datum validieren
    const anreiseDatum = new Date(anreise);
    const abreiseDatum = new Date(abreise);
    const heute = new Date();
    
    if (anreiseDatum < heute) {
      return res.status(400).json({ 
        error: 'Anreisedatum muss in der Zukunft liegen' 
      });
    }
    
    if (abreiseDatum <= anreiseDatum) {
      return res.status(400).json({ 
        error: 'Abreisedatum muss nach dem Anreisedatum liegen' 
      });
    }
    
    // Buchung erstellen
    const buchungId = await createBuchung(req.body);
    
    res.json({ 
      success: true, 
      message: 'Buchung erfolgreich erstellt!',
      buchungId: buchungId 
    });
    
  } catch (error) {
    console.error(' Fehler bei Buchungserstellung:', error);
    res.status(500).json({ 
      error: 'Fehler beim Erstellen der Buchung' 
    });
  }
});

// API: Alle Buchungen abrufen
app.get('/api/buchungen', async (req, res) => {
  try {
    const buchungen = await getAllBuchungen();
    res.json(buchungen);
  } catch (error) {
    console.error(' API-Fehler:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Buchungen' });
  }
});

// Admin-Panel für Buchungen
app.get('/admin', async (req, res) => {
  try {
    const buchungen = await getAllBuchungen();
    res.render('admin', { buchungen });
  } catch (error) {
    console.error(' Fehler beim Laden der Admin-Seite:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Buchungen' });
  }
});

//  HEALTH CHECK 
app.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'healthy', service: 'buchung' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

//  SERVER STARTEN 
async function startServer() {
  await connectWithRetry();
  await initializeDB();
  
  app.listen(PORT, () => {
    console.log(` Buchung-Service läuft auf http://localhost:${PORT}`);
    console.log(` Buchungen werden in der Datenbank gespeichert!`);
  });
}

//  GRACEFUL SHUTDOWN 
process.on('SIGTERM', async () => {
  console.log(' Buchung-Service wird beendet...');
  if (db) {
    await db.end();
  }
  process.exit(0);
});

// Server starten
startServer().catch(console.error);