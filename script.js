window.addEventListener('DOMContentLoaded', () => {
  // Cache loader
  setTimeout(()=>{
    const launch = document.getElementById('launch-screen');
    if(launch) launch.style.display = 'none';
  }, 900);

  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const stars = [];
  for(let i=0; i<200; i++){
    stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.5, alpha: Math.random(), speed: 0.05 + Math.random()*0.1 });
  }

  function drawStars(){
    ctx.clearRect(0,0,W,H);
    for(let s of stars){
      s.y += s.speed;
      if(s.y>H) s.y=0;
      ctx.fillStyle = `rgba(18,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // Parallax
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc = window.scrollY;
    const vh = window.innerHeight;
    layers.forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.3');
      if(el.id === 'overlay'){
        const y = -50 + (sc*speed/vh*50);
        el.style.transform = `translate(-50%, ${y}%)`;
      } else {
        el.style.transform = `translateX(-50%) translateY(${sc*speed}px)`;
      }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  // Scroll button
  document.getElementById('goInfo').addEventListener('click', ()=>{
    window.scrollTo({ top: window.innerHeight - 30, behavior:'smooth' });
  });
});
