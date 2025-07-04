

document.addEventListener('DOMContentLoaded', () => {
  console.log(' Zimmer Seite geladen!');
  

  const swiper = new Swiper('.mySwiper', {

    loop: true,
    centeredSlides: true,
    spaceBetween: 30,
    

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    
    
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    
 
    breakpoints: {
      
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
     
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
 
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
  
      1400: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    },
    

    speed: 600,
    effect: 'slide',
    

    grabCursor: true,
    touchRatio: 1,
    

    keyboard: {
      enabled: true,
      onlyInViewport: true
    }
  });
  

  const zimmerCards = document.querySelectorAll('.zimmer-card');
  
  zimmerCards.forEach((card, index) => {
 
    card.addEventListener('mouseenter', () => {
     
      swiper.autoplay.stop();
    });
    
    card.addEventListener('mouseleave', () => {
      
      swiper.autoplay.start();
    });
    
  
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
  

  const features = document.querySelectorAll('.feature-icon');
  features.forEach((feature, index) => {
    feature.addEventListener('mouseenter', () => {
      feature.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    feature.addEventListener('mouseleave', () => {
      feature.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  
  const badges = document.querySelectorAll('.availability-badge');
  badges.forEach(badge => {
    if (badge.classList.contains('low') || badge.classList.contains('sold-out')) {
      
      setInterval(() => {
        badge.style.opacity = badge.style.opacity === '0.7' ? '1' : '0.7';
      }, 2000);
    }
  });
  

  swiper.on('slideChange', () => {
    console.log(` Aktuelle Slide: ${swiper.activeIndex}`);
  });
  
 
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
  

  const totalRooms = zimmerCards.length;
  const availableRooms = Array.from(document.querySelectorAll('.availability-badge'))
    .filter(badge => !badge.classList.contains('sold-out')).length;
  
  console.log(` ${totalRooms} Zimmer geladen, ${availableRooms} verfügbar`);
  console.log(' Steuerung: ←→ Pfeiltasten, Leertaste = Auto-play an/aus');
});