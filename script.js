window.addEventListener('DOMContentLoaded', () => {
  // apparition globale (titre, logo, etc.)
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
    const title = document.getElementById('title');
    if (title) title.classList.add('pulse');
  });

  // vérification fond ADN
  const bgCheck = new Image();
  bgCheck.onload = () => {};
  bgCheck.onerror = () => document.body.classList.add('no-image');
  bgCheck.src = 'assets/bg-dna.jpg';

  // vérification logo PNG
  const logoPath = 'assets/logo.png';
  const logoTest = new Image();
  logoTest.onload = () => {
    const logoWrap = document.getElementById('logo');
    if (logoWrap) logoWrap.classList.add('has-external');
  };
  logoTest.onerror = () => {
    const logoImg = document.getElementById('logo-img');
    if (logoImg) logoImg.style.display = 'none';
  };
  logoTest.src = logoPath;
});
