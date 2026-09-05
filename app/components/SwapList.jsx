import { Arrow } from './Icons';

export default function SwapList({ rows }) {
  return (
    <div className="swap">
      {rows.map((r) => (
        <div className="swap__row" key={r.after}>
          <span className="swap__before">{r.before}</span>
          <span className="swap__arrow" aria-hidden="true">
            <Arrow size={22} />
          </span>
          <span className="swap__after">{r.after}</span>
        </div>
      ))}
    </div>
  );
}
