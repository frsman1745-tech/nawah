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
