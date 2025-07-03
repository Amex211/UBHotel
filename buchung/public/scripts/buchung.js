// === BUCHUNGSFORMULAR MIT DATABASE ===

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buchungForm');
  const erfolgBox = document.getElementById('buchungErfolg');
  const inputs = document.querySelectorAll('input, select');

  // 🎯 Formular absenden
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 📋 Buchungsdaten sammeln
    const buchungsDaten = {
      name: form.name.value,
      email: form.email.value,
      adresse: form.adresse.value,
      zimmer: form.zimmer.value,
      anreise: form.anreise.value,
      abreise: form.abreise.value
    };
    
    // 🔄 Loading-Zustand
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '⏳ Wird gesendet...';
    submitButton.disabled = true;
    
    try {
      // 📡 Daten an Server senden (über nginx mit korrektem Pfad)
      const response = await fetch('/buchung/api/buchung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buchungsDaten)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // ✅ Erfolgreich
        console.log('✅ Buchung erfolgreich:', result);
        zeigeErfolg(`Buchung erfolgreich erstellt! ID: ${result.buchungId}`);
      } else {
        // ❌ Fehler vom Server
        console.error('❌ Server-Fehler:', result.error);
        zeigeFehler(result.error);
      }
      
    } catch (error) {
      // ❌ Netzwerk-Fehler
      console.error('❌ Netzwerk-Fehler:', error);
      zeigeFehler('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      // 🔄 Button zurücksetzen
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });

  // 🎉 Erfolgs-Animation anzeigen
  function zeigeErfolg(message) {
    // Formular leeren
    form.reset();
    
    // Erfolgs-Box anzeigen
    erfolgBox.textContent = `🎉 ${message}`;
    erfolgBox.classList.remove('hidden');
    erfolgBox.style.background = '#4CAF50';
    erfolgBox.style.color = 'white';
    
    // Container Animation
    const container = document.querySelector('.buchung-container');
    container.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
      container.style.transform = 'scale(1)';
    }, 200);
    
    // Erfolgs-Box nach 8 Sekunden verstecken
    setTimeout(() => {
      erfolgBox.classList.add('hidden');
    }, 8000);
  }

  // ❌ Fehler-Animation anzeigen
  function zeigeFehler(message) {
    erfolgBox.textContent = `❌ ${message}`;
    erfolgBox.classList.remove('hidden');
    erfolgBox.style.background = '#f44336';
    erfolgBox.style.color = 'white';
    
    // Container schütteln
    const container = document.querySelector('.buchung-container');
    container.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
      container.style.animation = '';
    }, 500);
    
    // Fehler-Box nach 5 Sekunden verstecken
    setTimeout(() => {
      erfolgBox.classList.add('hidden');
    }, 5000);
  }

  // 📅 Mindest-Datum auf heute setzen
  function setzeMinimumDatum() {
    const heute = new Date().toISOString().split('T')[0];
    document.getElementById('anreise').min = heute;
    document.getElementById('abreise').min = heute;
  }

  // 🔄 Abreise-Datum automatisch nach Anreise setzen
  document.getElementById('anreise').addEventListener('change', (e) => {
    const anreiseDatum = e.target.value;
    const abreiseInput = document.getElementById('abreise');
    
    // Abreise muss nach Anreise sein
    abreiseInput.min = anreiseDatum;
    
    // Wenn Abreise vor Anreise liegt, zurücksetzen
    if (abreiseInput.value && abreiseInput.value <= anreiseDatum) {
      abreiseInput.value = '';
    }
  });

  // ✨ Sanfte Eingabe-Animationen
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
      input.style.transform = 'translateY(0)';
    });
  });

  // 🎯 Initialisierung
  setzeMinimumDatum();
  
  console.log('🚀 Buchungsformular ist bereit!');
});

// CSS für shake Animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);