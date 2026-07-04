/* ============ FOOTER: Stardust trail behind mouse ============ */

(function () {
  var canvas = document.getElementById('footer-hex-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var footer = canvas.parentElement;
  var w = 0, h = 0, topOffset = 0;
  var resizeId = null;
  var particles = [];
  var px = -9999, py = -9999;

  function resize() {
    var rect = footer.getBoundingClientRect();
    w = Math.round(rect.width);
    h = Math.round(rect.height);
    if (w < 1) w = window.innerWidth;
    if (h < 1) h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    topOffset = rect.top;
  }

  function addBurst(x, y, count) {
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 1.0 + 0.2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        size: Math.random() * 2.5 + 0.5,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    var footerRect = footer.getBoundingClientRect();
    var curTop = footerRect.top;
    var curBottom = footerRect.bottom;

    var inside = (px >= 0 && px <= window.innerWidth && py >= curTop && py <= curBottom);

    if (inside) {
      addBurst(px, py - topOffset, 1);
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.life -= p.decay;
      p.life -= 0.003;

      if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life * p.life * 0.15;
      ctx.fillStyle = '#F0EEE9';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 200) {
      particles.splice(0, particles.length - 200);
    }

    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', function (e) {
    px = e.clientX;
    py = e.clientY;
  });

  window.addEventListener('resize', function () {
    if (resizeId) return;
    resizeId = requestAnimationFrame(function () {
      resize();
      resizeId = null;
    });
  });

  window.addEventListener('scroll', function () {
    var rect = footer.getBoundingClientRect();
    topOffset = rect.top;
  }, { passive: true });

  resize();
  animate();
})();