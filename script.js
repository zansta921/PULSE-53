// Simple script to enable fade-in, detect bg image and show logo image when present.
window.addEventListener('DOMContentLoaded', () => {
  // show fade-in elements
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
    // also add neon pulse class to title
    const title = document.getElementById('title');
    if (title) title.classList.add('pulse');
  });

  // check background image existence; if not present, add .no-image for fallback gradient
  const bgCheck = new Image();
  bgCheck.onload = () => { /* image exists */ };
  bgCheck.onerror = () => { document.body.classList.add('no-image'); };
  bgCheck.src = './assets/bg-dna.jpg';

  // try to load external logo (assets/logo.png). If exists, show it and add glow wrapper class.
  const logoTest = new Image();
  logoTest.onload = () => {
    const logoImg = document.getElementById('logo-img');
    const logoSvg = document.getElementById('logo-svg');
    const logoWrap = document.getElementById('logo');
    if (logoImg) logoImg.style.display = 'block';
    if (logoSvg) logoSvg.style.display = 'none';
    if (logoWrap) logoWrap.classList.add('has-external');
  };
  logoTest.onerror = () => { /* keep SVG fallback */ };
  logoTest.src = './assets/logo.png';
});
