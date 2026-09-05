import Link from 'next/link';
import CtaBand from '../components/CtaBand';
import SplitText from '../components/SplitText';
import { Arrow } from '../components/Icons';

export const metadata = {
  title: 'Work',
  description:
    'Platforms and internal tools built end to end — medical records review, commission tracking, case management, and provider network software.',
  alternates: { canonical: '/work/' },
};

const projects = [
  {
    n: '01',
    meta: 'Healthcare · Platform',
    title: 'Medical records & review platform',
    body: 'A platform for requesting, organising, and reviewing patient medical records, built for a workflow that had been running on email attachments and shared drives. Regulated data, real reviewers, real deadlines — which meant access control and auditability were part of the design from day one, not bolted on later.',
    tags: ['Web application', 'HIPAA-regulated data', 'Document workflow', 'Role-based access'],
  },
  {
    n: '02',
    meta: 'SaaS · Founded and built',
    title: 'RepCommish — sales & commission tracking',
    body: 'A commission tracking product for independent sales reps, founded and built from nothing. Reps were reconciling payouts across brands by hand in spreadsheets; RepCommish turned that into a dashboard that shows what was sold, what is owed, and what has actually been paid. Product decisions, build, launch, and support were all one job.',
    tags: ['Product from 0→1', 'Dashboards', 'Multi-brand data', 'Subscription product'],
  },
  {
    n: '03',
    meta: 'Operations · Internal tool',
    title: 'Journey management system',
    body: 'Case management for coordinators running long, multi-stage journeys with a lot of moving parts — milestones, documents, tasks, and people who all need different views of the same case. It replaced a stack of spreadsheets and calendar reminders with one timeline everybody could trust.',
    tags: ['Case management', 'Milestone tracking', 'Task assignment', 'Admin tooling'],
  },
  {
    n: '04',
    meta: 'Healthcare · Network software',
    title: 'Provider network platform',
    body: 'Software for managing a network of healthcare providers — onboarding, records, and the matching of providers to the people who need them. The kind of system where the hard part is not the screens, it is understanding the operation well enough to know which screens should exist.',
    tags: ['Provider onboarding', 'Matching', 'Reporting', 'Discovery-led'],
  },
];

export default function Work() {
  return (
    <>
      <section className="section glow glow--sage" style={{ paddingTop: 200 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">Work</p>
            <h2 className="kinetic">
              <SplitText text="Things I’ve taken" />
              <SplitText text="from nothing to live." start={17} />
            </h2>
            <p className="lead reveal" style={{ '--d': '160ms' }}>
              Client names are left out on purpose — most of this is software
              businesses run on internally, and that&rsquo;s not mine to
              advertise. Happy to walk you through any of it on a call.
            </p>
          </div>

          <div className="rows">
            {projects.map((p) => (
              <article className="row-item reveal" key={p.n}>
                <div className="row-item__num">{p.n}</div>
                <div>
                  <div className="row-item__meta">{p.meta}</div>
                  <h3>{p.title}</h3>
                </div>
                <div>
                  <p>{p.body}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--edge glow glow--terra">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow reveal">Also true</p>
              <h2 className="kinetic" style={{ marginTop: 30 }}>
                <SplitText text="Small jobs" />
                <SplitText text="are welcome." start={10} />
              </h2>
            </div>
            <div>
              <p className="lead reveal">
                Not everything needs to be a platform. A five-page site that
                loads fast, a booking form that actually sends, a domain and
                email setup that stops embarrassing you — that&rsquo;s good work
                too, and often the most valuable thing I can do for a small
                business.
              </p>
              <div className="btn-row">
                <Link className="btn btn--fill" href="/contact/">
                  Tell me what you need <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Want the detail behind any of these?"
        body="I can talk through what was built, what it cost, and what I would do differently — on a call, without a pitch attached."
      />
    </>
  );
}
