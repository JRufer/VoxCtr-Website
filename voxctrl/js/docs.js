/* ─────────── activate docs layout ─────────── */
document.querySelector('.docs-shell')?.classList.add('is-active');
document.body.classList.add('is-docs');

/* ─────────── mobile nav (hamburger → sidebar drawer) ─────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  if (!toggle) return;

  /* surface the top-level site links inside the drawer, since the top-bar
     links collapse on mobile and the drawer is the docs navigation */
  const side = document.querySelector('.docs-side');
  if (side && !side.querySelector('.mobile-site-nav')) {
    const g = document.createElement('div');
    g.className = 'group mobile-site-nav';
    g.innerHTML =
      '<span class="h">voxctrl</span>' +
      '<a class="item" href="/voxctrl/"><span class="glyph">⌂</span> Overview</a>' +
      '<a class="item" href="https://github.com/JRufer/voxctrl" target="_blank" rel="noreferrer"><span class="glyph">★</span> GitHub</a>';
    side.insertBefore(g, side.firstChild);
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);
  const close = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  backdrop.addEventListener('click', close);
  document.querySelectorAll('.docs-side a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); });
})();

/* ─────────── copy buttons ─────────── */
document.querySelectorAll('[data-copy]').forEach(b => {
  b.addEventListener('click', () => {
    const txt = b.getAttribute('data-copy') || b.parentElement.parentElement.querySelector('pre')?.innerText || '';
    navigator.clipboard?.writeText(txt);
    const orig = b.innerHTML; b.innerHTML = '✓ copied';
    setTimeout(() => b.innerHTML = orig, 1400);
  });
});

/* ─────────── TOC generation ─────────── */
const content = document.querySelector('.docs-content');
const toc = document.getElementById('docsToc');
if (content && toc) {
  const heads = content.querySelectorAll('h2');
  if (heads.length > 0) {
    toc.innerHTML = '<div class="h">On this page</div>' +
      [...heads].map((h, i) => {
        h.id = 'h-' + i;
        return `<a class="toc-item" href="#h-${i}">${h.textContent}</a>`;
      }).join('');
  }
}

/* ─────────── github: stars + version ─────────── */
(async () => {
  const starEl = document.getElementById('gh-star-count');
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);

  const applyVersion = (tag) => {
    document.querySelectorAll('.nav-version').forEach(el => { el.textContent = tag; });
    document.querySelectorAll('.foot-bottom .left span').forEach(el => {
      el.textContent = el.textContent.replace(/v[\d.]+/, tag);
    });
  };

  const [repoRes, tagsRes] = await Promise.allSettled([
    fetch('https://api.github.com/repos/JRufer/voxctrl', { headers: { 'Accept': 'application/vnd.github+json' } }),
    fetch('https://api.github.com/repos/JRufer/voxctrl/tags', { headers: { 'Accept': 'application/vnd.github+json' } }),
  ]);

  if (repoRes.status === 'fulfilled' && repoRes.value.ok && starEl) {
    try {
      const repo = await repoRes.value.json();
      starEl.textContent = typeof repo.stargazers_count === 'number' ? fmt(repo.stargazers_count) : '★';
    } catch { starEl.textContent = 'Star'; }
  } else if (starEl) { starEl.textContent = 'Star'; }

  if (tagsRes.status === 'fulfilled' && tagsRes.value.ok) {
    try {
      const tags = await tagsRes.value.json();
      if (Array.isArray(tags) && tags.length > 0) applyVersion(tags[0].name);
    } catch { /* leave static fallback */ }
  }
})();
