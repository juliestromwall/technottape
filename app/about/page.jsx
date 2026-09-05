import Image from 'next/image';
import CtaBand from '../components/CtaBand';
import SplitText from '../components/SplitText';
import { site } from '../site';

export const metadata = {
  title: 'About',
  description:
    'Tech Not Tape is Julie Stromwall — a product manager and builder making custom websites and software for small businesses, from first conversation through launch and support.',
  alternates: { canonical: '/about/' },
};

const principles = [
  {
    n: '01',
    accent: 'var(--sage)',
    title: 'I will talk you out of it',
    body: 'If an off-the-shelf tool does the job for $30 a month, that’s what I’ll tell you. It costs me a project and saves you a lot, and it’s why people come back.',
  },
  {
    n: '02',
    accent: 'var(--ochre)',
    title: 'You own everything',
    body: 'The code, the domain, the hosting accounts, the data. All of it is registered to you, and you can walk away with it at any point without asking me for permission.',
  },
  {
    n: '03',
    accent: 'var(--terracotta)',
    title: 'Plain language, always',
    body: 'You should never leave a conversation with me unsure what was decided. If I use a word you didn’t ask for, that’s my failure, not yours.',
  },
  {
    n: '04',
    accent: 'var(--sage)',
    title: 'One person, all the way through',
    body: 'The person on the first call is the person writing the code, and the person answering the phone two years later. Nothing gets lost in the handoff because there isn’t one.',
  },
];

export default function About() {
  return (
    <>
      <section className="section" style={{ paddingTop: 200 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">About</p>
            <h2 className="kinetic">
              <SplitText text="Hi — I’m" />
              <SplitText text="Julie Stromwall." start={8} />
            </h2>
          </div>

          <div className="split">
            <div className="media reveal">
              <Image src="/julie.jpg" alt={site.owner} width={800} height={800} priority />
            </div>
            <div>
              <p className="lead reveal">
                I build websites and software for small businesses. Before that I
                spent years as a product manager, which mostly meant sitting with
                people while they explained a process, and then working out what
                software should exist to make that process stop hurting.
              </p>
              <p className="lead reveal" style={{ '--d': '110ms', marginTop: 24 }}>
                That order matters. A lot of small-business tech fails not because
                it was built badly but because nobody asked the right questions
                first — so a business ends up paying for something that solves a
                problem it doesn&rsquo;t have.
              </p>
              <p className="lead reveal" style={{ '--d': '220ms', marginTop: 24 }}>
                I named this Tech Not Tape because of what I kept finding when I
                looked under the hood of small companies: things patched together,
                patched again, and quietly costing somebody an hour a day. The
                alternative is not fancier software. It is software that fits, and
                someone who is still around to change it when your business
                changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">How I work</p>
            <h2 className="kinetic">
              <SplitText text="A few things" />
              <SplitText text="I hold to." start={12} />
            </h2>
          </div>

          <div className="grid grid--2">
            {principles.map((p, i) => (
              <div className="cell reveal" style={{ '--d': `${i * 100}ms` }} key={p.n}>
                <span className="cell__bar" style={{ '--accent': p.accent }} />
                <span className="cell__num">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--edge">
        <div className="container">
          <div className="split split--sticky">
            <div>
              <p className="eyebrow reveal">Background</p>
              <h2 className="kinetic" style={{ marginTop: 30 }}>
                <SplitText text="Where the" />
                <SplitText text="experience" start={9} />
                <SplitText text="comes from." start={19} />
              </h2>
            </div>
            <div>
              <ul className="checks">
                {[
                  'Product management and delivery across healthcare and other compliance-heavy industries',
                  'Founded, built, and ran a SaaS product end to end — including the invoicing, the support, and the bad days',
                  'Discovery work: sitting with teams to map how a business actually runs before proposing software',
                  'Full-stack build and launch, including the domain, DNS, mail, and hosting side most developers hand off',
                  'Based in Minneapolis, working with clients anywhere in the US',
                ].map((item, i) => (
                  <li className="reveal" style={{ '--d': `${i * 80}ms` }} key={item}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
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
