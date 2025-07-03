// === ZIMMER SEITE - SWIPER KARUSSELL ===

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏠 Zimmer Seite geladen!');
  
  // 🎠 Swiper initialisieren (mit Swiper CDN)
  const swiper = new Swiper('.mySwiper', {
    // Grundeinstellungen
    loop: true,
    centeredSlides: true,
    spaceBetween: 30,
    
    // Auto-Play
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    
    // Navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    
    // Pagination Dots
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    
    // Responsive Breakpoints
    breakpoints: {
      // Mobile
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // Tablet
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      // Desktop
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // Large Desktop
      1400: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    },
    
    // Smooth Transitions
    speed: 600,
    effect: 'slide',
    
    // Touch/Mouse
    grabCursor: true,
    touchRatio: 1,
    
    // Keyboard Navigation
    keyboard: {
      enabled: true,
      onlyInViewport: true
    }
  });
  
  // 🎯 Zusätzliche Interaktionen
  const zimmerCards = document.querySelectorAll('.zimmer-card');
  
  zimmerCards.forEach((card, index) => {
    // 🎨 Hover-Effekte verstärken
    card.addEventListener('mouseenter', () => {
      // Auto-play pausieren bei Hover
      swiper.autoplay.stop();
    });
    
    card.addEventListener('mouseleave', () => {
      // Auto-play wieder starten
      swiper.autoplay.start();
    });
    
    // 📱 Touch-Feedback für Mobile
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
  
  // 🌟 Feature Icons animieren
  const features = document.querySelectorAll('.feature-icon');
  features.forEach((feature, index) => {
    feature.addEventListener('mouseenter', () => {
      feature.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    feature.addEventListener('mouseleave', () => {
      feature.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // 🎯 Verfügbarkeits-Badge Animation
  const badges = document.querySelectorAll('.availability-badge');
  badges.forEach(badge => {
    if (badge.classList.contains('low') || badge.classList.contains('sold-out')) {
      // Sanftes Blinken für wenige/keine Zimmer
      setInterval(() => {
        badge.style.opacity = badge.style.opacity === '0.7' ? '1' : '0.7';
      }, 2000);
    }
  });
  
  // 🎪 Slide Change Events
  swiper.on('slideChange', () => {
    console.log(`📍 Aktuelle Slide: ${swiper.activeIndex}`);
  });
  
  // ⌨️ Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      swiper.slidePrev();
    } else if (e.key === 'ArrowRight') {
      swiper.slideNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (swiper.autoplay.running) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
    }
  });
  
  // 📊 Statistiken loggen
  const totalRooms = zimmerCards.length;
  const availableRooms = Array.from(document.querySelectorAll('.availability-badge'))
    .filter(badge => !badge.classList.contains('sold-out')).length;
  
  console.log(`✅ ${totalRooms} Zimmer geladen, ${availableRooms} verfügbar`);
  console.log('🎮 Steuerung: ←→ Pfeiltasten, Leertaste = Auto-play an/aus');
});