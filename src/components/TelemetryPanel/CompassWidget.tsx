interface Props {
  heading: number;
}

function headingToCardinal(deg: number): string {
  const h = ((deg % 360) + 360) % 360;
  const dirs = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  return dirs[Math.round(h / 45) % 8];
}

export function CompassWidget({ heading }: Props) {
  const normalizedHeading = ((heading % 360) + 360) % 360;
  const cardinal = headingToCardinal(normalizedHeading);

  // Compass needle rotation: needle points to heading
  const needleAngle = normalizedHeading;

  return (
    <div
      style={{
        background: '#0f2e4a',
        border: '1px solid #1a3d5c',
        borderRadius: '8px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Left: label + heading text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Yönelim
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'monospace',
            color: '#e0eaf2',
            lineHeight: 1,
          }}
        >
          {Math.round(normalizedHeading)}°
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#00b8d4',
            fontWeight: 700,
            marginTop: '3px',
          }}
        >
          {cardinal}
        </div>
      </div>

      {/* Right: SVG compass */}
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{ flexShrink: 0 }}
      >
        {/* Outer ring */}
        <circle cx="36" cy="36" r="34" stroke="#1a3d5c" strokeWidth="1.5" fill="#051421" />
        <circle cx="36" cy="36" r="30" stroke="#0f2e4a" strokeWidth="0.5" fill="none" />

        {/* Cardinal tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const isMajor = angle % 90 === 0;
          const r1 = isMajor ? 27 : 29;
          const r2 = 34;
          return (
            <line
              key={angle}
              x1={36 + r1 * Math.cos(rad)}
              y1={36 + r1 * Math.sin(rad)}
              x2={36 + r2 * Math.cos(rad)}
              y2={36 + r2 * Math.sin(rad)}
              stroke={isMajor ? '#00b8d4' : '#1a3d5c'}
              strokeWidth={isMajor ? 1.5 : 0.8}
            />
          );
        })}

        {/* Cardinal labels: K N, G S, D E, B W */}
        {[
          { label: 'K', angle: 0, color: '#C75D5D' },
          { label: 'G', angle: 180, color: '#94a3b8' },
          { label: 'D', angle: 90, color: '#94a3b8' },
          { label: 'B', angle: 270, color: '#94a3b8' },
        ].map(({ label, angle, color }) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const r = 21;
          return (
            <text
              key={label}
              x={36 + r * Math.cos(rad)}
              y={36 + r * Math.sin(rad) + 4}
              textAnchor="middle"
              fill={color}
              fontSize="8"
              fontWeight="700"
              fontFamily="monospace"
            >
              {label}
            </text>
          );
        })}

        {/* Rotating needle group */}
        <g transform={`rotate(${needleAngle}, 36, 36)`}>
          {/* North pointer (teal) */}
          <polygon
            points="36,8 33,36 39,36"
            fill="#00b8d4"
          />
          {/* South pointer (dark) */}
          <polygon
            points="36,64 33,36 39,36"
            fill="#1a3d5c"
          />
        </g>

        {/* Center dot */}
        <circle cx="36" cy="36" r="3" fill="#051421" stroke="#00b8d4" strokeWidth="1" />
      </svg>
    </div>
  );
}
