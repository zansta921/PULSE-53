window.addEventListener('DOMContentLoaded', () => {
  // Animation de lancement
  setTimeout(() => {
    const launch = document.getElementById('launch-screen');
    if (launch) launch.style.display = 'none';
  }, 1500);

  // Vérification fond ADN
  const bgCheck = new Image();
  bgCheck.onload = () => {};
  bgCheck.onerror = () => document.body.classList.add('no-image');
  bgCheck.src = 'assets/bg-dna.jpg';

  // Vérification logo PNG
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
