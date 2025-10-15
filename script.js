// Simple script to enable fade-in and handle missing image fallback.
window.addEventListener('DOMContentLoaded', () => {
  // Wait a tick then add visible class for CSS transitions
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
  });

  // Check if background image exists; if not add .no-image to body
  const img = new Image();
  img.onload = () => { /* image exists */ };
  img.onerror = () => { document.body.classList.add('no-image'); };
  // path must match styles.css
  img.src = './assets/bg-dna.jpg';
});
