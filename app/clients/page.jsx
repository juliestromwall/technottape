import Link from 'next/link';
import SplitText from '../components/SplitText';
import { Arrow } from '../components/Icons';

/**
 * /clients/ — what you land on after signing in without a client in the URL,
 * and where signing out drops you. One entry per client.
 */

export const metadata = {
  title: 'Client area',
  description: 'Private client area.',
  robots: { index: false, follow: false },
};

const clients = [{ name: 'Bunce Performing Arts', href: '/clients/bunce/', note: 'Prototype & proposal' }];

export default function Clients() {
  return (
    <section className="section" style={{ paddingTop: 200 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">Client area</p>
          <h2 className="kinetic">
            <SplitText text="Work in progress." />
          </h2>
          <p className="lead reveal" style={{ '--d': '160ms' }}>
            Private to the people it belongs to.
          </p>
        </div>

        <div className="client-list">
          {clients.map((c) => (
            <Link className="client-item reveal" href={c.href} key={c.href}>
              <span className="row-item__num">→</span>
              <span className="client-item__main">
                <span className="row-item__meta">{c.note}</span>
                <span className="client-item__title">
                  {c.name} <Arrow />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="client-foot reveal">
          <p>
            <a className="textlink" href="/clients/signout">
              Sign out of this device
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
