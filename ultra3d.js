window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Espace étoilé
    scene.clearColor = new BABYLON.Color4(0,0,0,1);

    // Caméra orbite/discrète
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2.05, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lumière halo, bloom, rimLight
    var light = new BABYLON.PointLight("plight", new BABYLON.Vector3(0,2,2), scene);
    light.intensity = 1.5;
    var rimLight = new BABYLON.HemisphericLight("rim", new BABYLON.Vector3(0,1,0), scene);
    rimLight.intensity = .5;

    // Effet Bloom
    var bloom = new BABYLON.BloomEffect(scene);
    bloom.threshold = 0.7;
    bloom.weight = 0.7;

    // Plan relief avec texture et displacement
    var pulseTex = new BABYLON.Texture("pulse53.png", scene);
    var mat = new BABYLON.PBRMaterial("mat", scene);
    mat.albedoTexture = pulseTex;
    mat.metallic = 0.3;
    mat.roughness = 0.25;
    mat.subSurface.isTranslucencyEnabled = true;
    mat.subSurface.translucencyIntensity = 0.15;
    mat.subSurface.minimumThickness = 0.7;
    mat.subSurface.maximumThickness = 1.52;

    // Texture bump (relief/organique) : optionnel, crée une pulse53-bump.png en niveaux de gris !
    mat.bumpTexture = new BABYLON.Texture("pulse53-bump.png", scene);
    mat.bumpTexture.level = 0.35;
    mat.subSurface.refractionIntensity = 0.22;

    // Halo dynamique autour du plan
    mat.emissiveColor = new BABYLON.Color3(0.1,1,1);

    var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width:1.6,height:1}, scene);
    plane.material = mat;

    // Ajoute le bloom sur la scène via pipeline (Babylon 5+)
    scene.imageProcessingConfiguration.bloomEnabled = true;
    scene.imageProcessingConfiguration.bloomThreshold = 0.7;
    scene.imageProcessingConfiguration.bloomWeight = 0.7;

    // Animation pulsation.
    scene.registerBeforeRender(function () {
      // Distorsion organique
      var t = performance.now() * 0.001;
      plane.position.z = Math.sin(t*1.2)*.08;
      plane.rotation.y = Math.sin(t*0.7)*0.13;
      plane.rotation.x = Math.sin(t*0.4)*0.06;
      // Parallax effet souris.
      if (window._mouse) {
        plane.rotation.x += window._mouse.y * 0.04;
        plane.rotation.y += window._mouse.x * 0.10;
      }
    });

    // Parallax souris
    window._mouse = {x:0,y:0};
    canvas.addEventListener('mousemove', function(e){
      window._mouse.x = (e.clientX / window.innerWidth - 0.5)*2;
      window._mouse.y = (e.clientY / window.innerHeight - 0.5)*2;
    });

    // Reveal brouillard organique (bloom à zéro au début)
    scene.imageProcessingConfiguration.bloomWeight = 0;
    let reveal = 0;
    scene.registerBeforeRender(function(){
      if(reveal<0.7){reveal+=.012;}
      scene.imageProcessingConfiguration.bloomWeight = reveal;
    });
    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () { scene.render(); });
  window.addEventListener("resize", function () { engine.resize(); });
});
