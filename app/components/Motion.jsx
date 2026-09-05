'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One observer for the whole page. Pages stay server components and just add
 * `reveal`, `reveal-line`, or `kinetic` classNames; this arms and triggers them.
 *
 * Hiding is armed by the `js-motion` class the inline script in layout.jsx
 * sets before first paint, so a visitor without JS gets the plain readable
 * page and nothing here can leave content stuck invisible.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal, .reveal-line, .kinetic, .stepper, .swap__row');

    if (reduced) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
