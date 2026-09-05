import Image from 'next/image';
import Accordion from '../components/Accordion';
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
    accent: 'var(--sage)',
    title: 'I will talk you out of it',
    body: 'If an off-the-shelf tool does the job for $30 a month, that’s what I’ll tell you. It costs me a project and saves you a lot, and it’s why people come back.',
  },
  {
    accent: 'var(--ochre)',
    title: 'You own everything',
    body: 'The code, the domain, the hosting accounts, the data. All of it is registered to you, and you can walk away with it at any point without asking me for permission.',
  },
  {
    accent: 'var(--terracotta)',
    title: 'Plain language, always',
    body: 'You should never leave a conversation with me unsure what was decided. If I use a word you didn’t ask for, that’s my failure, not yours.',
  },
  {
    accent: 'var(--sage)',
    title: 'One person, all the way through',
    body: 'The person on the first call is the person writing the code, and the person answering the phone two years later. Nothing gets lost in the handoff because there isn’t one.',
  },
];

export default function About() {
  return (
    <>
      <section className="section glow glow--duo" style={{ paddingTop: 200 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow reveal">About</p>
            <h2 className="kinetic">
              <SplitText text="Hi — I’m" />
              <SplitText text="Julie Stromwall." start={8} />
            </h2>
          </div>

          <div className="split">
            <div className="media-wrap reveal">
              <div className="media">
                <Image src="/julie.jpg" alt={site.owner} width={800} height={800} priority />
              </div>
            </div>
            <div>
              <p className="lead reveal">
                I build websites and software for small businesses. Before that I
                spent years as a product manager and managing teams, which mostly
                meant sitting with someone while they explained how the work
                actually gets done, then working out what should exist to make it
                stop hurting.
              </p>
              <p className="lead reveal" style={{ '--d': '110ms', marginTop: 24 }}>
                The part I like most is watching someone who has just told me
                they&rsquo;re &ldquo;not a tech person&rdquo; work out what&rsquo;s
                actually possible. Usually they&rsquo;ve been handed tools built
                for someone else&rsquo;s business, by people who never bothered to
                ask how theirs works. Fix that, and the technology stops being the
                hard part.
              </p>
              <p className="lead reveal" style={{ '--d': '220ms', marginTop: 24 }}>
                I&rsquo;m also drawn to the problems other people have given up
                on. If you&rsquo;ve been told the thing you want can&rsquo;t be
                done, or quoted something ridiculous to do it, that&rsquo;s the
                conversation I want to have. In my experience
                &ldquo;unsolvable&rdquo; usually means nobody has sat down and
                looked at it properly yet.
              </p>
              <p className="lead reveal" style={{ '--d': '330ms', marginTop: 24 }}>
                Away from work, my family is the whole point of it. I&rsquo;m
                married with two teenagers who are far funnier than I am, and two
                rescued dogs who are quite certain they count as children too.
                Most of what matters to me happens in that house.
              </p>
              <p className="lead reveal" style={{ '--d': '440ms', marginTop: 24 }}>
                I&rsquo;ve also been a surrogate three times — three families who
                wanted children and now have them. It&rsquo;s the thing I&rsquo;m
                proudest of outside of raising my own, and honestly it comes from
                the same place as the rest of this: I love helping people reach
                something they couldn&rsquo;t get to on their own.
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

          <Accordion items={principles} idPrefix="principle" />
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
                  'Managing people and teams — hiring, coaching, and the unglamorous parts of running a group',
                  'Founded, built, and ran a SaaS product end to end — including the invoicing, the support, and the bad days',
                  'Discovery work: sitting with teams to map how a business actually runs before proposing software',
                  'Writing SOPs and mapping workflows so a process survives the person who invented it',
                  'Moving businesses off paper and onto secure, backed-up cloud storage with real access control',
                  'Full-stack build and launch, including the domain, DNS, mail, and hosting side most developers hand off',
                  'Based in Minneapolis, working with clients anywhere in the US',
                ].map((item, i) => (
                  <li className="reveal" style={{ '--d': `${i * 80}ms` }} key={item}>
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
