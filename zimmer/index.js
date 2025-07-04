const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// MySQL laden
const mysql = require('mysql2/promise');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const dbConfig = {
  host: 'zimmer-mysql',
  user: 'root',
  password: 'root',
  database: 'ubhotel_zimmer',
  charset: 'utf8mb4'
};

const db = mysql.createPool(dbConfig);

// Emoji-Mapping
const emojiMap = {
  'Whirlpool': '🔥 Whirlpool',
  'WLAN': '📶 WLAN',
  'Frühstück': '🍽 Frühstück',
  'Doppelbett': '🛏 Doppelbett',
  'Gartenblick': '🌳 Gartenblick',
  'Babybett': '🍼 Babybett',
  'Bergblick': '🌄 Bergblick',
  'Badewanne': '🛁 Badewanne',
  'Dachterrasse': '🌞 Dachterrasse',
  'Wellness': '🧖 Wellness',
  'Spa-Zugang': '🌿 Spa-Zugang',
  'Kaffeeautomat': '☕ Kaffeeautomat',
  'Schreibtisch': '💼 Schreibtisch',
  'Drucker': '📠 Drucker',
  'Kamin': '❤️ Kamin',
  'Himmelbett': '🛏 Himmelbett',
  'Nachhaltig': '🌿 Nachhaltig',
  'Holzmöbel': '🪵 Holzmöbel',
  'Naturblick': '☀️ Naturblick',
  'Bio-Frühstück': '🍽 Bio-Frühstück',
  'Skyline': '🏙 Skyline',
  'Minibar': '🍷 Minibar'
};

// === NUR DATENBANK - ZIMMER LADEN ===
async function getAllZimmer() {
  try {
    const [rows] = await db.execute('SELECT * FROM rooms ORDER BY id');
    
    return rows.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      price: room.price,
      image: room.image,
      available: room.available,
      features: room.features ? room.features.split(',').map(f => emojiMap[f.trim()] || f.trim()) : []
    }));
  } catch (error) {
    console.error(' Fehler beim Abrufen der Zimmer:', error);
    throw error; // Fehler weiterwerfen statt leeres Array zurückgeben
  }
}

// Hauptroute - NUR DATENBANK
app.get("/", async (req, res) => {
  try {
    const rooms = await getAllZimmer();
    console.log(` ${rooms.length} Zimmer aus MySQL geladen`);
    res.render("zimmer", { rooms });
  } catch (error) {
    console.error(' Datenbankfehler:', error);
    res.status(500).render("error", { 
      message: "Fehler beim Laden der Zimmer",
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Gesundheitscheck
app.get("/health", async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send('Seite nicht gefunden');
});

// Fehlerbehandlung
app.use((error, req, res, next) => {
  console.error(' Server-Fehler:', error);
  res.status(500).send('Interner Server-Fehler');
});

app.listen(PORT, () => {
  console.log(` Zimmer-Service läuft auf http://localhost:${PORT}`);
  console.log(` Verwende nur MySQL-Datenbank`);
});