window.addEventListener('DOMContentLoaded', () => {

  // 1️⃣ Loader
  setTimeout(()=>{
    const launch = document.getElementById('launch-screen');
    if(launch) launch.style.display = 'none';
  },900);

  // 2️⃣ Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const stars = [];
  for(let i=0;i<200;i++){
    stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.5, alpha: Math.random(), speed: 0.05+Math.random()*0.1 });
  }

  function drawStars(){
    ctx.clearRect(0,0,W,H);
    stars.forEach(s=>{
      s.y += s.speed;
      if(s.y>H) s.y=0;
      ctx.fillStyle = `rgba(18,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // 3️⃣ Parallax
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc = window.scrollY;
    const vh = window.innerHeight;
    layers.forEach(el=>{
      const speed = parseFloat(el.dataset.speed||'0.3');
      el.style.transform = `translateX(-50%) translateY(${sc*speed}px)`;
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  // 4️⃣ Scroll bouton
  document.getElementById('goInfo').addEventListener('click', ()=>{
    window.scrollTo({ top: window.innerHeight, behavior:'smooth' });
  });

  // 5️⃣ Transition full screen entre hero et contenu
  const tCanvas = document.getElementById('transition-canvas');
  const tCtx = tCanvas.getContext('2d');
  function resizeTransition(){ tCanvas.width = window.innerWidth; tCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeTransition);
  resizeTransition();

  const cols = 50, rows = 30;
  const squareWidth = tCanvas.width / cols;
  const squareHeight = tCanvas.height / rows;
  const squares = [];
  for(let x=0;x<cols;x++){
    for(let y=0;y<rows;y++){
      squares.push({
        x:x*squareWidth,
        y:y*squareHeight,
        alpha:1,
        speed:Math.random()*0.02+0.01,
        delay:Math.random()*50
      });
    }
  }

  let frame = 0;
  function animateTransition(){
    tCtx.clearRect(0,0,tCanvas.width,tCanvas.height);
    squares.forEach(s=>{
      if(frame > s.delay){
        s.alpha -= s.speed;
        if(s.alpha<0) s.alpha=0;
        const grd = tCtx.createLinearGradient(s.x,s.y,s.x+squareWidth,s.y+squareHeight);
        grd.addColorStop(0, `rgba(18,255,255,${s.alpha*0.05})`);
        grd.addColorStop(1, `rgba(0,180,166,${s.alpha*0.2})`);
        tCtx.fillStyle = grd;
        tCtx.fillRect(s.x,s.y,squareWidth,squareHeight);
      }
    });
    frame++;
    requestAnimationFrame(animateTransition);
  }
  animateTransition();
});
