// --- ScrollTrigger, scroll fluide ---
gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray(".section");
sections.forEach((section, i) => {
  gsap.fromTo(section, 
    {opacity:0, scale:0.95},
    {
      opacity:1, scale:1,
      duration: 1.3,
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: true,
      }
    }
  );
});

// --- Fond spatial étoilé animé, variable par section ---
function starfield(canvasId, fromColor, toColor) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  let W = window.innerWidth, H = window.innerHeight;
  c.width = W; c.height = H;

  const stars = [];
  for (let i=0; i<220; i++) {
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.6 + 0.5,
      alpha: 0.65 + Math.random()*0.3,
      color: i<130 
        ? fromColor
        : toColor,
      speed: 0.08 + Math.random()*0.15
    });
  }

  function animate() {
    ctx.clearRect(0,0,W,H);
    // Dégradé dynamique de fond
    let g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0, fromColor);
    g.addColorStop(1, toColor);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // Dessine les étoiles
    for (let s of stars) {
      s.y += s.speed;
      if (s.y > H) s.y = 0;
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();  
}
starfield('bgSpaceHero', "#02c7ec", "#1f0856");
starfield('bgSpaceElephant', "#19ffda", "#0d2755");
starfield('bgSpaceTurtle', "#2aff81", "#003930");
starfield('bgSpaceAxolotl', "#df74ef", "#391c63");

// --- Virus/contagion particles vapor effet ---
function vaporAndVirus(id) {
  const v = document.querySelector("#"+id);
  if (!v) return;
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  v.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const particles = [];
  for (let i=0; i<70; i++) {
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      dx: (Math.random()-0.5)*1.5,
      dy: (Math.random()*2.4)+0.7,
      r: Math.random()*9+4,
      alpha: 0.2 + Math.random()*0.09,
      color: ["#12ffff", "#4daf7d", "#df74ef", "#afd8e6"][Math.floor(Math.random()*4)]
    });
  }
  function render() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (let p of particles) {
      p.y += p.dy; p.x += p.dx;
      if (p.y > canvas.height) { p.y = 0; p.x = Math.random()*canvas.width;}
      if (p.x > canvas.width) p.x = 0;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 21;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(render);
  }
  render();
}
document.querySelectorAll(".vapor-layer").forEach((vaporElm, i)=>vaporAndVirus(vaporElm.id = "vapor"+i));
document.querySelectorAll(".virus-layer").forEach((virusElm, i)=>vaporAndVirus(virusElm.id = "virus"+i));

