/* faq.js - simple FAQ accordion.
   Clicking a question shows or hides its answer. Each question is a real
   <button> with aria-expanded / aria-controls so keyboard and screen-reader
   users get the same behavior. */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.faq-question');
  if (!buttons.length) return;

  function setOpen(button, open) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(open));
    button.classList.toggle('is-open', open);
    panel.hidden = !open;
  }

  buttons.forEach(function (button) {
    setOpen(button, false);   // start collapsed

    button.addEventListener('click', function () {
      var isOpen = button.getAttribute('aria-expanded') === 'true';
      setOpen(button, !isOpen);
    });
  });

  // Optional "Expand all / Collapse all" control.
  var toggleAll = document.getElementById('faq-toggle-all');
  if (toggleAll) {
    toggleAll.hidden = false;
    toggleAll.addEventListener('click', function () {
      var expand = toggleAll.getAttribute('data-state') !== 'expanded';
      buttons.forEach(function (b) { setOpen(b, expand); });
      toggleAll.setAttribute('data-state', expand ? 'expanded' : 'collapsed');
      toggleAll.textContent = expand ? 'Collapse all answers' : 'Expand all answers';
    });
  }
})();
