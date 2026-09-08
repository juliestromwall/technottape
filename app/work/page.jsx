import Link from 'next/link';
import CtaBand from '../components/CtaBand';
import Testimonials from '../components/Testimonials';
import SplitText from '../components/SplitText';
import { Arrow } from '../components/Icons';

export const metadata = {
  title: 'Work',
  description:
    'Platforms, internal tools and websites built end to end — medical records review, commission tracking, a custom CRM, job estimating, non-profit and distribution software, and small-business websites.',
  alternates: { canonical: '/work/' },
};

const projects = [
  {
    n: '01',
    meta: 'Platform · Regulated data',
    title: 'Records & review platform',
    body: 'Regulated data, real reviewers, real deadlines — and it holds. A full platform for requesting, organising and reviewing sensitive records, replacing a process that lived in email attachments and shared drives. Access control and auditability were designed in from day one rather than bolted on when somebody asked. This is the least forgiving kind of software to get right, and it runs every day.',
    tags: ['Web application', 'HIPAA-regulated data', 'Document workflow', 'Role-based access'],
  },
  {
    n: '02',
    meta: 'SaaS · Founded and built',
    title: 'RepCommish — sales & commission tracking',
    body: 'Founded, designed, built, launched and supported by one person. Independent reps were reconciling payouts across multiple brands by hand in spreadsheets; RepCommish turned that into a dashboard showing what sold, what is owed, and what has actually been paid. Every decision was mine — the product, the code, the pricing, the support inbox, and the bad days.',
    tags: ['Product from 0→1', 'Dashboards', 'Multi-brand data', 'Subscription product'],
  },
  {
    n: '03',
    meta: 'Internal tool · CRM',
    title: 'Custom CRM system',
    body: 'Built around how the business actually works, instead of forcing the business to bend around somebody else\u2019s software. Contacts, stages, documents, tasks and ownership in one place, with each team seeing the view that matters to them. It replaced a sprawl of spreadsheets and calendar reminders with a single source everyone trusts — the thing every off-the-shelf CRM had failed to do.',
    tags: ['Custom CRM', 'Pipeline stages', 'Task assignment', 'Admin tooling'],
  },
  {
    n: '04',
    meta: 'Internal tool · Estimating',
    title: 'Estimating & quoting software',
    body: 'Turns an evening of paperwork into a few minutes. Build an estimate from labour and materials, keep pricing consistent from one job to the next, and get a clean, professional quote out while the job is still fresh. Quoting faster than everyone else is a quiet way to win more work, and this does exactly that.',
    tags: ['Estimating', 'Quoting', 'Pricing consistency', 'Field-friendly'],
  },
  {
    n: '05',
    meta: 'Platform · Booking',
    title: 'Travel booking system',
    body: 'Search, availability, booking and confirmation — the kind of system where the edge cases are the whole job. Dates that overlap, inventory that changes while somebody is mid-checkout, and a customer who needs a confirmation they can rely on. Built to hold up at the exact moment a real person is halfway through paying.',
    tags: ['Search & availability', 'Booking flow', 'Payments', 'Confirmations'],
  },
  {
    n: '06',
    meta: 'Platform · Non-profit',
    title: 'Non-profit platform',
    body: 'Software for a non-profit that needed to run on a great deal less admin than it had. People, scheduling, records and reporting — all the moving parts that otherwise scatter across a dozen spreadsheets, printouts and group chats — brought into one place everybody can see. Less time spent on the machinery, more spent on the actual mission.',
    tags: ['Scheduling', 'People & records', 'Reporting', 'Shared source of truth'],
  },
  {
    n: '07',
    meta: 'Platform · Operations',
    title: 'Distribution center platform',
    body: 'What arrived, what is going out, and where everything sits in between. It replaces paper and the memory of whoever has worked there longest with a record the whole floor can check. Operations software has to survive a bad day with people shouting and a truck waiting — this was built for that, not for a demo.',
    tags: ['Inbound & outbound', 'Inventory visibility', 'Operations', 'Reporting'],
  },
  {
    n: '08',
    meta: 'Websites · Ongoing',
    title: 'Websites for small businesses',
    body: 'Site after site, across trades and services. Fast on a phone, honest about what the business does, and easy to get in touch with — no template smell, no page that takes eight seconds to load. Then looked after afterwards, so changing your hours or adding a photo never means waiting on a developer who has moved on.',
    tags: ['Marketing sites', 'Mobile-first', 'Hosting & launch', 'Ongoing support'],
  },
  {
    n: '09',
    meta: 'SaaS · Various',
    title: 'And other SaaS platforms',
    body: 'Subscription products with real users behind logins, across a range of industries. Mostly the parts that never make it into a screenshot — accounts, roles, permissions, billing, and the admin side somebody has to actually run the business from. Different sectors, same fundamentals, and all of them still running.',
    tags: ['Accounts & roles', 'Permissions', 'Billing', 'Admin tooling'],
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

      <Testimonials />

      <CtaBand
        title="Want the detail behind any of these?"
        body="I can talk through what was built, what it cost, and what I would do differently — on a call, without a pitch attached."
      />
    </>
  );
}
