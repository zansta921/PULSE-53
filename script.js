// script.js
import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/gsap.min.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------
   Launch screen hide
   ----------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(()=>{
    const launch=document.getElementById('launch-screen');
    if(launch) launch.style.display='none';
  }, 900);
});

/* -----------------------------------------
   Improved starfield: layered stars + twinkle + spawn on scroll
   ----------------------------------------- */
const starCanvas = document.getElementById('starfield');
const sctx = starCanvas.getContext('2d');
let S_W = 0, S_H = 0;
function resizeStarCanvas(){
  S_W = starCanvas.width = window.innerWidth;
  S_H = starCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStarCanvas);
resizeStarCanvas();

// layers: back (far), mid, front (near). front will be more reactive.
const starLayers = [
  {count:120, speed:0.02, size:()=>Math.random()*0.6+0.2, stars:[]},
  {count:90,  speed:0.04, size:()=>Math.random()*1.1+0.4, stars:[]},
  {count:60,  speed:0.08, size:()=>Math.random()*1.8+0.8, stars:[]}
];

function seedStars(){
  for(const layer of starLayers){
    layer.stars = [];
    for(let i=0;i<layer.count;i++){
      layer.stars.push({
        x: Math.random()*S_W,
        y: Math.random()*S_H,
        r: layer.size(),
        alpha: Math.random()*0.9 + 0.1,
        twinklePhase: Math.random()*Math.PI*2
      });
    }
  }
}
seedStars();

let starTick = 0;
function drawStarfield(){
  sctx.clearRect(0,0,S_W,S_H);
  // subtle gradient to keep the black line at bottom visually consistent
  const g = sctx.createLinearGradient(0,0,0,S_H);
  g.addColorStop(0,'rgba(0,0,0,0.0)');
  g.addColorStop(0.6,'rgba(0,29,36,0.12)');
  g.addColorStop(1,'rgba(0,0,0,1)');
  sctx.fillStyle = g;
  sctx.fillRect(0,0,S_W,S_H);

  starTick += 0.01;
  for(let li=0; li<starLayers.length; li++){
    const layer = starLayers[li];
    for(const s of layer.stars){
      // twinkle
      const a = s.alpha * (0.5 + 0.5*Math.sin(s.twinklePhase + starTick* (1 + li*0.6)));
      sctx.globalAlpha = Math.max(0.06, Math.min(1, a));
      const size = s.r * (1 + 0.3*Math.sin(starTick*2 + s.twinklePhase));
      sctx.fillStyle = `rgba(180,255,255,${sctx.globalAlpha})`;
      sctx.beginPath();
      sctx.arc(s.x, s.y, size, 0, Math.PI*2);
      sctx.fill();
    }
  }
  sctx.globalAlpha = 1;
  requestAnimationFrame(drawStarfield);
}
drawStarfield();

// spawn occasional shooting stars / new stars on scroll (non-blocking)
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const dy = Math.abs(window.scrollY - lastScrollY);
  if(dy > 30){
    // push some front layer stars downward slightly to create 'follow' illusion
    const front = starLayers[2];
    for(let i=0;i<6;i++){
      const s = front.stars[Math.floor(Math.random()*front.stars.length)];
      s.y += (Math.random()*40 - 10);
      s.x += (Math.random()*30 - 15);
      s.alpha = 0.5 + Math.random()*0.5;
    }
  }
  lastScrollY = window.scrollY;
});

/* -----------------------------------------
   Parallax: layers with data-speed
   - Will use requestAnimationFrame to set transform based on scroll for smoothness
   ----------------------------------------- */
const parallaxEls = Array.from(document.querySelectorAll('.parallax-layer'));
function updateParallax(){
  const sc = window.scrollY;
  const vh = window.innerHeight;
  for(const el of parallaxEls){
    const speed = parseFloat(el.dataset.speed || 0.3);
    const offset = (sc) * speed;
    el.style.transform = `translate3d(-50%, ${-50 + (offset / vh * 50)}%, 0)`; // keeps the original centering for overlay
  }
  requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);

/* -----------------------------------------
   GSAP Scroll-triggered slide transition + multi-speed text animation
   ----------------------------------------- */
const hero = document.getElementById('hero');
const content = document.getElementById('content');
const goInfo = document.getElementById('goInfo');
const overlay = document.getElementById('overlay');
const silhouette = document.getElementById('silhouette');

// animate when the user clicks CTA
goInfo.addEventListener('click', ()=> scrollToContent());

function scrollToContent(){
  // smooth scroll to a point slightly into main content, but animate hero elements out
  const tl = gsap.timeline();
  tl.to([overlay, silhouette, '#topbar', '#logo-img', '#goInfo'], {
    y: -120, opacity: 0, stagger: 0.05, ease: 'power3.in'
  }, 0);
  tl.to('#starfield', {scale:1.02, filter:'blur(0px)', ease:'power1.in'}, 0);
  tl.to(window, {duration:0.9, scrollTo: {y: window.innerHeight - 40}, ease:'power3.inOut'}, 0.05);
}

