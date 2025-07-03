const { createClient } = require('redis');

const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.connect();

const datenSet = [
  { ort: "Esslingen", temperatur: "22°C", beschreibung: "Sonnig", icon: "/wetter/images/sun.svg" },
  { ort: "Esslingen", temperatur: "17°C", beschreibung: "Leicht bewölkt", icon: "/wetter/images/cloudy.svg" },
  { ort: "Esslingen", temperatur: "13°C", beschreibung: "Regen", icon: "/wetter/images/rain.svg" },
  { ort: "Esslingen", temperatur: "10°C", beschreibung: "Stark bewölkt", icon: "/wetter/images/cloud.svg" }
];

function schreibeNeuesWetter() {
  const random = datenSet[Math.floor(Math.random() * datenSet.length)];
  redisClient.set('wetter:data', JSON.stringify(random));
  console.log("Wetter aktualisiert:", random);
}

setInterval(schreibeNeuesWetter, 10000);
