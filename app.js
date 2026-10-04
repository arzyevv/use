(function () {
  'use strict';

  // The one place the download URL lives.
  var DOWNLOAD_URL = 'https://github.com/arzyevv/use/releases/latest/download/Use.dmg';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-download]').forEach(function (a) {
    a.setAttribute('href', DOWNLOAD_URL);
  });

  // Segmented switches: one thumb slides, stacked screenshots cross-fade.
  document.querySelectorAll('[data-switch]').forEach(function (group) {
    var sw = group.querySelector('.switch');
    var tabs = Array.prototype.slice.call(sw.querySelectorAll('button'));
    var imgs = Array.prototype.slice.call(group.querySelectorAll('.stack img'));
    sw.style.setProperty('--n', tabs.length);

    function select(i, focus) {
      sw.style.setProperty('--i', i);
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
      });
      imgs.forEach(function (im, k) {
        if (k === i && im.loading === 'lazy') im.loading = 'eager';
        im.classList.toggle('on', k === i);
      });
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
      });
    });
    select(0);
  });

  // Rise-in on scroll.
  var rises = document.querySelectorAll('.rise');
  if (reduce || !('IntersectionObserver' in window)) {
    rises.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rises.forEach(function (el) { io.observe(el); });
  }

  // Intro starts once fonts are ready (with a safety timeout).
  var started = false;
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(function () { root.classList.add('ready'); });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1200);
  } else {
    start();
  }
})();
