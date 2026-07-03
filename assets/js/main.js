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
    var cx = 0, cy = 0;
    var ox = 0, oy = 0;
    var mx2 = 0, my2 = 0;

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

      core.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%)';
      mid.style.transform = 'translate(' + ox + 'px, ' + oy + 'px) translate(-50%, -50%)';
      outer.style.transform = 'translate(' + mx2 + 'px, ' + my2 + 'px) translate(-50%, -50%)';
      label.style.transform = 'translate(' + cx + 'px, ' + (cy - 55) + 'px) translate(-50%, -50%)';

      requestAnimationFrame(animate);
    }

    animate();

    function applyHover(el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor--hover');

        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          document.body.classList.add('cursor--text');
          label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });

      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor--hover', 'cursor--text');
      });
    }

    var targets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    for (var i = 0; i < targets.length; i++) {
      applyHover(targets[i]);
    }

    document.addEventListener('mouseleave', function () { core.style.opacity = '0'; mid.style.opacity = '0'; outer.style.opacity = '0'; label.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { core.style.opacity = '1'; mid.style.opacity = '1'; outer.style.opacity = '1'; label.style.opacity = ''; });
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
