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
  logoTest.onerror = () => {
    // no external logo: SVG remains visible (fallback)
  };
  logoTest.src = './assets/logo.png';
});
