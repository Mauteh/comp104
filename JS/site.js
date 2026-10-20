/* site.js - small DOM updates shared by every page:
   - fills in the current year in the footer
   - shows whether the shop is open right now (where a status element exists) */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var status = document.getElementById('open-status');
  if (!status) return;

  // Hours in 24-hour time, indexed by getDay() (0 = Sunday). null = closed.
  var hours = [null, [8, 17.5], [8, 17.5], [8, 17.5], [8, 17.5], [8, 17.5], [8, 14]];
  var now   = new Date();
  var today = hours[now.getDay()];
  var time  = now.getHours() + now.getMinutes() / 60;
  var open  = today && time >= today[0] && time < today[1];

  status.textContent = open ? 'We’re open right now.' : 'We’re currently closed.';
  status.classList.add(open ? 'is-open-now' : 'is-closed-now');
})();
