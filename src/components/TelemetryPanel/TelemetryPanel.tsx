import type { TelemetryData, Language } from '../../types';
import { CameraFeed } from './CameraFeed';
import { MetricCard } from './MetricCard';
import { CompassWidget } from './CompassWidget';
import { createT } from '../../i18n';
import ficoModel from '../../assets/fico_model.png';

interface Props {
  data: TelemetryData;
  lang: Language;
}

export function TelemetryPanel({ data, lang }: Props) {
  const { altitude, velocity, battery, heading } = data;
  const t = createT(lang);

  // Estimate remaining minutes: assume 85% battery = 30 minutes flight
  const remainingMinutes = Math.round((battery / 100) * 30);

  // Altitude progress: 0-10m range → 0-100%
  const altProgress = Math.min(100, (altitude / 10) * 100);
  // Velocity progress: 0-12 m/s
  const velProgress = Math.min(100, (velocity / 12) * 100);
  // Battery is already 0-100
  const battProgress = battery;
  // Sensors always nominal
  const sensorProgress = 100;

  const battColor = battery > 50 ? '#50C878' : battery > 20 ? '#E8A33D' : '#C75D5D';

  return (
    <div
      className="app-telemetry"
      style={{
        width: '340px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px',
        overflowY: 'auto',
        background: 'rgba(18, 40, 64, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '2px solid var(--border)',
        boxShadow: '-3px 0 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Camera feed */}
      <CameraFeed />

      {/* Section label */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
          color: 'var(--accent)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {t('telemetry.data')}
      </div>

      {/* 2x2 metric grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}
      >
        <MetricCard
          title={t('altitude')}
          value={altitude.toFixed(1)}
          unit="m"
          progress={altProgress}
          progressColor="#4A90E2"
        />
        <MetricCard
          title={t('velocity')}
          value={velocity.toFixed(1)}
          unit="m/s"
          progress={velProgress}
          progressColor="#00b8d4"
        />
        <MetricCard
          title={t('battery')}
          value={battery.toFixed(0)}
          unit="%"
          progress={battProgress}
          progressColor={battColor}
          subtitle={`${t('remaining')}: ${remainingMinutes}${t('unit.min')}`}
        />
        <MetricCard
          title={t('sensors')}
          value="AKTİF"
          unit=""
          progress={sensorProgress}
          progressColor="#50C878"
          subtitle="LIDAR / IMU / GPS(9)"
        />
      </div>

      {/* Compass */}
      <CompassWidget heading={heading} />

      {/* FiCo drone model image */}
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 184, 212, 0.2)',
          flexShrink: 0,
          boxShadow: '0 4px 24px rgba(0,184,212,0.12)',
        }}
      >
        <img
          src={ficoModel}
          alt="FirnasKopter FiCo"
          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>

      {/* Status footer */}
      <div
        style={{
          background: 'rgba(0, 184, 212, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 184, 212, 0.15)',
          borderRadius: '16px',
          padding: '10px 14px',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          lineHeight: '1.9',
          fontFamily: "'Outfit', monospace",
        }}
      >
        <div style={{ color: '#50C878', fontWeight: 700, textShadow: '0 0 8px rgba(80,200,120,0.5)' }}>● LIDAR AKTİF</div>
        <div style={{ color: '#50C878', fontWeight: 700, textShadow: '0 0 8px rgba(80,200,120,0.5)' }}>● IMU STABİL</div>
        <div style={{ color: '#50C878', fontWeight: 700, textShadow: '0 0 8px rgba(80,200,120,0.5)' }}>● GPS SABİT (9)</div>
      </div>
    </div>
  );
}