// ScrollTrigger to create a parallax layered movement for the textual content inside main
const layersToParallax = document.querySelectorAll('#content .card, #overlay, #subtitle, #title');
layersToParallax.forEach((el, i) => {
  gsap.fromTo(el, {y: 60 * (i+1), opacity: 0}, {
    y: 0, opacity: 1, ease: 'power2.out', duration: 1.0,
    scrollTrigger: {
      trigger: el,
      start: () => 'top bottom-=' + (120 + i*40),
      end: 'center top',
      scrub: false,
      toggleActions: 'play none none reverse'
    },
    delay: 0.05 * i
  });
});

/* Parallax text with different speeds while scrolling the hero section (to simulate different speeds)
   We'll use ScrollTrigger to adjust translation of specific elements so each moves at different rate. */
document.querySelectorAll('[data-speed]').forEach(el => {
  const speed = parseFloat(el.dataset.speed);
  gsap.to(el, {
    y: () => -(window.innerHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
});

/* -----------------------------------------
   3D p53: procedural placeholder + interaction
   - If you have a GLB model, replace the procedural creation with GLTFLoader usage (see comments)
   ----------------------------------------- */
const p53Canvas = document.getElementById('p53-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: p53Canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 3.6);
scene.add(camera);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0x99ffff, 0.9);
dir.position.set(5, 5, 5);
scene.add(dir);

// create a stylized "protein" using icosahedron + vertex displacement
const geom = new THREE.IcosahedronGeometry(1.0, 4);
const pos = geom.attributes.position;
const vcount = pos.count;
const offsets = new Float32Array(vcount*3);
for(let i=0;i<vcount;i++){
  offsets[i*3] = (Math.random()-0.5) * 0.06;
  offsets[i*3+1] = (Math.random()-0.5) * 0.06;
  offsets[i*3+2] = (Math.random()-0.5) * 0.06;
}
geom.setAttribute('offset', new THREE.BufferAttribute(offsets, 3));

const mat = new THREE.MeshStandardMaterial({
  color: 0x00cfcf,
  emissive: 0x003f3f,
  roughness: 0.35,
  metalness: 0.15,
  flatShading: true,
  transparent: true,
  opacity: 0.98
});
const protein = new THREE.Mesh(geom, mat);
scene.add(protein);

// small particle halo
const pGeom = new THREE.BufferGeometry();
const pCount = 120;
const pPositions = new Float32Array(pCount * 3);
for(let i=0;i<pCount;i++){
  const t = Math.random()*Math.PI*2;
  const r = 1.6 + Math.random()*0.6;
  pPositions[i*3] = Math.cos(t)*r * (0.6 + Math.random()*0.6);
  pPositions[i*3+1] = (Math.random()-0.5) * 1.1;
  pPositions[i*3+2] = Math.sin(t)*r * (0.6 + Math.random()*0.6);
}
pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
const pMat = new THREE.PointsMaterial({ size: 0.01, color: 0xc6ffff, transparent:true, opacity:0.85 });
const halo = new THREE.Points(pGeom, pMat);
scene.add(halo);

// OrbitControls but constrained (only rotate, no pan/zoom)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = false;
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 2.8;
controls.maxDistance = 6;
controls.target.set(0,0,0);

// Resize handler
function resizeP53(){
  const rect = p53Canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeP53);
resizeP53();

// simple gentle procedural animation + allowing user to rotate by drag
let t0 = 0;
function animateP53(t){
  const dt = (t - t0) * 0.001;
  t0 = t;
  // slight breathing
  const s = 1.0 + 0.02 * Math.sin(t*0.0025);
  protein.scale.setScalar(s);

  // micro-vertex wobble
  const pos = protein.geometry.attributes.position;
  for(let i=0;i<vcount;i++){
    const ox = offsets[i*3], oy = offsets[i*3+1], oz = offsets[i*3+2];
    pos.array[i*3] += Math.sin(t*0.001 + i) * (ox*0.0005);
    pos.array[i*3+1] += Math.cos(t*0.001 + i*1.1) * (oy*0.0005);
    pos.array[i*3+2] += Math.sin(t*0.001 + i*1.7) * (oz*0.0005);
  }
  pos.needsUpdate = true;

  halo.rotation.y += 0.0015 + dt*0.03;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animateP53);
}
requestAnimationFrame(animateP53);

/* If you have a real p53 GLB model, load it like this (example):
const loader = new GLTFLoader();
loader.load('models/p53.glb', gltf => {
  const model = gltf.scene;
  model.scale.set(1.2,1.2,1.2);
  scene.add(model);
  // remove procedural protein if present
  scene.remove(protein);
});
*/

/* -----------------------------------------
   Accessibility / keyboard scroll to content
   ----------------------------------------- */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowUp' || e.key === 'PageUp') scrollToContent();
});

/* -----------------------------------------
   Polishing: avoid blocking main animations when resizing, minimize layout thrash
   ----------------------------------------- */
// keep main content initially hidden for a smoother reveal
gsap.set('#content', { autoAlpha: 1 });

/* End of script.js */
