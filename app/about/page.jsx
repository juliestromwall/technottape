import Image from 'next/image';
import CtaBand from '../components/CtaBand';
import { Check } from '../components/Icons';
import { site } from '../site';

export const metadata = {
  title: 'About',
  description:
    'Tech Not Tape is Julie Stromwall — a product manager and builder making custom websites and software for small businesses, from first conversation through launch and support.',
  alternates: { canonical: '/about/' },
};

export default function About() {
  return (
    <>
      <section className="section" style={{ paddingTop: 76 }}>
        <div className="container">
          <div className="about-grid">
            <div className="portrait">
              <Image
                src="/julie.jpg"
                alt={site.owner}
                width={800}
                height={800}
                priority
              />
            </div>
            <div>
              <p className="eyebrow">About</p>
              <h2>Hi — I&rsquo;m {site.owner}.</h2>
              <div className="prose" style={{ marginTop: 22 }}>
                <p>
                  I build websites and software for small businesses. Before
                  that I spent years as a product manager, which mostly meant
                  sitting with people while they explained a process, and then
                  working out what software should exist to make that process
                  stop hurting.
                </p>
                <p>
                  That order matters. A lot of small-business tech fails not
                  because it was built badly but because nobody asked the right
                  questions first — so a business ends up paying for something
                  that solves a problem it does not have.
                </p>
                <p>
                  I named this Tech Not Tape because of what I kept finding when
                  I looked under the hood of small companies: things patched
                  together, patched again, and quietly costing somebody an hour
                  a day. The alternative is not fancier software. It is software
                  that fits, and someone who is still around to change it when
                  your business changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How I work</p>
            <h2>A few things I hold to.</h2>
          </div>

          <div className="grid grid--2">
            <div className="card">
              <h3>I will talk you out of it</h3>
              <p>
                If an off-the-shelf tool does the job for $30 a month, that is
                what I will tell you. It costs me a project and saves you a lot,
                and it is why the people I work with come back.
              </p>
            </div>
            <div className="card">
              <h3>You own everything</h3>
              <p>
                The code, the domain, the hosting accounts, the data. All of it
                is registered to you, and you can walk away with it at any point
                without asking me for permission.
              </p>
            </div>
            <div className="card">
              <h3>Plain language, always</h3>
              <p>
                You should never leave a conversation with me unsure of what was
                decided. If I use a word you did not ask for, that is my
                failure, not yours.
              </p>
            </div>
            <div className="card">
              <h3>One person, all the way through</h3>
              <p>
                The person on the first call is the person writing the code and
                the person answering the phone in eighteen months. Nothing gets
                lost in a handoff because there is no handoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="about-grid">
            <div>
              <p className="eyebrow">Background</p>
              <h2>Where the experience comes from.</h2>
            </div>
            <div>
              <ul className="checks">
                <li>
                  <Check /> Product management and delivery across healthcare
                  and other compliance-heavy industries
                </li>
                <li>
                  <Check /> Founded, built, and ran a SaaS product end to end —
                  including the invoicing, the support, and the bad days
                </li>
                <li>
                  <Check /> Discovery work: sitting with teams to map how a
                  business actually runs before proposing software
                </li>
                <li>
                  <Check /> Full-stack build and launch, including the domain,
                  DNS, mail, and hosting side most developers hand off
                </li>
                <li>
                  <Check /> Based in Minneapolis, working with clients anywhere
                  in the US
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's see if I'm the right fit."
        body="Tell me what your business does and what is currently held together with tape. If I am not the right person, I will point you at who is."
      />
    </>
  );
}
