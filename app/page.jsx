import Link from 'next/link';
import CtaBand from './components/CtaBand';
import { Arrow, Build, Check, Launch, Support } from './components/Icons';
import { site } from './site';

export const metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    'Custom websites and software for small business, from a developer in Minneapolis. One person builds it, launches it, and keeps it running — no agency handoffs, no duct tape.',
  alternates: { canonical: '/' },
};

const services = [
  {
    icon: <Build />,
    tint: 'sage',
    title: 'Build',
    kicker: 'Sites, apps & tools',
    body: 'A website that brings in work, or the internal tool your team has been running out of a spreadsheet. Built around what your business actually does, instead of bent to fit a template.',
  },
  {
    icon: <Launch />,
    tint: 'ochre',
    title: 'Launch',
    kicker: 'Hosting & go-live',
    body: 'Domains, DNS, email, hosting, certificates — the boring half that sinks most projects. I run the whole cutover, so nothing goes dark on the day you switch.',
  },
  {
    icon: <Support />,
    tint: 'terracotta',
    title: 'Support',
    kicker: 'Monthly updates',
    body: "Software's never finished. Changes and fixes come from the person who built the thing, so you're not re-explaining your business to a new developer every year.",
  },
];

const steps = [
  {
    num: 'Step 01',
    title: 'We talk about the actual problem',
    body: "Not features — the thing costing you hours or customers. Sometimes the honest answer is that you don't need custom software, and I'll say so.",
  },
  {
    num: 'Step 02',
    title: 'You get a fixed scope and price',
    body: 'What gets built, what it costs, and when it lands — in writing, before any work starts. No hourly meter running in the background.',
  },
  {
    num: 'Step 03',
    title: 'It ships, and it keeps working',
    body: "I launch it, make sure it holds up in the real world, and stay reachable afterwards. You don't get handed a login and wished luck.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <span className="pill">
                <span className="pill__dot" />
                Taking on new projects
              </span>
              <h1>
                Software that holds.
                <br />
                <span className="grad-text">Not held together.</span>
              </h1>
              <p className="lead">
                I build custom websites and software for small businesses — then
                launch them and keep them running. Based in Minneapolis, working
                with clients anywhere. You deal with me, not an account manager.
              </p>
              <div className="btn-row">
                <Link className="btn btn--primary" href="/contact/">
                  Start a project <Arrow />
                </Link>
                <Link className="btn btn--ghost" href="/services/">
                  What I build
                </Link>
              </div>
            </div>

            <div className="showcase">
              <div className="showcase__body">
                <div className="showcase__row">
                  <span className="showcase__tick" style={{ background: 'var(--sage)' }}>
                    <Check size={14} />
                  </span>
                  <span>
                    Built
                    <small>Sites, apps &amp; internal tools</small>
                  </span>
                </div>
                <div className="showcase__row">
                  <span className="showcase__tick" style={{ background: 'var(--ochre)' }}>
                    <Check size={14} />
                  </span>
                  <span>
                    Launched
                    <small>Domains, hosting &amp; go-live</small>
                  </span>
                </div>
                <div className="showcase__row">
                  <span className="showcase__tick" style={{ background: 'var(--terracotta)' }}>
                    <Check size={14} />
                  </span>
                  <span>
                    Supported
                    <small>Monthly updates and fixes</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* the problem */}
      <section className="section section--paper">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Why the name</p>
            <h2>Most small-business tech is held together with tape.</h2>
            <p className="lead">
              A site someone&rsquo;s nephew built in 2019. A spreadsheet doing
              the job of a database. Three tools that don&rsquo;t talk to each
              other, and a person whose real job is copying between them. It
              works, right up until it doesn&rsquo;t.
            </p>
          </div>

          <div className="grid grid--3">
            <div className="card tint-sage">
              <h3>Nobody owns it</h3>
              <p>
                Whoever built it stopped replying. Every small change is a
                project now, and nobody left can tell you how any of it works.
              </p>
            </div>
            <div className="card tint-ochre">
              <h3>It doesn&rsquo;t fit</h3>
              <p>
                Software that does 70% of the job, so your team does the other
                30% by hand. Every day. Forever.
              </p>
            </div>
            <div className="card tint-terracotta">
              <h3>It quietly breaks</h3>
              <p>
                An expired certificate, a contact form that stopped sending, a
                domain nobody renewed. You find out when a customer tells you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What I do</p>
            <h2>Built, launched, and supported.</h2>
            <p className="lead">
              Three things, done properly, by the same person. Take all three, or
              just the part you&rsquo;re stuck on.
            </p>
          </div>

          <div className="grid grid--3">
            {services.map((s) => (
              <div className="card card--lift" key={s.title}>
                <span className={`icon-badge icon-badge--${s.tint}`}>{s.icon}</span>
                <h3>{s.title}</h3>
                <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginTop: 6 }}>
                  {s.kicker}
                </p>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="btn-row">
            <Link className="textlink" href="/services/">
              Full breakdown of each <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* process */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it goes</p>
            <h2>No mystery, no surprise invoice.</h2>
          </div>

          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="step__num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* proof */}
      <section className="section section--paper">
        <div className="container">
          <div className="about-grid">
            <div>
              <p className="eyebrow">Who you get</p>
              <h2>One person, who has built this before.</h2>
            </div>
            <div className="prose">
              <p>
                I&rsquo;m {site.owner}. I&rsquo;ve spent my career as a product
                manager and builder taking software from nothing to live — in
                healthcare, in industries where compliance is not optional, and
                for founders running a real business out of a spreadsheet.
              </p>
              <p>
                So I&rsquo;m as comfortable working out what should be built as I
                am building it — usually the difference between software that
                gets used and software that gets quietly abandoned.
              </p>
              <ul className="checks">
                <li>
                  <Check /> Patient-facing platforms handling medical records and
                  HIPAA-regulated data
                </li>
                <li>
                  <Check /> A commission-tracking SaaS product founded, built,
                  and run end to end
                </li>
                <li>
                  <Check /> Case management systems that replaced spreadsheets
                  for teams of coordinators
                </li>
              </ul>
              <div className="btn-row">
                <Link className="textlink" href="/work/">
                  See the work <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
