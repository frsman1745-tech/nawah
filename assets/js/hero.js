/* ============ HERO: Hexagon Particle Canvas System ============ */

class HexagonParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isRunning = true;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();

    document.addEventListener('visibilitychange', () => {
      this.isRunning = !document.hidden;
      if (this.isRunning) this.animate();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  createParticles() {
    const count = Math.min(Math.floor((this.width * this.height) / 15000), 80);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 50 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.08 + 0.02,
        color: Math.random() > 0.5 ? '#C9A84C' : '#0E1C3D',
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  drawHexagon(ctx, x, y, size, rotation, opacity, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = size * Math.cos(angle);
      const hy = size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          this.ctx.save();
          this.ctx.globalAlpha = 0.03 * (1 - dist / 200);
          this.ctx.strokeStyle = '#C9A84C';
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const mpX = (this.mouseX / this.width - 0.5) * 0.05;
    const mpY = (this.mouseY / this.height - 0.5) * 0.05;

    this.particles.forEach(p => {
      p.x += p.vx + mpX * 2;
      p.y += p.vy + mpY * 2;
      p.rotation += p.rotSpeed;

      p.y += Math.sin(Date.now() * 0.0005 + p.phase) * 0.1;
      p.x += Math.cos(Date.now() * 0.0003 + p.phase) * 0.1;

      if (p.x < -p.size) p.x = this.width + p.size;
      if (p.x > this.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = this.height + p.size;
      if (p.y > this.height + p.size) p.y = -p.size;

      this.drawHexagon(this.ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.color);
    });

    this.drawConnections();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-canvas')) {
    new HexagonParticleSystem('hero-canvas');
  }
  if (document.getElementById('page-hero-canvas')) {
    new HexagonParticleSystem('page-hero-canvas');
  }
});
