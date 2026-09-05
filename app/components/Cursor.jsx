'use client';

import { useEffect } from 'react';

const HOT = 'a, button, input, select, textarea, .row-item, .cell, .media, [data-hot]';

export default function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot is-hidden';
    ring.className = 'cursor-ring is-hidden';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);
    document.body.classList.add('has-cursor');

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let seen = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        rx = mx; ry = my;
        dot.classList.remove('is-hidden');
        ring.classList.remove('is-hidden');
      }
    };

    // delegated, so it keeps working as sections mount and unmount
    const onOver = (e) => {
      if (e.target.closest?.(HOT)) ring.classList.add('is-hot');
    };
    const onOut = (e) => {
      if (e.target.closest?.(HOT) && !e.relatedTarget?.closest?.(HOT)) {
        ring.classList.remove('is-hot');
      }
    };
    const onLeave = () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);

    let raf;
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-cursor');
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
