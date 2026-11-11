export default function StatCard({ label, value, variant = 'default', icon: Icon }) {
  return (
    <div className={`card stat-card stat-card--${variant}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {Icon && (
          <span className="stat-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
      </div>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
