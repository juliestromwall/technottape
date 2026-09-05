import Link from 'next/link';
import SplitText from './components/SplitText';
import { Arrow } from './components/Icons';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 220, textAlign: 'center' }}>
      <div className="container">
        <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>
          Error 404
        </p>
        <h2 className="kinetic" style={{ marginTop: 30 }}>
          <SplitText text="That page" />
          <SplitText text="isn’t here." start={9} />
        </h2>
        <p className="lead reveal" style={{ '--d': '160ms', margin: '30px auto 0' }}>
          Which is a bit embarrassing on a website about things working properly.
          Try one of these instead.
        </p>
        <div className="btn-row reveal" style={{ '--d': '260ms', justifyContent: 'center' }}>
          <Link className="btn btn--fill" href="/">
            Back home <Arrow />
          </Link>
          <Link className="btn" href="/contact/">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