// ----------- ADN + Molécule main HERO (Three.js 3D) ---------
import * as THREE from "three";
function createADNMolecule(containerId, animalColor) {
  const div = document.getElementById(containerId);
  const w = div.offsetWidth, h = div.offsetHeight;

  // Setup scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
  camera.position.z = 5.8;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(w, h);
  div.appendChild(renderer.domElement);

  // Lights
  const pointLight = new THREE.PointLight(animalColor, 1.6);
  pointLight.position.set(6,7,9);
  scene.add(pointLight);
  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambient);

  // ADN double hélice 3D
  const ADNGroup = new THREE.Group();
  const helixRadius = 1.3, helixTurns = 5, segs = 120;
  for (let side=0; side<2; side++) {
    const material = new THREE.MeshPhongMaterial({ 
      color: animalColor, emissive: animalColor, shininess: 0.83, transparent:true, opacity:0.65 
    });
    const curve = [];
    for (let i=0; i<=segs; i++) {
      const t = i/segs * Math.PI*helixTurns;
      const x = Math.cos(t+side*Math.PI)*helixRadius;
      const y = (i/segs - 0.5)*6;
      const z = Math.sin(t+side*Math.PI)*helixRadius;
      curve.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve), segs, 0.16, 12, false);
    const mesh = new THREE.Mesh(geometry, material);
    ADNGroup.add(mesh);
  }

  // Ponts entre les deux hélices + base-pairs
  for (let i=0; i<segs; i+=8) {
    const t = i/segs * Math.PI*helixTurns;
    const y = (i/segs-0.5)*6;
    const x1 = Math.cos(t)*helixRadius;
    const z1 = Math.sin(t)*helixRadius;
    const x2 = Math.cos(t+Math.PI)*helixRadius;
    const z2 = Math.sin(t+Math.PI)*helixRadius;
    const geometry = new THREE.CylinderGeometry(0.06, 0.08, 1.25, 6);
    const pairMaterial = new THREE.MeshPhongMaterial({ 
      color: animalColor, transparent:true, opacity:0.6, shininess:0.7
    });
    const mesh = new THREE.Mesh(geometry, pairMaterial);
    mesh.position.set((x1+x2)/2, y, (z1+z2)/2);
    mesh.lookAt(new THREE.Vector3(x2, y, z2));
    ADNGroup.add(mesh);
  }

  // Molécule centrale (sphere organic blob)
  const geometryM = new THREE.IcosahedronGeometry(0.85, 2);
  const moleculeMaterial = new THREE.MeshPhongMaterial({ 
    color: animalColor, transparent:true, opacity:0.7, shininess:1, emissive:animalColor
  });
  const mol = new THREE.Mesh(geometryM, moleculeMaterial);
  mol.position.set(0,0,0);
  ADNGroup.add(mol);

  scene.add(ADNGroup);

  // Animation
  function animate() {
    ADNGroup.rotation.y += 0.0122;
    ADNGroup.rotation.x += 0.0014;
    mol.scale.x = 1.08+Math.sin(Date.now()*0.002)*0.15;
    mol.scale.y = 1.11+Math.cos(Date.now()*0.002)*0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// Hero ADN/Molécule section
setTimeout(()=>createADNMolecule("webgl-hero", 0x12ffff), 500);

// Animal section ADN + molecule, couleur spécifique
setTimeout(()=>createADNMolecule("adn-elephant", 0x24f8a7), 1200);
setTimeout(()=>createADNMolecule("adn-turtle", 0x4cff70), 1200); 
setTimeout(()=>createADNMolecule("adn-axolotl", 0xdf74ef), 1200);

// ----------- SVG Animaux réalistes, contours fluos -----------
function svgAnimal(containerId, animal) {
  const div = document.getElementById(containerId);
  let color = "#12ffff";
  if (animal==="elephant") color = "#24f8a7";
  if (animal==="turtle") color = "#4cff70";
  if (animal==="axolotl") color = "#df74ef";
  let path, scale;
  if (animal==="elephant") {
    path = "M70 250 Q120 180 160 190 Q207 138 207 97 Q185 78 160 74 Q130 71 110 97 Q90 116 110 128 Q78 138 50 120 Q55 192 128 244 Z M130 152 Q141 162 140 184 Q128 197 127 161 Z"; scale=1.13;
  } else if (animal==="turtle") {
    path = "M190 250 Q240 190 230 130 Q210 60 140 80 Q60 90 95 160 Q130 280 210 200 Q210 140 100 150 Z M140 100 Q178 120 150 180 Q111 135 158 160 Z"; scale=1.3;
  } else if (animal==="axolotl") {
    path = "M188 110 Q210 55 245 115 Q190 175 235 130 Q180 210 115 160 Q180 160 110 150 Q80 140 80 90 Q105 105 195 110 Z"; scale=1.32;
  }
  div.innerHTML = `
    <svg width="270" height="270" viewBox="0 30 270 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 30px ${color});">
      <path d="${path}" stroke="${color}" stroke-width="4.8" fill="black" opacity="0.98"/>
    </svg>
  `;
}
setTimeout(()=>svgAnimal("elephant-svg", "elephant"), 1400);
setTimeout(()=>svgAnimal("turtle-svg", "turtle"), 1400);
setTimeout(()=>svgAnimal("axolotl-svg", "axolotl"), 1400);
