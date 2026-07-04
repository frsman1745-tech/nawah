/* ============ HERO: Hexagon Particle Canvas System ============ */

class HexagonParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.smoothMX = -9999;
    this.smoothMY = -9999;
    this.isRunning = true;
    this.resizeRAF = null;
    this.frameSkip = window.innerWidth < 768 ? 2 : 1;
    this.frameCount = 0;

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
    var rect = this.canvas.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w < 1) w = window.innerWidth;
    if (h < 1) h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.width = w;
    this.height = h;

    if (this.particles.length) {
      this.particles.forEach(function (p) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
      });
    }
  }

  createParticles() {
    var isMobile = window.innerWidth < 768;
    var area = this.width * this.height;
    var divisor = isMobile ? 50000 : 20000;
    var maxP = isMobile ? 25 : 60;
    var count = Math.min(Math.floor(area / divisor), maxP);
    if (count < 5) count = 5;
    this.particles = [];

    var maxSize = isMobile ? Math.min(30, this.height * 0.08) : Math.min(50, this.height * 0.12);

    for (var i = 0; i < count; i++) {
      var baseVx = (Math.random() - 0.5) * 0.1;
      var baseVy = (Math.random() - 0.5) * 0.1;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * maxSize + 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: baseVx,
        vy: baseVy,
        baseVx: baseVx,
        baseVy: baseVy,
        opacity: isMobile ? Math.random() * 0.04 + 0.01 : Math.random() * 0.07 + 0.015,
        color: Math.random() > 0.5 ? '#C9A84C' : '#0E1C3D',
        phase: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.0003 + 0.00015,
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
    var maxDist = Math.min(200, this.height * 0.5);

    for (i = 0; i < this.particles.length; i++) {
      for (j = i + 1; j < this.particles.length; j++) {
        dx = this.particles[i].x - this.particles[j].x;
        dy = this.particles[i].y - this.particles[j].y;
        dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          alpha = 0.03 * (1 - dist / maxDist) * (1 - dist / maxDist);
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
    var ticking = false;

    window.addEventListener('resize', function () {
      if (self.resizeRAF) return;
      self.resizeRAF = requestAnimationFrame(function () {
        self.resize();
        self.createParticles();
        self.resizeRAF = null;
      });
    });

    document.addEventListener('mousemove', function (e) {
      if (!ticking) {
        requestAnimationFrame(function () {
          self.mouseX = e.clientX;
          self.mouseY = e.clientY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  animate() {
    if (!this.isRunning) return;

    var self = this;

    this.frameCount++;
    if (this.frameCount % this.frameSkip !== 0) {
      requestAnimationFrame(function () { self.animate(); });
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    var time = Date.now();
    var mouseRadius = Math.min(180, this.height * 0.4);

    this.smoothMX += (this.mouseX - this.smoothMX) * 0.15;
    this.smoothMY += (this.mouseY - this.smoothMY) * 0.15;

    this.particles.forEach(function (p) {
      var dx = p.x - self.smoothMX;
      var dy = p.y - self.smoothMY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var influence = 0;

      if (dist < mouseRadius && dist > 0.5) {
        influence = 1 - dist / mouseRadius;
        var force = Math.pow(influence, 1.5) * 1.2;
        var angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.08;
        p.vy += Math.sin(angle) * force * 0.08;
        p.rotation += influence * 0.03;
      }

      p.vx += (p.baseVx - p.vx) * 0.04;
      p.vy += (p.baseVy - p.vy) * 0.04;

      p.x += Math.sin(time * p.floatSpeed + p.floatOffX) * 0.1;
      p.y += Math.cos(time * p.floatSpeed * 0.7 + p.floatOffY) * 0.1;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotSpeed;

      if (p.x < -p.size * 2) p.x = self.width + p.size;
      if (p.x > self.width + p.size) p.x = -p.size * 2;
      if (p.y < -p.size * 2) p.y = self.height + p.size;
      if (p.y > self.height + p.size) p.y = -p.size * 2;

      var finalOpacity = p.opacity + influence * 0.04;
      self.drawHexagon(self.ctx, p.x, p.y, p.size, p.rotation, finalOpacity, p.color);
    });

    if (this.frameSkip < 2) {
      this.drawConnections();
    }

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