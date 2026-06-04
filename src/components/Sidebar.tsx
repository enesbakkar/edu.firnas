import { Settings, FileText, Play, Square } from 'lucide-react';
import { CATEGORY_META, CATEGORY_COLOR } from './Blocks/blockDefinitions';
import { createT } from '../i18n';
import type { BlockCategory, Language } from '../types';

const CATEGORIES: BlockCategory[] = ['events', 'motion', 'control', 'logic', 'sensors'];

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
    <aside className="app-sidebar">

      {/* Başlık */}
      <div style={{
        padding: '13px 18px 11px',
        fontSize: '11px', fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--accent)',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        borderBottom: '1.5px solid var(--border)',
        background: 'rgba(0,184,212,0.06)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)',
          display: 'inline-block', flexShrink: 0,
        }} />
        {t('categories')}
      </div>

      {/* Kategori listesi */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const color = CATEGORY_COLOR[cat];
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onCategorySelect(isActive ? null : cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 12px',
                border: isActive
                  ? `1.5px solid ${color}60`
                  : '1.5px solid transparent',
                background: isActive ? `${color}18` : 'transparent',
                borderRadius: '12px',
                cursor: 'pointer', textAlign: 'left',
                borderLeft: `4px solid ${isActive ? color : 'transparent'}`,
                transition: 'all 0.2s ease',
                marginBottom: '2px',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0,184,212,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(0,184,212,0.2)';
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
                width: '10px', height: '10px', borderRadius: '4px',
                background: color, flexShrink: 0,
                boxShadow: isActive ? `0 0 8px ${color}90` : 'none',
              }} />
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{meta.icon}</span>
              <span style={{
                fontSize: '14px', fontWeight: isActive ? 800 : 600,
                fontFamily: "'Inter', sans-serif",
                color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                flex: 1,
              }}>
                {meta.label}
              </span>
              {isActive && (
                <span style={{ color, fontSize: '11px', filter: `drop-shadow(0 0 4px ${color})` }}>▶</span>
              )}
            </button>
          );
        })}

        {/* Modüller (devre dışı) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', opacity: 0.35,
          borderLeft: '4px solid transparent',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '4px', background: 'var(--text-3)', flexShrink: 0 }} />
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🧩</span>
          <span style={{ fontSize: '14px', color: 'var(--text-3)', flex: 1 }}>
            {t('category.modules')}
          </span>
          <span style={{
            fontSize: '10px', color: 'var(--accent)',
            background: 'rgba(0,184,212,0.1)',
            border: '1px solid rgba(0,184,212,0.2)',
            padding: '1px 6px', borderRadius: '100px',
            fontFamily: "'Outfit', sans-serif",
          }}>
            {t('coming_soon')}
          </span>
        </div>
      </div>

      {/* Ayraç */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(0,184,212,0.25), transparent)',
        margin: '0 16px',
      }} />

      {/* Çalıştır / Durdur */}
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

      {/* Alt araçlar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 12px',
        display: 'flex', gap: '6px',
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
              color: 'var(--text-3)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px',
              padding: '5px 8px', borderRadius: '8px',
              flex: 1, justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,184,212,0.08)';
              e.currentTarget.style.borderColor = 'rgba(0,184,212,0.2)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-3)';
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
