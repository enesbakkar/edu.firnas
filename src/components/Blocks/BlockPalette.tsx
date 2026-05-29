import { useDraggable } from '@dnd-kit/core';
import { BLOCK_DEFS, CATEGORY_META, CATEGORY_COLOR } from './blockDefinitions';
import { createT } from '../../i18n';
import type { BlockCategory, Language } from '../../types';

interface DraggableBlockItemProps {
  defId: string;
  label: string;
  color: string;
  paramSummary?: string;
}

function DraggableBlockItem({ defId, label, color, paramSummary }: DraggableBlockItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${defId}`,
    data: { type: 'palette', defId },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 10px',
        marginBottom: '6px',
        borderRadius: '6px',
        borderLeft: `4px solid ${color}`,
        background: isDragging ? 'rgba(0, 184, 212,0.15)' : 'var(--bg-card)',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
        boxShadow: isDragging ? `0 2px 12px ${color}44` : '0 1px 3px rgba(0,0,0,0.3)',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </div>
        {paramSummary && (
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {paramSummary}
          </div>
        )}
      </div>
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

interface Props {
  categoryKey: string | null;
  onClose: () => void;
  lang?: Language;
}

export function BlockPalette({ categoryKey, onClose, lang }: Props) {
  const t = lang ? createT(lang) : createT('TR');

  if (!categoryKey) return null;

  const meta = CATEGORY_META[categoryKey as BlockCategory];
  const color = CATEGORY_COLOR[categoryKey] ?? '#00b8d4';
  const blocks = BLOCK_DEFS.filter(d => d.category === categoryKey);

  return (
    <div
      style={{
        width: '220px',
        background: 'var(--bg-deep)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{meta?.icon}</span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: color,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {meta?.label ?? categoryKey}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '2px',
          }}
          title="Kapat"
        >
          ×
        </button>
      </div>

      {/* Block list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {t('drag.hint')}
        </div>
        {blocks.map(def => {
          const paramSummary = def.params
            ?.map(p => `${p.name}: ${p.defaultValue}${p.unit}`)
            .join(', ');
          return (
            <DraggableBlockItem
              key={def.id}
              defId={def.id}
              label={def.label}
              color={color}
              paramSummary={paramSummary}
            />
          );
        })}
      </div>
    </div>
  );
}
