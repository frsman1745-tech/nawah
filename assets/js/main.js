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

const CURSOR_SVG = `<svg viewBox="0 0 50 58" xmlns="http://www.w3.org/2000/svg">
  <polygon points="25,0 50,14.5 50,43.5 25,58 0,43.5 0,14.5" fill="#1A2744"/>
  <polygon points="25,5 45,17 45,41 25,53 5,41 5,17" fill="#2B3D5F"/>
  <polygon points="25,10 40,19.5 40,38.5 25,48 10,38.5 10,19.5" fill="#3A506B"/>
  <polygon points="25,18 33,22.5 33,35.5 25,40 17,35.5 17,22.5" fill="#C9A84C"/>
</svg>`;

const cursor = {
  init() {
    if (window.innerWidth <= 768) return;

    const cursorEl = document.createElement('div');
    cursorEl.className = 'cursor';
    cursorEl.innerHTML = CURSOR_SVG + '<span class="cursor__label">View</span>';

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';

    document.body.appendChild(cursorEl);
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isHovering = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      const lerp = isHovering ? 0.06 : 0.12;
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    }

    animate();

    const hoverTargets = document.querySelectorAll('a, button, .btn, .glass-card, .service-card, .team-card, .project-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        cursorEl.classList.add('cursor--hover');
        follower.classList.add('cursor-follower--hidden');

        if (el.tagName === 'A' || el.classList.contains('btn') || el.closest('a')) {
          cursorEl.classList.add('cursor--text');
          const label = cursorEl.querySelector('.cursor__label');
          if (label) label.textContent = el.getAttribute('data-cursor') || 'Click';
        }
      });

      el.addEventListener('mouseleave', () => {
        isHovering = false;
        cursorEl.classList.remove('cursor--hover', 'cursor--text');
        follower.classList.remove('cursor-follower--hidden');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorEl.style.opacity = '0';
      follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorEl.style.opacity = '1';
      follower.style.opacity = '1';
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
