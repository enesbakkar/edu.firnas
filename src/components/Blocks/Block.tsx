import { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BlockInstance, BlockDef } from '../../types';
import { CATEGORY_COLOR, BLOCK_DEFS } from './blockDefinitions';

interface ContextMenuState { x: number; y: number; }

interface Props {
  instance: BlockInstance;
  def: BlockDef;
  depth: number;
  activeBlockId: string | null;
  onUpdateParam: (blockId: string, paramName: string, value: number) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, defId: string, defaultParams: { name: string; value: number }[]) => void;
}

/* ─── Scratch blok geometrisi ─────────────────────────────────────────────
   bump  = alt çıkıntı (connector plug)   w=20 h=6
   notch = üst girinti (connector socket) aynı boyut
   ─────────────────────────────────────────────────────────────────────── */
const BUMP_W = 20;
const BUMP_H = 6;
const BUMP_X = 16; // sol kenardan uzaklık
const R = 6;       // köşe yarıçapı

/**
 * Scratch tarzı SVG blok arka planı oluşturur.
 * @param w - genişlik
 * @param h - yükseklik (gövde)
 * @param isHat - üst hat (olaylar) biçimi
 * @param hasBottom - alt connector var mı
 */
function buildBlockPath(
  w: number, h: number,
  isHat: boolean,
  hasBottom: boolean,
): string {
  const bx = BUMP_X;
  const bx2 = bx + BUMP_W;

  if (isHat) {
    // Hat: üst kısım oval yay, alt connector
    const totalH = h + BUMP_H;
    return [
      `M ${R} 0`,
      `Q 0 0 0 ${R}`,
      `L 0 ${h - R}`,
      // alt notch (giriş yuvası)
      `L ${bx} ${h - R}`,
      `L ${bx} ${h}`,
      `L ${bx2} ${h}`,
      `L ${bx2} ${h - R}`,
      `L ${w - R} ${h - R}`,
      `Q ${w} ${h - R} ${w} ${h}`,
      // alt bump
      `L ${w} ${totalH - R}`,
      `Q ${w} ${totalH} ${w - R} ${totalH}`,
      `L ${bx2} ${totalH}`,
      `L ${bx2} ${totalH - BUMP_H}`,
      `L ${bx} ${totalH - BUMP_H}`,
      `L ${bx} ${totalH}`,
      `L ${R} ${totalH}`,
      `Q 0 ${totalH} 0 ${totalH - R}`,
      `L 0 ${R}`,
      `Q 0 0 ${R} 0`,
      `Z`,
    ].join(' ');
  }

  // Normal blok: üst notch + gövde + alt bump (isteğe bağlı)
  const totalH = hasBottom ? h + BUMP_H : h;
  const path = [
    `M 0 0`,
    // üst notch
    `L ${bx} 0`,
    `L ${bx} ${BUMP_H}`,
    `L ${bx2} ${BUMP_H}`,
    `L ${bx2} 0`,
    `L ${w - R} 0`,
    `Q ${w} 0 ${w} ${R}`,
    `L ${w} ${h - R}`,
    `Q ${w} ${h} ${w - R} ${h}`,
  ];

  if (hasBottom) {
    // alt bump çıkıntısı
    path.push(
      `L ${bx2} ${h}`,
      `L ${bx2} ${h + BUMP_H}`,
      `L ${bx} ${h + BUMP_H}`,
      `L ${bx} ${h}`,
      `L ${R} ${h}`,
      `Q 0 ${h} 0 ${h - R}`,
    );
  } else {
    path.push(
      `L ${R} ${h}`,
      `Q 0 ${h} 0 ${h - R}`,
    );
  }

  path.push(`L 0 0`, `Z`);
  return path.join(' ');
}

