window.addEventListener('DOMContentLoaded', () => {
  /* ========== Ecran de lancement fluide veines ========== */
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;
  const vCtx = virusCanvas.getContext('2d');

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
      const edge = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let x = edge==='horizontal' ? halo.xMin + Math.random()*(halo.xMax-halo.xMin)
                                  : (Math.random()<0.5 ? halo.xMin-1 : halo.xMax+1);
      let y = edge==='horizontal' ? (Math.random()<0.5 ? halo.yMin-1 : halo.yMax+1)
                                  : halo.yMin + Math.random()*(halo.yMax-halo.yMin);
      this.x=x; this.y=y;
      this.vx=(Math.random()-0.5)*10;
      this.vy=(Math.random()-0.5)*10;
      this.radius=3+Math.random()*4;
      this.alpha=0.3+Math.random()*0.5;
      this.finished=false;
    }
    move() {
      this.x+=this.vx; this.y+=this.vy;
      if(this.x>halo.xMin && this.x<halo.xMax && this.y>halo.yMin && this.y<halo.yMax){
        this.x+=this.vx>0?10:-10; this.y+=this.vy>0?10:-10;
      }
      if(this.x<0||this.x>virusCanvas.width||this.y<0||this.y>virusCanvas.height) this.finished=true;
    }
    draw(ctx){
      ctx.fillStyle=`rgba(18,255,255,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fill();
    }
  }

  const veines=[];
  for(let i=0;i<120;i++) veines.push(new VeineFluid());

  function animateFluid(){
    vCtx.fillStyle='rgba(0,0,0,0.05)';
    vCtx.fillRect(0,0,virusCanvas.width,virusCanvas.height);
    let allFinished=true;
    veines.forEach(v=>{
      if(!v.finished){v.move(); allFinished=false;}
      v.draw(vCtx);
    });
    if(!allFinished) requestAnimationFrame(animateFluid);
    else{
      launch.style.transition='opacity 1s ease';
      launch.style.opacity=0;
      setTimeout(()=>launch.style.display='none',1000);
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
    stars.forEach(s=>{
      s.y+=s.speed; if(s.y>H) s.y=0;
      ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ========== Parallax ========== */
  const layers=Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc=window.scrollY, vh=window.innerHeight;
    layers.forEach(el=>{
      const speed=parseFloat(el.dataset.speed||'0.3');
      if(el.id==='overlay'){
        el.style.transform=`translate(-50%,-50%) translateY(${sc*speed}px)`;
      }else{
        el.style.transform=`translateX(-50%) translateY(${sc*speed}px)`;
      }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  /* ========== Scroll vers slider ========== */
  document.getElementById('goSlider').addEventListener('click',()=>{
    const sliderPos=document.getElementById('cell-slider').offsetTop;
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
