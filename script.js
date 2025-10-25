window.addEventListener('DOMContentLoaded', () => {
  // Cache loader
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  const vCtx = virusCanvas.getContext('2d');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;

  let veins = [];
  for(let i=0;i<50;i++){
    veins.push({
      x: window.innerWidth/2,
      y: window.innerHeight/2,
      dx:(Math.random()-0.5)*3,
      dy:(Math.random()-0.5)*3,
      len:Math.random()*50+30,
      alpha: Math.random()*0.5+0.3
    });
  }

  function drawVeins(){
    vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
    veins.forEach(v=>{
      v.x += v.dx;
      v.y += v.dy;
      vCtx.strokeStyle = `rgba(18,255,255,${v.alpha})`;
      vCtx.lineWidth = 2;
      vCtx.beginPath();
      vCtx.moveTo(v.x,v.y);
      vCtx.lineTo(v.x-v.dx*v.len, v.y-v.dy*v.len);
      vCtx.stroke();
      // rebond
      if(v.x<0||v.x>virusCanvas.width) v.dx*=-1;
      if(v.y<0||v.y>virusCanvas.height) v.dy*=-1;
    });
    requestAnimationFrame(drawVeins);
  }
  drawVeins();

  setTimeout(()=>{
    launch.style.transition = 'opacity 1s ease';
    launch.style.opacity = 0;
    setTimeout(()=>launch.style.display='none',1000);
  },2000);

  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

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

  // Scroll vers slider
  document.getElementById('goSlider').addEventListener('click', ()=>{
    const sliderPos = document.getElementById('cell-slider').offsetTop;
    window.scrollTo({ top: sliderPos, behavior:'smooth' });
  });

  // Slider Tunnel
  const slides = document.querySelectorAll('#cell-slider .slide');
  let current = 0;
  let canSlide = true;

  function updateSlides() {
    slides.forEach((s,i)=>{
      s.classList.remove('active','prev','next');
      if(i===current) s.classList.add('active');
      if(i===current-1) s.classList.add('prev');
      if(i===current+1) s.classList.add('next');
    });
  }

  function throttleSlide
