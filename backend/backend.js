const express = require('express');
const layout = require('express-ejs-layouts');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(layout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'mainLayout.ejs');
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;

// Homepage
app.get('/', async (req, res) => {
  const response = await axios.get('http://homepage:3000/');
  const body = extractBody(response.data);
  res.render('mainLayout', {
    body,
    styles: ['/styles/homepage.css','/styles/layout.css'],
    scripts: ['/scripts/index.js'],
    title: 'UBHotel – Startseite'
  });
});

app.get('/zimmer', async (req, res) => {
  const response = await axios.get('http://zimmer:3000/');
  const body = extractBody(response.data);

  res.render('mainLayout', {
    title: 'Zimmer – UBHotel',
    body,
    styles: [
      '/styles/layout.css',
      'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css',
      '/zimmer/styles/zimmer.css'
    ],
    scripts: [
      'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js',
      '/zimmer/scripts/zimmer.js'
    ]
  });
});

app.get('/events', async (req, res) => {
  const response = await axios.get('http://events:3000/');
  const body = extractBody(response.data);

  res.render('mainLayout', {
    title: 'Events – UBHotel',
    body,
    styles: [
      '/styles/layout.css',
      'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css',
      '/events/styles/events.css'
    ],
    scripts: [
      'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js',
      '/events/scripts/events.js'
    ]
  });
});

app.get('/buchung', async (req, res) => {
  const response = await axios.get('http://buchung:3000/');
  const body = extractBody(response.data);

  res.render('mainLayout', {
    title: 'Buchung – UBHotel',
    body,
    styles: ['/styles/layout.css', '/buchung/styles/buchung.css'],
    scripts: ['/buchung/scripts/buchung.js']
  });
});

app.get('/media', async (req, res) => {
  const response = await axios.get('http://media:3000/');
  const body = extractBody(response.data);

  res.render('mainLayout', {
    title: 'Media – UBHotel',
    body,
    styles: ['/styles/layout.css', '/media/styles/media.css'],
    scripts: ['/media/scripts/media.js']
  });
});

app.get('/wetter', async (req, res) => {
  const response = await axios.get('http://wetter:3000/');
  const body = extractBody(response.data);

  res.render('mainLayout', {
    title: 'Wetter – UBHotel',
    body,
    styles: ['/styles/layout.css', '/wetter/styles/wetter.css'],
    scripts: ['/wetter/scripts/wetter.js']
  });
});

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
