'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Mark from './Mark';
import { Menu, Close } from './Icons';
import { site, nav } from '../site';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="nav">
      <div className="container">
        <div className="nav__inner">
          <Link href="/" className="logo" onClick={() => setOpen(false)}>
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

          <div className="nav__cta">
            <a className="nav__phone" href={site.phoneHref}>
              {site.phone}
            </a>
            <Link className="btn btn--primary" href="/contact/">
              Start a project
            </Link>
            <button
              type="button"
              className="nav__toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div className={`nav__mobile${open ? ' is-open' : ''}`}>
        <div className="container">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact/" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <a href={site.phoneHref} onClick={() => setOpen(false)}>
            {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
