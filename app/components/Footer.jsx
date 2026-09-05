import Link from 'next/link';
import TapedPhrase from './TapedPhrase';
import Wordmark from './Wordmark';
import { site, nav } from '../site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <TapedPhrase className="footer__big" />

        <div className="footer__cols">
          <div>
            <Wordmark binary className="footer__wm" title={site.name} />
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
            &copy; {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.owner}</span>
        </div>
      </div>
    </footer>
  );
}
