// Three bars, squared off and aligned — the opposite of a crossed strip of tape.
export default function Mark({ className = 'logo__mark' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Tech Not Tape">
      <rect x="0" y="0" width="32" height="32" rx="8" fill="#1c1917" />
      <rect x="7" y="8" width="18" height="4" rx="2" fill="#4f6f52" />
      <rect x="7" y="14" width="18" height="4" rx="2" fill="#bc8f3b" />
      <rect x="7" y="20" width="11" height="4" rx="2" fill="#a8553a" />
    </svg>
  );
}
