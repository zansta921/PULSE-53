// =================== Loader veines organiques ===================
window.addEventListener('DOMContentLoaded', () => {
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  if (virusCanvas) {
    const vCtx = virusCanvas.getContext('2d');
    virusCanvas.width = window.innerWidth;
    virusCanvas.height = window.innerHeight;
    class Veine { constructor(x,y){
      this.points=[{x:x+(Math.random()-0.5)*6,y:y+(Math.random()-0.5)*6}];
      this.maxPoints=26+Math.floor(Math.random()*70);
      this.color=`rgba(18,255,255,${0.38+Math.random()*0.38})`;
      this.finished=false;
    }
    grow() {
      if(this.finished)return;
      const last=this.points[this.points.length-1];
      const angle=Math.random()*Math.PI*2;
      const len=12+Math.random()*18;
      const nx=last.x+Math.cos(angle)*len;
      const ny=last.y+Math.sin(angle)*len;
      this.points.push({x:nx,y:ny});
      if(this.points.length>this.maxPoints||nx<0||nx>virusCanvas.width||ny<0||ny>virusCanvas.height){
        this.finished=true;
      }
    }
    draw(ctx){
      ctx.strokeStyle=this.color;
      ctx.lineWidth=2.2;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x,this.points[0].y);
      for(let i=1;i<this.points.length;i++){
        const midX=(this.points[i-1].x+this.points[i].x)/2;
        const midY=(this.points[i-1].y+this.points[i].y)/2;
        ctx.quadraticCurveTo(this.points[i-1].x,this.points[i-1].y,midX,midY);
      }
      ctx.stroke();
    }}
    const veines=[];
    for(let i=0;i<100;i++)veines.push(new Veine(window.innerWidth/2, window.innerHeight/2));
    function animateVeines(){
      vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
      let allFinished=true;
      veines.forEach(v=>{if(!v.finished){v.grow();allFinished=false;}v.draw(vCtx);});
      requestAnimationFrame(animateVeines);
      if(allFinished){
        launch.style.transition='opacity 0.6s ease';
        launch.style.opacity=0;
        setTimeout(()=>launch.style.display='none',600);
      }
    }
    animateVeines();
  }

  // =================== Fond étoilé ===================
  const starCanvas = document.getElementById('starfield');
  if (starCanvas) {
    const ctx=starCanvas.getContext('2d');
    const W=window.innerWidth,H=window.innerHeight;
    starCanvas.width=W; starCanvas.height=H;
    const stars=[];
    for(let i=0;i<220;i++) stars.push({
      x:Math.random()*W,
      y:Math.random()*H,
      r:Math.random()*1.3+0.7,
      alpha:Math.random()*0.8+0.15,
      speed:0.08+Math.random()*0.14
    });
    function drawStars(){
      ctx.clearRect(0,0,W,H);
      for(let s of stars){
        s.y+=s.speed;
        if(s.y>H) s.y=0;
        ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  // =================== Parallax ===================
  const layers=Array.from(document.querySelectorAll('.parallax-layer'));
  function parallaxLoop(){
    const sc=window.scrollY;
    layers.forEach(el=>{
      const speed=parseFloat(el.dataset.speed||'0.3');
      if(el.id==='overlay'){ el.style.transform=`translate(-50%,-50%) translateY(${sc*speed}px)`; }
      else{ el.style.transform=`translateX(-50%) translateY(${sc*speed}px)`; }
    });
    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  // =================== Scroll vers slider ===================
  document.getElementById('goSlider').addEventListener('click',()=>{
    const sliderPos=document.getElementById('cell-slider').offsetTop;
    window.scrollTo({top:sliderPos,behavior:'smooth'});
  });

  // =================== Slider tunnel centré ===================
  const slides=document.querySelectorAll('#cell-slider .slide');
  let current=0, canSlide=true;
  function updateSlides(){
    slides.forEach((s,i)=>{
      s.classList.remove('active','prev','next');
      if(i===current) s.classList.add('active');
      if(i===current-1||(current===0&&i===slides.length-1)) s.classList.add('prev');
      if(i===current+1||(current===slides.length-1&&i===0)) s.classList.add('next');
    });
    // Centrer la slide active
    const slider = document.getElementById('cell-slider');
    const activeSlide = slides[current];
    const sliderWidth = slider.offsetWidth;
    const slideWidth = activeSlide.offsetWidth;
    const offset = activeSlide.offsetLeft + slideWidth / 2 - sliderWidth / 2;
    slider.scrollTo({ left: offset, behavior: 'smooth' });
  }
  function throttleSlide(cb){ if(!canSlide)return; canSlide=false; cb(); setTimeout(()=>canSlide=true,700);}
  document.querySelector('.nav.next').addEventListener('click',()=>throttleSlide(()=>{current=(current+1)%slides.length;updateSlides();}));
  document.querySelector('.nav.prev').addEventListener('click',()=>throttleSlide(()=>{current=(current-1+slides.length)%slides.length;updateSlides();}));
  updateSlides();

  // =================== HERO: Animation Igloo ultra-premium Babylon.js ===================
  const canvas3d = document.getElementById('webgl-canvas');
  if (window.BABYLON && canvas3d) {
    const engine = new BABYLON.Engine(canvas3d, true, {preserveDrawingBuffer:true, stencil:true});
    const createScene = function () {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0,0,0,0);

      const camera = new BABYLON.ArcRotateCamera("cam", Math.PI/2, Math.PI/2.19, 2.08, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas3d, true);

      const light = new BABYLON.PointLight("plight", new BABYLON.Vector3(0,2,2), scene);
      light.intensity = 1.4;
      const rimLight = new BABYLON.HemisphericLight("rim", new BABYLON.Vector3(0,1,0), scene);
      rimLight.intensity = .7;

      scene.imageProcessingConfiguration.bloomEnabled = true;
      scene.imageProcessingConfiguration.bloomThreshold = 0.63;
      scene.imageProcessingConfiguration.bloomWeight = 0;

      // Ton image modelée
      const pulseTex = new BABYLON.Texture("pulse53.png", scene);
      const mat = new BABYLON.PBRMaterial("mat", scene);
      mat.albedoTexture = pulseTex;
      mat.metallic = 0.28;
      mat.roughness = 0.13;
      mat.subSurface.isTranslucencyEnabled = true;
      mat.subSurface.translucencyIntensity = 0.14;
      mat.subSurface.minimumThickness = 0.7;
      mat.subSurface.maximumThickness = 1.28;
      mat.bumpTexture = new BABYLON.Texture("pulse53-bump.png", scene); // optionnel relief map
      mat.bumpTexture.level = 0.26;
      mat.emissiveColor = new BABYLON.Color3(0.09, 1, 1);

      const plane = BABYLON.MeshBuilder.CreatePlane("ultraPlane", {width:1.38,height:1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
      plane.material = mat;

      // Animation parallax, distortion, reveal
      let mouse = {x:0,y:0};
      canvas3d.addEventListener('mousemove', function(e){
        mouse.x = (e.clientX/canvas3d.width-0.5)*2;
        mouse.y = (e.clientY/canvas3d.height-0.51)*2;
      });
      let reveal = 0.01;
      scene.registerBeforeRender(function () {
        const t = performance.now() * 0.001;
        plane.position.z = Math.sin(t*0.97)*.07;
        plane.rotation.y = mouse.x*0.21 + Math.sin(t*0.49)*0.12;
        plane.rotation.x = -mouse.y*0.18 + Math.cos(t*0.34)*0.07;
        if(reveal<0.7){reveal+=0.012;}
        scene.imageProcessingConfiguration.bloomWeight = reveal;
      });

      return scene;
    }
    const scene = createScene();
    engine.runRenderLoop(() => {scene.render();});
    window.addEventListener("resize", ()=>engine.resize());
  }
});
