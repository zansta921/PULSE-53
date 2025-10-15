// main.js (module) — Three.js import via CDN pour navigateur
import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('bg-canvas');
if (!canvas) {
  console.error('Canvas #bg-canvas introuvable — vérifiez index.html');
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

scene.add(new THREE.AmbientLight(0x88ffe8, 0.35));
const rim = new THREE.DirectionalLight(0xaffff0, 0.9);
rim.position.set(-5, 10, 10);
scene.add(rim);

const group = new THREE.Group();
scene.add(group);

// Helix (sphères pour robustesse)
const sphereGeo = new THREE.SphereGeometry(0.08, 12, 12);
const matA = new THREE.MeshStandardMaterial({ color: 0x2fe8a8, emissive: 0x063f30, roughness: 0.4 });
const matB = new THREE.MeshStandardMaterial({ color: 0x66d7ff, emissive: 0x041b2b, roughness: 0.4 });

const instances = 260;
const helixPositions = [];
for (let i = 0; i < instances; i++) {
  const t = i / (instances - 1);
  const angle = t * Math.PI * 6;
  const y = (t - 0.5) * 6;
  const r = 1.0 + 0.06 * Math.sin(angle * 1.5);
  const xA = Math.cos(angle) * r * 0.9;
  const zA = Math.sin(angle) * r * 0.45;
  const xB = Math.cos(angle + Math.PI) * r * 0.9;
  const zB = Math.sin(angle + Math.PI) * r * 0.45;
  helixPositions.push({ xA, y, zA, xB, zB, angle });
}

for (let i = 0; i < instances; i++) {
  const p = helixPositions[i];
  const scale = 0.7 + (i / instances) * 0.9;
  const mA = new THREE.Mesh(sphereGeo, matA);
  mA.position.set(p.xA, p.y, p.zA);
  mA.scale.setScalar(scale * 0.9);
  group.add(mA);
  const mB = new THREE.Mesh(sphereGeo, matB);
  mB.position.set(p.xB, p.y, p.zB);
  mB.scale.setScalar(scale * 0.9);
  group.add(mB);
}

// Particules simples
const particleCount = 600;
const pGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i*3+0] = 9999; positions[i*3+1] = 9999; positions[i*3+2] = 9999;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pMat = new THREE.PointsMaterial({ size: 0.06, color: 0x6ffff0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

let spawnIndex = 0;
const velocities = new Float32Array(particleCount * 3);
const lifetimes = new Float32Array(particleCount);

function spawnParticleFromHelix(i) {
  const idx = spawnIndex % particleCount;
  const p = helixPositions[i % helixPositions.length];
  const useA = Math.random() > 0.5;
  const x = useA ? p.xA : p.xB;
  const z = useA ? p.zA : p.zB;
  const y = p.y;
  positions[idx*3+0] = x;
  positions[idx*3+1] = y;
  positions[idx*3+2] = z;
  const dirX = x + (Math.random() - 0.5) * 0.3;
  const dirY = (Math.random() - 0.2) * 0.4;
  const dirZ = z + (Math.random() - 0.5) * 0.3;
  const len = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ) || 1;
  velocities[idx*3+0] = dirX / len * (0.03 + Math.random()*0.06);
  velocities[idx*3+1] = dirY * (0.03 + Math.random()*0.06);
  velocities[idx*3+2] = dirZ / len * (0.03 + Math.random()*0.06);
  lifetimes[idx] = 0.0001;
  spawnIndex++;
}

group.rotation.set(-0.5, 0.3, -0.35);
group.position.set(-1.2, 0.7, -2.2);

const clock = new THREE.Clock();
let lastSpawn = 0;

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize, false);
onWindowResize();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  group.rotation.z += 0.000 + 0.02 * dt;
  group.rotation.y += 0.000 + 0.01 * dt;
  const breath = 1 + Math.sin(t * 1.4) * 0.02;
  group.scale.set(breath, breath, breath);

  lastSpawn += dt;
  if (lastSpawn > 0.01) {
    const spawnCount = 1 + Math.floor(Math.random() * 3);
    for (let s = 0; s < spawnCount; s++) spawnParticleFromHelix(Math.floor(Math.random() * helixPositions.length));
    lastSpawn = 0;
  }

  for (let i = 0; i < particleCount; i++) {
    if (lifetimes[i] > 0) {
      positions[i*3+0] += velocities[i*3+0];
      positions[i*3+1] += velocities[i*3+1];
      positions[i*3+2] += velocities[i*3+2];
      lifetimes[i] += dt * (0.15 + Math.random()*0.3);
      if (lifetimes[i] > 1.0) {
        positions[i*3+0] = 9999; positions[i*3+1] = 9999; positions[i*3+2] = 9999;
        lifetimes[i] = 0;
        velocities[i*3+0] = velocities[i*3+1] = velocities[i*3+2] = 0;
      }
    }
  }
  pGeo.attributes.position.needsUpdate = true;

  const scrollY = window.scrollY || window.pageYOffset;
  const maxShift = 0.6;
  const shift = Math.min(scrollY / window.innerHeight, 1) * maxShift;
  camera.position.x = shift * 0.6;
  camera.position.y = -shift * 0.3;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

console.log('Three.js chargé — rendu initialisé');

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
