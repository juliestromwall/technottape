// Bars on transparent — the dark site provides its own ground.
export default function Mark({ className = 'logo__mark' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Tech Not Tape">
      <rect x="4" y="7" width="24" height="4.5" rx="2.25" fill="#6f9a73" />
      <rect x="4" y="13.75" width="24" height="4.5" rx="2.25" fill="#d9a94a" />
      <rect x="4" y="20.5" width="14" height="4.5" rx="2.25" fill="#cf7350" />
    </svg>
  );
}
