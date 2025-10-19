// Simple script: fade-ins and show external logo if present (but keep SVG fallback).
window.addEventListener('DOMContentLoaded', () => {
  // show fade-in elements
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
    const title = document.getElementById('title');
    if (title) title.classList.add('pulse');
  });

  // check background image existence; if missing add .no-image (fallback gradient)
  const bgCheck = new Image();
  bgCheck.onload = () => { /* exists */ };
  bgCheck.onerror = () => { document.body.classList.add('no-image'); };
  bgCheck.src = './assets/bg-dna.jpg';

  // Try to load external logo (assets/logo.png).
  const logoTest = new Image();
  logoTest.onload = () => {
    const logoImg = document.getElementById('logo-img');
    const logoWrap = document.getElementById('logo');
    if (logoImg) {
      logoImg.style.display = 'block';
      // keep SVG too but visually prefer external image via CSS (SVG still there as fallback)
    }
    if (logoWrap) logoWrap.classList.add('has-external');
  };
  window.addEventListener('DOMContentLoaded', () => {
  // apparition globale (titre, etc.)
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
    const title = document.getElementById('title');
    if (title) title.classList.add('pulse');
  });

  // vérif background
  const bgCheck = new Image();
  bgCheck.onload = () => { /* exists */ };
  bgCheck.onerror = () => { document.body.classList.add('no-image'); };
  bgCheck.src = './assets/bg-dna.jpg';

  // vérif logo externe
  const logoPath = 'assets/logo.png'; // ajuste si nécessaire
  const logoTest = new Image();
  logoTest.onload = () => {
    const logoWrap = document.getElementById('logo');
    const logoImg  = document.getElementById('logo-img');
    // marque le container pour activer le halo
    if (logoWrap) logoWrap.classList.add('has-external');
    // s'assurer que l'image visible (on utilise opacité via CSS)
    if (logoImg) {
      logoImg.src = logoPath; // réassigne pour forcer prise en compte si besoin
      logoImg.alt = logoImg.alt || 'logo PULSE-53';
      // on ne touche pas au display; CSS body.visible gère l'opacité
    }
  };
  logoTest.onerror = () => {
    // fallback : laisse le SVG visible. on peut aussi cacher l'img si corrompue
    const logoImg = document.getElementById('logo-img');
    if (logoImg) logoImg.style.display = 'none';
  };
  logoTest.src = logoPath;
});

