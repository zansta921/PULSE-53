// main.js (ES module)
// Note: imports Three.js from CDN to keep this file repository-friendly.
import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();

// Camera
const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.set(0, 0, 8);

// subtle ambient + rim light
const amb = new THREE.AmbientLight(0x88ffe8, 0.35);
scene.add(amb);

const rim = new THREE.DirectionalLight(0xaffff0, 0.9);
rim.position.set(-5, 10, 10);
scene.add(rim);

// Group to hold helix and particle emitters
const group = new THREE.Group();
scene.add(group);

// Create double helix using InstancedMesh for performance
const strandRadius = 0.08;
const sphereGeo = new THREE.SphereGeometry(strandRadius, 12, 12);
const matA = new THREE.MeshStandardMaterial({ color: 0x2fe8a8, emissive: 0x0a6a55, roughness: 0.4, metalness: 0.1 });
const matB = new THREE.MeshStandardMaterial({ color: 0x66d7ff, emissive: 0x033a66, roughness: 0.4, metalness: 0.1 });

// We'll create two InstancedMesh objects: strandA and strandB
const instances = 280;
const strandA = new THREE.InstancedMesh(sphereGeo, matA, instances);
const strandB = new THREE.InstancedMesh(sphereGeo, matB, instances);

group.add(strandA, strandB);

// Helix parameters
const turns = 6;
const height = 6.0;
const separation = 0.9;
const twoPi = Math.PI * 2;

// Precompute positions along helix
const helixPositions = [];
for (let i = 0; i < instances; i++) {
  const t = i / (instances - 1); // 0..1
  const angle = t * turns * twoPi;
  const y = (t - 0.5) * height; // center along y
  // radius oscillates slightly to give depth
  const r = 1.0 + 0.06 * Math.sin(angle * 1.5);
  const xA = Math.cos(angle) * r * separation;
  const zA = Math.sin(angle) * r * separation * 0.5;
  const xB = Math.cos(angle + Math.PI) * r * separation;
  const zB = Math.sin(angle + Math.PI) * r * separation * 0.5;
  helixPositions.push({ xA, y, zA, xB, zB, angle });
}

// Apply initial transforms to instances
const dummy = new THREE.Object3D();
for (let i = 0; i < instances; i++) {
  const p = helixPositions[i];
  const scale = 0.7 + (i / instances) * 0.9; // perspective feel along the strand
  dummy.position.set(p.xA, p.y, p.zA);
  dummy.scale.setScalar(scale * 0.9);
  dummy.updateMatrix();
  strandA.setMatrixAt(i, dummy.matrix);

  dummy.position.set(p.xB, p.y, p.zB);
  dummy.scale.setScalar(scale * 0.9);
  dummy.updateMatrix();
  strandB.setMatrixAt(i, dummy.matrix);
}
strandA.instanceMatrix.needsUpdate = true;
strandB.instanceMatrix.needsUpdate = true;

// Particles representing p53: we spawn particles from helix points and emit outward
const particleCount = 800;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const lifetimes = new Float32Array(particleCount);
const velocity = new Float32Array(particleCount * 3);

// Initialize particles off-screen
for (let i = 0; i < particleCount; i++) {
  positions[i * 3 + 0] = 9999;
  positions[i * 3 + 1] = 9999;
  positions[i * 3 + 2] = 9999;
  lifetimes[i] = 0;
  velocity[i * 3 + 0] = 0;
  velocity[i * 3 + 1] = 0;
  velocity[i * 3 + 2] = 0;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('aLifetime', new THREE.BufferAttribute(lifetimes, 1));

const particleMat = new THREE.PointsMaterial({
  size: 0.06,
  vertexColors: false,
  color: 0x6ffff0,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Utility: spawn a particle from a helix point index
let spawnIndex = 0;
function spawnParticleFromHelix(i) {
  const idx = spawnIndex % particleCount;
  const p = helixPositions[i % helixPositions.length];
  // choose between strand A or B randomly
  const useA = Math.random() > 0.5;
  const x = useA ? p.xA : p.xB;
  const z = useA ? p.zA : p.zB;
  const y = p.y;
  positions[idx * 3 + 0] = x;
  positions[idx * 3 + 1] = y;
  positions[idx * 3 + 2] = z;
  // velocity outward from center of helix
  const dirX = (x) + (Math.random() - 0.5) * 0.2;
  const dirY = (Math.random() - 0.2) * 0.3;
  const dirZ = (z) + (Math.random() - 0.5) * 0.2;
  const len = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ) || 1;
  velocity[idx * 3 + 0] = dirX / len * (0.02 + Math.random() * 0.06);
  velocity[idx * 3 + 1] = dirY * (0.02 + Math.random() * 0.06);
  velocity[idx * 3 + 2] = dirZ / len * (0.02 + Math.random() * 0.06);
  lifetimes[idx] = 0.0001; // kick to alive
  spawnIndex++;
}

// Animation loop variables
const clock = new THREE.Clock();
let lastSpawn = 0;

// Make the helix oriented diagonally (from top-left to bottom-right) and slightly into depth
group.rotation.set(-0.5, 0.3, -0.35); // give diagonal stance
group.position.set(-1.2, 0.7, -2.2);

// gentle slow rotation
const rotationSpeed = 0.02;

// Resize handling
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize, false);
onWindowResize();

// Optional: OrbitControls for debugging if you press 'o' to toggle
let controls;
let controlsEnabled = false;
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'o') {
    if (!controls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
    }
    controlsEnabled = !controlsEnabled;
    controls.enabled = controlsEnabled;
  }
});

