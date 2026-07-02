/* ─────────── mobile nav (hamburger) ─────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  if (!toggle) return;
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
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); });
})();

/* ─────────── tabs ─────────── */
document.querySelectorAll('#wfTabs .tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#wfTabs .tab').forEach(x => x.classList.toggle('is-active', x === t));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === t.dataset.wf));
  });
});

/* ─────────── copy buttons ─────────── */
document.querySelectorAll('[data-copy]').forEach(b => {
  b.addEventListener('click', () => {
    const txt = b.getAttribute('data-copy') || b.parentElement.parentElement.querySelector('pre')?.innerText || '';
    navigator.clipboard?.writeText(txt);
    const orig = b.innerHTML; b.innerHTML = '✓ copied';
    setTimeout(() => b.innerHTML = orig, 1400);
  });
});

/* ─────────── live waveform sim in hero ─────────── */
const barsEl = document.getElementById('waveBars');
const N = 64;
const bars = [];
for (let i = 0; i < N; i++) {
  const b = document.createElement('i');
  b.style.height = '4px';
  barsEl.appendChild(b);
  bars.push(b);
}
let phase = 0;
function tickBars() {
  phase += 0.07;
  for (let i = 0; i < N; i++) {
    const x = i / N;
    const env = Math.exp(-Math.pow((x - 0.5) * 3.6, 2));
    const wob = Math.sin(phase + i * 0.42) * 0.4 + Math.sin(phase * 1.7 + i * 0.21) * 0.4 + Math.random() * 0.3;
    const v = Math.max(0.06, env * (0.55 + wob * 0.5));
    const h = Math.min(80, Math.max(3, v * 80));
    bars[i].style.height = h + 'px';
    bars[i].style.opacity = (0.55 + v * 0.4).toFixed(2);
  }
  requestAnimationFrame(tickBars);
}
tickBars();

/* ─────────── reveal on scroll ─────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ─────────── transcript cycle ─────────── */
const cycles = [
  { raw: 'um, schedule a team sync, uh, for thursday at three p m', out: 'Schedule a team sync for Thursday at 3:00 PM' },
  { raw: 'open the readme dot md and add a section about install', out: 'open ./README.md\n# add: ## Installation' },
  { raw: 'tell hermes to deploy the staging branch please', out: '$ hermes deploy --branch staging' },
  { raw: 'note for journal — finished the routing refactor today', out: '- Finished routing refactor (Thu 14:32)' },
];
let ci = 0;
setInterval(() => {
  ci = (ci + 1) % cycles.length;
  const c = cycles[ci];
  const raw = document.getElementById('rawT');
  const out = document.getElementById('outT');
  raw.style.opacity = 0.2; out.style.opacity = 0.2;
  setTimeout(() => {
    raw.textContent = c.raw;
    out.innerHTML = c.out + '<span class="caret"></span>';
    raw.style.opacity = 1; out.style.opacity = 1;
  }, 250);
}, 4200);

/* ─────────── ⌘K → docs ─────────── */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    window.location.href = '/voxctrl/docs/quickstart.html';
  }
});

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
