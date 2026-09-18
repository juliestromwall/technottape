import SplitText from '../../components/SplitText';
import { Arrow } from '../../components/Icons';
import { site } from '../../site';

/**
 * The Foundry client page.
 *
 * This area has its OWN password, not the shared /clients/ one — see AREAS in
 * functions/clients/_middleware.js. Foundry Hub is a live application wired to
 * a real database, so it should not open for anyone holding the password to a
 * different client's proposal.
 *
 * The link below points at public/clients/foundry/hub/, a built copy of the
 * Foundry Hub app, not a Next route. It is copied to out/ verbatim at build.
 */

export const metadata = {
  title: 'Foundry Distribution',
  description: 'Private client area.',
  robots: { index: false, follow: false },
};

const items = [
  {
    n: '01',
    meta: 'Live application',
    title: 'Foundry Hub',
    href: '/clients/foundry/hub/',
    body:
      'The internal hub for Foundry Distribution: real logins for the office and every rep, events with RSVPs and flight details, expense claims that route to accounting, and contracts signed in the browser with a full signature record. This is the working application, not a prototype — it talks to a live database, and what you can see depends on who you sign in as.',
    tags: ['Needs a Foundry Hub login', 'Admin and rep see different things', 'Real data'],
  },
];

export default function FoundryClientPage() {
  return (
    <section className="section glow glow--sage" style={{ paddingTop: 200 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">Private · Foundry Distribution</p>
          <h2 className="kinetic">
            <SplitText text="One door" />
            <SplitText text="per person." start={12} />
          </h2>
          <p className="lead reveal" style={{ '--d': '160ms' }}>
            Foundry Hub replaces a single shared password at the edge with real
            accounts — the database itself decides what each person may see, so a
            rep reads their own contract and their own receipts and nobody
            else&rsquo;s. Open it on a laptop if you can.
          </p>
        </div>

        <div className="client-list">
          {items.map((it, i) => (
            <a
              className="client-item reveal"
              style={{ '--d': `${i * 110}ms` }}
              href={it.href}
              key={it.href}
            >
              <span className="row-item__num">{it.n}</span>
              <span className="client-item__main">
                <span className="row-item__meta">{it.meta}</span>
                <span className="client-item__title">
                  {it.title} <Arrow />
                </span>
                <p>{it.body}</p>
                <span className="tags">
                  {it.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="client-foot reveal">
          <p>
            You&rsquo;ll need a Foundry Hub login as well as the password that got
            you here — the two are separate on purpose. Ask Julie, or email{' '}
            <a className="textlink" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p>
            <a className="textlink" href="/clients/foundry/signout">
              Sign out of this device
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
