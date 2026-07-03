const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ─────────── nav shadow after scroll ─────────── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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

/* ─────────── hero background: layered drifting sound waves ─────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || REDUCED_MOTION) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const accent = () =>
    document.documentElement.getAttribute('data-theme') === 'light'
      ? '10, 156, 190' : '34, 212, 239';

  // each layer: frequency, speed, base amplitude, alpha, line width
  const layers = [
    { f: 0.012, sp: 0.9, amp: 26, a: 0.30, lw: 1.5 },
    { f: 0.020, sp: -0.6, amp: 18, a: 0.18, lw: 1.2 },
    { f: 0.007, sp: 0.4, amp: 40, a: 0.10, lw: 2.0 },
    { f: 0.030, sp: 1.4, amp: 9, a: 0.14, lw: 1.0 },
  ];

  let t = 0;
  function frame() {
    // pause when the hero is off screen
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      requestAnimationFrame(frame);
      return;
    }
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    const rgb = accent();
    const midY = h * 0.55;
    // slow global "breath" so the field swells and settles like speech
    const breath = 0.65 + 0.35 * Math.sin(t * 0.6);

    for (const L of layers) {
      ctx.beginPath();
      ctx.lineWidth = L.lw;
      ctx.strokeStyle = `rgba(${rgb}, ${L.a})`;
      for (let x = 0; x <= w; x += 3) {
        // envelope keeps the waves loudest in the middle of the hero
        const env = Math.exp(-Math.pow((x / w - 0.5) * 2.2, 2));
        const y = midY
          + Math.sin(x * L.f + t * L.sp) * L.amp * env * breath
          + Math.sin(x * L.f * 2.3 + t * L.sp * 1.7) * L.amp * 0.35 * env * breath;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ─────────── live waveform sim in hero console ─────────── */
(function () {
  const barsEl = document.getElementById('waveBars');
  if (!barsEl) return;
  const N = 64;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const b = document.createElement('i');
    b.style.height = '4px';
    barsEl.appendChild(b);
    bars.push(b);
  }
  if (REDUCED_MOTION) return;
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
})();

/* ─────────── reveal on scroll, with automatic sibling stagger ─────────── */
(function () {
  const els = [...document.querySelectorAll('.fade-up')];
  // stagger siblings that share a parent so groups cascade in
  const groups = new Map();
  els.forEach(el => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const i = groups.get(p);
    el.style.setProperty('--reveal-delay', Math.min(i * 0.09, 0.45) + 's');
    groups.set(p, i + 1);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
})();

/* ─────────── metric count-up on reveal ─────────── */
(function () {
  if (REDUCED_MOTION) return;
  const metrics = document.querySelectorAll('.metric .v');
  if (!metrics.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const raw = e.target.textContent.trim();
      const m = raw.match(/^(\d+)(\+?)$/);
      if (!m) return; // leave non-numeric values (∞) alone
      const target = parseInt(m[1], 10), suffix = m[2];
      const dur = 1200, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  metrics.forEach(el => io.observe(el));
})();

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
  if (!raw || !out) return;
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
