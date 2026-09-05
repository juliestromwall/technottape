/**
 * Server component. Splits a line into per-character spans for the kinetic
 * reveal, keeping whole words unbroken so nothing wraps mid-word.
 * The text is real text in the HTML — readable by crawlers and with JS off.
 */
export default function SplitText({ text, start = 0, className = '' }) {
  let i = start;
  return (
    <span className={`k-line ${className}`.trim()}>
      {text.split(' ').map((word, w, all) => (
        <span className="k-word" key={`${word}-${w}`}>
          {[...word].map((ch, c) => (
            <span className="k-char" style={{ '--i': i++ }} key={c}>
              {ch}
            </span>
          ))}
          {w < all.length - 1 && (
            <span className="k-char" style={{ '--i': i++ }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
