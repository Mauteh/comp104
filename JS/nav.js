(function () {
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var open = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu with Escape and return focus to the button.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && list.classList.contains('is-open')) {
      list.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();
