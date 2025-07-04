
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementsByClassName('close')[0];
  const images = document.querySelectorAll('.media-img');

 
  function openModal(imageSrc) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    modalImg.src = imageSrc;
    
   
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
    
  
    document.body.style.overflow = 'hidden';
  }


  function closeModal() {
    modal.classList.remove('show');
    

    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.add('hidden');
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }


  images.forEach(img => {

    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    img.addEventListener('click', function() {
      openModal(this.src);
    });
    
    img.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(this.src);
      }
    });
    
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View ${this.alt} in full size`);
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('show')) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
  });

  function smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.videos, .bilder').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  images.forEach((img, index) => {
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    img.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(img);
  });

  document.querySelectorAll('.video-grid iframe').forEach(iframe => {
    iframe.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    iframe.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});