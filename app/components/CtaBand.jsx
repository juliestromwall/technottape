import Link from 'next/link';
import SplitText from './SplitText';
import { Arrow } from './Icons';
import { site } from '../site';

export default function CtaBand({
  title = 'Tell me what you need built.',
  body = 'A short conversation is usually enough to tell whether this is a two-week job or a two-month one. No charge for finding out.',
}) {
  return (
    <section className="cta">
      <div className="container">
        <h2 className="kinetic">
          <SplitText text={title} />
        </h2>
        <p className="lead reveal" style={{ '--d': '120ms' }}>
          {body}
        </p>
        <div className="btn-row reveal" style={{ '--d': '220ms' }}>
          <Link className="btn btn--fill" href="/contact/">
            Start a project <Arrow />
          </Link>
          <a className="btn" href={site.phoneHref}>
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
