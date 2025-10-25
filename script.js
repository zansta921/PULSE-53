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

  // 3️⃣ Scroll bouton
  document.getElementById('goInfo').addEventListener('click', ()=>{
    window.scrollTo({ top: window.innerHeight, behavior:'smooth' });
  });

  // 4️⃣ Transition écailles de dragon
  const tCanvas = document.getElementById('transition-canvas');
  const tCtx = tCanvas.getContext('2d');
  function resizeTransition(){ 
      tCanvas.width = window.innerWidth; 
      tCanvas.height = window.innerHeight; 
  }
  window.addEventListener('resize', resizeTransition);
  resizeTransition();

  const scaleRows = 15;
  const scaleCols = 30;
  const scaleWidth = tCanvas.width / scaleCols;
  const scaleHeight = tCanvas.height / scaleRows;

  const scales = [];
  for(let y=0; y<scaleRows; y++){
      for(let x=0; x<scaleCols; x++){
          scales.push({
              x: x*scaleWidth,
              y: y*scaleHeight,
              progress: 0,
              speed: Math.random()*0.02+0.01,
              delay: Math.random()*50
          });
      }
  }

  function drawScale(ctx, x, y, w, h, progress){
      const grd = ctx.createLinearGradient(x, y, x+w, y+h);
      grd.addColorStop(0, `rgba(18,255,255,${0.2+progress*0.8})`);
      grd.addColorStop(1, `rgba(0,180,166,${0.2+progress*0.8})`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(x+w*0.5, y);
      ctx.bezierCurveTo(x+w*0.8, y, x+w, y+h*0.3, x+w, y+h*0.5);
      ctx.bezierCurveTo(x+w, y+h*0.8, x+w*0.8, y+h, x+w*0.5, y+h);
      ctx.bezierCurveTo(x+w*0.2, y+h, x, y+h*0.8, x, y+h*0.5);
      ctx.bezierCurveTo(x, y+h*0.3, x+w*0.2, y, x+w*0.5, y);
      ctx.closePath();
      ctx.fill();
  }

  let frame = 0;
  function animateDragonScales(){
      tCtx.clearRect(0,0,tCanvas.width,tCanvas.height);
      
      const bgGrad = tCtx.createLinearGradient(0,0,0,tCanvas.height);
      bgGrad.addColorStop(0, "#12ffff");
      bgGrad.addColorStop(1, "#000000");
      tCtx.fillStyle = bgGrad;
      tCtx.fillRect(0,0,tCanvas.width,tCanvas.height);
      
      scales.forEach(s=>{
          if(frame > s.delay){
              s.progress += s.speed;
              if(s.progress > 1) s.progress = 1;
          }
          drawScale(tCtx, s.x, s.y, scaleWidth, scaleHeight, 1 - s.progress);
      });

      frame++;
      requestAnimationFrame(animateDragonScales);
  }
  animateDragonScales();

});
