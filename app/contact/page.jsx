import ContactForm from '../components/ContactForm';
import SplitText from '../components/SplitText';
import { site } from '../site';

export const metadata = {
  title: 'Contact',
  description:
    'Start a project with Tech Not Tape. Tell me what your business needs built, or call 970.333.4481.',
  alternates: { canonical: '/contact/' },
};

export default function Contact() {
  return (
    <section className="section glow glow--ochre" style={{ paddingTop: 200 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">Contact</p>
          <h2 className="kinetic">
            <SplitText text="Tell me what" />
            <SplitText text="needs building." start={12} />
          </h2>
          <p className="lead reveal" style={{ '--d': '160ms' }}>
            The more you can say about what your business actually does, the more
            useful my first reply will be. There&rsquo;s no pitch waiting on the
            other end of this — worst case, you get a straight answer about
            whether custom software is even the right call.
          </p>
        </div>

        <div className="split">
          <div>
            <div className="contact-line reveal">
              <strong>Phone</strong>
              <a href={site.phoneHref}>{site.phone}</a>
            </div>
            <div className="contact-line reveal" style={{ '--d': '90ms' }}>
              <strong>Email</strong>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="contact-line reveal" style={{ '--d': '180ms' }}>
              <strong>Where</strong>
              <span>{site.location}</span>
            </div>

            <div style={{ marginTop: 54 }}>
              <p className="eyebrow reveal" style={{ marginBottom: 26 }}>
                What happens next
              </p>
              <ul className="checks">
                {[
                  'I reply within one business day, usually with questions.',
                  'A short call — 30 minutes, no charge — to understand the work.',
                  'A written scope and fixed price. You decide from there.',
                ].map((s, i) => (
                  <li className="reveal" style={{ '--d': `${i * 90}ms` }} key={s}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
