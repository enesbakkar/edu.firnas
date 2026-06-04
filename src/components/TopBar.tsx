import { Code2, Radio, ListTodo, Battery, Wifi, Camera, Sun, Moon } from 'lucide-react';
import { FirnasLogo } from './FirnasLogo';
import { UserBadge } from './LoginPage';
import { createT } from '../i18n';
import type { AppTab, Language } from '../types';
import type { GoogleUser } from '../hooks/useGoogleAuth';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  connected: boolean;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  user?: GoogleUser | null;
  onSignOut?: () => void;
}

const LANGS: Language[] = ['TR', 'EN', 'AR'];

export function TopBar({ activeTab, onTabChange, lang, onLangChange, connected, theme, onThemeToggle, user, onSignOut }: Props) {
  const t = createT(lang);

  const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'logic',     label: t('tab.logic'),     icon: <Code2    size={14} /> },
    { id: 'telemetry', label: t('tab.telemetry'), icon: <Radio    size={14} /> },
    { id: 'tasks',     label: t('tab.tasks'),     icon: <ListTodo size={14} /> },
  ];

  return (
    <header className="app-header">
      {/* Sol: Logo + ayraç + başlık */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <FirnasLogo subtitle="FiCo Studio" />
        <div style={{
          width: '1px', height: '32px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,184,212,0.45), transparent)',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontSize: '14px', fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            color: 'var(--text-1)', letterSpacing: '0.02em',
          }}>
            {t('app.title')}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: 'var(--text-2)', letterSpacing: '0.05em',
            fontFamily: "'Inter', sans-serif",
          }}>
            {t('app.subtitle')}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Orta: Tab butonları */}
      <div style={{
        display: 'flex', gap: '3px',
        background: 'rgba(0,184,212,0.08)',
        padding: '4px', borderRadius: '12px',
        border: '1.5px solid rgba(0,184,212,0.2)',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`btn-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Sağ: Kontroller */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Tema toggle */}
        <button
          onClick={onThemeToggle}
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          style={{
            background: 'rgba(0,184,212,0.08)',
            border: '1.5px solid rgba(0,184,212,0.2)',
            borderRadius: '9px',
            color: 'var(--text-2)',
            cursor: 'pointer',
            padding: '6px 9px',
            display: 'flex', alignItems: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,184,212,0.2)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-2)';
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Dil seçici */}
        <div style={{
          display: 'flex', gap: '2px',
          background: 'rgba(0,184,212,0.08)',
          padding: '3px', borderRadius: '10px',
          border: '1.5px solid rgba(0,184,212,0.2)',
        }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => onLangChange(l)}
              style={{
                padding: '4px 10px',
                borderRadius: '7px', border: 'none',
                cursor: 'pointer',
                fontSize: '12px', fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.04em',
                background: lang === l ? 'var(--accent)' : 'transparent',
                color: lang === l ? '#071a2e' : 'var(--text-2)',
                transition: 'all 0.2s ease',
                boxShadow: lang === l ? '0 0 10px rgba(0,184,212,0.4)' : 'none',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Bağlantı durumu */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: connected ? 'rgba(0,184,212,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1.5px solid ${connected ? 'rgba(0,184,212,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: '100px', padding: '5px 13px',
        }}>
          <span
            className={connected ? 'blink-dot' : ''}
            style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: connected ? '#00d4f0' : '#ef4444',
              display: 'inline-block', flexShrink: 0,
              boxShadow: connected ? '0 0 8px #00d4f0' : 'none',
            }}
          />
          <span style={{
            fontSize: '12px', fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            color: connected ? 'var(--text-2)' : '#fca5a5',
            letterSpacing: '0.03em',
          }}>
            {connected ? t('connected') : t('disconnected')}
          </span>
        </div>

        {/* İkon grubu */}
        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-3)', alignItems: 'center' }}>
          <Battery size={15} />
          <Wifi size={15} />
          <Camera size={15} />
        </div>

        {/* Kullanıcı rozeti */}
        {user && onSignOut && (
          <>
            <div style={{
              width: '1px', height: '24px',
              background: 'rgba(0,184,212,0.2)',
            }} />
            <UserBadge user={user} onSignOut={onSignOut} />
          </>
        )}
      </div>
    </header>
  );
}
