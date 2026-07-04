/* ============ FOOTER: Soft Light Behind Cursor (contrast for gold rings) ============ */

(function () {
  var canvas = document.getElementById('footer-hex-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var footer = canvas.parentElement;
  var mx = -9999, my = -9999;
  var sx = -9999, sy = -9999;
  var inside = false;
  var visible = 0;
  var w = 0, h = 0, topOffset = 0;
  var resizeId = null;

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

  function drawGlow(cx, cy, radius, alpha, time) {
    if (alpha < 0.001) return;

    var pulse = 1 + Math.sin(time * 0.001) * 0.04;
    var finalAlpha = alpha * pulse;

    ctx.save();
    ctx.globalAlpha = finalAlpha;

    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(255, 252, 248, 0.08)');
    grad.addColorStop(1, 'rgba(255, 252, 248, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    sx += (mx - sx) * 0.07;
    sy += (my - topOffset - sy) * 0.07;

    var footerRect = footer.getBoundingClientRect();
    var curTop = footerRect.top;
    var curBottom = footerRect.bottom;
    inside = (mx >= 0 && mx <= window.innerWidth && my >= curTop && my <= curBottom);

    visible += inside ? 0.03 : -0.02;
    if (visible < 0) visible = 0;
    if (visible > 1) visible = 1;

    if (visible > 0.005) {
      drawGlow(sx, sy, 500, visible * 0.5, Date.now());
    }

    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
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