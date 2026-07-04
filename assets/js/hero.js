/* ============ HERO: Hexagon Particle Canvas System ============ */

class HexagonParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.isRunning = true;
    this.resizeRAF = null;

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

    if (this.particles.length) {
      this.particles.forEach(p => {
        p.x = Math.random() * this.width;
        p.y = Math.random() * this.height;
      });
    }
  }

  createParticles() {
    var count = Math.min(Math.floor((this.width * this.height) / 15000), 80);
    this.particles = [];

    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 50 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.08 + 0.02,
        color: Math.random() > 0.5 ? '#C9A84C' : '#0E1C3D',
        phase: Math.random() * Math.PI * 2,
        floatAmp: Math.random() * 0.5 + 0.3,
        floatSpeed: Math.random() * 0.0003 + 0.0002,
        floatOffX: Math.random() * Math.PI * 2,
        floatOffY: Math.random() * Math.PI * 2,
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
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i - Math.PI / 6;
      var hx = size * Math.cos(angle);
      var hy = size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawConnections() {
    var i, j, dx, dy, dist, alpha;
    for (i = 0; i < this.particles.length; i++) {
      for (j = i + 1; j < this.particles.length; j++) {
        dx = this.particles[i].x - this.particles[j].x;
        dy = this.particles[i].y - this.particles[j].y;
        dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
          alpha = 0.04 * (1 - dist / 250) * (1 - dist / 250);
          if (alpha < 0.002) continue;
          this.ctx.save();
          this.ctx.globalAlpha = alpha;
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
    var self = this;

    window.addEventListener('resize', function () {
      if (self.resizeRAF) return;
      self.resizeRAF = requestAnimationFrame(function () {
        self.resize();
        self.resizeRAF = null;
      });
    });

    document.addEventListener('mousemove', function (e) {
      self.mouseX = e.clientX;
      self.mouseY = e.clientY;
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    var time = Date.now();
    var self = this;

    this.particles.forEach(function (p) {
      var dx = p.x - self.mouseX;
      var dy = p.y - self.mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var mouseRadius = 220;

      if (dist < mouseRadius && dist > 0.1) {
        var force = (1 - dist / mouseRadius) * 0.7;
        var angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force;
        p.y += Math.sin(angle) * force;
      }

      p.x += Math.sin(time * p.floatSpeed + p.floatOffX) * 0.12;
      p.y += Math.cos(time * p.floatSpeed * 0.7 + p.floatOffY) * 0.12;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotSpeed;

      if (p.x < -p.size * 2) p.x = self.width + p.size;
      if (p.x > self.width + p.size) p.x = -p.size * 2;
      if (p.y < -p.size * 2) p.y = self.height + p.size;
      if (p.y > self.height + p.size) p.y = -p.size * 2;

      self.drawHexagon(self.ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.color);
    });

    this.drawConnections();

    requestAnimationFrame(function () { self.animate(); });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('hero-canvas')) {
    new HexagonParticleSystem('hero-canvas');
  }
  if (document.getElementById('page-hero-canvas')) {
    new HexagonParticleSystem('page-hero-canvas');
  }
});