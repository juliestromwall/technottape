import Link from 'next/link';
import CtaBand from './components/CtaBand';
import HeroCanvas from './components/HeroCanvas';
import NodeCanvas from './components/NodeCanvas';
import SplitText from './components/SplitText';
import Accordion from './components/Accordion';
import PillarPicker from './components/PillarPicker';
import Stepper from './components/Stepper';
import SwapList from './components/SwapList';
import { Arrow } from './components/Icons';
import { pillars } from './pillars';
import { site } from './site';

export const metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    'Custom websites, software, and workflow help for small businesses in Minneapolis. Sorting out how the work flows, writing the SOPs, getting you off paper and into secure cloud storage — then building the tools to match.',
  alternates: { canonical: '/' },
};

const problems = [
  {
    accent: 'var(--sage)',
    title: 'Nobody owns it',
    body: 'Whoever built it stopped replying. Every small change is a project now, and nobody left can tell you how any of it works.',
  },
  {
    accent: 'var(--ochre)',
    title: 'It doesn’t fit how you work',
    body: 'Software that does 70% of the job, so your team does the other 30% by hand. Every day. Forever. The workaround becomes the process, and then nobody remembers why.',
  },
  {
    accent: 'var(--terracotta)',
    title: 'It quietly breaks',
    body: 'An expired certificate, a contact form that stopped sending, a domain nobody renewed. You find out when a customer tells you.',
  },
  {
    accent: 'var(--sage)',
    title: 'It only exists in one place',
    body: 'The customer list is in a notebook. The job history is in a filing cabinet. How it all actually works lives in one person’s head — and they are on holiday.',
  },
];

const offPaper = [
  { before: 'In a notebook', after: 'Searchable in seconds' },
  { before: 'On one laptop', after: 'Backed up off-site, automatically' },
  { before: 'Whoever remembers', after: 'Written down so anyone can follow it' },
  { before: 'Emailed spreadsheets', after: 'One version, with who-sees-what' },
  { before: 'A filing cabinet', after: 'Encrypted, with access you control' },
];

const steps = [
  {
    accent: 'var(--sage)',
    title: 'We talk about the actual problem',
    body: 'Not features — the thing costing you hours or customers. Sometimes the honest answer is that you don’t need custom software, and I’ll say so.',
  },
  {
    accent: 'var(--ochre)',
    title: 'You get a fixed scope and price',
    body: 'What gets built, what it costs, and when it lands — in writing, before any work starts. No hourly meter running in the background.',
  },
  {
    accent: 'var(--terracotta)',
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
              I sort out how your business actually works, then build the
              websites and software to match — and keep them running. Based in
              Minneapolis, working with clients anywhere. You deal with me, not
              an account manager.
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
          <span>Sorted</span>
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
        </div>
        <div className="marquee__track">
          <span>Sorted</span>
          <span>Built</span>
          <span>Launched</span>
          <span>Supported</span>
        </div>
      </div>

      {/* ---------- the problem ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="kinetic">
              <SplitText text="Most of the technology" />
              <SplitText text="small businesses run on" start={22} />
              <SplitText text="is held together" start={45} />
              <SplitText text="with tape." start={62} className="outline-text" />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              A site someone&rsquo;s nephew built in 2019. A spreadsheet doing
              the job of a database. Three tools that don&rsquo;t talk to each
              other, and a person whose real job is copying between them. It
              works, right up until it doesn&rsquo;t.
            </p>
          </div>

          <Accordion items={problems} idPrefix="problem" />
        </div>
      </section>

      {/* ---------- what I do ---------- */}
      <section className="section section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">What I do</p>
            <h2 className="kinetic">
              <SplitText text="Sorted, built," />
              <SplitText text="launched, supported." start={14} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              Four things, done properly, by the same person. Take all four, or
              just the part you&rsquo;re stuck on.
            </p>
          </div>

          <PillarPicker pillars={pillars} />

          <div className="btn-row">
            <Link className="textlink" href="/services/">
              Full breakdown of each <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- off paper, into the cloud ---------- */}
      <section className="section section--edge scene">
        <NodeCanvas />
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">Off paper</p>
            <h2 className="kinetic">
              <SplitText text="Paper doesn’t" />
              <SplitText text="back itself up." start={13} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              If the customer list is in a notebook, the job history is in a
              filing cabinet, and the only copy of anything sits on one laptop,
              you are one theft, flood, or dead hard drive from starting over.
              Getting all of that into the cloud properly — encrypted, backed
              up, and locked down so only the right people see it — is often the
              most valuable thing I do for a business.
            </p>
          </div>

          <SwapList rows={offPaper} />

          <p className="lead reveal" style={{ marginTop: 46 }}>
            None of this requires you to become a technical person. That is the
            entire point of hiring one.
          </p>
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

          <Stepper steps={steps} />
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
                  Patient-facing platforms handling medical records and
                  HIPAA-regulated data
                </li>
                <li className="reveal" style={{ '--d': '90ms' }}>
                  A commission-tracking SaaS product founded, built, and run end
                  to end
                </li>
                <li className="reveal" style={{ '--d': '180ms' }}>
                  Case management systems that replaced spreadsheets for teams of
                  coordinators
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
