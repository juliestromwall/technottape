import Link from 'next/link';
import Mark from './Mark';
import { site, nav } from '../site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <span className="logo logo--light">
              <Mark />
              {site.name}
            </span>
            <p className="footer__blurb">
              Websites and software for small businesses — built properly,
              launched carefully, and looked after once they&rsquo;re live.
            </p>
          </div>

          <div className="footer__col">
            <h4>Site</h4>
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact/">Contact</Link>
          </div>

          <div className="footer__col">
            <h4>Get in touch</h4>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.phoneHref}>{site.phone}</a>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>{site.owner}</span>
        </div>
      </div>
    </footer>
  );
}
