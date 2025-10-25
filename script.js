window.addEventListener('DOMContentLoaded', () => {
  /* ========== Ecran de lancement avec veines ========== */
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  const vCtx = virusCanvas.getContext('2d');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;

  // Définir un "halo" autour du titre pour que les veines ne le touchent jamais
  const titleEl = document.getElementById('title');
  const rect = titleEl.getBoundingClientRect();
  const padding = 10; // espace autour du titre
  const halo = {
    xMin: rect.left - padding,
    xMax: rect.right + padding,
    yMin: rect.top - padding,
    yMax: rect.bottom + padding
  };

  class Veine {
    constructor() {
      // Position initiale : autour du halo, aléatoire sur le contour
      const edge = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let x, y;
      if(edge === 'horizontal'){
        x = halo.xMin + Math.random()*(halo.xMax-halo.xMin);
        y = Math.random() < 0.5 ? halo.yMin-1 : halo.yMax+1;
      } else {
        y = halo.yMin + Math.random()*(halo.yMax-hHalo.yMin);
        x = Math.random() < 0.5 ? halo.xMin-1 : halo.xMax+1;
      }
      this.points = [{x, y}];
      this.maxPoints = 100 + Math.floor(Math.random()*150);
      this.color = `rgba(18,255,255,${0.3+Math.random()*0.5})`;
      this.finished = false;
    }

    grow() {
      if(this.finished) return;
      const last = this.points[this.points.length-1];
      const angle = Math.random()*Math.PI*2;
      const len = 10 + Math.random()*12; // croissance rapide
      let nx = last.x + Math.cos(angle)*len;
      let ny = last.y + Math.sin(angle)*len;

      // Ne jamais rentrer dans le halo du titre
      if(nx > halo.xMin && nx < halo.xMax && ny > halo.yMin && ny < halo.yMax){
        const dx = nx < (halo.xMin + halo.xMax)/2 ? -len : len;
        const dy = ny < (halo.yMin + halo.yMax)/2 ? -len : len;
        nx += dx; ny += dy;
      }

      this.points.push({x: nx, y: ny});

      // Stop si sortie de l'écran ou longueur max
      if(this.points.length > this.maxPoints || nx < 0 || nx > virusCanvas.width || ny < 0 || ny > virusCanvas.height){
        this.finished = true;
      }
    }

    draw(ctx){
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for(let i=1;i<this.points.length;i++){
        const midX = (this.points[i-1].x + this.points[i].x)/2;
        const midY = (this.points[i-1].y + this.points[i].y)/2;
        ctx.quadraticCurveTo(this.points[i-1].x,this.points[i-1].y,midX,midY);
      }
      ctx.stroke();
    }
  }

  // Générer les veines
  const veines = [];
  for(let i=0;i<80;i++) veines.push(new Veine());

  function animateVeines(){
    vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
    let allFinished = true;
    veines.forEach(v=>{
      if(!v.finished){ v.grow(); allFinished=false; }
      v.draw(vCtx);
    });
    requestAnimationFrame(animateVeines);
    if(allFinished){
      launch.style.transition = 'opacity 1s ease';
      launch.style.opacity = 0;
      setTimeout(()=>launch.style.display='none', 1000);
    }
  }
  animateVeines();

  /* ========== Starfield ========== */
  const canvas=document.getElementById('starfield');
  const ctx=canvas.getContext('2d');
  let W=window.innerWidth, H=window.innerHeight;
  canvas.width=W; canvas.height=H;
  const stars=[];
  for(let i=0;i<200;i++) stars.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+0.5, alpha:Math.random(), speed:0.05+Math.random()*0.1});
  function drawStars(){
    ctx.clearRect(0,0,W,H);
    for(let s of stars){
      s.y += s.speed;
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
