'use client';

import { useState } from 'react';

export default function Accordion({ items, idPrefix = 'acc' }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="acc">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            className={`acc__item${isOpen ? ' is-open' : ''}`}
            key={item.title}
            style={{ '--accent': item.accent }}
          >
            <button
              type="button"
              className="acc__btn"
              aria-expanded={isOpen}
              aria-controls={`${idPrefix}-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="acc__title">{item.title}</span>
              <span className="acc__sign" aria-hidden="true" />
            </button>
            <div className="acc__panel" id={`${idPrefix}-${i}`} role="region">
              <div>
                <p className="acc__body">{item.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
