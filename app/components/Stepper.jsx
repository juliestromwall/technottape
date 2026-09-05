export default function Stepper({ steps }) {
  return (
    <div className="stepper">
      <span className="stepper__rail" aria-hidden="true" />
      {steps.map((s) => (
        <div className="stp" key={s.title} style={{ '--accent': s.accent }}>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  );
}
