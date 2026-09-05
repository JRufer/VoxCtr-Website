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

/* ─────────── first-run walkthrough player ───────────
   One window that plays itself through the seven setup steps, the way a
   person would walk through them: the frame changes, the rail fills in, and
   the Continue button flashes as if it were pressed. Hovering, focusing a
   control, or scrolling the section out of view pauses it. */
(function () {
  const root = document.getElementById('wz');
  if (!root) return;

  const stage = document.getElementById('wzStage');
  const frames = Array.from(stage.querySelectorAll('.wz-frame'));
  const railEl = document.getElementById('wzRail');
  const nextBtn = document.getElementById('wzNext');
  const backBtn = document.getElementById('wzBack');
  const playBtn = document.getElementById('wzPlay');
  const barEl = document.getElementById('wzBar');
  const capEl = document.getElementById('wzCap');
  const numEl = document.getElementById('wzNum');
  const footEl = root.querySelector('.wz-foot');

  const STEPS = [
    { label: 'Welcome', ms: 5200, cta: 'Get started →', cap: '<b>Welcome.</b> What the next few minutes will cover — and a promise that none of it is permanent.' },
    { label: 'Engine', ms: 8200, cta: 'Continue →', cap: '<b>Engine.</b> whisper.cpp or Moonshine, and a model size. The wizard downloads it before you can continue.' },
    { label: 'Hotkey', ms: 7200, cta: 'Continue →', cap: '<b>Hotkey.</b> Pick a gesture, record the keys. The binding is registered through the desktop portal, live, before you leave the step.' },
    { label: 'Overlay', ms: 7200, cta: 'Continue →', cap: '<b>Overlay.</b> Eight styles and three positions — or no overlay at all, and just the tray icon.' },
    { label: 'Test', ms: 8200, cta: 'Continue →', cap: '<b>Live test.</b> Hold the binding you just made and watch real transcription land in a real text box.' },
    { label: 'Voice', ms: 8200, cta: 'Continue →', cap: '<b>Voice output.</b> Optional. Five TTS engines, sampled in place, from a 38 MB neural voice to a 1.2 GB one.' },
    { label: 'Done', ms: 7000, cta: 'Finish', cap: '<b>Done.</b> A summary of every choice, where to change each one, and where the tray icon lives.' },
  ];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── build the step rail ── */
  const bubbles = [];
  const links = [];
  STEPS.forEach((s, i) => {
    if (i > 0) {
      const l = document.createElement('span');
      l.className = 'wz-link';
      railEl.appendChild(l);
      links.push(l);
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'wz-step';
    b.innerHTML = '<span class="bub">' + String(i + 1).padStart(2, '0') + '</span><span>' + s.label + '</span>';
    b.addEventListener('click', () => { pause(); go(i); });
    railEl.appendChild(b);
    bubbles.push(b);
  });

  /* ── state ── */
  let cur = 0;
  let playing = !reduced;
  let t0 = 0;          // when the current step started
  let elapsed = 0;     // ms spent on the current step while playing
  let raf = 0;
  let visible = true;
  let hovering = false;

  function render() {
    frames.forEach((f, i) => {
      f.classList.toggle('is-on', i === cur);
      f.classList.toggle('is-prev', i < cur);
    });
    bubbles.forEach((b, i) => {
      b.classList.toggle('now', i === cur);
      b.classList.toggle('done', i < cur);
      b.querySelector('.bub').textContent = i < cur ? '✓' : String(i + 1).padStart(2, '0');
    });
    links.forEach((l, i) => l.classList.toggle('fill', i < cur));
    numEl.textContent = String(cur + 1);
    nextBtn.textContent = STEPS[cur].cta;
    // Read by the mobile footer's ::before, which stands in for the step rail.
    footEl.dataset.count = (cur + 1) + ' / ' + STEPS.length;
    backBtn.style.visibility = cur === 0 ? 'hidden' : 'visible';
    capEl.innerHTML = STEPS[cur].cap;
  }

  function go(i) {
    cur = (i + STEPS.length) % STEPS.length;
    elapsed = 0;
    t0 = performance.now();
    render();
    if (cur === 3) startClips();
    if (cur === 4) runTypeDemo();
  }

  function advance() {
    // Flash the Continue button first, so the frame change reads as a click.
    nextBtn.classList.add('press');
    setTimeout(() => nextBtn.classList.remove('press'), 180);
    go(cur + 1);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    elapsed += performance.now() - t0;
    playBtn.innerHTML = '▶ play';
    playBtn.setAttribute('aria-label', 'Play the walkthrough');
  }

  function play() {
    if (playing) return;
    playing = true;
    t0 = performance.now();
    playBtn.innerHTML = '❚❚ pause';
    playBtn.setAttribute('aria-label', 'Pause the walkthrough');
  }

  function tick(now) {
    const held = !playing || hovering || !visible;
    if (held) { t0 = now; } else { elapsed += now - t0; t0 = now; }
    const frac = Math.min(1, elapsed / STEPS[cur].ms);
    barEl.style.width = (frac * 100).toFixed(1) + '%';
    if (!held && frac >= 1) advance();
    raf = requestAnimationFrame(tick);
  }

  /* ── the overlay step plays its clips, but only once it is reached ── */
  let clipsStarted = false;
  function startClips() {
    if (clipsStarted) return;
    clipsStarted = true;
    stage.querySelectorAll('video[data-clip]').forEach((v) => {
      v.src = v.dataset.clip;
      v.play().then(() => v.classList.add('ready')).catch(() => { /* leave the glyph */ });
    });
  }

  /* ── the Test step types itself ── */
  let typeTimer = null;
  function runTypeDemo() {
    const out = document.getElementById('wzType');
    const rec = document.getElementById('wzRec');
    if (!out) return;
    clearTimeout(typeTimer);
    const text = 'Ship the routing refactor before Friday.';
    out.classList.remove('ph');
    out.textContent = '';
    rec.textContent = '● recording';
    rec.style.color = 'var(--warn)';
    let i = 0;
    (function step() {
      if (cur !== 4) { return; }
      if (i <= text.length) {
        out.textContent = text.slice(0, i++);
        typeTimer = setTimeout(step, 42);
      } else {
        rec.textContent = '✓ transcribed';
        rec.style.color = 'var(--good)';
      }
    })();
    setTimeout(() => { if (cur === 4) { rec.textContent = '◌ transcribing…'; rec.style.color = 'var(--cyan-1)'; } }, 900);
  }

  /* ── controls ── */
  nextBtn.addEventListener('click', () => { pause(); go(cur + 1); });
  backBtn.addEventListener('click', () => { pause(); go(cur - 1); });
  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  root.addEventListener('pointerenter', () => { hovering = true; });
  root.addEventListener('pointerleave', () => { hovering = false; });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { pause(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { pause(); go(cur - 1); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.25 }).observe(root);
  }

  render();
  if (reduced) {
    playBtn.innerHTML = '▶ play';
    barEl.style.width = '0%';
  }
  raf = requestAnimationFrame(tick);
})();

/* ─────────── settings showcase tabs ─────────── */
document.querySelectorAll('.st-tab[data-st]').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.st-tab').forEach(x => x.classList.toggle('on', x === t));
    document.querySelectorAll('.st-panel').forEach(p => p.classList.toggle('on', p.dataset.stp === t.dataset.st));
  });
});
