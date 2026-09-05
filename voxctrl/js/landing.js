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

/* ─────────── first-run slideshow ───────────
   Plays the setup-wizard captures in order, the way someone would step
   through the wizard. The screenshots already carry the app's own chrome and
   step rail, so this only advances them and reports where we are. Hovering,
   or scrolling the section out of view, pauses it. */
(function () {
  const root = document.getElementById('ss');
  if (!root) return;

  const shots = Array.from(root.querySelectorAll('.ss-shot'));
  const dots = Array.from(root.querySelectorAll('.ss-dot'));
  const pending = root.querySelector('.ss-pending');
  const pendingPath = document.getElementById('ssPendingPath');
  const playBtn = document.getElementById('ssPlay');
  const barEl = document.getElementById('ssBar');
  const capEl = document.getElementById('ssCap');

  const STEPS = [
    { label: 'Welcome', text: 'What the next few minutes cover — and a promise that none of it is permanent.' },
    { label: 'Engine', text: 'whisper.cpp or Moonshine, and a model size. The wizard downloads it before you can continue.' },
    { label: 'Hotkey', text: 'Pick a gesture, record the keys. The binding is registered through the desktop portal, live, before you leave the step.' },
    { label: 'Overlay', text: 'Eight overlay styles and three positions — or no overlay at all, and just the tray icon.' },
    { label: 'Test', text: 'Hold the binding you just made and watch real transcription land in a real text box.' },
    { label: 'Voice', text: 'Optional. Five TTS engines, sampled in place, from a 38 MB neural voice to a 1.2 GB one.' },
    { label: 'Done', text: 'A summary of every choice, where to change each one, and where the tray icon lives.' }
  ];

  const HOLD_MS = 5200;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cur = 0;
  let playing = !reduced;
  let elapsed = 0;
  let last = 0;
  let hovering = false;
  let visible = true;

  /* A slide whose file is not on disk yet shows the pending panel instead of a
     broken-image icon, so the section degrades legibly before the captures land. */
  shots.forEach((img) => {
    img.addEventListener('error', () => { img.classList.add('is-missing'); if (shots[cur] === img) render(); });
    if (img.complete && img.naturalWidth === 0) img.classList.add('is-missing');
  });

  function render() {
    shots.forEach((s, i) => s.classList.toggle('is-on', i === cur));
    dots.forEach((d, i) => {
      d.classList.toggle('is-on', i === cur);
      d.classList.toggle('is-done', i < cur);
      d.setAttribute('aria-current', i === cur ? 'true' : 'false');
    });
    const s = STEPS[cur];
    capEl.innerHTML = '<span class="step">STEP ' + (cur + 1) + ' / ' + STEPS.length +
      '</span><b>' + s.label + '.</b> ' + s.text;
    const missing = shots[cur].classList.contains('is-missing');
    pending.classList.toggle('is-on', missing);
    if (missing) pendingPath.textContent = shots[cur].getAttribute('src').replace('/voxctrl/', '');
  }

  function go(i) {
    cur = (i + STEPS.length) % STEPS.length;
    elapsed = 0;
    render();
  }

  function pause() {
    if (!playing) return;
    playing = false;
    playBtn.innerHTML = '\u25B6\u00A0play';
    playBtn.setAttribute('aria-label', 'Play the slideshow');
  }

  function play() {
    if (playing) return;
    playing = true;
    playBtn.innerHTML = '\u275A\u275A\u00A0pause';
    playBtn.setAttribute('aria-label', 'Pause the slideshow');
  }

  function tick(now) {
    const held = !playing || hovering || !visible;
    if (!held && last) elapsed += now - last;
    last = now;
    const frac = Math.min(1, elapsed / HOLD_MS);
    barEl.style.width = (frac * 100).toFixed(1) + '%';
    if (!held && frac >= 1) go(cur + 1);
    requestAnimationFrame(tick);
  }

  document.getElementById('ssNext').addEventListener('click', () => { pause(); go(cur + 1); });
  document.getElementById('ssPrev').addEventListener('click', () => { pause(); go(cur - 1); });
  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  dots.forEach((d) => d.addEventListener('click', () => { pause(); go(+d.dataset.go); }));
  root.addEventListener('pointerenter', () => { hovering = true; });
  root.addEventListener('pointerleave', () => { hovering = false; });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { pause(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { pause(); go(cur - 1); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.2 })
      .observe(root);
  }

  render();
  if (reduced) { playBtn.innerHTML = '\u25B6\u00A0play'; }
  requestAnimationFrame(tick);
})();

/* ─────────── settings gallery ─────────── */
(function () {
  const root = document.getElementById('sg');
  if (!root) return;

  const NOTES = [
    'Settings \u2192 General. The setup wizard, update checking, and the local MCP JSON-RPC server.',
    'Settings \u2192 Output Commands. Named destinations for transcribed text \u2014 and how to call one by name mid-dictation.',
  ];

  const tabs = Array.from(root.querySelectorAll('.sg-tab'));
  const shots = Array.from(root.querySelectorAll('.sg-shot'));
  const pending = document.getElementById('sgPending');
  const pendingPath = document.getElementById('sgPendingPath');
  const note = document.getElementById('sgNote');
  let cur = 0;

  shots.forEach((img) => {
    img.addEventListener('error', () => { img.classList.add('is-missing'); if (shots[cur] === img) show(cur); });
    if (img.complete && img.naturalWidth === 0) img.classList.add('is-missing');
  });

  function show(i) {
    cur = i;
    tabs.forEach((t, n) => t.classList.toggle('is-on', n === i));
    shots.forEach((s, n) => s.classList.toggle('is-on', n === i));
    note.textContent = NOTES[i];
    const missing = shots[i].classList.contains('is-missing');
    pending.classList.toggle('is-on', missing);
    if (missing) pendingPath.textContent = shots[i].getAttribute('src').replace('/voxctrl/', '');
  }

  tabs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.sg)));
  show(0);
})();