// Render loop
function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  // rotate entire group slowly
  group.rotation.z += rotationSpeed * dt * 0.3;
  group.rotation.y += rotationSpeed * dt * 0.14;

  // subtle "breathing" scale on strands to emphasize pulse
  const breath = 1 + Math.sin(t * 1.4) * 0.02;
  group.scale.set(breath, breath, breath);

  // update instance positions to give impression of twist movement
  for (let i = 0; i < instances; i++) {
    const p = helixPositions[i];
    const phase = t * 0.8 + p.angle * 0.08;
    const wobble = 0.06 * Math.sin(phase);
    dummy.position.set(p.xA + wobble, p.y + 0.01 * Math.cos(phase), p.zA + 0.02 * Math.sin(phase * 0.9));
    const scale = 0.7 + (i / instances) * 0.9 + 0.06 * Math.sin(phase * 0.6);
    dummy.scale.setScalar(scale * 0.9);
    dummy.updateMatrix();
    strandA.setMatrixAt(i, dummy.matrix);

    dummy.position.set(p.xB - wobble, p.y - 0.01 * Math.cos(phase), p.zB - 0.02 * Math.sin(phase * 0.9));
    dummy.scale.setScalar(scale * 0.9);
    dummy.updateMatrix();
    strandB.setMatrixAt(i, dummy.matrix);
  }
  strandA.instanceMatrix.needsUpdate = true;
  strandB.instanceMatrix.needsUpdate = true;

  // Spawn particles periodically along helix
  lastSpawn += dt;
  const spawnRate = 0.01; // lower -> more particles
  if (lastSpawn > spawnRate) {
    // spawn a few per frame
    const spawnCount = 2 + Math.floor(Math.random() * 3);
    for (let s = 0; s < spawnCount; s++) {
      const idx = Math.floor(Math.random() * instances);
      spawnParticleFromHelix(idx);
    }
    lastSpawn = 0;
  }

  // Update particles positions and lifetimes
  for (let i = 0; i < particleCount; i++) {
    if (lifetimes[i] > 0) {
      // move
      positions[i * 3 + 0] += velocity[i * 3 + 0];
      positions[i * 3 + 1] += velocity[i * 3 + 1];
      positions[i * 3 + 2] += velocity[i * 3 + 2];
      // increment lifetime and fade out by moving lifetime value up to 1
      lifetimes[i] += dt * (0.15 + Math.random() * 0.3);
      // reduce alpha via material opacity (global) and also we can shrink by moving size in shader - but we use simple approach:
      if (lifetimes[i] > 1.0) {
        // kill
        positions[i * 3 + 0] = 9999;
        positions[i * 3 + 1] = 9999;
        positions[i * 3 + 2] = 9999;
        lifetimes[i] = 0;
        velocity[i * 3 + 0] = 0;
        velocity[i * 3 + 1] = 0;
        velocity[i * 3 + 2] = 0;
      }
    }
  }

  // update buffer attributes
  particleGeo.attributes.position.needsUpdate = true;
  particleGeo.attributes.aLifetime.array = lifetimes;
  particleGeo.attributes.aLifetime.needsUpdate = true;

  // subtle camera parallax depending on scroll position to enhance perspective when scrolling
  const scrollY = window.scrollY || window.pageYOffset;
  const maxShift = 0.6;
  const shift = Math.min(scrollY / window.innerHeight, 1) * maxShift;
  camera.position.x = shift * 0.6;
  camera.position.y = -shift * 0.3;
  camera.lookAt(0, 0, 0);

  if (controlsEnabled && controls) controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Small helper: make canvas responsive immediately
(function fitCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
})();
