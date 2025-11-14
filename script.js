window.addEventListener("DOMContentLoaded", ()=>{

// --------- SCROLL ANIMATION (simple fluid transition) ---------
const sections = Array.from(document.querySelectorAll(".section"));
sections.forEach((sec, i) => {
  sec.style.opacity = "0";
  sec.style.transform = "scale(1.07)";
  setTimeout(()=>{
    sec.style.transition = "opacity 1.5s cubic-bezier(.28,.74,.36,.9), transform 1.4s cubic-bezier(.11,.94,.33,.98)";
    sec.style.opacity="1";
    sec.style.transform="scale(1)";
  }, 300 + 200*i);
});

// --------- STARFIELD ANIMATION CANVAS ---------
function starfield(bgCanvasId, color1, color2){
  const c = document.getElementById(bgCanvasId);
  if(!c) return;
  const ctx = c.getContext("2d");
  let W = c.width = c.offsetWidth||window.innerWidth, H = c.height = c.offsetHeight||window.innerHeight;
  const stars = [];
  for(let i=0;i<180;i++){
    stars.push({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.6+0.5,
      alpha: 0.65 + Math.random()*0.28,
      color: (i<110)?color1:color2,
      speed: 0.08+Math.random()*0.17
    });
  }
  function loop(){
    ctx.clearRect(0,0,W,H);
    let g = ctx.createLinearGradient(W/2,0,W/2,H);
    g.addColorStop(0,color1); g.addColorStop(1,color2); ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
    for(let s of stars){
      s.y+=s.speed; if(s.y>H)s.y=0;
      ctx.save(); ctx.globalAlpha=s.alpha; ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=s.color;
      ctx.shadowColor=s.color;
      ctx.shadowBlur=26;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  loop();
}
// Hero, Elephant, Turtle, Axolotl backgrounds
starfield("canvas-hero-bg","#02c7ec","#1f0856");
starfield("canvas-elephant-bg","#18f3b4","#128091");
starfield("canvas-turtle-bg","#45e696","#07906c");
starfield("canvas-axolotl-bg","#df74ef","#391c63");

// --------- VAPOR + VIRUS EFFECT ANIMATION ---------
function vaporAndVirus(layer) {
  if(!layer) return;
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  layer.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const cloud = [];
  for(let i=0;i<80;i++) {
    cloud.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      dx:(Math.random()-0.5)*1.5,
      dy:(Math.random()*3.0)+0.6,
      r:Math.random()*9+3,
      alpha: 0.11 + Math.random()*0.13,
      color: ["#12ffff","#45e696","#df74ef","#afd8e6"][Math.floor(Math.random()*4)]
    });
  }
  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let p of cloud){
      p.y+=p.dy; p.x+=p.dx;
      if(p.y>canvas.height){p.y=0; p.x=Math.random()*canvas.width;}
      if(p.x>canvas.width) p.x=0;
      ctx.save(); ctx.globalAlpha=p.alpha; ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color;
      ctx.shadowColor=p.color; ctx.shadowBlur=20; ctx.fill(); ctx.restore();
    }
    requestAnimationFrame(render);
  }
  render();
}
// Vapor & virus layers
document.querySelectorAll(".vapor-layer").forEach(l=>vaporAndVirus(l));
document.querySelectorAll(".virus-layer").forEach(l=>vaporAndVirus(l));

