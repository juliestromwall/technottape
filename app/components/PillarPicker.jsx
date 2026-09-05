'use client';

import { useState } from 'react';

export default function PillarPicker({ pillars }) {
  const [active, setActive] = useState(0);

  return (
    <div className="pillars">
      <div className="pillars__list" role="tablist" aria-label="What I do">
        {pillars.map((p, i) => (
          <button
            type="button"
            key={p.title}
            role="tab"
            id={`pillar-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`pillar-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className={`pillar${active === i ? ' is-on' : ''}`}
            style={{ '--accent': p.accent }}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const n = (i + 1) % pillars.length;
                setActive(n);
                document.getElementById(`pillar-tab-${n}`)?.focus();
              }
              if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const n = (i - 1 + pillars.length) % pillars.length;
                setActive(n);
                document.getElementById(`pillar-tab-${n}`)?.focus();
              }
            }}
          >
            <span className="pillar__dot" aria-hidden="true" />
            <span className="pillar__name">{p.title}</span>
          </button>
        ))}
      </div>

      <div className="pillar__panel">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            id={`pillar-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`pillar-tab-${i}`}
            className={`pillar__panel-item${active === i ? ' is-on' : ''}`}
            style={{ '--accent': p.accent }}
          >
            <div className={active === i ? 'pillar__fade' : undefined}>
              <p className="pillar__kicker">{p.kicker}</p>
              <p className="pillar__lead">{p.lead}</p>
              <ul className="pillar__items">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
