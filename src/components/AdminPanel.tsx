import { useState, useEffect } from 'react';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, serverTimestamp, orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/* ─── Tipler ──────────────────────────────────────────────────────────── */
interface UserRecord {
  email: string;
  name: string;
  picture: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: { seconds: number } | null;
}

const FIRNAS_TEAL = '#00b8d4';

/* ─── Kart bileşeni ───────────────────────────────────────────────────── */
function UserCard({ user, onApprove, onReject }: {
  user: UserRecord;
  onApprove: () => void;
  onReject: () => void;
}) {
  const date = user.requestedAt
    ? new Date(user.requestedAt.seconds * 1000).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '—';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: 'rgba(35, 72, 104, 0.6)',
      border: '1px solid rgba(0,184,212,0.18)',
      borderRadius: '14px', padding: '14px 18px',
      marginBottom: '10px',
      transition: 'all 0.2s',
    }}>
      <img src={user.picture} alt={user.name}
        style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(0,184,212,0.4)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: '#e8f6fc', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(157,204,224,0.7)', marginTop: 2 }}>{user.email}</div>
        <div style={{ fontSize: 11, color: 'rgba(106,170,197,0.5)', marginTop: 2 }}>{date}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onApprove} style={{
          padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
          background: 'rgba(0,184,212,0.2)', color: '#00d4f0', fontWeight: 700, fontSize: 12,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = FIRNAS_TEAL; e.currentTarget.style.color = '#071a2e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,184,212,0.2)'; e.currentTarget.style.color = '#00d4f0'; }}
        >✓ Onayla</button>
        <button onClick={onReject} style={{
          padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
          background: 'rgba(239,68,68,0.12)', color: '#f87171', fontWeight: 700, fontSize: 12,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
        >✕ Reddet</button>
      </div>
    </div>
  );
}

function ApprovedCard({ user, onRevoke }: { user: UserRecord; onRevoke: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'rgba(0,184,212,0.06)',
      border: '1px solid rgba(0,184,212,0.15)',
      borderRadius: '12px', padding: '10px 14px',
      marginBottom: '8px',
    }}>
      <img src={user.picture} alt={user.name}
        style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(0,184,212,0.4)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: '#e8f6fc', fontSize: 13 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(157,204,224,0.6)' }}>{user.email}</div>
      </div>
      <span style={{
        fontSize: 10, padding: '2px 8px', borderRadius: '100px',
        background: 'rgba(0,184,212,0.15)', color: '#00d4f0', fontWeight: 700,
        letterSpacing: '0.05em', flexShrink: 0,
      }}>AKTİF</span>
      <button onClick={onRevoke} style={{
        background: 'transparent', border: 'none', color: 'rgba(239,68,68,0.6)',
        cursor: 'pointer', fontSize: 12, padding: '2px 8px', borderRadius: '6px',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; e.currentTarget.style.background = 'transparent'; }}
        title="Erişimi Kaldır"
      >İptal</button>
    </div>
  );
}

