const express = require('express');
const path = require('path');

const { createClient } = require('redis');
const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.connect().catch(console.error);

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/wetter', async (req, res) => {
  try {
    const data = await redisClient.get('wetter:data');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Lesen der Wetterdaten' });
  }
});

app.listen(PORT, () => {
  console.log(`Wetter-Service läuft auf http://localhost:${PORT}`);
});
