import { useState, useEffect } from 'react';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function CameraFeed() {
  const [elapsed, setElapsed] = useState(2535); // start at 00:42:15

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/9',
        background: '#050D16',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1a3d5c',
        flexShrink: 0,
      }}
    >
      {/* Perspective grid SVG */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 320 180"
        preserveAspectRatio="none"
      >
        {/* Horizon grid lines */}
        {[30, 60, 90, 120, 150].map(y => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#0f2e4a" strokeWidth="0.5" />
        ))}
        {/* Vertical perspective lines */}
        {[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="0"
            x2="160"
            y2="180"
            stroke="#0f2e4a"
            strokeWidth="0.5"
          />
        ))}
        {/* Horizon line */}
        <line x1="0" y1="90" x2="320" y2="90" stroke="#00b8d444" strokeWidth="0.8" />
        {/* Crosshair */}
        <circle cx="160" cy="90" r="18" stroke="#00b8d4" strokeWidth="0.8" fill="none" />
        <circle cx="160" cy="90" r="3" stroke="#00b8d4" strokeWidth="0.8" fill="none" />
        <line x1="137" y1="90" x2="153" y2="90" stroke="#00b8d4" strokeWidth="0.8" />
        <line x1="167" y1="90" x2="183" y2="90" stroke="#00b8d4" strokeWidth="0.8" />
        <line x1="160" y1="67" x2="160" y2="83" stroke="#00b8d4" strokeWidth="0.8" />
        <line x1="160" y1="97" x2="160" y2="113" stroke="#00b8d4" strokeWidth="0.8" />
        {/* Altitude ladder marks */}
        {[-2, -1, 0, 1, 2].map(tick => (
          <g key={tick} transform={`translate(280, ${90 - tick * 15})`}>
            <line x1="0" y1="0" x2="8" y2="0" stroke="#00b8d4" strokeWidth="0.6" />
            <text x="10" y="4" fill="#00b8d4" fontSize="5" fontFamily="monospace">
              {tick * 2}
            </text>
          </g>
        ))}
        {/* Speed ladder */}
        {[-2, -1, 0, 1, 2].map(tick => (
          <g key={tick} transform={`translate(32, ${90 - tick * 15})`}>
            <line x1="0" y1="0" x2="-8" y2="0" stroke="#00b8d4" strokeWidth="0.6" />
            <text x="-22" y="4" fill="#00b8d4" fontSize="5" fontFamily="monospace">
              {tick * 2}
            </text>
          </g>
        ))}
      </svg>

      {/* Top-left label */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          color: '#00b8d4',
          fontSize: '9px',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}
      >
        CAM_01 // CANLI YAYIN
      </div>

      {/* Top-right */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: '#94a3b8',
          fontSize: '8px',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
        }}
      >
        1080p · 30fps
      </div>

      {/* Bottom-left GPS */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          color: '#94a3b8',
          fontSize: '8px',
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
        }}
      >
        41.0082° K, 28.9784° D
      </div>

      {/* Bottom-right recording */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#e0eaf2',
          fontSize: '8px',
          fontFamily: 'monospace',
        }}
      >
        <span className="blink-dot" style={{ color: '#C75D5D', fontSize: '10px' }}>●</span>
        <span>KAYIT {formatTime(elapsed)}</span>
      </div>

      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
