document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const images = [
    '/images/hotel1.jpg',
    '/images/hotel2.jpg',
    '/images/hotel3.jpg'
  ];

  let current = 0;
  setInterval(() => {
    current = (current + 1) % images.length;
    hero.style.backgroundImage = `url('${images[current]}')`;
  }, 5000);
});
