import Link from 'next/link';
import CtaBand from '../components/CtaBand';
import SplitText from '../components/SplitText';
import { Arrow } from '../components/Icons';

export const metadata = {
  title: 'Services',
  description:
    'Build, Launch, and Support — custom websites, web apps, and internal tools for small business, plus the hosting cutover and the ongoing maintenance afterwards.',
  alternates: { canonical: '/services/' },
};

const detail = [
  {
    id: 'build',
    n: '01',
    accent: 'var(--sage)',
    title: 'Build',
    kicker: 'Sites, apps & tools',
    lead: 'A marketing site that brings in work, a web app your customers log into, or the internal tool that finally kills the spreadsheet.',
    items: [
      'Marketing and brochure sites that load fast and read well on a phone',
      'Web applications with logins, roles, and real data behind them',
      'Internal tools — job tracking, scheduling, quoting, reporting',
      'Replacing a spreadsheet or paper process with something that scales',
      'Integrations between the tools you already pay for',
      'Fixing or finishing a project another developer walked away from',
    ],
  },
  {
    id: 'launch',
    n: '02',
    accent: 'var(--ochre)',
    title: 'Launch',
    kicker: 'Hosting & go-live',
    lead: 'Domains, DNS, mail, certificates, redirects. I run the cutover myself, so switch day is uneventful — which is the highest compliment you can pay a launch.',
    items: [
      'Domain registration, transfers, and renewals you will not forget',
      'DNS migration with your email records protected through the move',
      'Hosting set up on infrastructure that costs a few dollars a month, not a few hundred',
      'HTTPS certificates, redirects, and the old site retired cleanly',
      'Google Workspace mail, SPF, DKIM, and DMARC so your email lands in inboxes',
      'Analytics and search console, so you can see what is actually happening',
    ],
  },
  {
    id: 'support',
    n: '03',
    accent: 'var(--terracotta)',
    title: 'Support',
    kicker: 'Monthly updates',
    lead: 'The work doesn’t stop at launch. A flat monthly arrangement keeps the person who built it on hand for when something needs to change.',
    items: [
      'Content, copy, and photo updates as your business changes',
      'New features and adjustments as you learn what customers want',
      'Dependency and security updates so nothing quietly rots',
      'Uptime and form monitoring — I find out before your customers do',
      'Backups and a tested way to restore them',
      'A person to call who already knows how your system works',
    ],
  },
];

export default function Services() {
  return (
    <>
      <section className="section" style={{ paddingTop: 200 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">Services</p>
            <h2 className="kinetic">
              <SplitText text="Three things," />
              <SplitText text="done properly." start={12} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              Most people take all three — the same person building, launching,
              and maintaining it is the whole point. But if only one of them is
              your problem right now, start there.
            </p>
          </div>

          <div className="rows">
            {detail.map((s) => (
              <a className="row-item reveal" href={`#${s.id}`} key={s.id}>
                <div className="row-item__num">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                </div>
                <div>
                  <p>{s.kicker}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {detail.map((s) => (
        <section
          className="section section--edge"
          id={s.id}
          key={s.id}
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
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* pricing posture */}
      <section className="section section--edge">
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

          <div className="grid grid--3">
            <div className="cell reveal">
              <span className="cell__bar" style={{ '--accent': 'var(--sage)' }} />
              <span className="cell__num">01</span>
              <h3>A scope, in writing</h3>
              <p>
                What is being built, what is not, and what it costs — before you
                commit to anything.
              </p>
            </div>
            <div className="cell reveal" style={{ '--d': '110ms' }}>
              <span className="cell__bar" style={{ '--accent': 'var(--ochre)' }} />
              <span className="cell__num">02</span>
              <h3>No hourly meter</h3>
              <p>
                You shouldn&rsquo;t have to think twice about asking a question.
                Projects are priced whole, not by the hour.
              </p>
            </div>
            <div className="cell reveal" style={{ '--d': '220ms' }}>
              <span className="cell__bar" style={{ '--accent': 'var(--terracotta)' }} />
              <span className="cell__num">03</span>
              <h3>Support is monthly</h3>
              <p>
                A flat monthly rate after launch. Cancel it whenever — you keep
                the code and the accounts either way.
              </p>
            </div>
          </div>

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
