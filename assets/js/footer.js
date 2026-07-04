/* ============ FOOTER: Faint Gold Hexagon Mouse Follower ============ */

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

  function drawHexagon(cx, cy, radius, rotation, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#C9A84C';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(201, 168, 76, 0.06)';

    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = (Math.PI / 3) * i - Math.PI / 6;
      var px = radius * Math.cos(a);
      var py = radius * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    sx += (mx - sx) * 0.12;
    sy += (my - topOffset - sy) * 0.12;

    var footerRect = footer.getBoundingClientRect();
    var curTop = footerRect.top;
    var curBottom = footerRect.bottom;
    inside = (mx >= 0 && mx <= window.innerWidth && my >= curTop && my <= curBottom);

    visible += inside ? 0.04 : -0.02;
    if (visible < 0) visible = 0;
    if (visible > 1) visible = 1;

    if (visible > 0.005) {
      drawHexagon(sx, sy, 100, Date.now() * 0.0002, visible * 0.06);
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