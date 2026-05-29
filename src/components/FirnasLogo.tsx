import firnasLogo from '../assets/firnas_logo.svg';

interface Props {
  subtitle?: string;
}

export function FirnasLogo({ subtitle = 'FiCo Studio' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src={firnasLogo} width={38} height={38} alt="Firnas Logo" style={{ borderRadius: '10px', flexShrink: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Outfit', 'Segoe UI', sans-serif",
          fontWeight: 700,
          fontSize: '10px',
          color: '#94a3b8',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          FİRNAS TEKNOLOJİ
        </span>
        <span style={{
          fontFamily: "'Outfit', 'Segoe UI', sans-serif",
          fontWeight: 800,
          fontSize: '16px',
          color: '#e0eaf2',
          letterSpacing: '-0.01em',
          marginTop: '3px',
        }}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}
