import Link from 'next/link';
import CtaBand from './components/CtaBand';
import HeroCanvas from './components/HeroCanvas';
import SplitText from './components/SplitText';
import { Arrow } from './components/Icons';
import { site } from './site';

export const metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    'Custom websites and software for small business, from a developer in Minneapolis. One person builds it, launches it, and keeps it running — no agency handoffs, no duct tape.',
  alternates: { canonical: '/' },
};

const problems = [
  {
    n: '01',
    accent: 'var(--sage)',
    title: 'Nobody owns it',
    body: 'Whoever built it stopped replying. Every small change is a project now, and nobody left can tell you how any of it works.',
  },
  {
    n: '02',
    accent: 'var(--ochre)',
    title: 'It doesn’t fit',
    body: 'Software that does 70% of the job, so your team does the other 30% by hand. Every day. Forever.',
  },
  {
    n: '03',
    accent: 'var(--terracotta)',
    title: 'It quietly breaks',
    body: 'An expired certificate, a contact form that stopped sending, a domain nobody renewed. You find out when a customer tells you.',
  },
];

const services = [
  {
    n: '01',
    accent: 'var(--sage)',
    title: 'Build',
    kicker: 'Sites, apps & tools',
    body: 'A website that brings in work, or the internal tool your team has been running out of a spreadsheet. Built around what your business actually does, instead of bent to fit a template.',
  },
  {
    n: '02',
    accent: 'var(--ochre)',
    title: 'Launch',
    kicker: 'Hosting & go-live',
    body: 'Domains, DNS, email, hosting, certificates — the boring half that sinks most projects. I run the whole cutover, so nothing goes dark on the day you switch.',
  },
  {
    n: '03',
    accent: 'var(--terracotta)',
    title: 'Support',
    kicker: 'Monthly updates',
    body: 'Software’s never finished. Changes and fixes come from the person who built the thing, so you’re not re-explaining your business to a new developer every year.',
  },
];

const steps = [
  {
    n: '01',
    title: 'We talk about the actual problem',
    body: 'Not features — the thing costing you hours or customers. Sometimes the honest answer is that you don’t need custom software, and I’ll say so.',
  },
  {
    n: '02',
    title: 'You get a fixed scope and price',
    body: 'What gets built, what it costs, and when it lands — in writing, before any work starts. No hourly meter running in the background.',
  },
  {
    n: '03',
    title: 'It ships, and it keeps working',
    body: 'I launch it, make sure it holds up in the real world, and stay reachable afterwards. You don’t get handed a login and wished luck.',
  },
];

export default function Home() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero">
        <HeroCanvas />
        <div className="container">
          <span className="hero__status reveal">
            <i />
            Taking on new projects
          </span>

          <h1 className="hero__title kinetic">
            <SplitText text="Software" />
            <SplitText text="that holds." start={9} />
            <SplitText text="Not held together." start={22} className="l2" />
          </h1>

          <div className="hero__foot">
            <p className="lead reveal" style={{ '--d': '400ms' }}>
              I build custom websites and software for small businesses — then
              launch them and keep them running. Based in Minneapolis, working
              with clients anywhere. You deal with me, not an account manager.
            </p>
            <div className="scroll-cue reveal" style={{ '--d': '560ms' }}>
              Scroll
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- marquee ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
        </div>
        <div className="marquee__track">
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
        </div>
      </div>

      {/* ---------- the problem ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">Why the name</p>
            <h2 className="kinetic">
              <SplitText text="Most small-business" />
              <SplitText text="tech is held together" start={19} />
              <SplitText text="with tape." start={40} className="outline-text" />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              A site someone&rsquo;s nephew built in 2019. A spreadsheet doing
              the job of a database. Three tools that don&rsquo;t talk to each
              other, and a person whose real job is copying between them. It
              works, right up until it doesn&rsquo;t.
            </p>
          </div>

          <div className="grid grid--3">
            {problems.map((p, i) => (
              <div className="cell reveal" style={{ '--d': `${i * 110}ms` }} key={p.n}>
                <span className="cell__bar" style={{ '--accent': p.accent }} />
                <span className="cell__num">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="section section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">What I do</p>
            <h2 className="kinetic">
              <SplitText text="Built, launched," />
              <SplitText text="and supported." start={16} />
            </h2>
          </div>

          <div className="grid grid--3">
            {services.map((s, i) => (
              <div className="cell reveal" style={{ '--d': `${i * 110}ms` }} key={s.n}>
                <span className="cell__bar" style={{ '--accent': s.accent }} />
                <span className="cell__num">
                  {s.n} — {s.kicker}
                </span>
                <h3>{s.title}</h3>
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

      {/* ---------- process ---------- */}
      <section className="section section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">How it goes</p>
            <h2 className="kinetic">
              <SplitText text="No mystery," />
              <SplitText text="no surprise invoice." start={11} />
            </h2>
          </div>

          <div className="rows">
            {steps.map((s) => (
              <div className="row-item reveal" key={s.n}>
                <div className="row-item__num">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                </div>
                <div>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- proof ---------- */}
      <section className="section section--edge">
        <div className="container">
          <div className="split split--sticky">
            <div>
              <p className="eyebrow reveal">Who you get</p>
              <h2 className="kinetic" style={{ marginTop: 30 }}>
                <SplitText text="One person," />
                <SplitText text="who has built" start={11} />
                <SplitText text="this before." start={24} />
              </h2>
            </div>
            <div>
              <p className="lead reveal">
                I&rsquo;m {site.owner}. I&rsquo;ve spent my career as a product
                manager and builder taking software from nothing to live — in
                healthcare, in industries where compliance is not optional, and
                for founders running a real business out of a spreadsheet.
              </p>
              <p className="lead reveal" style={{ '--d': '120ms', marginTop: 24 }}>
                So I&rsquo;m as comfortable working out what should be built as I
                am building it — usually the difference between software that
                gets used and software that gets quietly abandoned.
              </p>

              <ul className="checks" style={{ marginTop: 46 }}>
                <li className="reveal">
                  <span>01</span>
                  Patient-facing platforms handling medical records and
                  HIPAA-regulated data
                </li>
                <li className="reveal" style={{ '--d': '90ms' }}>
                  <span>02</span>A commission-tracking SaaS product founded,
                  built, and run end to end
                </li>
                <li className="reveal" style={{ '--d': '180ms' }}>
                  <span>03</span>Case management systems that replaced
                  spreadsheets for teams of coordinators
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
