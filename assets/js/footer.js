/* ============ FOOTER: Soft spotlight behind cursor (CSS radial-gradient) ============ */

(function () {
  var glow = document.getElementById('footer-glow');
  if (!glow) return;

  var mx = -9999, my = -9999;
  var inside = false;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    var rect = glow.parentElement.getBoundingClientRect();
    var lx = mx - rect.left;
    var ly = my - rect.top;
    var was = inside;
    inside = (mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom);

    if (inside) {
      glow.style.setProperty('--glow-x', lx + 'px');
      glow.style.setProperty('--glow-y', ly + 'px');
    }
    if (inside !== was) {
      glow.classList.toggle('visible', inside);
    }
    requestAnimationFrame(tick);
  }

  tick();
})();