/* ─── Ana Admin Paneli ────────────────────────────────────────────────── */
export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [pendingUsers, setPendingUsers]   = useState<UserRecord[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserRecord[]>([]);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  // Gerçek zamanlı dinleyiciler
  useEffect(() => {
    const qPending = query(
      collection(db, 'users'),
      where('status', '==', 'pending'),
      orderBy('requestedAt', 'desc'),
    );
    const qApproved = query(
      collection(db, 'users'),
      where('status', '==', 'approved'),
      orderBy('requestedAt', 'desc'),
    );

    const unsubP = onSnapshot(qPending,  snap => {
      setPendingUsers(snap.docs.map(d => d.data() as UserRecord));
    });
    const unsubA = onSnapshot(qApproved, snap => {
      setApprovedUsers(snap.docs.map(d => d.data() as UserRecord));
    });

    return () => { unsubP(); unsubA(); };
  }, []);

  const setStatus = async (email: string, status: 'approved' | 'rejected') => {
    await updateDoc(doc(db, 'users', email), { status, reviewedAt: serverTimestamp() });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,24,38,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '560px', maxHeight: '85vh',
        background: 'rgba(27, 58, 85, 0.97)',
        border: '1.5px solid rgba(0,184,212,0.28)',
        borderRadius: '22px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(0,184,212,0.2)',
          background: 'rgba(15, 46, 74, 0.6)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#e8f6fc', fontFamily: "'Outfit', sans-serif" }}>
              🛡️ Admin Paneli
            </div>
            <div style={{ fontSize: 12, color: 'rgba(157,204,224,0.6)', marginTop: 3 }}>
              Erişim talepleri ve aktif kullanıcılar
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'rgba(157,204,224,0.6)',
            cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '2px 6px', borderRadius: '8px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8f6fc'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(157,204,224,0.6)'; e.currentTarget.style.background = 'transparent'; }}
          >×</button>
        </div>

        {/* Tab seçici */}
        <div style={{
          display: 'flex', gap: 4,
          padding: '12px 24px 0',
          flexShrink: 0,
        }}>
          {([
            { id: 'pending',  label: 'Bekleyenler', count: pendingUsers.length },
            { id: 'approved', label: 'Aktif Kullanıcılar', count: approvedUsers.length },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 18px', border: 'none', borderRadius: '10px 10px 0 0',
                cursor: 'pointer', fontWeight: 700, fontSize: 13,
                fontFamily: "'Outfit', sans-serif",
                background: tab === t.id ? 'rgba(0,184,212,0.15)' : 'transparent',
                color: tab === t.id ? FIRNAS_TEAL : 'rgba(157,204,224,0.5)',
                borderBottom: tab === t.id ? `2px solid ${FIRNAS_TEAL}` : '2px solid transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  background: tab === t.id ? FIRNAS_TEAL : 'rgba(157,204,224,0.2)',
                  color: tab === t.id ? '#071a2e' : 'rgba(157,204,224,0.7)',
                  borderRadius: '100px', fontSize: 11, fontWeight: 800,
                  padding: '1px 7px',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 20px' }}>
          {tab === 'pending' && (
            <>
              {pendingUsers.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  color: 'rgba(157,204,224,0.4)', fontSize: 14,
                }}>
                  ✅ Bekleyen talep yok
                </div>
              ) : (
                pendingUsers.map(u => (
                  <UserCard
                    key={u.email} user={u}
                    onApprove={() => setStatus(u.email, 'approved')}
                    onReject={() => setStatus(u.email, 'rejected')}
                  />
                ))
              )}
            </>
          )}

          {tab === 'approved' && (
            <>
              {approvedUsers.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  color: 'rgba(157,204,224,0.4)', fontSize: 14,
                }}>
                  Henüz onaylanan kullanıcı yok
                </div>
              ) : (
                approvedUsers.map(u => (
                  <ApprovedCard
                    key={u.email} user={u}
                    onRevoke={() => setStatus(u.email, 'rejected')}
                  />
                ))
              )}
            </>
          )}
        </div>

        {/* Footer istatistik */}
        <div style={{
          borderTop: '1px solid rgba(0,184,212,0.15)',
          padding: '12px 24px',
          display: 'flex', gap: '20px',
          background: 'rgba(15,46,74,0.4)',
          flexShrink: 0,
        }}>
          {[
            { label: 'Bekliyor', value: pendingUsers.length, color: '#f59e0b' },
            { label: 'Aktif',    value: approvedUsers.length, color: FIRNAS_TEAL },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'Outfit', sans-serif" }}>
                {s.value}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(157,204,224,0.5)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Yardımcı: Admin butonu için kullan ─────────────────────────────── */
export const ADMIN_EMAILS: string[] = [
  // Buraya admin e-posta(ları)nı yaz
  import.meta.env.VITE_ADMIN_EMAIL ?? '',
].filter(Boolean);
