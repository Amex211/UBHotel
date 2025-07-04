-- Datenbank erstellen falls nicht vorhanden
CREATE DATABASE IF NOT EXISTS ubhotel_buchung CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Datenbank auswählen
USE ubhotel_buchung;

-- Buchungen Tabelle erstellen
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indizes für bessere Performance
CREATE INDEX idx_buchungen_email ON buchungen(email);
CREATE INDEX idx_buchungen_anreise ON buchungen(anreise);
CREATE INDEX idx_buchungen_status ON buchungen(status);


INSERT INTO buchungen (name, email, adresse, zimmer, anreise, abreise) VALUES
('Max Mustermann', 'max@example.com', 'Musterstraße 1, 12345 Musterstadt', 'deluxe', '2025-08-15', '2025-08-20');