// Enhanced Modal Functionality for Image Gallery
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementsByClassName('close')[0];
  const images = document.querySelectorAll('.media-img');

  // Smooth modal opening with animation
  function openModal(imageSrc) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    modalImg.src = imageSrc;
    
    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }

  // Smooth modal closing with animation
  function closeModal() {
    modal.classList.remove('show');
    
    // Wait for animation to complete
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.add('hidden');
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  // Image click handlers
  images.forEach(img => {
    // Add loading state
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    img.addEventListener('click', function() {
      openModal(this.src);
    });
    
    // Add keyboard navigation for accessibility
    img.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(this.src);
      }
    });
    
    // Make images focusable for accessibility
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View ${this.alt} in full size`);
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Click outside to close
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('show')) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
  });

  // Smooth scroll to sections (bonus feature)
  function smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Add intersection observer for fade-in animations
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

  // Apply fade-in animation to sections
  document.querySelectorAll('.videos, .bilder').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Apply staggered animation to images
  images.forEach((img, index) => {
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    img.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(img);
  });

  // Add smooth hover effects for videos
  document.querySelectorAll('.video-grid iframe').forEach(iframe => {
    iframe.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    iframe.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});