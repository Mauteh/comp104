/* gallery.js - dynamic image gallery for the Services page.
   Builds the thumbnails from the data below and swaps the main image,
   caption, and counter with the DOM (no page reload). */
(function () {
  'use strict';

  var gallery = document.getElementById('gallery');
  if (!gallery) return;

  // Each image has real alt text, a caption, and a short label.
  var images = [
    { src: 'images/gallery-tuneup.svg',     alt: 'Illustration of a small engine with a spark plug on the workbench',           caption: 'Seasonal tune-up: spark plug, oil, and air filter service.' },
    { src: 'images/gallery-carburetor.svg', alt: 'Illustration of a carburetor with four mounting bolts',                       caption: 'Carburetor cleaning: clearing clogged jets and old fuel.' },
    { src: 'images/gallery-blade.svg',      alt: 'Illustration of a sharpened lawn mower blade with a gold cutting edge',        caption: 'Blade sharpening: balanced blades for a cleaner cut.' },
    { src: 'images/gallery-chainsaw.svg',   alt: 'Illustration of a red chainsaw with a freshly sharpened chain',                caption: 'Chainsaw repair: sharp chains and reliable starts.' }
  ];

  var mainImage = document.getElementById('gallery-image');
  var caption   = document.getElementById('gallery-caption');
  var counter   = document.getElementById('gallery-counter');
  var prevBtn   = document.getElementById('gallery-prev');
  var nextBtn   = document.getElementById('gallery-next');
  var thumbList = document.getElementById('gallery-thumbs');
  var current   = 0;
  var thumbButtons = [];

  // Build one thumbnail button per image.
  images.forEach(function (img, i) {
    var li  = document.createElement('li');
    var btn = document.createElement('button');
    var pic = document.createElement('img');

    btn.type = 'button';
    btn.className = 'gallery-thumb';
    btn.setAttribute('aria-label', 'Show image ' + (i + 1) + ' of ' + images.length + ': ' + img.caption);
    pic.src = img.src;
    pic.alt = '';              // decorative: the button's aria-label describes it
    pic.width = 80;
    pic.height = 53;

    btn.appendChild(pic);
    li.appendChild(btn);
    thumbList.appendChild(li);
    thumbButtons.push(btn);

    btn.addEventListener('click', function () { show(i); });
  });

  // Show image number `index` (wraps around at both ends).
  function show(index) {
    current = (index + images.length) % images.length;
    var img = images[current];

    mainImage.src = img.src;
    mainImage.alt = img.alt;
    caption.textContent = img.caption;
    // counter lives in an aria-live region, so screen readers announce the change
    counter.textContent = 'Image ' + (current + 1) + ' of ' + images.length;

    thumbButtons.forEach(function (btn, i) {
      var active = i === current;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // Arrow keys work while focus is anywhere inside the gallery.
  gallery.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { show(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
  });

  // Reveal the controls (they are hidden until JS is available) and start.
  gallery.classList.add('is-ready');
  show(0);
})();
