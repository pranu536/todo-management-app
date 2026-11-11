export default function Spinner({ fullPage = false, label = 'Loading...' }) {
  return (
    <div
      className={fullPage ? 'spinner-fullpage' : 'spinner-inline'}
      role="status"
      aria-live="polite"
    >
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

