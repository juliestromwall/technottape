/**
 * The wordmark: TECH (binary) · NOT (small caps) · TAPE (hollow).
 *
 * Inline SVG rather than an <img>, so the <text> inherits the page's Inter
 * from next/font and nothing depends on the font being installed elsewhere.
 * Widths come from measured ratios, not estimates:
 *   TECH w800 @-0.045em = 2.599em | TAPE w700 = 2.401em | NOT w600 @+0.08em = 2.397em
 *
 * `binary` is deliberately opt-in. Below roughly 30px tall the 1s and 0s stop
 * being texture and become noise, so the nav uses the plain version and only
 * larger placements switch it on.
 */

// fixed, not random — a random fill would differ between server and client
// render and trip a hydration mismatch
const BITS = [
  '01000101101100101110010001101',
  '11010011010110100111000101101',
  '00110101110010110100011011001',
  '10101100011101001011010011100',
  '01101001011010110001110100110',
  '11001011101000110101100101011',
  '00101110100101100111010001101',
];

const S = 100;
const CAP = 0.72 * S;
const W_TECH = 2.599 * S;
const W_TAPE = 2.401 * S;
const NOT_F = 0.3;
const NS = S * NOT_F;
const W_NOT = 2.397 * NS;
const GAP = 0.26 * S;

const X_NOT = W_TECH + GAP;
const X_TAPE = X_NOT + W_NOT + GAP;
const TOTAL = X_TAPE + W_TAPE;

export default function Wordmark({ binary = false, className, title = 'Tech Not Tape' }) {
  const uid = binary ? 'wm-b' : 'wm-p';
  const rowH = CAP / BITS.length;

  return (
    <svg
      viewBox={`-2 -3 ${TOTAL + 6} ${CAP + 8}`}
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      {binary && (
        <defs>
          <clipPath id={uid}>
            <text
              x="0"
              y={CAP}
              fontSize={S}
              fontWeight="800"
              letterSpacing={-0.045 * S}
            >
              TECH
            </text>
          </clipPath>
        </defs>
      )}

      {binary ? (
        <>
          <g clipPath={`url(#${uid})`}>
            {BITS.map((row, i) => (
              <text
                key={i}
                x={-2}
                y={i * rowH + rowH * 0.82}
                fontSize={rowH * 0.92}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                letterSpacing={rowH * 0.1}
                fillOpacity="0.92"
              >
                {row}
              </text>
            ))}
          </g>
          <text
            x="0"
            y={CAP}
            fontSize={S}
            fontWeight="800"
            letterSpacing={-0.045 * S}
            fill="none"
            stroke="currentColor"
            strokeWidth={S * 0.017}
            strokeOpacity="0.9"
          >
            TECH
          </text>
        </>
      ) : (
        <text x="0" y={CAP} fontSize={S} fontWeight="800" letterSpacing={-0.045 * S}>
          TECH
        </text>
      )}

      <text
        x={X_NOT}
        y={0.36 * (S + NS)}
        fontSize={NS}
        fontWeight="600"
        letterSpacing={0.08 * NS}
        fillOpacity="0.85"
      >
        NOT
      </text>

      <text
        x={X_TAPE}
        y={CAP}
        fontSize={S}
        fontWeight="700"
        letterSpacing={-0.045 * S}
        fill="none"
        stroke="currentColor"
        strokeWidth={S * 0.021}
        strokeOpacity="0.85"
      >
        TAPE
      </text>
    </svg>
  );
}
