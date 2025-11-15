// Morphing SVG, reveal section, mask reveal titres, parallax premium
window.addEventListener('DOMContentLoaded', () => {
  // --- Morph SVG adaptive --- //
  const morphs = [
    // hero
    "M0,100 Q250,0 600,100 T1440,100 Q1300,600 800,400 T0,500 Z",
    // adn
    "M0,150 Q300,40 700,180 T1440,210 Q1200,620 650,390 T0,500 Z",
    // phases
    "M0,190 Q360,100 900,200 Q1200,250 1440,210 Q1200,500 700,360 T0,500 Z",
    // infos/about
    "M0,250 Q500,420 1200,305 T1440,390 Q1300,600 600,500 T0,500 Z"
  ];
  const morphSections = ["hero","adn-animals-section","phases-section","about"];
  const morph = document.getElementById('morph-shape');
  function setMorphToSection(idx) {
    if (morph) morph.setAttribute('d', morphs[idx]);
    document.documentElement.setAttribute("data-section",["hero","adn","phases","about"][idx]||"hero");
  }
  
  // --- Fade + zoom on section reveal + morph shift
  function sectionTransitions() {
    const secs = document.querySelectorAll('.section.premium-section');
    secs.forEach((sec, i) => {
      gsap.set(sec, { opacity:0, scale:1.08, y:30 });
      ScrollTrigger.create({
        trigger:sec, start:"top 70%",
        onEnter:()=> {
          gsap.to(sec, { opacity:1, scale:1, y:0, duration:.82, ease:"power3.out" });
          setMorphToSection(Math.max(0,morphSections.findIndex(sel=>sec.id===sel||sec.classList.contains(sel))));
        },
        onLeaveBack:()=> {
          gsap.to(sec, { opacity:0, scale:1.08, y:30, duration:.8, ease:"power2.in" });
        }
      });
    });
  }

  // --- Title/Major elements mask reveal
  function maskReveal() {
    ScrollTrigger.batch('.mask-reveal',{
      interval:0.09, batchMax:8,
      onEnter: batch => batch.forEach(el=>el.classList.add('is-visible'))
    });
  }

  // --- Parallax premium (adj sur .parallax-layer)
  function parallaxPremium() {
    const layers = document.querySelectorAll('.parallax-layer');
    function plx() {
      const sc = window.scrollY;
      layers.forEach(el=>{
        const speed = parseFloat(el.dataset.speed||'0.8');
        el.style.transform = (el.id==='overlay')
            ? `translate(-50%,-50%) translateY(${sc*speed}px)`
            : `translateX(-50%) translateY(${sc*speed}px)`;
      });
      requestAnimationFrame(plx);
    }
    plx();
  }

  // --- Premium phases fade-in
  function revealPhases() {
    const section = document.getElementById('phases-section');
    const grid = document.getElementById('phases-grid');
    if (!section||!grid) return;
    function reveal(){
      const rect = section.getBoundingClientRect();
      if(rect.top<window.innerHeight-120) grid.classList.add('phases-visible');
      else grid.classList.remove('phases-visible');
    }
    window.addEventListener('scroll', reveal, {passive:true});
    window.addEventListener('resize', reveal, {passive:true});
    reveal();
  }
  
  setMorphToSection(0);
  parallaxPremium();
  sectionTransitions();
  maskReveal();
  revealPhases();

  // Option accessibilité : réduire les effets (préserve la structure)
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
    gsap.globalTimeline.timeScale(0.01);
  }
});
