import SplitText from './SplitText';
import { testimonials } from '../testimonials';

export default function Testimonials() {
  // nothing to show until there are real quotes — see app/testimonials.js
  if (!testimonials.length) return null;

  return (
    <section className="section section--edge glow glow--ochre">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">In their words</p>
          <h2 className="kinetic">
            <SplitText text="What clients say." />
          </h2>
        </div>

        <div className="quotes">
          {testimonials.map((t, i) => (
            <figure
              className="quote reveal"
              key={t.name + i}
              style={{ '--accent': t.accent || 'var(--sage)', '--d': `${i * 110}ms` }}
            >
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="quote__name">{t.name}</span>
                {t.role ? <span className="quote__role">{t.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
