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
    this.createElements();
    this.state = {};
    this.config = {};
    this.trackMouse();
    this.animate();
    this.bindHover();
    this.bindWindowEdge();
  },

  /* ---------- 1. DOM Elements ---------- */

  createElements() {
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
    document.body.style.cursor = 'none';
    this.el = { outer: outer, mid: mid, core: core, label: label };

    this.state = {
      mx: 0, my: 0,
      cx: 0, cy: 0,
      ox: 0, oy: 0,
      wx: 0, wy: 0,
      orbitPhase: 0,
      orbitT: 0,
      orbitTarget: 0,
      clickBurst: 0,
      spin1: 0,
      spin2: 0
    };

    this.config = {
      orbitRX: 18, orbitRY: 9,
      orbitRX2: 30, orbitRY2: 15,
      orbitSpeed: 0.03,
      spinSpeedMid: 0.6,
      spinSpeedOut: -0.4,
      lerpCore: 0.18,
      lerpMid: 0.09,
      lerpOut: 0.06
    };
  },

  /* ---------- 2. Mouse Tracking ---------- */

  trackMouse() {
    var self = this;
    document.addEventListener('mousemove', function (e) {
      self.state.mx = e.clientX;
      self.state.my = e.clientY;
    });
    document.addEventListener('click', function () {
      self.state.clickBurst = 1;
    });
  },

  /* ---------- 3. Trailing (3-layer chain) ---------- */

  calcTrailing() {
    var s = this.state;
    var c = this.config;
    s.cx += (s.mx - s.cx) * c.lerpCore;
    s.cy += (s.my - s.cy) * c.lerpCore;
    s.ox += (s.cx - s.ox) * c.lerpMid;
    s.oy += (s.cy - s.oy) * c.lerpMid;
    s.wx += (s.ox - s.wx) * c.lerpOut;
    s.wy += (s.oy - s.wy) * c.lerpOut;
  },

  /* ---------- 4. Orbit (Lissajous, active on hover) ---------- */

  calcOrbit() {
    var s = this.state;
    var c = this.config;
    s.orbitT += (s.orbitTarget - s.orbitT) * 0.07;
    var intensity = Math.min(1.3, s.orbitT + s.clickBurst * 0.5);

    var spd = 1 + s.clickBurst * 4;
    s.orbitPhase += c.orbitSpeed * spd;

    var p1 = s.orbitPhase;
    var p2 = s.orbitPhase * 0.7 + 1.8;

    var x1 = Math.cos(p1) * c.orbitRX;
    var y1 = Math.sin(p1 * 1.5) * c.orbitRY + Math.sin(p1 * 3.1) * 2;
    var x2 = Math.cos(p2) * c.orbitRX2;
    var y2 = Math.sin(p2 * 1.3 + 0.9) * c.orbitRY2 + Math.sin(p2 * 2.7) * 3;

    var kick = s.clickBurst * 8;

    this._orbitX1 = (x1 + Math.cos(s.orbitPhase) * kick) * intensity;
    this._orbitY1 = (y1 + Math.sin(s.orbitPhase * 1.1) * kick) * intensity;
    this._orbitX2 = (x2 - Math.cos(s.orbitPhase * 0.8) * kick * 0.7) * intensity;
    this._orbitY2 = (y2 - Math.sin(s.orbitPhase * 0.9) * kick * 0.7) * intensity;
  },

  /* ---------- 5. Self-Rotation ---------- */

  calcSpin() {
    var s = this.state;
    var c = this.config;
    var spd = 1 + s.clickBurst * 4;
    s.spin1 += c.spinSpeedMid * spd;
    s.spin2 += c.spinSpeedOut * spd;
  },

  /* ---------- 6. Click Burst (core only) ---------- */

  calcClickBurst() {
    this.state.clickBurst *= 0.93;
  },

  /* ---------- 7. Apply Transforms ---------- */

  applyTransforms() {
    var s = this.state;
    var e = this.el;

    var coreScale = 1 + s.clickBurst * 0.3;

    var midX = s.ox + this._orbitX1;
    var midY = s.oy + this._orbitY1;
    var outX = s.wx + this._orbitX2;
    var outY = s.wy + this._orbitY2;

    e.core.style.transform = 'translate(' + s.cx + 'px,' + s.cy + 'px) translate(-50%,-50%) scale(' + coreScale + ')';
    e.mid.style.transform = 'translate(' + midX + 'px,' + midY + 'px) translate(-50%,-50%) rotate(' + s.spin1 + 'deg)';
    e.outer.style.transform = 'translate(' + outX + 'px,' + outY + 'px) translate(-50%,-50%) rotate(' + s.spin2 + 'deg)';
    e.label.style.transform = 'translate(' + s.cx + 'px,' + (s.cy - 28) + 'px) translate(-50%,-50%)';
  },

  /* ---------- 8. Animation Loop ---------- */

  animate() {
    this.calcTrailing();
    this.calcOrbit();
    this.calcSpin();
    this.calcClickBurst();
    this.applyTransforms();
    requestAnimationFrame(this.animate.bind(this));
  },

  /* ---------- 9. Hover Effects (activate orbit) ---------- */

  bindHover() {
    var self = this;
    function applyHover(el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor--hover');
        self.state.orbitTarget = 1;
        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          document.body.classList.add('cursor--text');
          self.el.label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor--hover', 'cursor--text');
        self.state.orbitTarget = 0;
      });
    }
    var targets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    for (var i = 0; i < targets.length; i++) {
      applyHover(targets[i]);
    }
  },

  /* ---------- 10. Window Edge (hide/show) ---------- */

  bindWindowEdge() {
    var e = this.el;
    document.addEventListener('mouseleave', function () {
      e.core.style.opacity = '0';
      e.mid.style.opacity = '0';
      e.outer.style.opacity = '0';
      e.label.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      e.core.style.opacity = '1';
      e.mid.style.opacity = '1';
      e.outer.style.opacity = '';
      e.label.style.opacity = '';
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
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
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
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
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

  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initLenis();
  }
});
