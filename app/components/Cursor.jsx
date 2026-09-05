'use client';

import { useEffect } from 'react';
import { CURSOR_EVENT, getCursorPref } from '../cursor-pref';

// Most specific first — the first match wins.
// Only genuinely interactive things belong here. Decorative blocks (.cell,
// .media, and the non-link .row-item articles) hover-highlight but cannot be
// clicked, so labelling them made the cursor promise something that isn't
// there. The clickable service rows are plain <a>, so they match below.
const LABELS = [
  ['a[href^="tel:"]', 'Call'],
  ['a[href^="mailto:"]', 'Email'],
  ['button[type="submit"]', 'Send'],
  ['input, textarea, select', 'Type'],
  ['a, button', 'Open'],
];
const HOT = LABELS.map(([sel]) => sel).join(', ');
const TRAIL = 5;

export default function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine.matches || !motionOK) return; // native cursor stays

    const root = document.documentElement;
    const core = document.createElement('div');
    const ring = document.createElement('div');
    const label = document.createElement('div');
    core.className = 'cursor-core';
    ring.className = 'cursor-ring';
    label.className = 'cursor-label';
    [core, ring, label].forEach((el) => el.setAttribute('aria-hidden', 'true'));

    const trail = Array.from({ length: TRAIL }, (_, i) => {
      const d = document.createElement('div');
      d.className = 'cursor-trail';
      d.setAttribute('aria-hidden', 'true');
      const f = 1 - i / TRAIL;
      d.style.opacity = '0';
      d.dataset.f = String(f);
      return d;
    });

    document.body.append(core, ring, label, ...trail);

    let on = getCursorPref();
    const apply = () => {
      root.classList.toggle('custom-cursor', on);
      [core, ring, label, ...trail].forEach((el) => {
        el.style.display = on ? '' : 'none';
      });
    };
    apply();

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    const tx = new Array(TRAIL).fill(mx);
    const ty = new Array(TRAIL).fill(my);
    let live = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!live) {
        live = true;
        rx = mx;
        ry = my;
        tx.fill(mx);
        ty.fill(my);
        core.classList.add('is-live');
        ring.classList.add('is-live');
        trail.forEach((d) => d.classList.add('is-live'));
      }
    };

    const setHot = (el) => {
      const hit = el?.closest?.(HOT);
      if (!hit) {
        ring.classList.remove('is-hot');
        core.classList.remove('is-hot');
        label.classList.remove('is-on');
        return;
      }
      const custom = hit.getAttribute('data-cursor');
      const text = custom || LABELS.find(([sel]) => hit.matches(sel))?.[1] || 'Open';
      label.textContent = text;
      ring.classList.add('is-hot');
      core.classList.add('is-hot');
      label.classList.add('is-on');
    };

    const onOver = (e) => setHot(e.target);
    const onOut = (e) => {
      if (!e.relatedTarget?.closest?.(HOT)) setHot(null);
    };
    const onDown = () => {
      ring.classList.add('is-down');
      core.classList.add('is-down');
    };
    const onUp = () => {
      ring.classList.remove('is-down');
      core.classList.remove('is-down');
    };
    const onLeave = () => {
      live = false;
      [core, ring, ...trail].forEach((el) => el.classList.remove('is-live'));
      label.classList.remove('is-on');
    };
    const onPref = (e) => {
      on = e.detail;
      apply();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener(CURSOR_EVENT, onPref);

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!on) return;

      rx += (mx - rx) * 0.17;
      ry += (my - ry) * 0.17;

      let px = mx;
      let py = my;
      for (let i = 0; i < TRAIL; i++) {
        tx[i] += (px - tx[i]) * 0.34;
        ty[i] += (py - ty[i]) * 0.34;
        px = tx[i];
        py = ty[i];
        const d = trail[i];
        const f = Number(d.dataset.f);
        d.style.transform = `translate3d(${tx[i]}px, ${ty[i]}px, 0) scale(${f})`;
        if (live) d.style.opacity = String(f * 0.5);
      }

      core.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${
        label.classList.contains('is-on') ? 1 : 0.7
      })`;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener(CURSOR_EVENT, onPref);
      root.classList.remove('custom-cursor');
      [core, ring, label, ...trail].forEach((el) => el.remove());
    };
  }, []);

  return null;
}
