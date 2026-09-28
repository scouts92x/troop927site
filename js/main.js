// Shared UI helpers for all pages.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }

  // Promo sections with data-hide-after="YYYY-MM-DD" disappear the day after that date.
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  document.querySelectorAll('[data-hide-after]').forEach(function (el) {
    var p = el.getAttribute('data-hide-after').split('-');
    var last = new Date(+p[0], +p[1] - 1, +p[2]);
    if (today > last) { el.style.display = 'none'; return; }

    var cd = el.querySelector('.bbq-countdown');
    if (cd) {
      var days = Math.round((last - today) / 86400000);
      cd.textContent = days === 0 ? '🔥 Pickup is TODAY!'
        : days === 1 ? '⏳ Pickup is tomorrow!'
        : '⏳ Only ' + days + ' days until pickup, order early!';
    }
  });
})();
