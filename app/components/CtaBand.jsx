import Link from 'next/link';
import { site } from '../site';

export default function CtaBand({
  title = 'Tell me what you need built.',
  body = 'A short conversation is usually enough to tell whether this is a two-week job or a two-month one. No charge for finding out.',
}) {
  return (
    <section className="section section--tight">
      <div className="container">
        <div className="cta-band">
          <h2>{title}</h2>
          <p>{body}</p>
          <div className="btn-row">
            <Link className="btn btn--solid-light" href="/contact/">
              Start a project
            </Link>
            <a className="btn btn--ghost" href={site.phoneHref} style={{ borderColor: 'rgba(255,255,255,.45)', color: '#fff' }}>
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
