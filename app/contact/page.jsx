import ContactForm from '../components/ContactForm';
import { Mail, Phone, Pin } from '../components/Icons';
import { site } from '../site';

export const metadata = {
  title: 'Contact',
  description:
    'Start a project with Tech Not Tape. Tell me what your business needs built, or call 970.333.4481.',
  alternates: { canonical: '/contact/' },
};

export default function Contact() {
  return (
    <section className="section" style={{ paddingTop: 76 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Contact</p>
          <h2>Tell me what needs building.</h2>
          <p className="lead">
            The more you can say about what your business actually does, the
            more useful my first reply will be. There is no pitch on the other
            end of this — worst case you get a straight answer about whether
            custom software is even the right call.
          </p>
        </div>

        <div className="contact-grid">
          <ContactForm />

          <div>
            <div className="contact-card">
              <div className="contact-line">
                <Phone />
                <div>
                  <strong>Phone</strong>
                  <a href={site.phoneHref}>{site.phone}</a>
                </div>
              </div>
              <div className="contact-line">
                <Mail />
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </div>
              <div className="contact-line">
                <Pin />
                <div>
                  <strong>Where</strong>
                  <span>{site.location}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 22 }}>
              <h3>What happens next</h3>
              <ol className="checks" style={{ counterReset: 'none' }}>
                <li>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>1.</span>
                  I reply within one business day, usually with questions.
                </li>
                <li>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>2.</span>
                  A short call — 30 minutes, no charge — to understand the work.
                </li>
                <li>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>3.</span>
                  A written scope and fixed price. You decide from there.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
