import { useEffect, useRef } from 'react';
import type { GoogleUser } from '../hooks/useGoogleAuth';

interface Props {
  onCredential: (credential: string) => void;
}

const FIRNAS_NAVY  = '#0f2e4a';
const FIRNAS_TEAL  = '#00b8d4';
const FIRNAS_TEAL2 = '#00d4f0';

export function LoginPage({ onCredential }: Props) {
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId || !btnRef.current) return;

    const tryRender = () => {
      const g = (window as unknown as {
        google?: {
          accounts: {
            id: {
              initialize: (cfg: object) => void;
              renderButton: (el: HTMLElement, cfg: object) => void;
            };
          };
        };
      }).google;
      if (!g || !btnRef.current) return;
      g.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: { credential: string }) => onCredential(resp.credential),
        cancel_on_tap_outside: false,
      });
      g.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 280,
      });
    };

    if ((window as unknown as { google?: unknown }).google) {
      tryRender();
    } else {
      const script = document.getElementById('gsi-script');
      script?.addEventListener('load', tryRender);
      return () => script?.removeEventListener('load', tryRender);
    }
  }, [onCredential]);

  return (
    <div style={{
      minHeight: '100vh',
      background: FIRNAS_NAVY,
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0,184,212,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0,100,160,0.2) 0%, transparent 60%),
        radial-gradient(rgba(0,184,212,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 28px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animasyonlu arka plan lekeleri */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        filter: 'blur(80px)', opacity: 0.4,
      }}>
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw',
          top: '-15%', left: '-10%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,184,212,0.5) 0%, transparent 60%)',
          animation: 'blob1 22s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '40vw', height: '40vw',
          bottom: '-10%', right: '-5%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,130,190,0.4) 0%, transparent 60%)',
          animation: 'blob2 28s ease-in-out infinite',
        }} />
      </div>

      {/* Login kartı */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(30, 64, 96, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(0,184,212,0.25)',
        borderRadius: '24px',
        padding: '48px 44px',
        width: '380px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,184,212,0.08)',
        textAlign: 'center',
        animation: 'pop-in 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Logo / Marka */}
        <div style={{ marginBottom: '32px' }}>
          {/* Firnas amblem (hexagon + uçak ikonu) */}
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 16px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${FIRNAS_TEAL} 0%, ${FIRNAS_TEAL2} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px',
            boxShadow: `0 8px 32px rgba(0,184,212,0.4)`,
          }}>
            ✈️
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: '26px', fontWeight: 800,
            color: '#e8f6fc',
            letterSpacing: '-0.01em',
          }}>
            FiCo Studio
          </h1>
          <p style={{
            margin: '6px 0 0',
            fontSize: '13px',
            color: 'rgba(157,204,224,0.8)',
            fontWeight: 500,
          }}>
            Firnas Technologies · Drone Programlama
          </p>
        </div>

        {/* Ayraç */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(0,184,212,0.35), transparent)',
          marginBottom: '28px',
        }} />

        {/* Giriş metni */}
        <p style={{
          margin: '0 0 24px',
          fontSize: '14px',
          color: 'rgba(157,204,224,0.9)',
          lineHeight: 1.6,
        }}>
          Platforma erişmek için kurumsal<br />
          Google hesabınla giriş yapın.
        </p>

        {/* Google Sign-In butonu */}
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }}>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div ref={btnRef} />
          ) : (
            /* Client ID yoksa dev uyarısı */
            <div style={{
              padding: '10px 20px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '12px',
              lineHeight: 1.5,
              textAlign: 'left',
            }}>
              ⚠️ <strong>VITE_GOOGLE_CLIENT_ID</strong> tanımlı değil.<br />
              .env dosyasına ekleyin.
            </div>
          )}
        </div>

        {/* Alt not */}
        <p style={{
          margin: '28px 0 0',
          fontSize: '11px',
          color: 'rgba(106,170,197,0.6)',
          lineHeight: 1.5,
        }}>
          Yalnızca yetkili kullanıcılar erişebilir.<br />
          © 2026 Firnas Technologies
        </p>
      </div>
    </div>
  );
}

