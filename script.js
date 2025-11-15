window.addEventListener('DOMContentLoaded', () => {
  /* =================== Launch screen (veines organiques) =================== */
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  let vCtx = virusCanvas && virusCanvas.getContext ? virusCanvas.getContext('2d') : null;

  function resizeVirusCanvas() {
    if (!virusCanvas) return;
    virusCanvas.width = window.innerWidth;
    virusCanvas.height = window.innerHeight;
    // re-create veines around center on resize
    veines.length = 0;
    for (let i = 0; i < 100; i++) veines.push(new Veine(window.innerWidth/2, window.innerHeight/2));
    allVeinesStarted = false;
  }

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
      if (this.points.length > this.maxPoints || nx < 0 || nx > virusCanvas.width || ny < 0 || ny > virusCanvas.height){
        this.finished = true;
      }
    }
    draw(ctx) {
      if(!ctx) return;
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
  let allVeinesStarted = false;
  function startVeines() {
    veines.length = 0;
    for(let i=0;i<100;i++) veines.push(new Veine(window.innerWidth/2, window.innerHeight/2));
    allVeinesStarted = false;
  }

  function animateVeines() {
    if (vCtx && virusCanvas) {
      vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
      let allFinished = true;
      veines.forEach(v => {
        if(!v.finished) { v.grow(); allFinished=false; }
        v.draw(vCtx);
      });
      if(allFinished && !allVeinesStarted) {
        allVeinesStarted = true;
        launch.style.transition='opacity 0.5s ease';
        launch.style.opacity=0;
        setTimeout(()=>launch.style.display='none',500);
      }
    }
    requestAnimationFrame(animateVeines);
  }

  window.addEventListener('resize', () => {
    resizeVirusCanvas();
    vCtx = virusCanvas.getContext('2d');
  });

  resizeVirusCanvas();
  startVeines();
  animateVeines();

  /* =================== Starfield =================== */
  const canvas = document.getElementById('starfield');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let W = window.innerWidth, H = window.innerHeight;
  if (canvas) { canvas.width = W; canvas.height = H; }
  const stars = [];
  for(let i=0;i<200;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.5,alpha:Math.random(),speed:0.05+Math.random()*0.1});
  function drawStars(){
    if(!ctx) return;
    ctx.clearRect(0,0,W,H);
    for(let s of stars){
      s.y+=s.speed; if(s.y>H) s.y=0;
      ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    if (canvas) { canvas.width = W; canvas.height = H; }
  }, {passive:true});

  /* =================== Parallax =================== */
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc = window.scrollY;
    layers.forEach(el=>{
      const speed = parseFloat(el.dataset.speed||'0.3');
      if(el.id==='overlay'){ el.style.transform = `translate(-50%,-50%) translateY(${sc*speed}px)`; }
      else{ el.style.transform = `translateX(-50%) translateY(${sc*speed}px)`; }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  /* =================== goSlider -> scroll to phases section (slider removed) =================== */
  const goBtn = document.getElementById('goSlider');
  if (goBtn) {
    goBtn.addEventListener('click', ()=>{
      const target = document.getElementById('phases-section') || document.getElementById('content');
      if (!target) return;
      const pos = target.offsetTop;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    });
  }

  /* =================== (removed slider logic) =================== */
  // slider markup and JS removed per request

  /* =================== Canvas helpers (high-DPI) =================== */
  function setupCanvasForDrawing(canvasEl) {
    if(!canvasEl) return null;
    const rect = canvasEl.getBoundingClientRect();
    const DPR = Math.max(window.devicePixelRatio || 1, 1);
    canvasEl.width = Math.max(1, Math.round(rect.width * DPR));
    canvasEl.height = Math.max(1, Math.round(rect.height * DPR));
    canvasEl.style.width = rect.width + "px";
    canvasEl.style.height = rect.height + "px";
    const cctx = canvasEl.getContext('2d');
    if(!cctx) return null;
    cctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return {ctx: cctx, W: rect.width, H: rect.height};
  }

  /* =================== ADN animation (double helix) =================== */
  function animateADN(canvasId, color = "#12ffff", helixRadiusRatio = 0.31, helixTurns = 7.5) {
    const c = document.getElementById(canvasId);
    if(!c) return;
    let setup = setupCanvasForDrawing(c);
    if(!setup) return;
    let ctx = setup.ctx;
    let W = setup.W, H = setup.H;
    const segs = 66;
    let helixRadius = Math.max(10, Math.min(W, H) * helixRadiusRatio);
    const centerY = H / 2;
    let tAnim = Math.random()*50;

    window.addEventListener('resize', () => {
      setup = setupCanvasForDrawing(c);
      if(!setup) return;
      ctx = setup.ctx; W = setup.W; H = setup.H;
      helixRadius = Math.max(10, Math.min(W, H) * helixRadiusRatio);
    }, {passive:true});

    function draw(){
      ctx.clearRect(0,0,W,H);
      tAnim += 0.017;
      for (let side=0; side<2; side++){
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 - side * 4;
        ctx.lineWidth = Math.max(1.8, 9 - (side*3));
        ctx.globalAlpha = 0.31 + side*0.34;
        ctx.beginPath();
        for (let i=0;i<=segs;i++){
          const t = i/segs*Math.PI*helixTurns + tAnim + (side?Math.PI:0);
          const x = W/2 + Math.cos(t) * helixRadius;
          const y = centerY + (i/segs - 0.5) * H * 0.76 + Math.sin(t*0.5 + tAnim) * 7 * (1.12 + side*0.15);
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
        ctx.restore();
      }
      // base pairs
      for (let i=0;i<segs;i+=8){
        const t = i/segs*Math.PI*helixTurns + tAnim;
        const y = centerY + (i/segs - 0.5) * H * 0.76;
        const x1 = W/2 + Math.cos(t) * helixRadius;
        const x2 = W/2 + Math.cos(t + Math.PI) * helixRadius;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.38;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
        ctx.restore();
      }
      // central sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2, centerY, helixRadius * 1.01 + Math.sin(tAnim)*3, 0, Math.PI*2);
      ctx.shadowColor = color;
      ctx.shadowBlur = 16 + Math.abs(Math.sin(tAnim)*13);
      ctx.globalAlpha = 0.15 + 0.08 * Math.abs(Math.sin(tAnim*0.68));
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      requestAnimationFrame(draw);
    }
    draw();
  }

  // start ADN animations (elephant gray, turtle green, axolotl purple)
  animateADN("adn-elephant", "#bfc3ca", 0.31, 7.5);
  animateADN("adn-turtle", "#45e696", 0.31, 7.5);
  animateADN("adn-axolotl", "#df74ef", 0.31, 7.5);

  /* =================== animal SVGs (contour) =================== */
  function svgAnimal(containerId, animal) {
    const div = document.getElementById(containerId);
    if(!div) return;
    let color = "#12ffff", svg = "";
    if (animal === "elephant") {
      color = "#bfc3ca";
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
  svgAnimal("elephant-svg","elephant");
  svgAnimal("turtle-svg","turtle");
  svgAnimal("axolotl-svg","axolotl");

  /* =================== PHASES: reveal on scroll + cosmos background =================== */
   function phasesRevealAndCosmos() {
    const section = document.getElementById('phases-section');
    const grid = document.getElementById('phases-grid');
    const canvas = document.getElementById('phases-cosmos');
    if (!section || !grid || !canvas) return;

    // Reveal on scroll (révélation progressive au scroll)
    function reveal(){
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        grid.classList.add('phases-visible');
      } else {
        grid.classList.remove('phases-visible');
      }
    }
    // AJOUT ici : reveal dès le chargement SI la section est déjà visible
    window.addEventListener('scroll', reveal, {passive:true});
    window.addEventListener('resize', reveal, {passive:true}); // au cas où resize fait apparaître/disparaître la section
    reveal(); // tout de suite au chargement

    // Cosmos (subtle starfield)
    let W = canvas.parentNode.offsetWidth;
    let H = 220;
    let ctx2 = canvas.getContext('2d');
    function resizeCanvas() {
      W = canvas.width = canvas.offsetWidth = canvas.parentNode.offsetWidth;
      H = canvas.height = H;
    }
    let stars = [];
    function makeStars(){
      stars = [];
      for (let i=0;i<48;i++){
        stars.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r: Math.random()*1.4 + 0.4,
          alpha: Math.random()*0.85 + 0.15,
          speed: 0.08 + Math.random()*0.16
        });
      }
    }
    function drawStars(){
      ctx2.clearRect(0,0,W,H);
      for (let s of stars){
        s.y += s.speed;
        if (s.y > H) s.y = -8;
        ctx2.save();
        ctx2.globalAlpha = s.alpha;
        ctx2.beginPath();
        ctx2.fillStyle = Math.random()>0.94 ? "#12ffff" : "#23c9ea";
        ctx2.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx2.shadowColor = "#12ffff";
        ctx2.shadowBlur = 10;
        ctx2.fill();
        ctx2.restore();
      }
      requestAnimationFrame(drawStars);
    }
    function initCosmos(){
      resizeCanvas(); makeStars(); drawStars();
    }
    window.addEventListener('resize', () => { initCosmos(); }, {passive:true});
    setTimeout(initCosmos, 160);
  }
  phasesRevealAndCosmos();

  /* =================== End DOMContentLoaded =================== */
});
