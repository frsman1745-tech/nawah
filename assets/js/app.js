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
    this.isMobile = window.innerWidth < 768;

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

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        this.isRunning = entries[0].isIntersecting && !document.hidden;
        if (this.isRunning) this.animate();
      }, { threshold: 0 });
      obs.observe(this.canvas);
    }
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
    var area = this.width * this.height;
    var maxP = this.isMobile ? 15 : 30;
    var divisor = this.isMobile ? 40000 : 20000;
    var count = Math.min(Math.floor(area / divisor), maxP); if (count < 3) count = 3;
    if (count < 5) count = 5;
    this.particles = [];

    var maxSize = this.isMobile ? Math.min(30, this.height * 0.08) : Math.min(50, this.height * 0.12);

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
        opacity: this.isMobile ? Math.random() * 0.04 + 0.01 : Math.random() * 0.07 + 0.015,
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
    if (this.isMobile) return;

    var i, j, dx, dy, dist, alpha;
    var maxDist = Math.min(250, this.height * 0.6);

    for (i = 0; i < this.particles.length; i++) {
      for (j = i + 1; j < this.particles.length; j++) {
        dx = this.particles[i].x - this.particles[j].x;
        dy = this.particles[i].y - this.particles[j].y;
        dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          alpha = 0.04 * (1 - dist / maxDist) * (1 - dist / maxDist);
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

    this.ctx.clearRect(0, 0, this.width, this.height);

    var time = Date.now();
    var self = this;
    var mouseRadius = Math.min(120, this.height * 0.35);

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
/* ============ MAIN: Core functionality ============ */

/* ========== Theme System ========== */

const theme = {
  init() {
    const saved = localStorage.getItem('nawah-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.set(theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        this.set(current === 'dark' ? 'light' : 'dark');
      });
    }
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nawah-theme', theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
};

/* ========== Custom Cursor ========== */

const cursor = {
  init() {
    if (window.innerWidth <= 768) return;

    var outer = document.createElement('div');
    outer.className = 'cursor__outer';

    var mid = document.createElement('div');
    mid.className = 'cursor__mid';

    var core = document.createElement('div');
    core.className = 'cursor__core';

    var label = document.createElement('span');
    label.className = 'cursor__label';
    label.textContent = 'View';

    document.body.appendChild(outer);
    document.body.appendChild(mid);
    document.body.appendChild(core);
    document.body.appendChild(label);

    var mx = 0, my = 0;
    var cx = 0, cy = 0;
    var ox = 0, oy = 0;
    var mx2 = 0, my2 = 0;
    var spinAngle1 = 0, spinAngle2 = 0;
    var orbitIntensity = 0, orbitTarget = 0;
    var clickBurst = 0;
    var SPIN_SPEED_1 = -0.8;
    var SPIN_SPEED_2 = 0.6;

    var ripple = document.createElement('div');
    ripple.style.cssText = 'position:fixed;top:0;left:0;width:40px;height:46px;border:2px solid #C9A84C;background:rgba(201,168,76,0.06);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);pointer-events:none;z-index:99998;opacity:0;transform:translate(-50%,-50%) scale(0.2)';
    document.body.appendChild(ripple);
    var rippleActive = false, rippleStart = 0, rippleX = 0, rippleY = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function animate() {
      cx += (mx - cx) * 0.25;
      cy += (my - cy) * 0.25;
      ox += (cx - ox) * 0.10;
      oy += (cy - oy) * 0.10;
      mx2 += (ox - mx2) * 0.07;
      my2 += (oy - my2) * 0.07;

      orbitIntensity += (orbitTarget - orbitIntensity) * 0.08;
      if (orbitIntensity > 0.01) {
        spinAngle1 += SPIN_SPEED_1 * orbitIntensity;
        spinAngle2 += SPIN_SPEED_2 * orbitIntensity;
      }

      clickBurst *= 0.75;
      var t = clickBurst;
      var coreScale = 1 - t * 0.35 + t * (1 - t) * 0.18;
      var coreRotate = t * 22 + Math.sin(t * Math.PI * 5) * t * 6;
      var ringPulse = 1 + t * 0.1;
      spinAngle1 += t * 3;
      spinAngle2 += t * 2.5;
      if (t > 0.05) {
        core.style.filter = 'drop-shadow(0 0 ' + (t * 20) + 'px rgba(201, 168, 76, 0.9)) drop-shadow(0 0 ' + (t * 8) + 'px rgba(255, 215, 0, 0.5))';
      } else {
        core.style.filter = '';
      }

      core.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%) scale(' + coreScale + ') rotate(' + coreRotate + 'deg)';
      mid.style.transform = 'translate(' + ox + 'px, ' + oy + 'px) translate(-50%, -50%) rotate(' + spinAngle1 + 'deg) scale(' + ringPulse + ')';
      outer.style.transform = 'translate(' + mx2 + 'px, ' + my2 + 'px) translate(-50%, -50%) rotate(' + spinAngle2 + 'deg) scale(' + ringPulse + ')';
      label.style.transform = 'translate(' + cx + 'px, ' + (cy - 28) + 'px) translate(-50%, -50%)';

      if (rippleActive) {
        var elapsed = performance.now() - rippleStart;
        var rp = Math.min(elapsed / 500, 1);
        var easeOut = 1 - Math.pow(1 - rp, 2.5);
        ripple.style.transform = 'translate(' + rippleX + 'px, ' + rippleY + 'px) translate(-50%, -50%) scale(' + (0.3 + easeOut * 3) + ') rotate(' + (rp * 60) + 'deg)';
        ripple.style.opacity = Math.pow(1 - rp, 2.5) * 0.85;
        if (rp >= 1) { rippleActive = false; ripple.style.opacity = '0'; }
      }

      requestAnimationFrame(animate);
    }

    animate();

    function applyHover(el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor--hover');
        orbitTarget = 1;
        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          document.body.classList.add('cursor--text');
          label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });

      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor--hover', 'cursor--text');
        orbitTarget = 0;
      });
    }

    var targets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    for (var i = 0; i < targets.length; i++) {
      applyHover(targets[i]);
    }

    document.addEventListener('click', function () {
      clickBurst = 1;
      rippleX = cx; rippleY = cy;
      rippleActive = true; rippleStart = performance.now();
    });

    document.addEventListener('mouseleave', function () { core.style.opacity = '0'; mid.style.opacity = '0'; outer.style.opacity = '0'; label.style.opacity = '0'; ripple.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { core.style.opacity = '1'; mid.style.opacity = '1'; outer.style.opacity = ''; label.style.opacity = ''; });

    window.addEventListener('resize', function () {
      if (window.innerWidth <= 768) {
        core.style.display = 'none'; mid.style.display = 'none'; outer.style.display = 'none'; label.style.display = 'none';
      } else {
        core.style.display = ''; mid.style.display = ''; outer.style.display = ''; label.style.display = '';
      }
    });
  }
};

