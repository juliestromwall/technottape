import SplitText from '../../components/SplitText';
import { Arrow } from '../../components/Icons';
import { site } from '../../site';

/**
 * The Bunce client page. Everything under /clients/ sits behind a shared
 * password — see functions/clients/_middleware.js — so this page is only
 * ever seen by someone who has been given it.
 *
 * The two links point at static files in public/clients/bunce/, not at Next
 * routes: the prototype is its own little vanilla-JS app and the proposal is
 * one self-contained HTML file. They are copied to out/ verbatim at build.
 */

export const metadata = {
  title: 'Bunce Performing Arts',
  description: 'Private client area.',
  robots: { index: false, follow: false },
};

const items = [
  {
    n: '01',
    meta: 'Interactive prototype',
    title: 'The Bunce Hub',
    href: '/clients/bunce/demo/',
    body: 'A clickable prototype of the platform — one login for cast families, volunteers, directors and the board, with each one seeing a different portal. Rehearsal notes sorted by scene and performer, auditions and casting, a contact record for every person, photo consent enforced by the system, volunteer shifts, and giving.',
    tags: ['Switch roles in the top bar', 'Everything is clickable', 'Resets when you want it to'],
  },
  {
    n: '02',
    meta: 'Proposal · Includes pricing',
    title: 'Platform proposal',
    href: '/clients/bunce/proposal/',
    body: 'The written proposal: what gets built, in what order, what it costs, and what happens after launch. Illustrated with screens from the prototype next door.',
    tags: ['Scope & timeline', 'Fixed price', 'Reads on a phone'],
  },
];

export default function BunceClientPage() {
  return (
    <section className="section glow glow--sage" style={{ paddingTop: 200 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">Private · Bunce Performing Arts</p>
          <h2 className="kinetic">
            <SplitText text="Twenty years" />
            <SplitText text="deserves better tools." start={12} />
          </h2>
          <p className="lead reveal" style={{ '--d': '160ms' }}>
            Two things live here — a working prototype you can click through, and
            the proposal behind it. Both are private to Bunce. Open them on a
            laptop if you can; the prototype is built for a phone too, but there
            is more to see on a bigger screen.
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
            Questions on any of it — including the parts you disagree with —
            call {site.phone} or email{' '}
            <a className="textlink" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
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
