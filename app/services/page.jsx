import Link from 'next/link';
import CtaBand from '../components/CtaBand';
import SplitText from '../components/SplitText';
import Accordion from '../components/Accordion';
import { Arrow } from '../components/Icons';
import { pillars } from '../pillars';

export const metadata = {
  title: 'Services',
  description:
    'Sort, Build, Launch, Support — workflow and SOP consulting, custom websites and internal tools, secure cloud hosting and go-live, and ongoing monthly support for small businesses.',
  alternates: { canonical: '/services/' },
};

const pricing = [
  {
    accent: 'var(--sage)',
    title: 'A scope, in writing',
    body: 'What is being built, what is not, and what it costs — before you commit to anything. If the work changes, we agree the change before it happens, not on the invoice.',
  },
  {
    accent: 'var(--ochre)',
    title: 'No hourly meter',
    body: 'You shouldn’t have to think twice about asking a question. Projects are priced whole, not by the hour, so a phone call never costs you anything.',
  },
  {
    accent: 'var(--terracotta)',
    title: 'Support is monthly',
    body: 'A flat monthly rate after launch. Cancel it whenever — you keep the code, the accounts, and the data either way. Nothing here is designed to trap you.',
  },
];

const slug = (t) => t.toLowerCase();

export default function Services() {
  return (
    <>
      <section className="section glow glow--ochre" style={{ paddingTop: 200 }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow reveal">Services</p>
            <h2 className="kinetic">
              <SplitText text="Four things," />
              <SplitText text="done properly." start={12} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              Most people take all four — the same person sorting, building,
              launching, and maintaining it is the whole point. But if only one
              of them is your problem right now, start there.
            </p>
            <p className="lead reveal" style={{ '--d': '240ms', marginTop: 22 }}>
              And if you have never used anything more formal than a notebook
              and a group chat, that is a completely normal place to start from.
              Most of my favourite work begins there.
            </p>
          </div>
        </div>
      </section>

      {pillars.map((s) => (
        <section
          className="section section--edge"
          id={slug(s.title)}
          key={s.title}
          style={{ scrollMarginTop: 110 }}
        >
          <div className="container">
            <div className="split split--sticky">
              <div>
                <p className="eyebrow reveal">{s.kicker}</p>
                <h2 className="kinetic" style={{ marginTop: 30, color: s.accent }}>
                  <SplitText text={s.title} />
                </h2>
              </div>
              <div>
                <p className="lead reveal">{s.lead}</p>
                <ul className="checks" style={{ marginTop: 44 }}>
                  {s.items.map((item, i) => (
                    <li className="reveal" style={{ '--d': `${i * 70}ms` }} key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section section--edge glow glow--duo">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">What it costs</p>
            <h2 className="kinetic">
              <SplitText text="Fixed price, agreed" />
              <SplitText text="before anything starts." start={19} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              Every project is different, so any price list here would be a
              polite fiction. What I can tell you is how the number gets set.
            </p>
          </div>

          <Accordion items={pricing} idPrefix="pricing" />

          <div className="btn-row">
            <Link className="btn btn--fill" href="/contact/">
              Get a price for your project <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
