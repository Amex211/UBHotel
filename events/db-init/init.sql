-- === EVENTS DATENBANK INITIALISIERUNG ===

-- Datenbank erstellen falls nicht vorhanden
CREATE DATABASE IF NOT EXISTS ubhotel_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Datenbank auswählen
USE ubhotel_events;

-- Events Tabelle erstellen
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Beispiel-Events einfügen (ohne Emojis in den Tags)
INSERT INTO events (title, description, image, location, date, tags) VALUES
('Live Jazz Abend', 'Genießen Sie entspannte Jazzklänge mit einem Glas Rotwein.', 'jazz.jpg', 'Hotelgarten', 'Freitag, 12. Juli – 19:30 Uhr', '["Musik", "Wein", "Abend"]'),
('Kulinarischer Workshop', 'Lernen Sie mit unseren Küchenchefs mediterrane Rezepte kennen.', 'cooking.jpg', 'Kochstudio – EG', 'Samstag, 13. Juli – 14:00 Uhr', '["Kochen", "Genuss", "Workshop"]'),
('Weinverkostung', 'Entdecken Sie erlesene Weine aus der Region mit unserem Sommelier.', 'wine.jpg', 'Weinkeller', 'Sonntag, 14. Juli – 16:00 Uhr', '["Wein", "Käse", "Genuss"]');

-- Index für bessere Performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_location ON events(location);