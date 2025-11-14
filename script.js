window.addEventListener('DOMContentLoaded', () => {
  // FOND ÉTOILÉ POUR LA SECTION ADN ANIMAUX
  function starfield(bgCanvasId, color1, color2){
    const c = document.getElementById(bgCanvasId);
    if(!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const stars = [];
    for(let i=0;i<180;i++){
      stars.push({
        x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*1.3+0.4,
        alpha: 0.55 + Math.random()*0.35,
        color: (i<60)?color1:(i>120)?color2:"#1a206f",
        speed: 0.07+Math.random()*0.15
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
        ctx.shadowBlur=24;
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }
  starfield("canvas-adn-bg","#12ffff","#1e226c");

  // ADN hélices animées (petites)
  function animateADN(canvasId,color){
    const c = document.getElementById(canvasId);
    if(!c) return;
    let W = c.width = c.offsetWidth||110, H = c.height = c.offsetHeight||110;
    const ctx = c.getContext("2d");
    const helixTurns=5, segs=120, helixRadius=W/6.3, centerY=H/2;
    let tAnim=0;
    function draw(){
      ctx.clearRect(0,0,W,H);
      tAnim += 0.017;
      for(let s=0;s<2;s++){
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 7;
        ctx.lineWidth=5-(s*2.3);
        ctx.globalAlpha= 0.42+s*0.37;
        ctx.beginPath();
        for(let i=0;i<=segs;i++){
          const t = i/segs*Math.PI*helixTurns+tAnim+(s?Math.PI:0);
          let x=W/2+Math.cos(t)*helixRadius;
          let y=centerY+(i/segs-0.5)*W*0.65 + Math.sin(t*0.3+tAnim)*6*(1.3+s*0.18);
          if(i==0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
        ctx.restore();
      }
      // Ponts
      for(let i=0;i<segs;i+=8){
        let t=i/segs*Math.PI*helixTurns+tAnim;
        let y=centerY+(i/segs-0.5)*W*0.65;
        let x1=W/2+Math.cos(t)*helixRadius;
        let x2=W/2+Math.cos(t+Math.PI)*helixRadius;
        ctx.save();
        ctx.strokeStyle=color; ctx.globalAlpha=0.46;
        ctx.lineWidth=1.1;
        ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
        ctx.restore();
      }
      // Sphere molécule
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2,centerY,helixRadius*0.62+Math.sin(tAnim)*3.7,0,Math.PI*2);
      ctx.shadowColor=color;
      ctx.shadowBlur=12+Math.abs(Math.sin(tAnim)*16);
      ctx.globalAlpha=0.18 + 0.13*Math.abs(Math.sin(tAnim*0.76));
      ctx.fillStyle=color;
      ctx.fill();
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
  }
  animateADN("adn-elephant","#24f8a7");
  animateADN("adn-turtle","#45e696");
  animateADN("adn-axolotl","#df74ef");

  // SVG animaux réalistes (petits + glow)
  function svgAnimal(containerId, animal) {
    const div = document.getElementById(containerId);
    let color = "#12ffff", svg="";
    if(animal==="elephant"){color="#24f8a7"; svg=`<svg viewBox="0 0 90 90" width="100%" height="100%"><path d="M8 59Q22 33 73 31Q90 31 89 57Q83 52 61 56Q45 85 32 62Q45 68 74 62Q39 64 8 62Z" fill="black" stroke="${color}" stroke-width="4" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
    else if(animal==="turtle"){color="#45e696"; svg=`<svg viewBox="0 0 90 90" width="100%" height="100%"><ellipse cx="44" cy="54" rx="24" ry="14" fill="black" stroke="${color}" stroke-width="4" filter="url(#glow)"/><ellipse cx="44" cy="44" rx="16" ry="6" fill="black" stroke="${color}" stroke-width="2.5" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
    else if(animal==="axolotl"){color="#df74ef"; svg=`<svg viewBox="0 0 90 90" width="100%" height="100%"><ellipse cx="49" cy="57" rx="15" ry="12" fill="black" stroke="${color}" stroke-width="4" filter="url(#glow)"/><ellipse cx="67" cy="47" rx="5" ry="10" fill="black" stroke="${color}" stroke-width="2.2" filter="url(#glow)"/><ellipse cx="31" cy="47" rx="5" ry="10" fill="black" stroke="${color}" stroke-width="2.2" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
    div.innerHTML=svg;
  }
  svgAnimal("elephant-svg","elephant");
  svgAnimal("turtle-svg","turtle");
  svgAnimal("axolotl-svg","axolotl");

  // Titres animés pour chaque ADN
  document.getElementById("nom-elephant").textContent = "ADN de l'Éléphant";
  document.getElementById("nom-turtle").textContent = "ADN de la Tortue";
  document.getElementById("nom-axolotl").textContent = "ADN de l'Axolotl";

  // REVEAL FLUID MASK - GSAP + ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  gsap.set(".venom-mask",{clipPath:"inset(0 0 0 0)",opacity:1});
  gsap.set(".bloc-adn-animal",{opacity:0, y:70, scale:0.88});
  ScrollTrigger.create({
    trigger: "#section-animaux",
    start: "top 80%",
    end: "bottom 40%",
    scrub: 1,
    onUpdate: self => {
      let p = self.progress;
      gsap.to(".venom-mask",{clipPath:`inset(${(1-p)*100}% 0 0 0)`,opacity:p>0.93?0:1,duration:0.2,ease:"power2.inOut"});
      gsap.to(".bloc-adn-animal",{opacity:p>0.05?1:0.0, y:p>=0.7?0:70, scale:p>=0.7?1:0.88, stagger:0.12, duration:0.6, ease:"power2.out"});
    }
  });
  ScrollTrigger.create({
    trigger:"#section-animaux",
    start: "top top", end:"top 40%", scrub:1,
    onUpdate: self => {
      let pb = 1-self.progress;
      gsap.to(".venom-mask",{clipPath:`inset(0 0 ${pb*100}% 0)`, opacity: pb>0.9?1:0, duration:0.26,ease:"power2.in"});
      gsap.to(".bloc-adn-animal",{opacity:pb>0.6?0:1, y:pb>0.6?70:0, scale:pb>0.6?0.88:1, stagger:0.14, duration:0.5, ease:"power2.inOut"});
    }
  });
});
