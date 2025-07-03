-- Zimmer Database für UBHotel
USE ubhotel_zimmer;

-- Zimmer Tabelle (genau wie deine JSON-Struktur)
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    available INT DEFAULT 5,
    features TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Deine exakten JSON-Daten in die DB
INSERT INTO rooms (name, description, price, image, available, features) VALUES
('Deluxe Suite mit Seeblick', 'Großzügige Suite mit King-Size Bett, Balkon und atemberaubendem Blick über den See.', '189€ pro Nacht', '/images/sea_room.jpg', 3, 'Whirlpool,WLAN,Frühstück'),

('Standard Zimmer', 'Gemütliches Zimmer mit moderner Ausstattung und kleinem Schreibtisch.', '99€ pro Nacht', '/images/standard_room.jpg', 5, 'WLAN,Doppelbett'),

('Familienzimmer mit Terrasse', 'Geräumiges Zimmer für bis zu 5 Personen mit Zugang zur Gartenterrasse.', '129€ pro Nacht', '/images/family_room.jpg', 2, 'Gartenblick,Frühstück,Babybett'),

('Panorama Loft mit Dachterrasse', 'Exklusives Loft mit bodentiefen Fenstern, Privatterrasse und 270°-Panoramablick auf die Berge.', '239€ pro Nacht', '/images/panorama_roof.jpg', 2, 'Bergblick,Badewanne,WLAN,Dachterrasse'),

('Wellness Suite mit Spa-Zugang', 'Suite mit kostenfreiem Zugang zum hauseigenen Spa, Regenwalddusche und Relax-Sessel.', '199€ pro Nacht', '/images/wellness_suite.jpg', 4, 'Wellness,Spa-Zugang,Kaffeeautomat,WLAN'),

('Business Zimmer mit Arbeitsplatz', 'Perfekt für Geschäftsreisende: ruhiges Zimmer mit Schreibtisch, schnellem WLAN und Druckerzugang.', '109€ pro Nacht', '/images/business_room.jpg', 3, 'Schreibtisch,Drucker,WLAN,Frühstück'),

('Romantik Suite mit Kamin', 'Charmante Suite mit offenem Kamin, Himmelbett und direktem Zugang zum Wellnessbereich.', '179€ pro Nacht', '/images/romantic_room.jpg', 2, 'Kamin,Himmelbett,Spa-Zugang,WLAN'),

('Eco-Zimmer mit Naturblick', 'Nachhaltig eingerichtetes Zimmer mit Naturmaterialien, Bio-Bettwäsche und Blick ins Grüne.', '119€ pro Nacht', '/images/eco_room_nature.jpg', 4, 'Nachhaltig,Holzmöbel,Naturblick,Bio-Frühstück'),

('Penthouse mit Whirlpool & Skyline View', 'Luxuriöses Penthouse mit Whirlpool auf der Dachterrasse und Blick über die Stadt.', '299€ pro Nacht', '/images/skyline_jacuzzi.jpg', 1, 'Skyline,Whirlpool,Dachterrasse,Minibar');