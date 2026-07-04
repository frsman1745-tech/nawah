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

    /* ─── Create DOM elements ─── */
    var outer = document.createElement('div');
    outer.className = 'cursor__outer';
    var mid = document.createElement('div');
    mid.className = 'cursor__mid';
    var core = document.createElement('div');
    core.className = 'cursor__core';
    var label = document.createElement('span');
    label.className = 'cursor__label';
    label.textContent = 'View';

    document.body.append(outer, mid, core, label);
    document.body.style.cursor = 'none';

    /* ─── Position state ─── */
    var mx = 0, my = 0;      // raw mouse
    var cx = 0, cy = 0;      // core → mouse (lerp 0.21)
    var ox = 0, oy = 0;      // mid  → core (lerp 0.09)
    var mx2 = 0, my2 = 0;    // outer → mid (lerp 0.06)

    /* ─── Animation state ─── */
    var orbitAngle = 0;
    var orbitT = 0;
    var orbitTarget = 0;
    var clickBurst = 0;
    var spinAngle = 0;

    /* ─── Tunables ─── */
    var CONFIG = {
      orbitRX: 18,  orbitRY: 9,
      orbitRX2: 30, orbitRY2: 15,
      speed: 0.035,
      spinRate: 0.5,
      kickRadius: 8,
    };

    /* ─── Events ─── */
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    document.addEventListener('click', function () {
      clickBurst = 1;
    });

    /* ─── Main animation loop ─── */
    function animate() {
      /* trailing chain */
      cx += (mx - cx) * 0.21;
      cy += (my - cy) * 0.21;
      ox += (cx - ox) * 0.09;
      oy += (cy - oy) * 0.09;
      mx2 += (ox - mx2) * 0.06;
      my2 += (oy - my2) * 0.06;

      /* smooth intensity transition */
      orbitT += (orbitTarget - orbitT) * 0.08;
      clickBurst *= 0.92;

      var intensity = orbitT + clickBurst * 0.6;
      if (intensity > 0) {
        var spd = 1 + clickBurst * 4;
        orbitAngle += CONFIG.speed * spd;
        spinAngle += CONFIG.spinRate * spd;

        /* compound Lissajous orbit */
        var p1 = orbitAngle;
        var p2 = orbitAngle * 0.7 + 1.8;

        var offX1 = Math.cos(p1) * CONFIG.orbitRX;
        var offY1 = Math.sin(p1 * 1.5) * CONFIG.orbitRY + Math.sin(p1 * 3.1) * 2;
        var offX2 = Math.cos(p2) * CONFIG.orbitRX2;
        var offY2 = Math.sin(p2 * 1.3 + 0.9) * CONFIG.orbitRY2 + Math.sin(p2 * 2.7) * 3;

        var kick = clickBurst * CONFIG.kickRadius;
        var kx1 = Math.cos(orbitAngle) * kick;
        var ky1 = Math.sin(orbitAngle * 1.1) * kick;
        var kx2 = Math.cos(orbitAngle * 0.8) * kick * 0.7;
        var ky2 = Math.sin(orbitAngle * 0.9) * kick * 0.7;

        mid.style.transform = translate(ox + (offX1 + kx1) * intensity,
                                        oy + (offY1 + ky1) * intensity,
                                        spinAngle);
        outer.style.transform = translate(mx2 + (offX2 - kx2) * intensity,
                                          my2 + (offY2 - ky2) * intensity,
                                          -spinAngle);
      } else {
        mid.style.transform = translate(ox, oy, 0);
        outer.style.transform = translate(mx2, my2, 0);
      }

      core.style.transform = translate(cx, cy, 0);
      label.style.transform = 'translate(' + cx + 'px, ' + (cy - 28) + 'px) translate(-50%, -50%)';

      requestAnimationFrame(animate);
    }

    function translate(x, y, deg) {
      return 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) rotate(' + deg + 'deg)';
    }

    animate();

    /* ─── Hover in → orbit, Hover out → static ─── */
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

    var selectors = 'a, button, .btn, .glass-card, .service-card, .team-card, .project-card';
    document.querySelectorAll(selectors).forEach(applyHover);

    /* ─── Window leave / enter ─── */
    document.addEventListener('mouseleave', function () {
      core.style.opacity = '0'; mid.style.opacity = '0'; outer.style.opacity = '0'; label.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      core.style.opacity = '1'; mid.style.opacity = '1'; outer.style.opacity = '1'; label.style.opacity = '1';
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
