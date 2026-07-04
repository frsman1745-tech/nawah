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
    document.body.style.cursor = 'none';

    var mx = 0, my = 0;
    var pmx = 0, pmy = 0;
    var vx = 0, vy = 0;
    var cx = 0, cy = 0;
    var ox = 0, oy = 0;
    var mx2 = 0, my2 = 0;
    var orbitPhase = 0;
    var orbitT = 0;
    var orbitTarget = 1;
    var clickBurst = 0;
    var burstPhase = 0;
    var selfRot1 = 0;
    var selfRot2 = 0;
    var coreScale = 1;
    var midScale = 1;
    var outerScale = 1;
    var smoothSpeed = 0;
    var idleT = 0;

    var ORBIT_RX = 18, ORBIT_RY = 9;
    var ORBIT_RX2 = 30, ORBIT_RY2 = 15;
    var ORBIT_SPD = 0.03;
    var SPIN_MID = 0.6;
    var SPIN_OUT = -0.4;

    document.addEventListener('mousemove', function (e) {
      pmx = mx; pmy = my;
      mx = e.clientX;
      my = e.clientY;
      vx = mx - pmx;
      vy = my - pmy;
    });

    document.addEventListener('click', function () {
      clickBurst = 1;
      burstPhase = 0;
    });

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function animate() {
      var vel = Math.sqrt(vx * vx + vy * vy);
      var speedFactor = Math.min(1, vel / 30);
      smoothSpeed += (speedFactor - smoothSpeed) * 0.1;

      var lerpCore = 0.18 + smoothSpeed * 0.15;
      var lerpMid = 0.08 + smoothSpeed * 0.08;
      var lerpOut = 0.05 + smoothSpeed * 0.05;

      cx += (mx - cx) * lerpCore;
      cy += (my - cy) * lerpCore;
      ox += (cx - ox) * lerpMid;
      oy += (cy - oy) * lerpMid;
      mx2 += (ox - mx2) * lerpOut;
      my2 += (oy - my2) * lerpOut;

      vx *= 0.85; vy *= 0.85;

      orbitT += (orbitTarget - orbitT) * 0.07;

      burstPhase += 0.04;
      if (clickBurst > 0.01) {
        clickBurst *= 0.92;
        var burstProgress = easeOutCubic(Math.min(1, burstPhase));
        var burstScale = 0.7 + (1 - burstProgress) * 0.3;
        coreScale += (burstScale - coreScale) * 0.25;
      } else {
        clickBurst = 0;
        idleT += 0.02;
        var breath = 1 + Math.sin(idleT * 0.5) * 0.015;
        var speedScaleCore = 1 + smoothSpeed * 0.08;
        coreScale += (speedScaleCore * breath - coreScale) * 0.05;
        midScale += (1 - midScale) * 0.05;
        outerScale += (1 - outerScale) * 0.05;
      }

      var spd = 1 + clickBurst * 3;
      orbitPhase += ORBIT_SPD * spd * (0.5 + smoothSpeed * 0.5);
      selfRot1 += SPIN_MID * spd * (0.7 + smoothSpeed * 0.3);
      selfRot2 += SPIN_OUT * spd * (0.7 + smoothSpeed * 0.3);

      var intensity = Math.min(1.3, orbitT + clickBurst * 0.4);
      var p1 = orbitPhase;
      var p2 = orbitPhase * 0.7 + 1.8;

      var orbitX1 = Math.sin(p1 * 0.9) * ORBIT_RX + Math.sin(p1 * 2.3) * 3;
      var orbitY1 = Math.cos(p1 * 1.1) * ORBIT_RY + Math.sin(p1 * 3.1) * 2;
      var orbitX2 = Math.cos(p2) * ORBIT_RX2 + Math.sin(p2 * 2.1) * 3;
      var orbitY2 = Math.sin(p2 * 0.8 + 0.9) * ORBIT_RY2 + Math.cos(p2 * 2.7) * 3;

      var kick = clickBurst * 12;
      var midOx = ox + (orbitX1 + Math.cos(orbitPhase + burstPhase * 2) * kick) * intensity;
      var midOy = oy + (orbitY1 + Math.sin(orbitPhase * 1.1 + burstPhase * 2) * kick) * intensity;
      var outOx = mx2 + (orbitX2 - Math.cos(orbitPhase * 0.8 + burstPhase * 1.5) * kick * 0.6) * intensity;
      var outOy = my2 + (orbitY2 - Math.sin(orbitPhase * 0.9 + burstPhase * 1.5) * kick * 0.6) * intensity;

      core.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%) scale(' + coreScale + ')';
      mid.style.transform = 'translate(' + midOx + 'px, ' + midOy + 'px) translate(-50%, -50%) rotate(' + selfRot1 + 'deg) scale(' + midScale + ')';
      outer.style.transform = 'translate(' + outOx + 'px, ' + outOy + 'px) translate(-50%, -50%) rotate(' + selfRot2 + 'deg) scale(' + outerScale + ')';
      label.style.transform = 'translate(' + cx + 'px, ' + (cy - 28) + 'px) translate(-50%, -50%)';

      requestAnimationFrame(animate);
    }

    animate();

    function applyHover(el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor--hover');
        orbitTarget = 0;
        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          document.body.classList.add('cursor--text');
          label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });

      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor--hover', 'cursor--text');
        orbitTarget = 1;
      });
    }

    var targets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    for (var i = 0; i < targets.length; i++) {
      applyHover(targets[i]);
    }

    document.addEventListener('mouseleave', function () { core.style.opacity = '0'; mid.style.opacity = '0'; outer.style.opacity = '0'; label.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { core.style.opacity = '1'; mid.style.opacity = '1'; outer.style.opacity = ''; label.style.opacity = ''; });
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
