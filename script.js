window.addEventListener('DOMContentLoaded', () => {
  // ... TES AUTRES SCRIPTS (loader, étoilé, slider, parallax, etc.) ...

  // SECTION ADN ANIMAUX - Si besoin, tu peux retirer le vapor/virus layers ici !
  // Anim ADN canvas
  function animateADN(canvasId,color){
    const c = document.getElementById(canvasId);
    if(!c) return;
    let W = c.width = c.offsetWidth||130, H = c.height = c.offsetHeight||130;
    const ctx = c.getContext("2d");
    const helixTurns=5, segs=120, helixRadius=W/5, centerY=H/2;
    let tAnim=0;
    function draw(){
      ctx.clearRect(0,0,W,H);
      tAnim += 0.018;
      for(let s=0;s<2;s++){
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.lineWidth=7-(s*3.5);
        ctx.globalAlpha= 0.42+s*0.37;
        ctx.beginPath();
        for(let i=0;i<=segs;i++){
          const t = i/segs*Math.PI*helixTurns+tAnim+(s?Math.PI:0);
          let x=W/2+Math.cos(t)*helixRadius;
          let y=centerY+(i/segs-0.5)*W*0.83 + Math.sin(t*0.3+tAnim)*8*(1.3+s*0.18);
          if(i==0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
        ctx.restore();
      }
      // Ponts
      for(let i=0;i<segs;i+=8){
        let t=i/segs*Math.PI*helixTurns+tAnim;
        let y=centerY+(i/segs-0.5)*W*0.83;
        let x1=W/2+Math.cos(t)*helixRadius;
        let x2=W/2+Math.cos(t+Math.PI)*helixRadius;
        ctx.save();
        ctx.strokeStyle=color; ctx.globalAlpha=0.46;
        ctx.lineWidth=1.7;
        ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
        ctx.restore();
      }
      // Sphere molécule
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2,centerY,helixRadius*0.67+Math.sin(tAnim)*6,0,Math.PI*2);
      ctx.shadowColor=color;
      ctx.shadowBlur=21+Math.abs(Math.sin(tAnim)*40);
      ctx.globalAlpha=0.19 + 0.14*Math.abs(Math.sin(tAnim*0.76));
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
    if(animal==="elephant"){color="#24f8a7"; svg=`<svg viewBox="0 0 120 120" width="100%" height="100%"><path d="M10 78Q30 44 92 41Q112 41 111 75Q104 68 78 61Q65 100 53 72Q69 79 93 74Q47 76 10 82Z" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
    else if(animal==="turtle"){color="#45e696"; svg=`<svg viewBox="0 0 120 120" width="100%" height="100%"><ellipse cx="59" cy="68" rx="34" ry="22" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="59" cy="54" rx="23" ry="10" fill="black" stroke="${color}" stroke-width="3" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
    else if(animal==="axolotl"){color="#df74ef"; svg=`<svg viewBox="0 0 120 120" width="100%" height="100%"><ellipse cx="64" cy="70" rx="22" ry="18" fill="black" stroke="${color}" stroke-width="5" filter="url(#glow)"/><ellipse cx="90" cy="60" rx="7" ry="15" fill="black" stroke="${color}" stroke-width="3.5" filter="url(#glow)"/><ellipse cx="38" cy="60" rx="7" ry="15" fill="black" stroke="${color}" stroke-width="3.5" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;}
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
      // slide the venom mask by scroll progress
      let p = self.progress;
      // mask slides up and fades (0 : masked, 1 : unmasked)
      gsap.to(".venom-mask",{clipPath:`inset(${(1-p)*100}% 0 0 0)`,opacity:p>0.93?0:1,duration:0.2,ease:"power2.inOut"});
      gsap.to(".bloc-adn-animal",{opacity:p>0.05?1:0.0, y:p>=0.7?0:70, scale:p>=0.7?1:0.88, stagger:0.13, duration:0.7, ease:"power2.out"});
    }
  });
  // Optional: on leave back, restore mask fully
  ScrollTrigger.create({
    trigger:"#section-animaux",
    start: "top top",
    end: "top 40%",
    scrub: 1,
    onUpdate: self => {
      let pb = 1-self.progress;
      gsap.to(".venom-mask",{clipPath:`inset(0 0 ${pb*100}% 0)`, opacity: pb>0.9?1:0, duration:0.3,ease:"power2.in"});
      gsap.to(".bloc-adn-animal",{opacity:pb>0.6?0:1, y:pb>0.6?70:0, scale:pb>0.6?0.88:1, stagger:0.14, duration:0.6, ease:"power2.inOut"});
    }
  });
});
