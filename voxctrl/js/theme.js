/* ─────────── voxctrl theme — dark by default, light opt-in ───────────
   Loaded synchronously in <head> so the saved theme applies before
   first paint (no flash). Also wires up every .theme-toggle button. */
(function () {
  var KEY = 'voxctrl-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  var theme = saved === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  function setTheme(next) {
    var root = document.documentElement;
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    clearTimeout(setTheme._t);
    setTheme._t = setTimeout(function () { root.classList.remove('theme-anim'); }, 500);
  }

  function wire() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme');
        setTheme(cur === 'dark' ? 'light' : 'dark');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
