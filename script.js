window.addEventListener('DOMContentLoaded', () => {
  /* =================== Écran de lancement : veines organiques =================== */
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  const vCtx = virusCanvas.getContext('2d');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;

  class Veine {
    constructor(x, y) {
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = (Math.random() - 0.5) * 6;
      this.points = [{x: x + offsetX, y: y + offsetY}];
      this.maxPoints = 30 + Math.floor(Math.random() * 60);
      this.color = `rgba(18,255,255,${0.3 + Math.random() * 0.4})`;
      this.finished = false;
    }
    grow() {
      if (this.finished) return;
      const last = this.points[this.points.length - 1];
      const angle = Math.random() * Math.PI * 2;
      const len = 15 + Math.random() * 15;
      const nx = last.x + Math.cos(angle) * len;
      const ny = last.y + Math.sin(angle) * len;
      this.points.push({x: nx, y: ny});
      if(this.points.length > this.maxPoints || nx<0 || nx>virusCanvas.width || ny<0 || ny>virusCanvas.height){
        this.finished = true;
      }
    }
    draw(ctx) {
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

  const veines = [];
  const originX = window.innerWidth/2;
  const originY = window.innerHeight/2;
  for(let i=0;i<100;i++) veines.push(new Veine(originX, originY));

  function animateVeines() {
    vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
    let allFinished = true;
    veines.forEach(v => {
      if(!v.finished) { v.grow(); allFinished=false; }
      v.draw(vCtx);
    });
    requestAnimationFrame(animateVeines);
    if(allFinished) {
      launch.style.transition='opacity 0.5s ease';
      launch.style.opacity=0;
      setTimeout(()=>launch.style.display='none',500);
    }
  }
  animateVeines();

  /* =================== Starfield =================== */
  const canvas=document.getElementById('starfield');
  const ctx=canvas.getContext('2d');
  let W=window.innerWidth,H=window.innerHeight;
  canvas.width=W; canvas.height=H;
  const stars=[];
  for(let i=0;i<200;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.5,alpha:Math.random(),speed:0.05+Math.random()*0.1});
  function drawStars(){
    ctx.clearRect(0,0,W,H);
    for(let s of stars){
      s.y+=s.speed; if(s.y>H) s.y=0;
      ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* =================== Parallax =================== */
  const layers=Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc=window.scrollY,vh=window.innerHeight;
    layers.forEach(el=>{
      const speed=parseFloat(el.dataset.speed||'0.3');
      if(el.id==='overlay'){ el.style.transform=`translate(-50%,-50%) translateY(${sc*speed}px)`; }
      else{ el.style.transform=`translateX(-50%) translateY(${sc*speed}px)`; }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  /* =================== Scroll vers slider =================== */
  document.getElementById('goSlider').addEventListener('click',()=>{
    const sliderPos=document.getElementById('cell-slider').offsetTop;
    window.scrollTo({top:sliderPos,behavior:'smooth'});
  });

  /* =================== Slider tunnel centré =================== */
  const slides=document.querySelectorAll('#cell-slider .slide');
  let current=0, canSlide=true;
  function updateSlides(){
    slides.forEach((s,i)=>{
      s.classList.remove('active','prev','next');
      if(i===current) s.classList.add('active');
      if(i===current-1||(current===0&&i===slides.length-1)) s.classList.add('prev');
      if(i===current+1||(current===slides.length-1&&i===0)) s.classList.add('next');
    });

    // Centrer la slide active
    const slider = document.getElementById('cell-slider');
    const activeSlide = slides[current];
    const sliderWidth = slider.offsetWidth;
    const slideWidth = activeSlide.offsetWidth;
    const offset = activeSlide.offsetLeft + slideWidth / 2 - sliderWidth / 2;
    slider.scrollTo({ left: offset, behavior: 'smooth' });
  }
  function throttleSlide(cb){ if(!canSlide) return; canSlide=false; cb(); setTimeout(()=>canSlide=true,700);}
  document.querySelector('.nav.next').addEventListener('click',()=>throttleSlide(()=>{current=(current+1)%slides.length;updateSlides();}));
  document.querySelector('.nav.prev').addEventListener('click',()=>throttleSlide(()=>{current=(current-1+slides.length)%slides.length;updateSlides();}));
  updateSlides();

  // ===== NO SMOKE: ADN animations and SVG animals =====

  // Anim ADN: double hélice animée
  function animateADN(canvasId, color = "#12ffff") {
    const c = document.getElementById(canvasId);
    if (!c) return;
    let W = c.width = 200, H = c.height = 200;
    const ctx = c.getContext("2d");
    const helixTurns = 4.7, segs = 66, helixRadius = 38, centerY = H / 2;
    let tAnim = Math.random() * 50; // décale les anims entre animaux
    function draw() {
      ctx.clearRect(0, 0, W, H);
      tAnim += 0.017;
      // Double hélice
      for (let s = 0; s < 2; s++) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12 - s * 5;
        ctx.lineWidth = 9 - (s * 3);
        ctx.globalAlpha = 0.31 + s * 0.38;
        ctx.beginPath();
        for (let i = 0; i <= segs; i++) {
          const t = i / segs * Math.PI * helixTurns + tAnim + (s ? Math.PI : 0);
          let x = W / 2 + Math.cos(t) * helixRadius;
          let y = centerY + (i / segs - 0.5) * W * 0.51 + Math.sin(t * 0.4 + tAnim) * 7 * (1.2 + s * 0.22);
          if (i == 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.restore();
      }
      // Barres nucléotidiques
      for (let i = 0; i < segs; i += 9) {
        let t = i / segs * Math.PI * helixTurns + tAnim;
        let y = centerY + (i / segs - 0.5) * W * 0.51;
        let x1 = W / 2 + Math.cos(t) * helixRadius;
        let x2 = W / 2 + Math.cos(t + Math.PI) * helixRadius;
        ctx.save();
        ctx.strokeStyle = color; ctx.globalAlpha = 0.41;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
      }
      // Sphère centrale
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, centerY, helixRadius * 1.08 + Math.sin(tAnim) * 4, 0, Math.PI * 2);
      ctx.shadowColor = color;
      ctx.shadowBlur = 19 + Math.abs(Math.sin(tAnim) * 18);
      ctx.globalAlpha = 0.13 + 0.11 * Math.abs(Math.sin(tAnim * 0.59));
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      requestAnimationFrame(draw);
    }
    draw();
  }
  animateADN("adn-elephant", "#24f8a7");
  animateADN("adn-turtle", "#45e696");
  animateADN("adn-axolotl", "#df74ef");

  // SVG animaux (contour fluo) dans .animal-svg
  function svgAnimal(containerId, animal) {
    const div = document.getElementById(containerId);
    let color = "#12ffff", svg = "";
    if (animal === "elephant") {
      color = "#24f8a7";
      svg = `<svg viewBox="0 0 320 320" width="100%" height="100%"><path d="M30 210 Q80 110 185 95 Q276 90 253 198 Q260 142 176 130 Q162 176 217 200 Q159 217 125 192 Q90 165 139 175 Q89 159 48 170 Q60 200 160 225 Q140 200 60 215 Q44 190 35 220 Z" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;
    } else if (animal === "turtle") {
      color = "#45e696";
      svg = `<svg viewBox="0 0 320 320" width="100%" height="100%"><ellipse cx="148" cy="190" rx="80" ry="48" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><ellipse cx="148" cy="135" rx="53" ry="24" fill="black" stroke="${color}" stroke-width="7" filter="url(#glow)"/><ellipse cx="94" cy="190" rx="15" ry="24" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="198" cy="190" rx="15" ry="24" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="148" cy="220" rx="22" ry="18" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="148" cy="110" rx="12" ry="6" fill="black" stroke="${color}" stroke-width="4" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;
    } else if (animal === "axolotl") {
      color = "#df74ef";
      svg = `<svg viewBox="0 0 320 320" width="100%" height="100%"><ellipse cx="170" cy="180" rx="55" ry="48" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><ellipse cx="230" cy="138" rx="17" ry="35" fill="black" stroke="${color}" stroke-width="7.5" filter="url(#glow)"/><ellipse cx="108" cy="135" rx="17" ry="28" fill="black" stroke="${color}" stroke-width="7.5" filter="url(#glow)"/><ellipse cx="205" cy="232" rx="16" ry="20" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="132" cy="232" rx="16" ry="20" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="170" cy="80" rx="18" ry="11" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;
    }
    div.innerHTML = svg;
  }
  svgAnimal("elephant-svg", "elephant");
  svgAnimal("turtle-svg", "turtle");
  svgAnimal("axolotl-svg", "axolotl");
});
