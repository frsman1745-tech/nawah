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

    const wrapper = document.createElement('div');
    wrapper.className = 'cursor';

    const core = document.createElement('div');
    core.className = 'cursor__core';

    const orbit1 = document.createElement('div');
    orbit1.className = 'cursor__orbit cursor__orbit--1';

    const orbit2 = document.createElement('div');
    orbit2.className = 'cursor__orbit cursor__orbit--2';

    const label = document.createElement('span');
    label.className = 'cursor__label';
    label.textContent = 'View';

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    document.body.append(wrapper, core, orbit1, orbit2, label, follower);

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let ox = 0, oy = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animate() {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      ox += (mx - ox) * 0.12;
      oy += (my - oy) * 0.12;
      fx += (mx - fx) * 0.08;
      fy += (my - fy) * 0.08;

      const ct = `translate(${cx}px, ${cy}px)`;
      const ot = `translate(${ox}px, ${oy}px)`;
      const ft = `translate(${fx}px, ${fy}px)`;

      core.style.transform = ct + ' translate(-50%, -50%)';
      orbit1.style.transform = ot + ' translate(-50%, -50%)';
      orbit2.style.transform = ot + ' translate(-50%, -50%)';
      follower.style.transform = ft + ' translate(-50%, -50%)';
      label.style.transform = ct + ' translate(-50%, -180%)';

      requestAnimationFrame(animate);
    }

    animate();

    const targets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        wrapper.classList.add('cursor--hover');
        follower.classList.add('cursor-follower--hidden');

        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          wrapper.classList.add('cursor--text');
          label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });

      el.addEventListener('mouseleave', () => {
        wrapper.classList.remove('cursor--hover', 'cursor--text');
        follower.classList.remove('cursor-follower--hidden');
      });
    });

    document.addEventListener('mouseleave', () => {
      wrapper.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      wrapper.style.opacity = '1';
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