/* ========== Navbar Scroll Behavior ========== */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========== Mobile Menu ========== */

function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const overlayLinks = document.querySelectorAll('.nav-overlay__link');

  if (!hamburger || !overlay) return;

  function toggleMenu() {
    const isActive = overlay.classList.contains('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? '' : 'hidden';

    if (window.gsap) {
      if (!isActive) {
        gsap.fromTo(overlay.querySelectorAll('.nav-overlay__link'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
        );
      }
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  overlayLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

/* ========== FAQ Accordion ========== */

function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq__question');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (typeof gsap !== 'undefined') {
          const a = i.querySelector('.faq__answer');
          if (a) gsap.to(a, { maxHeight: 0, paddingBottom: 0, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' });
        }
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        if (answer && typeof gsap !== 'undefined') {
          gsap.fromTo(answer,
            { maxHeight: 0, paddingBottom: 0 },
            { maxHeight: answer.scrollHeight, paddingBottom: '0.5rem', duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' }
          );
        }
      }
    });
  });
}

/* ========== Smooth Anchor Scrolling ========== */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ========== Lenis Smooth Scroll ========== */

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 0.8,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
}

/* ========== Init All ========== */

document.addEventListener('DOMContentLoaded', () => {
  theme.init();
  cursor.init();
  initNavbar();
  initMobileMenu();
  initFAQ();
  initSmoothScroll();

  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth >= 768) {
    initLenis();
  }
});
/* ============ ANIMATIONS: GSAP & ScrollTrigger ============ */

/* ========== Hero Cinematic Entrance ========== */