export function Block({
  instance, def, depth,
  activeBlockId, onUpdateParam, onDelete, onAddChild,
}: Props) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [editingParam, setEditingParam] = useState<string | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `instance-${instance.id}` });

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const color      = CATEGORY_COLOR[def.category] ?? '#00b8d4';
  const colorDark  = `${color}cc`;
  const colorLight = `${color}22`;
  const isActive   = activeBlockId === instance.id;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDelete = useCallback(() => {
    setContextMenu(null); onDelete(instance.id);
  }, [instance.id, onDelete]);

  const handleParamChange = useCallback((paramName: string, rawValue: string) => {
    const num = parseFloat(rawValue);
    if (!isNaN(num)) onUpdateParam(instance.id, paramName, num);
  }, [instance.id, onUpdateParam]);

  // ── Boyut hesapla ──────────────────────────────────────────────────────
  const BLOCK_W      = 220 - depth * 16;
  const BLOCK_H      = 44;
  const hasBottom    = !def.isHat;
  const totalH       = BLOCK_H + (hasBottom ? BUMP_H : 0);

  const path = buildBlockPath(BLOCK_W, BLOCK_H, !!def.isHat, hasBottom);

  return (
    <div ref={setNodeRef} style={{ ...dragStyle, marginBottom: '2px', marginLeft: depth * 16 }}>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setContextMenu(null)} />
          <div style={{
            position: 'fixed', top: contextMenu.y, left: contextMenu.x,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '4px', zIndex: 999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}>
            <button onClick={handleDelete} style={{
              display: 'block', width: '100%', padding: '7px 18px',
              background: 'transparent', border: 'none',
              color: '#f87171', cursor: 'pointer', fontSize: '13px',
              textAlign: 'left', borderRadius: '6px', fontWeight: 600,
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              🗑 Sil
            </button>
          </div>
        </>
      )}

      {/* ── Scratch-style LEGO blok ──────────────────────────────────── */}
      <div
        className={isActive ? 'scratch-block active' : 'scratch-block'}
        onContextMenu={handleContextMenu}
        style={{ position: 'relative', width: BLOCK_W, minHeight: totalH }}
      >
        {/* SVG gövde */}
        <svg
          width={BLOCK_W}
          height={def.isHat ? BLOCK_H + BUMP_H * 2 : totalH}
          style={{ display: 'block', overflow: 'visible', position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <filter id={`glow-${instance.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Gölge katmanı */}
          <path
            d={path}
            fill="rgba(0,0,0,0.35)"
            transform="translate(2,3)"
          />
          {/* Ana blok */}
          <path
            d={path}
            fill={color}
            stroke={isActive ? '#fff' : colorDark}
            strokeWidth={isActive ? 2 : 1}
            filter={isActive ? `url(#glow-${instance.id})` : undefined}
          />
          {/* Üst ışık şeridi (Lego parlaklık efekti) */}
          <path
            d={`M ${R + 2} 4 L ${BLOCK_W - R - 2} 4`}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Blok içeriği – SVG üzerine absolute */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            padding: `${def.isHat ? 10 : 8}px 12px 8px ${BUMP_X + BUMP_W + 6}px`,
            minHeight: BLOCK_H,
          }}
        >
          {/* Drag handle */}
          <span
            {...listeners} {...attributes}
            style={{
              cursor: 'grab', color: 'rgba(255,255,255,0.55)',
              fontSize: '13px', userSelect: 'none', flexShrink: 0,
              lineHeight: 1,
            }}
            title="Sürükle"
          >⠿</span>

          {/* Hat badge */}
          {def.isHat && (
            <span style={{
              background: 'rgba(255,255,255,0.22)',
              color: '#fff',
              fontSize: '8px',
              padding: '1px 5px',
              borderRadius: '3px',
              fontWeight: 800,
              letterSpacing: '0.06em',
            }}>
              HAT
            </span>
          )}

          {/* Label */}
          <span style={{
            fontSize: '13px', fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'Outfit', sans-serif",
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            flexShrink: 0,
          }}>
            {def.label}
          </span>

          {/* Params */}
          {instance.params.map(param => {
            const paramDef = def.params?.find(p => p.name === param.name);
            const isEditing = editingParam === param.name;
            return (
              <span key={param.name} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {isEditing ? (
                  <input
                    className="scratch-param-input"
                    type="number"
                    defaultValue={param.value}
                    autoFocus
                    onBlur={e => { handleParamChange(param.name, e.target.value); setEditingParam(null); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { handleParamChange(param.name, e.currentTarget.value); setEditingParam(null); }
                      if (e.key === 'Escape') setEditingParam(null);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <button
                    className="scratch-param-pill"
                    onClick={e => { e.stopPropagation(); setEditingParam(param.name); }}
                  >
                    {param.value}
                  </button>
                )}
                {paramDef?.unit && (
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    {paramDef.unit}
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Container slot (C şekli) */}
        {def.isContainer && (
          <div className="scratch-container-slot" style={{
            marginLeft: 20,
            marginTop: 2,
            borderLeft: `3px solid ${colorDark}`,
            background: colorLight,
            borderRadius: '0 0 6px 6px',
            minHeight: 36,
            padding: '6px 8px',
          }}>
            {instance.children.length === 0 ? (
              <div style={{
                color: 'rgba(255,255,255,0.45)', fontSize: '11px',
                fontStyle: 'italic', padding: '4px 8px',
                textAlign: 'center',
              }}>
                (boş — sürükleyip bırak)
              </div>
            ) : (
              instance.children.map(child => {
                const childDef = BLOCK_DEFS.find(d => d.id === child.defId);
                if (!childDef) return null;
                return (
                  <Block
                    key={child.id} instance={child} def={childDef}
                    depth={0} activeBlockId={activeBlockId}
                    onUpdateParam={onUpdateParam}
                    onDelete={onDelete} onAddChild={onAddChild}
                  />
                );
              })
            )}

            {/* Alt blok ekleme */}
            <div style={{ marginTop: 4 }}>
              <select
                onChange={e => {
                  const defId = e.target.value;
                  if (!defId) return;
                  const childDef = BLOCK_DEFS.find(d => d.id === defId);
                  if (!childDef) return;
                  onAddChild(instance.id, defId, (childDef.params ?? []).map(p => ({ name: p.name, value: p.defaultValue })));
                  e.target.value = '';
                }}
                className="scratch-child-select"
                defaultValue=""
              >
                <option value="" disabled>+ Blok Ekle</option>
                {BLOCK_DEFS.filter(d => !d.isHat).map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
