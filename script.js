window.addEventListener('DOMContentLoaded', () => {
  // ... tout l'ancien code est inchangé jusqu'à la section ADN ...

  // Utility: setup canvas for high-DPI and given displayed size
  function setupCanvasForDrawing(canvasEl) {
    if(!canvasEl) return null;
    const rect = canvasEl.getBoundingClientRect();
    const DPR = Math.max(window.devicePixelRatio || 1, 1);
    canvasEl.width = Math.max(1, Math.round(rect.width * DPR));
    canvasEl.height = Math.max(1, Math.round(rect.height * DPR));
    canvasEl.style.width = rect.width + "px";
    canvasEl.style.height = rect.height + "px";
    const ctx = canvasEl.getContext('2d');
    if(!ctx) return null;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return {ctx, W: rect.width, H: rect.height};
  }

  // Anim ADN: double hélice animée (avec allongement !)
  function animateADN(canvasSelector, color = "#12ffff", helixRadiusRatio=0.38, helixTurns=6) {
    const c = document.getElementById(canvasSelector);
    if (!c) return;
    const setup = setupCanvasForDrawing(c);
    if (!setup) {
      console.warn('Canvas context not available for', canvasSelector);
      return;
    }
    let ctx = setup.ctx;
    let W = setup.W, H = setup.H;
    // Plus haut => plus calme (0.38) / plus de tours = plus allongé
    const helixRadius = Math.max(12, Math.min(W, H) * helixRadiusRatio);
    const segs = 66;
    const centerY = H / 2;
    let tAnim = Math.random() * 50;

    window.addEventListener('resize', () => {
      const s = setupCanvasForDrawing(c);
      if (!s) return;
      ctx = s.ctx;
      W = s.W; H = s.H;
    }, {passive:true});

    function draw() {
      ctx.clearRect(0,0, W, H);
      tAnim += 0.017;
      // Double hélice
      for (let side = 0; side < 2; side++) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 - side * 4;
        ctx.lineWidth = Math.max(1.8, 9 - (side * 3));
        ctx.globalAlpha = 0.31 + side * 0.38;
        ctx.beginPath();
        for (let i = 0; i <= segs; i++) {
          const t = i / segs * Math.PI * helixTurns + tAnim + (side ? Math.PI : 0);
          let x = W / 2 + Math.cos(t) * helixRadius;
          let y = centerY + (i / segs - 0.5) * H * 0.73 + Math.sin(t * 0.4 + tAnim) * 7 * (1.2 + side * 0.22);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
      // base pairs
      for (let i = 0; i < segs; i += 9) {
        let t = i / segs * Math.PI * helixTurns + tAnim;
        let y = centerY + (i / segs - 0.5) * H * 0.73;
        let x1 = W / 2 + Math.cos(t) * helixRadius;
        let x2 = W / 2 + Math.cos(t + Math.PI) * helixRadius;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
        ctx.restore();
      }
      // center sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2, centerY, helixRadius * 1.04 + Math.sin(tAnim) * 3, 0, Math.PI*2);
      ctx.shadowColor = color;
      ctx.shadowBlur = 16 + Math.abs(Math.sin(tAnim) * 18);
      ctx.globalAlpha = 0.12 + 0.1 * Math.abs(Math.sin(tAnim * 0.59));
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      requestAnimationFrame(draw);
    }
    draw();
  }

  // éléphant : gris allongé
  animateADN("adn-elephant", "#bfc3ca", 0.38, 6.1);
  // tortue & axolotl : couleurs d'origine
  animateADN("adn-turtle", "#45e696", 0.38, 6.1);
  animateADN("adn-axolotl", "#df74ef", 0.38, 6.1);

  // SVG animaux : éléphant = gris
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
  svgAnimal("elephant-svg", "elephant");
  svgAnimal("turtle-svg", "turtle");
  svgAnimal("axolotl-svg", "axolotl");
});
