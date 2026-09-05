'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Mark from './Mark';
import CursorToggle from './CursorToggle';
import { site, nav } from '../site';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // the overlay covers the page, so stop the page behind it scrolling
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={`nav${stuck ? ' is-stuck' : ''}`}>
        <div className="container">
          <div className="nav__inner">
            <Link href="/" className="logo">
              <Mark />
              {site.name}
            </Link>

            <nav className="nav__links">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? 'is-active' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="nav__right">
              <a className="nav__phone" href={site.phoneHref}>
                {site.phone}
              </a>
              <CursorToggle />
              <Link className="btn" href="/contact/">
                Start a project
              </Link>
              <button
                type="button"
                className={`nav__burger${open ? ' is-open' : ''}`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <i />
                <i />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`nav__overlay${open ? ' is-open' : ''}`}>
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/contact/">Contact</Link>
      </div>
    </>
  );
}
