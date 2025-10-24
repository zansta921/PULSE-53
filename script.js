window.addEventListener('DOMContentLoaded', () => {
  // Animation lancement
  setTimeout(()=>{
    const launch=document.getElementById('launch-screen');
    if(launch) launch.style.display='none';
  },1500);

  // Starfield canvas
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  window.addEventListener('resize',resize);
  resize();

  for(let i=0;i<200;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height*0.6,
      r: Math.random()*1.5+0.5,
      alpha: Math.random()
    });
  }

  function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let s of stars){
      let distY = canvas.height*0.4 - s.y;
      let alpha = s.alpha * Math.max(distY/(canvas.height*0.4),0);
      ctx.fillStyle = `rgba(18,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();
});
