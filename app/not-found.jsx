import Link from 'next/link';
import { Arrow } from './components/Icons';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center" style={{ paddingTop: 40 }}>
          <p className="eyebrow">404</p>
          <h2>That page isn&rsquo;t here.</h2>
          <p className="lead">
            Which is a bit embarrassing on a website about things working
            properly. Try one of these instead.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn btn--primary" href="/">
              Back home <Arrow />
            </Link>
            <Link className="btn btn--ghost" href="/contact/">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
