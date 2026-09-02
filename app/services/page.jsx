import Link from 'next/link';
import CtaBand from '../components/CtaBand';
import { Arrow, Build, Check, Launch, Support } from '../components/Icons';

export const metadata = {
  title: 'Services',
  description:
    'Build, Launch, and Support — custom websites, web apps, and internal tools for small business, plus the hosting cutover and the ongoing maintenance afterwards.',
  alternates: { canonical: '/services/' },
};

const detail = [
  {
    id: 'build',
    icon: <Build />,
    tint: 'sage',
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
    icon: <Launch />,
    tint: 'ochre',
    title: 'Launch',
    kicker: 'Hosting & go-live',
    lead: 'The part where projects usually stall. Domains, DNS, mail, certificates — I do the cutover so nothing goes dark on switch day.',
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
    icon: <Support />,
    tint: 'terracotta',
    title: 'Support',
    kicker: 'Monthly updates',
    lead: 'Software is never finished. A monthly arrangement keeps the person who built it available when you need a change.',
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
      <section className="section section--tight" style={{ paddingTop: 76 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Services</p>
            <h2>Three things, done properly.</h2>
            <p className="lead">
              Most clients take all three — it is the same person building,
              launching, and maintaining, which is the whole point. But you can
              start with just the piece you&rsquo;re stuck on.
            </p>
          </div>

          <div className="grid grid--3">
            {detail.map((s) => (
              <a className="card card--lift" href={`#${s.id}`} key={s.id}>
                <span className={`icon-badge icon-badge--${s.tint}`}>{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.kicker}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {detail.map((s, i) => (
        <section
          className={`section${i % 2 === 0 ? ' section--paper' : ''}`}
          id={s.id}
          key={s.id}
          style={{ scrollMarginTop: 80 }}
        >
          <div className="container">
            <div className="about-grid">
              <div>
                <span className={`icon-badge icon-badge--${s.tint}`}>{s.icon}</span>
                <p className="eyebrow">{s.kicker}</p>
                <h2>{s.title}</h2>
              </div>
              <div className="prose">
                <p className="lead">{s.lead}</p>
                <ul className="checks">
                  {s.items.map((item) => (
                    <li key={item}>
                      <Check /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* pricing posture */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What it costs</p>
            <h2>Fixed price, agreed before anything starts.</h2>
            <p className="lead">
              Every project is different, so there is no price list here that
              would tell you the truth. What I can promise is how the number
              gets set.
            </p>
          </div>

          <div className="grid grid--3">
            <div className="card" style={{ background: 'var(--dark-2)', borderColor: 'var(--dark-line)' }}>
              <h3 style={{ color: 'var(--on-dark)' }}>A scope, in writing</h3>
              <p style={{ color: 'var(--on-dark-soft)' }}>
                What is being built, what is not, and what it costs — before you
                commit to anything.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--dark-2)', borderColor: 'var(--dark-line)' }}>
              <h3 style={{ color: 'var(--on-dark)' }}>No hourly meter</h3>
              <p style={{ color: 'var(--on-dark-soft)' }}>
                You should not be nervous about asking a question. Projects are
                priced as a whole, not by the hour.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--dark-2)', borderColor: 'var(--dark-line)' }}>
              <h3 style={{ color: 'var(--on-dark)' }}>Support is monthly</h3>
              <p style={{ color: 'var(--on-dark-soft)' }}>
                A flat monthly rate after launch. Cancel it whenever — you keep
                the code and the accounts either way.
              </p>
            </div>
          </div>

          <div className="btn-row">
            <Link className="btn btn--primary" href="/contact/">
              Get a price for your project <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
