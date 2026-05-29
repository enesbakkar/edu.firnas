import { Settings, FileText, Play, Square } from 'lucide-react';
import { CATEGORY_META, CATEGORY_COLOR } from './Blocks/blockDefinitions';
import { createT } from '../i18n';
import type { BlockCategory, Language } from '../types';

const CATEGORIES: BlockCategory[] = ['events', 'motion', 'control', 'logic', 'sensors'];
const TRANSITION = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

interface Props {
  activeCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  lang: Language;
}

export function Sidebar({ activeCategory, onCategorySelect, isRunning, onRun, onStop, lang }: Props) {
  const t = createT(lang);

  return (
    <aside
      className="app-sidebar"
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'rgba(15, 46, 74, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Categories heading */}
      <div style={{
        padding: '14px 16px 10px',
        fontSize: '10px',
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--firnas-teal)',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(0, 184, 212, 0.05)',
      }}>
        {t('categories')}
      </div>

      {/* Category list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const color = CATEGORY_COLOR[cat];
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onCategorySelect(isActive ? null : cat)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 10px',
                border: isActive ? `1px solid rgba(0,184,212,0.2)` : '1px solid transparent',
                background: isActive ? 'rgba(0, 184, 212, 0.1)' : 'transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: `3px solid ${isActive ? color : 'transparent'}`,
                transition: TRANSITION,
                marginBottom: '2px',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0, 184, 212, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(0,184,212,0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{
                width: '10px', height: '10px',
                borderRadius: '4px',
                background: color,
                flexShrink: 0,
                boxShadow: isActive ? `0 0 6px ${color}60` : 'none',
              }} />
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{meta.icon}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                flex: 1,
              }}>
                {meta.label}
              </span>
              {isActive && (
                <span style={{ color, fontSize: '10px', filter: `drop-shadow(0 0 4px ${color})` }}>▶</span>
              )}
            </button>
          );
        })}

        {/* Modules (disabled) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 10px',
          opacity: 0.35,
          borderLeft: '3px solid transparent',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '4px', background: 'var(--text-secondary)', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', flexShrink: 0 }}>🧩</span>
          <span style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif", color: 'var(--text-secondary)', flex: 1 }}>
            {t('category.modules')}
          </span>
          <span style={{
            fontSize: '9px',
            color: 'var(--firnas-teal)',
            background: 'rgba(0,184,212,0.1)',
            border: '1px solid rgba(0,184,212,0.2)',
            padding: '1px 6px',
            borderRadius: '100px',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.05em',
          }}>
            {t('coming_soon')}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(0,184,212,0.1)', margin: '0 16px' }} />

      {/* Run/Stop buttons */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className={`btn-run${isRunning ? ' running' : ''}`}
          onClick={onRun}
          disabled={isRunning}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Play size={14} fill="currentColor" />
          <span>{t('btn.run')}</span>
        </button>

        <button
          className="btn-stop"
          onClick={onStop}
          disabled={!isRunning}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Square size={14} fill="currentColor" />
          <span>{t('btn.stop')}</span>
        </button>
      </div>

      {/* Bottom tools */}
      <div style={{
        borderTop: '1px solid rgba(0,184,212,0.08)',
        padding: '10px 14px',
        display: 'flex',
        gap: '8px',
      }}>
        {[
          { icon: <Settings size={13} />, label: t('settings') },
          { icon: <FileText size={13} />, label: t('docs') },
        ].map(({ icon, label }) => (
          <button
            key={label}
            title={label}
            style={{
              background: 'transparent',
              border: '1px solid transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: "'Inter', sans-serif",
              padding: '5px 8px',
              borderRadius: '8px',
              transition: TRANSITION,
              flex: 1,
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,184,212,0.07)';
              e.currentTarget.style.borderColor = 'rgba(0,184,212,0.15)';
              e.currentTarget.style.color = '#00b8d4';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
