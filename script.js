// --- Scene Three.js ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('bg'), alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Lumière ---
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(50,50,50);
scene.add(light);

// --- ADN double hélice ---
const helixGroup = new THREE.Group();
scene.add(helixGroup);

const helixRadius = 1;
const helixHeight = 10;
const turns = 20;
const points = 200;

for(let i=0; i<points; i++){
  const t = i / points * turns * Math.PI * 2;
  const y = i / points * helixHeight;
  const x1 = helixRadius * Math.cos(t);
  const z1 = helixRadius * Math.sin(t);
  const x2 = helixRadius * Math.cos(t + Math.PI);
  const z2 = helixRadius * Math.sin(t + Math.PI);

  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00})
  );
  sphere1.position.set(x1, y, z1);
  helixGroup.add(sphere1);

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshStandardMaterial({color: 0x00aaff, emissive: 0x00aaff})
  );
  sphere2.position.set(x2, y, z2);
  helixGroup.add(sphere2);
}

// --- Orientation diagonale et perspective ---
helixGroup.rotation.x = -0.5;
helixGroup.rotation.y = -0.5;

// --- Particules p53 ---
const particleCount = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];

for(let i=0; i<particleCount; i++){
  positions.push((Math.random()-0.5)*5);
  positions.push(Math.random()*helixHeight);
  positions.push((Math.random()-0.5)*5);
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff00ff,
  size: 0.1,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// --- Camera ---
camera.position.z = 15;

// --- Animation ---
function animate(){
  requestAnimationFrame(animate);
  helixGroup.rotation.y += 0.002;
  particles.rotation.y += 0.001;

  // Particules qui montent et disparaissent
  const positions = particles.geometry.attributes.position.array;
  for(let i=1; i<positions.length; i+=3){
    positions[i] += 0.02;
    if(positions[i] > helixHeight+5){
      positions[i] = 0;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

