/* Shared UI helpers: dark/light theme toggle + avatar helpers.
   Loaded in <head> so the saved theme applies before the page paints. */
(function () {
  var root = document.documentElement, KEY = 'vip-theme';
  try { if (localStorage.getItem(KEY) === 'light') root.classList.add('light'); } catch (e) {}

  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function paint() {
    var light = root.classList.contains('light');
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = light ? MOON : SUN;
      btns[i].setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#ffffff' : '#17212b');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!b) return;
    var light = root.classList.toggle('light');
    try { localStorage.setItem(KEY, light ? 'light' : 'dark'); } catch (err) {}
    paint();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();

  window.UI = {
    // "Package A" -> "PA", "john_doe" -> "JD"
    initials: function (s) {
      var w = String(s || '').trim().split(/[\s_.@-]+/).filter(Boolean);
      if (!w.length) return '?';
      var a = Array.from(w[0])[0], b = w[1] ? Array.from(w[1])[0] : '';
      return (a + b).toUpperCase();
    },
    // Stable color index 0–6 for a name (matches .g0 … .g6)
    hue: function (s) {
      var h = 0; s = String(s || '');
      for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return h % 7;
    },
    fmt: function (n) { return Number(n || 0).toLocaleString('en-US'); }
  };
})();
