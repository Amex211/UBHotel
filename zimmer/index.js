const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Versuche MySQL zu laden, falls verfügbar
let mysql;
try {
  mysql = require('mysql2/promise');
} catch (error) {
  console.log('📋 MySQL nicht verfügbar, verwende JSON-Fallback');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection (optional)
let db = null;
if (mysql) {
  const dbConfig = {
    host: 'zimmer-mysql',
    user: 'root',
    password: 'root',
    database: 'ubhotel_zimmer',
    charset: 'utf8mb4'
  };

  // Versuche DB-Verbindung
  mysql.createPool(dbConfig).getConnection()
    .then(connection => {
      db = mysql.createPool(dbConfig);
      connection.release();
      console.log('✅ MySQL verbunden - verwende Datenbank');
    })
    .catch(error => {
      console.log('📋 MySQL nicht erreichbar - verwende JSON-Fallback');
    });
}

// Emoji-Mapping (wie in deiner JSON)
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
  'Whirlpool': '🛁 Whirlpool',
  'Minibar': '🍷 Minibar'
};

// === ZIMMER AUS DATENBANK LADEN ===
async function getAllZimmer() {
  try {
    // ÄNDERE: zimmer → rooms
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
    console.error('❌ Fehler beim Abrufen der Zimmer:', error);
    return [];
  }
}

// Deine bestehende JSON-Funktion (unverändert)
function getRoomsFromJSON() {
  const data = fs.readFileSync(path.join(__dirname, "data", "rooms.json"));
  return JSON.parse(data);
}

// Hauptroute (fast unverändert)
app.get("/", async (req, res) => {
  let rooms;
  
  if (db) {
    rooms = await getRoomsFromDB();
    console.log(`📊 ${rooms.length} Zimmer aus MySQL geladen`);
  } else {
    rooms = getRoomsFromJSON();
    console.log(`📋 ${rooms.length} Zimmer aus JSON geladen`);
  }
  
  res.render("zimmer", { rooms });
});

app.listen(PORT, () => {
  console.log(`🏠 Zimmer-Service läuft auf http://localhost:${PORT}`);
});