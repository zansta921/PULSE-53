// ----- INITIALISATION -----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("background"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

// ----- ADN -----
const group = new THREE.Group();
const mat1 = new THREE.MeshBasicMaterial({ color: 0x00ffcc, emissive: 0x00ffcc });
const mat2 = new THREE.MeshBasicMaterial({ color: 0x3399ff, emissive: 0x3399ff });

for (let i = 0; i < 200; i++) {
  const angle = i * 0.2;
  const radius = 1;
  const x1 = Math.cos(angle) * radius;
  const y = (i - 100) * 0.1;
  const z1 = Math.sin(angle) * radius;
  const x2 = Math.cos(angle + Math.PI) * radius;
  const z2 = Math.sin(angle + Math.PI) * radius;

  const sphereGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const s1 = new THREE.Mesh(sphereGeo, mat1);
  const s2 = new THREE.Mesh(sphereGeo, mat2);
  s1.position.set(x1, y, z1);
  s2.position.set(x2, y, z2);
  group.add(s1, s2);

  if (i % 10 === 0) {
    const cyl = new THREE.CylinderGeometry(0.01, 0.01, 2 * radius, 8);
    const bridge = new THREE.Mesh(
      cyl,
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    bridge.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
    bridge.lookAt(x2, y, z2);
    group.add(bridge);
  }
}

scene.add(group);
camera.position.z = 10;

// ----- PARTICULES p53 -----
const particles = [];
const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  transparent: true,
  opacity: 1,
});

function spawnParticle() {
  const i = Math.floor(Math.random() * 200);
  const angle = i * 0.2;
  const radius = 1;
  const x = Math.cos(angle) * radius;
  const y = (i - 100) * 0.1;
  const z = Math.sin(angle) * radius;

  const p = new THREE.Mesh(particleGeo, glowMat.clone());
  p.position.set(x, y, z);
  p.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1
  );
  p.life = 120 + Math.random() * 60;
  particles.push(p);
  scene.add(p);
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.position.add(p.velocity);
    p.material.opacity = p.life / 180;
    p.scale.multiplyScalar(1.01);
    p.life--;
    if (p.life <= 0) {
      scene.remove(p);
      particles.splice(i, 1);
    }
  }
}

// ----- ANIMATION -----
setTimeout(() => {
  document.getElementById("background").style.opacity = "1";
}, 300);

function animate() {
  requestAnimationFrame(animate);

  group.rotation.y += 0.003;
  group.rotation.x = -0.2;
  group.position.x = -3;
  group.position.y = 2;
  group.position.z = -5;
  group.scale.set(0.5, 0.5, 0.5);

  if (particles.length < 300 && Math.random() < 0.5) spawnParticle();
  updateParticles();

  renderer.render(scene, camera);
}
animate();

// ----- ADAPTATION ÉCRAN -----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
