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

  tl.fromTo('.hero__cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.7);

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

/* ========== FAQ Accordion Animation Enhancement ========== */

function faqAnimations() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.faq__question').forEach(q => {
    q.addEventListener('click', function() {
      const item = this.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');

      if (item.classList.contains('active')) {
        gsap.to(answer, { maxHeight: 0, paddingBottom: 0, duration: 0.3, ease: 'power2.inOut' });
      } else {
        gsap.fromTo(answer,
          { maxHeight: 0, paddingBottom: 0 },
          { maxHeight: answer.scrollHeight, paddingBottom: '0.5rem', duration: 0.4, ease: 'power2.inOut' }
        );
      }
    });
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
    faqAnimations();
    parallaxHero();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 100);
});
