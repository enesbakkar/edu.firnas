interface Props {
  title: string;
  value: string;
  unit: string;
  progress: number;
  progressColor: string;
  subtitle?: string;
}

export function MetricCard({ title, value, unit, progress, progressColor, subtitle }: Props) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="metric-card">
      {/* Title */}
      <div style={{
        fontSize: '9px',
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--accent)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '6px',
        opacity: 0.8,
      }}>
        {title}
      </div>

      {/* Value + unit */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
        <span className="metric-value">{value}</span>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
        }}>
          {unit}
        </span>
      </div>

      {/* Progress bar — gradient like first_project .metric-fill */}
      <div className="progress-bar">
        <div style={{
          height: '100%',
          width: `${clampedProgress}%`,
          background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}cc 100%)`,
          borderRadius: '100px',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: `0 0 6px ${progressColor}80`,
        }} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{
          fontSize: '9px',
          fontFamily: "'Inter', sans-serif",
          color: 'var(--text-muted)',
          marginTop: '5px',
          letterSpacing: '0.04em',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
