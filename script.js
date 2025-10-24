import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

window.addEventListener("DOMContentLoaded", () => {
  // Loader
  setTimeout(() => {
    document.getElementById("launch-screen").style.display = "none";
  }, 1500);

  // 🌠 Starfield
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();
  for (let i = 0; i < 250; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: 0.1 + Math.random() * 0.3
    });
  }
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let s of stars) {
      s.y += s.speed;
      if (s.y > canvas.height) s.y = 0;
      ctx.fillStyle = `rgba(18,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // 📜 Scroll transition
  window.addEventListener("scroll", () => {
    const heroHeight = document.getElementById("hero").offsetHeight;
    if (window.scrollY > heroHeight * 0.6) {
      document.querySelector("main#info").classList.add("show");
    }
  });

  // 🧬 Three.js 3D p53
  const container = document.getElementById("p53-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  camera.position.set(0, 0, 3);

  const loader = new GLTFLoader();
  loader.load(
    "https://models.babylonjs.com/PBR_Spheres.glb",
    gltf => {
      const model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      scene.add(model);
      animate();
    },
    undefined,
    err => console.error(err)
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