/* Hâlihazırda giriş yapmış kullanıcı için üst bar rozeti */
export function UserBadge({ user, onSignOut }: { user: GoogleUser; onSignOut: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={user.picture}
        alt={user.name}
        style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid rgba(0,184,212,0.5)',
        }}
      />
      <span style={{ fontSize: '12px', color: 'rgba(232,246,252,0.8)', fontWeight: 600 }}>
        {user.name.split(' ')[0]}
      </span>
      <button
        onClick={onSignOut}
        style={{
          background: 'transparent', border: 'none',
          color: 'rgba(106,170,197,0.7)', cursor: 'pointer',
          fontSize: '11px', padding: '2px 6px', borderRadius: '6px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(106,170,197,0.7)'; e.currentTarget.style.background = 'transparent'; }}
        title="Çıkış Yap"
      >
        Çıkış
      </button>
    </div>
  );
}

/* ─── Onay Bekleniyor Ekranı ──────────────────────────────────────────── */
export function PendingPage({ user, onSignOut }: { user: GoogleUser; onSignOut: () => void }) {
  return (
    <div style={{
      minHeight: '100vh', background: FIRNAS_NAVY,
      backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0,184,212,0.15) 0%, transparent 60%),
        radial-gradient(rgba(0,184,212,0.04) 1px, transparent 1px)`,
      backgroundSize: '100% 100%, 28px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        background: 'rgba(30, 64, 96, 0.75)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(0,184,212,0.25)',
        borderRadius: '24px', padding: '48px 44px', width: '380px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'pop-in 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <img src={user.picture} alt={user.name} style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
          display: 'block', border: '3px solid rgba(0,184,212,0.4)',
        }} />
        <h1 style={{ margin: '0 0 6px', fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#e8f6fc' }}>
          Merhaba, {user.name.split(' ')[0]}!
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: 'rgba(157,204,224,0.7)' }}>{user.email}</p>
        <div style={{
          width: 56, height: 56, margin: '0 auto 24px', borderRadius: '50%',
          border: '3px solid rgba(0,184,212,0.2)',
          borderTop: `3px solid ${FIRNAS_TEAL}`,
          animation: 'spin 1.2s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24', marginBottom: 6 }}>⏳ Erişim Talebiniz Alındı</div>
          <div style={{ fontSize: 13, color: 'rgba(251,191,36,0.75)', lineHeight: 1.5 }}>
            Yönetici onayı bekleniyor.<br />Onaylandığında sayfayı yenileyin.
          </div>
        </div>
        <button onClick={onSignOut} style={{
          background: 'transparent', border: '1px solid rgba(157,204,224,0.2)',
          borderRadius: '10px', padding: '9px 22px', color: 'rgba(157,204,224,0.6)',
          cursor: 'pointer', fontSize: 12, transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(157,204,224,0.2)'; e.currentTarget.style.color = 'rgba(157,204,224,0.6)'; }}
        >Farklı hesapla giriş yap</button>
      </div>
    </div>
  );
}

/* ─── Erişim Reddedildi Ekranı ────────────────────────────────────────── */
export function RejectedPage({ user, onSignOut }: { user: GoogleUser; onSignOut: () => void }) {
  return (
    <div style={{
      minHeight: '100vh', background: FIRNAS_NAVY,
      backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 10%, rgba(239,68,68,0.08) 0%, transparent 60%),
        radial-gradient(rgba(0,184,212,0.04) 1px, transparent 1px)`,
      backgroundSize: '100% 100%, 28px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        background: 'rgba(30, 64, 96, 0.75)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(239,68,68,0.2)',
        borderRadius: '24px', padding: '48px 44px', width: '380px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'pop-in 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚫</div>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#e8f6fc' }}>
          Erişim Reddedildi
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: 'rgba(157,204,224,0.6)' }}>{user.email}</p>
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            Bu hesabın platforma erişim izni yok.<br />
            Yetkili hesabınızla giriş yapın veya<br />yöneticiyle iletişime geçin.
          </div>
        </div>
        <button onClick={onSignOut} style={{
          background: FIRNAS_TEAL, border: 'none', borderRadius: '12px',
          padding: '11px 28px', color: '#071a2e', cursor: 'pointer',
          fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = FIRNAS_TEAL2; }}
          onMouseLeave={e => { e.currentTarget.style.background = FIRNAS_TEAL; }}
        >Farklı Hesapla Giriş Yap</button>
      </div>
    </div>
  );
}
