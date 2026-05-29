import { Code2, Radio, ListTodo, Battery, Wifi, Camera, Sun, Moon } from 'lucide-react';
import { FirnasLogo } from './FirnasLogo';
import { createT } from '../i18n';
import type { AppTab, Language } from '../types';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  connected: boolean;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const LANGS: Language[] = ['TR', 'EN', 'AR'];

const TRANSITION = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

export function TopBar({ activeTab, onTabChange, lang, onLangChange, connected, theme, onThemeToggle }: Props) {
  const t = createT(lang);

  const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'logic',     label: t('tab.logic'),     icon: <Code2    size={14} /> },
    { id: 'telemetry', label: t('tab.telemetry'), icon: <Radio    size={14} /> },
    { id: 'tasks',     label: t('tab.tasks'),     icon: <ListTodo size={14} /> },
  ];

  return (
    <header
      className="app-header"
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        background: 'rgba(15, 46, 74, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Logo + divider + subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <FirnasLogo subtitle="FiCo Studio" />
        <div style={{ width: '1px', height: '32px', background: 'rgba(0, 184, 212, 0.2)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            color: 'var(--text-primary)',
            letterSpacing: '0.03em',
          }}>
            {t('app.title')}
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.06em',
            fontFamily: "'Inter', sans-serif",
          }}>
            {t('app.subtitle')}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Center: Tab buttons */}
      <div style={{
        display: 'flex',
        gap: '3px',
        background: 'rgba(255, 255, 255, 0.07)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
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

      {/* Right: controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px 9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: TRANSITION,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,184,212,0.4)';
            (e.currentTarget as HTMLButtonElement).style.color = '#00b8d4';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,184,212,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Language selector */}
        <div style={{
          display: 'flex',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.07)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => onLangChange(l)}
              style={{
                padding: '3px 9px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.05em',
                background: lang === l ? '#00b8d4' : 'transparent',
                color: lang === l ? 'white' : 'var(--text-secondary)',
                transition: TRANSITION,
                boxShadow: lang === l ? '0 0 8px rgba(0,184,212,0.35)' : 'none',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Connection badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: connected ? 'rgba(0, 184, 212, 0.1)' : 'rgba(199,93,93,0.1)',
          border: `1px solid ${connected ? 'rgba(0,184,212,0.25)' : 'rgba(199,93,93,0.25)'}`,
          borderRadius: '100px',
          padding: '4px 12px',
        }}>
          <span
            className={connected ? 'blink-dot' : ''}
            style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: connected ? '#00b8d4' : '#C75D5D',
              display: 'inline-block',
              flexShrink: 0,
              boxShadow: connected ? '0 0 6px #00b8d4' : 'none',
            }}
          />
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.04em',
            color: connected ? '#00b8d4' : '#C75D5D',
          }}>
            {connected ? t('connected') : t('disconnected')}
          </span>
        </div>

        {/* Icon buttons */}
        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)', alignItems: 'center' }}>
          <Battery size={15} />
          <Wifi size={15} />
          <Camera size={15} />
        </div>
      </div>
    </header>
  );
}