function heroEntrance() {
  if (typeof gsap === 'undefined') return;

  const mm = window.matchMedia('(prefers-reduced-motion: no-preference)');
  if (!mm.matches) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.set('.hero', { autoAlpha: 1 });

  tl.fromTo('.hero__canvas', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.3);

  tl.fromTo('.navbar', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.6);

  tl.call(() => {
    const headline = document.querySelector('.hero__headline');
    if (!headline) return;

    if (typeof SplitText !== 'undefined') {
      const split = new SplitText(headline, { type: 'words' });
      gsap.fromTo(split.words,
        { y: 40, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    } else {
      gsap.fromTo(headline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, null, 0.9);

  tl.fromTo('.hero__subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.4);

  tl.fromTo('.hero__ctas', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 1.7);

  tl.fromTo('.hero__scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.0);
}

/* ========== Scroll-Triggered Reveals ========== */

function scrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const mm = window.matchMedia('(prefers-reduced-motion: no-preference)');
  if (!mm.matches) return;

  gsap.utils.toArray('.section__heading').forEach(heading => {
    gsap.fromTo(heading,
      { clipPath: 'inset(0 0 100% 0)', y: 30 },
      {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.fromTo('.service-card',
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  gsap.utils.toArray('.features__item').forEach((item, i) => {
    const direction = i % 2 === 0 ? -40 : 40;
    gsap.fromTo(item,
      { x: direction, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.fromTo('.team-card',
    { scale: 0.85, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  gsap.utils.toArray('.glass-card:not(.service-card):not(.team-card):not(.project-card)').forEach(card => {
    gsap.fromTo(card,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.fromTo('.project-card',
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  gsap.fromTo('.value-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    }
  );

  gsap.utils.toArray('.featured-project__info, .featured-project__mockups').forEach(el => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}

/* ========== Parallax on Hero Canvas ========== */

function parallaxHero() {
  const canvas = document.querySelector('.hero__canvas');
  if (!canvas || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.to(canvas, {
    y: () => canvas.offsetHeight * 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });
}

/* ========== Initialize All ========== */

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    heroEntrance();
    scrollReveals();
    parallaxHero();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 100);
});
/* ============ COUNTER: Animated Number Counters ============ */

class Counter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.current = 0;
    this.animated = false;
    this.suffix = element.getAttribute('data-suffix') || '';
  }

  animate() {
    if (this.animated) return;
    this.animated = true;

    const startTime = performance.now();
    const startValue = 0;

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      this.current = Math.floor(startValue + (this.target - startValue) * eased);

      this.element.textContent = this.current.toLocaleString() + this.suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.element.textContent = this.target.toLocaleString() + this.suffix;
      }
    };

    requestAnimationFrame(update);
  }
}

function initCounters() {
  const counterElements = document.querySelectorAll('.counter-number');

  if (!counterElements.length) return;

  const counters = [];

  counterElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (!isNaN(target)) {
      counters.push(new Counter(el, target));
    }
  });

  if (typeof ScrollTrigger === 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = counters.find(c => c.element === entry.target);
          if (counter) counter.animate();
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c.element));
    return;
  }

  const statsSection = document.getElementById('stats');
  if (statsSection && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: statsSection,
      start: 'top 80%',
      onEnter: () => {
        counters.forEach(c => c.animate());
      },
      once: true,
    });
  }
}

document.addEventListener('DOMContentLoaded', initCounters);
(function () {
  var glow = document.getElementById('footer-glow');
  if (!glow) return;

  var ticking = false;
  var parent = glow.parentElement;

  parent.addEventListener('mousemove', function (e) {
    if (!ticking) {
      requestAnimationFrame(function () {
        var rect = parent.getBoundingClientRect();
        var lx = e.clientX - rect.left;
        var ly = e.clientY - rect.top;
        var inside = lx >= 0 && lx <= rect.width && ly >= 0 && ly <= rect.height;
        if (inside) glow.style.cssText = '--glow-x:' + lx + 'px;--glow-y:' + ly + 'px;opacity:1';
        else glow.style.opacity = '0';
        ticking = false;
      });
      ticking = true;
    }
  });

  parent.addEventListener('mouseleave', function () {
    glow.style.opacity = '0';
  });
})();


