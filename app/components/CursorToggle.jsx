'use client';

import { useEffect, useState } from 'react';
import { CURSOR_EVENT, getCursorPref, setCursorPref } from '../cursor-pref';

export default function CursorToggle() {
  // Start true on both server and client, then correct after mount, so the
  // stored preference can't cause a hydration mismatch.
  const [on, setOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOn(getCursorPref());
    setReady(true);
    const sync = (e) => setOn(e.detail);
    window.addEventListener(CURSOR_EVENT, sync);
    return () => window.removeEventListener(CURSOR_EVENT, sync);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setCursorPref(next);
  };

  return (
    <button
      type="button"
      className="cursor-toggle"
      onClick={toggle}
      aria-pressed={ready ? on : true}
      title={on ? 'Use your system cursor' : 'Use the custom cursor'}
      aria-label={on ? 'Switch to your system cursor' : 'Switch to the custom cursor'}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 3l7 17 2.2-6.8L20 11z" />
        {!on && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}
