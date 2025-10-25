window.addEventListener('DOMContentLoaded', () => {
  const launch = document.getElementById('launch-screen');
  const virusCanvas = document.getElementById('virus-animation');
  const vCtx = virusCanvas.getContext('2d');
  virusCanvas.width = window.innerWidth;
  virusCanvas.height = window.innerHeight;

  class Veine {
    constructor(x, y) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      this.points = [{ x: x + offsetX, y: y + offsetY }];
      this.maxPoints = 50 + Math.floor(Math.random() * 50);
      this.color = `rgba(18,255,255,${0.3 + Math.random() * 0.4})`;
      this.finished = false;
    }
    grow() {
      if (this.finished) return;
      const last = this.points[this.points.length - 1];
      const angle = Math.random() * Math.PI * 2;
      const len = 12 + Math.random() * 14;
      const nx = last.x + Math.cos(angle) * len;
      const ny = last.y + Math.sin(angle) * len;
      this.points.push({ x: nx, y: ny });
      if (this.points.length > this.maxPoints || nx < 0 || nx > virusCanvas.width || ny < 0 || ny > virusCanvas.height) {
        this.finished = true;
      }
    }
    draw(ctx) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        const midX = (this.points[i - 1].x + this.points[i].x) / 2;
        const midY = (this.points[i - 1].y + this.points[i].y) / 2;
        ctx.quadraticCurveTo(this.points[i - 1].x, this.points[i - 1].y, midX, midY);
      }
      ctx.stroke();
    }
  }

  const veines = [];
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 2;
  for (let i = 0; i < 80; i++) veines.push(new Veine(originX, originY));

  function animateVeines() {
    vCtx.clearRect(0, 0, virusCanvas.width, virusCanvas.height);
    let allFinished = true;
    veines.forEach(v => {
      if (!v.finished) { v.grow(); allFinished = false; }
      v.draw(vCtx);
    });
    if (allFinished) {
      launch.style.transition = 'opacity 0.8s ease';
      launch.style.opacity = 0;
      setTimeout(() => launch.style.display = 'none', 900);
    } else {
      requestAnimationFrame(animateVeines);
    }
  }
  animateVeines();

  // Slider
  const slides = document.querySelectorAll('#cell-slider .slide');
  let current = 0;
  let canSlide = true;

  function updateSlides() {
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev', 'next');
      if (i === current) s.classList.add('active');
      if (i === current - 1 || (current === 0 && i === slides.length - 1)) s.classList.add('prev');
      if (i === current + 1 || (current === slides.length - 1 && i === 0)) s.classList.add('next');
    });

    const slider = document.getElementById('cell-slider');
    const activeSlide = slides[current];
    const offset = activeSlide.offsetLeft + activeSlide.offsetWidth / 2 - slider.offsetWidth / 2;
    slider.scrollTo({ left: offset, behavior: 'smooth' });
  }

  function throttleSlide(cb) {
    if (!canSlide) return;
    canSlide = false;
    cb();
    setTimeout(() => canSlide = true, 600);
  }

  document.querySelector('.nav.next').addEventListener('click', () => throttleSlide(() => {
    current = (current + 1) % slides.length;
    updateSlides();
  }));
  document.querySelector('.nav.prev').addEventListener('click', () => throttleSlide(() => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlides();
  }));
  updateSlides();

  // Scroll vers slider
  document.getElementById('goSlider').addEventListener('click', () => {
    const pos = document.getElementById('cell-slider-container').offsetTop;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  });
});
