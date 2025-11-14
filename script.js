// --- Écran de lancement "veines organiques" ---
window.addEventListener('DOMContentLoaded', () => {
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  if (virusCanvas) {
    const vCtx = virusCanvas.getContext('2d');
    virusCanvas.width = window.innerWidth;
    virusCanvas.height = window.innerHeight;
    class Veine {
      constructor(x, y) {
        this.points = [{x: x + (Math.random()-0.5)*6, y: y + (Math.random()-0.5)*6}];
        this.maxPoints = 26+Math.floor(Math.random()*70);
        this.color = `rgba(18,255,255,${0.38+Math.random()*0.44})`;
        this.finished = false;
      }
      grow() {
        if (this.finished) return;
        const last = this.points[this.points.length-1];
        const angle = Math.random()*Math.PI*2;
        const len = 12+Math.random()*18;
        const nx = last.x + Math.cos(angle)*len;
        const ny = last.y + Math.sin(angle)*len;
        this.points.push({x:nx,y:ny});
        if (this.points.length > this.maxPoints || nx<0 || nx>virusCanvas.width || ny <0|| ny>virusCanvas.height) {
          this.finished = true;
        }
      }
      draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i=1;i<this.points.length;i++) {
          const midX = (this.points[i-1].x + this.points[i].x)/2;
          const midY = (this.points[i-1].y + this.points[i].y)/2;
          ctx.quadraticCurveTo(this.points[i-1].x, this.points[i-1].y, midX, midY);
        }
        ctx.stroke();
      }
    }
    const veines = [];
    for(let i=0;i<100;i++) veines.push(new Veine(window.innerWidth/2, window.innerHeight/2));
    function animateVeines() {
      vCtx.clearRect(0,0,virusCanvas.width,virusCanvas.height);
      let allFinished = true;
      veines.forEach(v => {if(!v.finished){v.grow();allFinished=false;} v.draw(vCtx);});
      requestAnimationFrame(animateVeines);
      if (allFinished) {
        launch.style.transition='opacity 0.6s ease';
        launch.style.opacity=0;
        setTimeout(()=>launch.style.display='none',650);
      }
    }
    animateVeines();
  }

  // --- Fond étoilé canvas ---
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
      alpha:Math.random()*0.75+0.25,
      speed:0.06+Math.random()*0.11
    });
    function drawStars(){
      ctx.clearRect(0,0,W,H);
      for(let s of stars){
        s.y+=s.speed; if(s.y>H) s.y=0;
        ctx.fillStyle=`rgba(18,255,255,${s.alpha})`;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  // -- Section Babylon.js Ultra 3D --
  var canvas = document.getElementById("renderCanvas");
  if (window.BABYLON && canvas) {
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function () {
      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0,0,0,0);

      // Caméra
      var camera = new BABYLON.ArcRotateCamera("Cam", Math.PI/2, Math.PI/2.08, 2.1, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);

      // Lumière et halo premium
      var light = new BABYLON.PointLight("plight", new BABYLON.Vector3(0,2,2), scene);
      light.intensity = 1.8;
      var rimLight = new BABYLON.HemisphericLight("rim", new BABYLON.Vector3(0,1,0), scene);
      rimLight.intensity = .5;

      // Effet Bloom pipeline
      scene.imageProcessingConfiguration.bloomEnabled = true;
      scene.imageProcessingConfiguration.bloomThreshold = 0.70;
      scene.imageProcessingConfiguration.bloomWeight = 0;

      // Matériau PBR relief organique
      var pulseTex = new BABYLON.Texture("pulse53.png", scene); // place ton PNG
      var mat = new BABYLON.PBRMaterial("mat", scene);
      mat.albedoTexture = pulseTex;
      mat.metallic = 0.36;
      mat.roughness = 0.16;
      mat.subSurface.isTranslucencyEnabled = true;
      mat.subSurface.translucencyIntensity = 0.13;
      mat.subSurface.minimumThickness = 0.71;
      mat.subSurface.maximumThickness = 1.34;
      // relief/bump (optionnel)
      mat.bumpTexture = new BABYLON.Texture("pulse53-bump.png", scene); // si tu as une bump map
      mat.bumpTexture.level = 0.33;
      // Halo lumineux + bloom
      mat.emissiveColor = new BABYLON.Color3(0.16, 1, 1);

      // Plan mesh très HD
      var plane = BABYLON.MeshBuilder.CreatePlane("ultraPlane", {width:1.42, height:1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
      plane.material = mat;

      // Animate, parallax, distortion organique
      let mouse = {x:0,y:0};
      canvas.addEventListener('mousemove', function(e){
        mouse.x = (e.clientX/window.innerWidth - 0.5)*2;
        mouse.y = (e.clientY/window.innerHeight - 0.6)*2;
      });

      let reveal = 0.02;
      scene.registerBeforeRender(function () {
        var t = performance.now()*0.001;
        plane.position.z = Math.sin(t*1.08)*.08;
        plane.rotation.y = mouse.x*0.21 + Math.sin(t*0.5)*0.12;
        plane.rotation.x = -mouse.y*0.19 + Math.cos(t*0.33)*0.07;
        // Bloom reveal progressif
        if(reveal<0.7){ reveal+=0.011; }
        scene.imageProcessingConfiguration.bloomWeight = reveal;
      });

      return scene;
    };

    var scene = createScene();
    engine.runRenderLoop(function () { scene.render(); });
    window.addEventListener("resize", function () { engine.resize(); });
  }
});