// --------- ADN DOUBLE HELICE ANIMEE CANVAS ---------
function animateADN(canvasId,color="#12ffff"){
  const c = document.getElementById(canvasId);
  if(!c) return;
  let W = c.width = c.offsetWidth||520, H = c.height = c.offsetHeight||520;
  const ctx = c.getContext("2d");
  const helixTurns=5, segs=120, helixRadius=W/8, centerY=H/2;
  let tAnim=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    tAnim += 0.018;
    // Double hélice
    for(let s=0;s<2;s++){
      ctx.save();
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.lineWidth=11-(s*4);
      ctx.globalAlpha= 0.39+s*0.34;
      ctx.beginPath();
      for(let i=0;i<=segs;i++){
        const t = i/segs*Math.PI*helixTurns+tAnim+(s?Math.PI:0);
        let x=W/2+Math.cos(t)*helixRadius;
        let y=centerY+(i/segs-0.5)*W*0.77 + Math.sin(t*0.4+tAnim)*14*(1.3+s*0.28);
        if(i==0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
      ctx.restore();
    }
    // Barres base-pairs
    for(let i=0;i<segs;i+=8){
      let t=i/segs*Math.PI*helixTurns+tAnim;
      let y=centerY+(i/segs-0.5)*W*0.77;
      let x1=W/2+Math.cos(t)*helixRadius;
      let x2=W/2+Math.cos(t+Math.PI)*helixRadius;
      ctx.save();
      ctx.strokeStyle=color; ctx.globalAlpha=0.48;
      ctx.lineWidth=2.4;
      ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
      ctx.restore();
    }
    // Sphere molécule centrale animée
    ctx.save();
    ctx.beginPath();
    ctx.arc(W/2,centerY,helixRadius*1.11+Math.sin(tAnim)*11,0,Math.PI*2);
    ctx.shadowColor=color;
    ctx.shadowBlur=40+Math.abs(Math.sin(tAnim)*120);
    ctx.globalAlpha=0.17 + 0.13*Math.abs(Math.sin(tAnim*0.59));
    ctx.fillStyle=color;
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
}
// Hero ADN/Molecule 
animateADN("canvas-hero-adn","#12ffff");
// Animaux ADN/molecule
animateADN("canvas-elephant-adn","#24f8a7");
animateADN("canvas-turtle-adn","#45e696");
animateADN("canvas-axolotl-adn","#df74ef");

// --------- SVG des animaux très réalistes, contour fluo ---------
function svgAnimal(containerId, animal) {
  const div = document.getElementById(containerId);
  let color = "#12ffff", svg="";
  if(animal==="elephant"){color="#24f8a7"; svg=`<svg viewBox="0 0 320 320" width="100%" height="100%"><path d="M30 210 Q80 110 185 95 Q276 90 253 198 Q260 142 176 130 Q162 176 217 200 Q159 217 125 192 Q90 165 139 175 Q89 159 48 170 Q60 200 160 225 Q140 200 60 215 Q44 190 35 220 Z" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
  else if(animal==="turtle"){color="#45e696"; svg=`<svg viewBox="0 0 320 320" width="100%" height="100%"><ellipse cx="148" cy="190" rx="80" ry="48" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><ellipse cx="148" cy="135" rx="53" ry="24" fill="black" stroke="${color}" stroke-width="7" filter="url(#glow)"/><ellipse cx="94" cy="190" rx="15" ry="24" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="198" cy="190" rx="15" ry="24" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="148" cy="220" rx="22" ry="18" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="148" cy="110" rx="12" ry="6" fill="black" stroke="${color}" stroke-width="4" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
  else if(animal==="axolotl"){color="#df74ef"; svg=`<svg viewBox="0 0 320 320" width="100%" height="100%"><ellipse cx="170" cy="180" rx="55" ry="48" fill="black" stroke="${color}" stroke-width="9" filter="url(#glow)"/><ellipse cx="230" cy="138" rx="17" ry="35" fill="black" stroke="${color}" stroke-width="7.5" filter="url(#glow)"/><ellipse cx="108" cy="135" rx="17" ry="28" fill="black" stroke="${color}" stroke-width="7.5" filter="url(#glow)"/><ellipse cx="205" cy="232" rx="16" ry="20" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="132" cy="232" rx="16" ry="20" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="170" cy="80" rx="18" ry="11" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="7" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
  div.innerHTML=svg;
}
// SVG animaux
svgAnimal("elephant-svg","elephant");
svgAnimal("turtle-svg","turtle");
svgAnimal("axolotl-svg","axolotl");

// (TOUT EST FULL JS/SVG/CANVAS, pas d'asset externe. Responsive/design premium.)

});
