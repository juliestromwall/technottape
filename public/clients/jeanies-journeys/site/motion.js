/* ---------------------------------------------------------------------------
   Motion.

   Same approach as technottape.com: content is visible by default, and an
   inline script in <head> adds `js-motion` before first paint — that class is
   what arms the hidden state. So with JavaScript off, broken, or slow, the
   page is a plain readable page rather than a blank one.

   Everything here is decorative. Nothing is only reachable by animating, and
   nothing moves that the reader has to chase. Most of the people booking these
   tours are in their seventies; motion that is merely impressive is not worth
   one person losing their place on the page.

   Three ways out of it, all honoured:
     · the OS "reduce motion" setting
     · the Motion button in the accessibility bar
     · no JavaScript at all
--------------------------------------------------------------------------- */

const MOTION_KEY = 'jj-motion';
const TEXT_KEY = 'jj-textsize';

function prefersReduced() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
}
function motionOff() {
  try {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved === 'off') return true;
    if (saved === 'on') return false;
  } catch (e) {}
  return prefersReduced();
}

/* ---- kinetic headlines --------------------------------------------------
   Split into per-character spans, masked per word so a line that wraps cannot
   let the first row's letters slide into the second row's space. The text in
   the HTML stays real text — this only rewrites it once JS is running. */
function splitKinetic(root) {
  (root || document).querySelectorAll('.kinetic:not([data-split])').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('data-split', '');
    el.setAttribute('aria-label', text);
    let i = 0;
    el.innerHTML = text.split(' ').map((word) => {
      const chars = [...word].map((ch) =>
        '<span class="k-char" style="--i:' + (i++) + '">' + ch + '</span>').join('');
      i++;
      return '<span class="k-word" aria-hidden="true">' + chars + '</span>';
    }).join('<span class="k-space" aria-hidden="true"> </span>');
  });
}

/* ---- counters ------------------------------------------------------------ */
function countUp(el) {
  const to = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1100;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(to * eased).toLocaleString('en-US') + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---- the map -------------------------------------------------------------
   Arcs are drawn with stroke-dashoffset, pins scale in behind them. The whole
   thing is inert decoration: every destination on it is also a card in the
   list below, so nothing here is the only way to reach a tour. */
function runMap(svg) {
  const arcs = svg.querySelectorAll('.arc');
  arcs.forEach((a, i) => {
    const len = a.getTotalLength();
    a.style.strokeDasharray = len;
    a.style.strokeDashoffset = len;
    a.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)';
    a.style.transitionDelay = (120 + i * 42) + 'ms';
    requestAnimationFrame(() => { a.style.strokeDashoffset = '0'; });
  });
  svg.querySelectorAll('.pin').forEach((p, i) => {
    p.style.transitionDelay = (420 + i * 42) + 'ms';
    requestAnimationFrame(() => p.classList.add('is-in'));
  });
}

/* ---- parallax ------------------------------------------------------------
   Transform only, batched into one rAF, and capped so nothing drifts far
   enough to break a layout at any window size. */
let parallaxItems = [];
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = window.innerHeight;
    parallaxItems.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > h + 200) return;
      const centre = r.top + r.height / 2 - h / 2;
      const amt = Number(el.dataset.parallax || 12);
      el.style.transform = 'translate3d(0,' + (-centre / h * amt).toFixed(2) + '%,0)';
    });
    ticking = false;
  });
}

/* ---- wiring -------------------------------------------------------------- */
function armMotion() {
  const off = motionOff();
  document.documentElement.classList.toggle('js-motion', !off);
  document.documentElement.classList.toggle('no-motion', off);

  const targets = document.querySelectorAll('.reveal, .reveal-line, .kinetic, .mapwrap, .count');

  if (off) {
    targets.forEach((el) => {
      el.classList.add('is-in');
      if (el.classList.contains('count')) {
        el.textContent = Number(el.dataset.count).toLocaleString('en-US') + (el.dataset.suffix || '');
      }
    });
    document.querySelectorAll('.arc').forEach((a) => { a.style.strokeDashoffset = '0'; });
    document.querySelectorAll('.pin').forEach((p) => p.classList.add('is-in'));
    parallaxItems = [];
    window.removeEventListener('scroll', onScroll);
    return;
  }

  splitKinetic();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-in');
      if (el.classList.contains('count')) countUp(el);
      if (el.classList.contains('mapwrap')) runMap(el.querySelector('svg'));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((el) => io.observe(el));

  parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- the accessibility bar ----------------------------------------------
   Deliberately visible rather than buried in a menu. The people booking these
   tours should not have to know about browser zoom to read the page. */
function applyTextSize() {
  let size = 'base';
  try { size = localStorage.getItem(TEXT_KEY) || 'base'; } catch (e) {}
  document.documentElement.setAttribute('data-text', size);
  document.querySelectorAll('[data-size]').forEach((b) => {
    const on = b.dataset.size === size;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function setupControls() {
  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-size]');
    if (s) {
      try { localStorage.setItem(TEXT_KEY, s.dataset.size); } catch (er) {}
      applyTextSize();
      return;
    }
    const m = e.target.closest('[data-motion-toggle]');
    if (m) {
      const nowOff = !motionOff();
      try { localStorage.setItem(MOTION_KEY, nowOff ? 'off' : 'on'); } catch (er) {}
      armMotion();
      paintMotionButton();
    }
  });
}

function paintMotionButton() {
  const b = document.querySelector('[data-motion-toggle]');
  if (!b) return;
  const off = motionOff();
  b.textContent = off ? 'Motion off' : 'Motion on';
  b.setAttribute('aria-pressed', String(!off));
  b.classList.toggle('on', !off);
}

/* Re-arm after the router swaps a view in. */
window.addEventListener('view:rendered', () => { armMotion(); });

applyTextSize();
setupControls();
paintMotionButton();

/* site.js renders the first view before this file is parsed, so its
   `view:rendered` event has already gone by. Arm once on load. */
armMotion();
