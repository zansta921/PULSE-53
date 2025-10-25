window.addEventListener('DOMContentLoaded', () => {
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  const vCtx = virusCanvas.getContext('2d');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;

  const titleEl = document.getElementById('title');
  const rect = titleEl.getBoundingClientRect();
  const padding = 10;
  const halo = {
    xMin: rect.left - padding,
    xMax: rect.right + padding,
    yMin: rect.top - padding,
    yMax: rect.bottom + padding
  };

  class VeineFluid {
    constructor() {
      // Position initiale : contour du halo
      const edge = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let x, y;
      if(edge === 'horizontal'){
        x = halo.xMin + Math.random()*(halo.xMax-halo.xMin);
        y = Math.random() < 0.5 ? halo.yMin-1 : halo.yMax+1;
      } else {
        y = halo.yMin + Math.random()*(halo.yMax-hHalo.yMin);
        x = Math.random() < 0.5 ? halo.xMin-1 : halo.xMax+1;
      }
      this.x = x;
      this.y = y;
      this.vx = (Math.random()-0.5)*8; // vitesse pour effet liquide
      this.vy = (Math.random()-0.5)*8;
      this.radius = 3 + Math.random()*4;
      this.alpha = 0.3 + Math.random()*0.5;
      this.finished = false;
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;

      // Dévier si on touche le halo
      if(this.x > halo.xMin && this.x < halo.xMax && this.y > halo.yMin && this.y < halo.yMax){
        const dx = this.x < (halo.xMin+halo.xMax)/2 ? -this.vx*2 : this.vx*2;
        const dy = this.y < (halo.yMin+halo.yMax)/2 ? -this.vy*2 : this.vy*2;
        this.x += dx; this.y += dy;
      }

      // Stop si sortie de l’écran
      if(this.x<0 || this.x>virusCanvas.width || this.y<0 || this.y>virusCanvas.height){
        this.finished = true;
      }
    }

    draw(ctx) {
      ctx.fillStyle = `rgba(18,255,255,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fill();
    }
  }

  const veines = [];
  for(let i=0;i<120;i++) veines.push(new VeineFluid());

  function animateFluid(){
    vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);

    // Fond semi-flou pour effet liquide qui fusionne
    vCtx.fillStyle = 'rgba(0,0,0,0.05)';
    vCtx.fillRect(0,0,virusCanvas.width,virusCanvas.height);

    let allFinished = true;
    veines.forEach(v=>{
      if(!v.finished){
        v.move();
        allFinished = false;
      }
      v.draw(vCtx);
    });

    requestAnimationFrame(animateFluid);

    // Dès que toutes les veines ont rempli l’écran
    if(allFinished){
      launch.style.transition = 'opacity 1s ease';
      launch.style.opacity = 0;
      setTimeout(()=>launch.style.display='none', 1000);
    }
  }
  animateFluid();

  /* ========== Starfield ========== */
  const canvas=document.getElementById('starfield');
  const ctx=canvas.getContext('2d');
  let W=window.innerWidth,H=window.innerHeight;
  canvas.width=W; canvas.height=H;
  const stars=[];
  for(let i=0;i<200;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.5,alpha:Math.random(),speed:0.05+Math.random()*0.1});
  function drawStars(){
    ctx.clearRect(0,0,W,H);
    for(let s of stars){
      s.y+=s.speed;
      if(s.y>H) s.y=0;
      ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ========== Parallax ========== */
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc = window.scrollY;
    const vh = window.innerHeight;
    layers.forEach(el=>{
      const speed = parseFloat(el.dataset.speed || '0.3');
      if(el.id==='overlay'){
        const y = -50 + (sc*speed/vh*50);
        el.style.transform = `translate(-50%,${y}%)`;
      } else {
        el.style.transform = `translateX(-50%) translateY(${sc*speed}px)`;
      }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  /* ========== Scroll vers slider ========== */
  document.getElementById('goSlider').addEventListener('click',()=>{
    const sliderPos = document.getElementById('cell-slider').offsetTop;
    window.scrollTo({top:sliderPos, behavior:'smooth'});
  });

  /* ========== Slider tunnel ========== */
  const slides=document.querySelectorAll('#cell-slider .slide');
  let current=0, canSlide=true;
  function updateSlides(){
    slides.forEach((s,i)=>{
      s.classList.remove('active','prev','next');
      if(i===current) s.classList.add('active');
      if(i===current-1||(current===0&&i===slides.length-1)) s.classList.add('prev');
      if(i===current+1||(current===slides.length-1&&i===0)) s.classList.add('next');
    });
  }
  function throttleSlide(cb){ if(!canSlide) return; canSlide=false; cb(); setTimeout(()=>canSlide=true,900); }
  document.querySelector('.nav.next').addEventListener('click',()=>throttleSlide(()=>{current=(current+1)%slides.length;updateSlides();}));
  document.querySelector('.nav.prev').addEventListener('click',()=>throttleSlide(()=>{current=(current-1+slides.length)%slides.length;updateSlides();}));
  updateSlides();
});
