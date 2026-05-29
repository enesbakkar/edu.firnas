import { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BlockInstance, BlockDef } from '../../types';
import { CATEGORY_COLOR, BLOCK_DEFS } from './blockDefinitions';

interface ContextMenuState {
  x: number;
  y: number;
}

interface Props {
  instance: BlockInstance;
  def: BlockDef;
  depth: number;
  activeBlockId: string | null;
  onUpdateParam: (blockId: string, paramName: string, value: number) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, defId: string, defaultParams: { name: string; value: number }[]) => void;
}

export function Block({
  instance,
  def,
  depth,
  activeBlockId,
  onUpdateParam,
  onDelete,
  onAddChild,
}: Props) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [editingParam, setEditingParam] = useState<string | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `instance-${instance.id}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const categoryColor = CATEGORY_COLOR[def.category] ?? '#00b8d4';
  const isActive = activeBlockId === instance.id;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDelete = useCallback(() => {
    setContextMenu(null);
    onDelete(instance.id);
  }, [instance.id, onDelete]);

  const handleParamChange = useCallback((paramName: string, rawValue: string) => {
    const num = parseFloat(rawValue);
    if (!isNaN(num)) {
      onUpdateParam(instance.id, paramName, num);
    }
  }, [instance.id, onUpdateParam]);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginBottom: '4px' }}
      {...attributes}
    >
      {/* Context menu overlay */}
      {contextMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 998,
            }}
            onClick={() => setContextMenu(null)}
          />
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '4px',
              zIndex: 999,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <button
              onClick={handleDelete}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 14px',
                background: 'transparent',
                border: 'none',
                color: '#C75D5D',
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                borderRadius: '4px',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Sil
            </button>
          </div>
        </>
      )}

      <div
        className={isActive ? 'block-item active' : 'block-item'}
        style={{
          borderLeft: `4px solid ${categoryColor}`,
          marginLeft: depth * 16,
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Drag handle + label row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {/* Drag handle */}
          <span
            {...listeners}
            style={{
              cursor: 'grab',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              userSelect: 'none',
              flexShrink: 0,
            }}
            title="Sürükle"
          >
            ⠿
          </span>

          {/* Hat indicator */}
          {def.isHat && (
            <span
              style={{
                background: categoryColor,
                color: 'white',
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              HAT
            </span>
          )}

          {/* Label */}
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}
          >
            {def.label}
          </span>

          {/* Params */}
          {instance.params.map(param => {
            const paramDef = def.params?.find(p => p.name === param.name);
            const isEditing = editingParam === param.name;

            return (
              <span
                key={param.name}
                style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                {isEditing ? (
                  <input
                    className="block-param-input"
                    type="number"
                    defaultValue={param.value}
                    autoFocus
                    onBlur={e => {
                      handleParamChange(param.name, e.target.value);
                      setEditingParam(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleParamChange(param.name, e.currentTarget.value);
                        setEditingParam(null);
                      }
                      if (e.key === 'Escape') setEditingParam(null);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditingParam(param.name);
                    }}
                    style={{
                      background: 'rgba(0,0,0,0.15)',
                      border: `1px solid ${categoryColor}66`,
                      borderRadius: '4px',
                      color: '#E8A33D',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '1px 6px',
                      cursor: 'text',
                      minWidth: '32px',
                      textAlign: 'center',
                    }}
                  >
                    {param.value}
                  </button>
                )}
                {paramDef && paramDef.unit && (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {paramDef.unit}
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Container children */}
        {def.isContainer && (
          <div
            className="block-container"
            style={{ marginLeft: '12px', marginTop: '8px' }}
          >
            {instance.children.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px dashed var(--border)',
                  textAlign: 'center',
                }}
              >
                (boş)
              </div>
            ) : (
              instance.children.map(child => {
                const childDef = BLOCK_DEFS.find(d => d.id === child.defId);
                if (!childDef) return null;
                return (
                  <Block
                    key={child.id}
                    instance={child}
                    def={childDef}
                    depth={0}
                    activeBlockId={activeBlockId}
                    onUpdateParam={onUpdateParam}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                  />
                );
              })
            )}

            {/* Add child button */}
            <div style={{ marginTop: '4px' }}>
              <select
                onChange={e => {
                  const defId = e.target.value;
                  if (!defId) return;
                  const childDef = BLOCK_DEFS.find(d => d.id === defId);
                  if (!childDef) return;
                  const defaultParams = (childDef.params ?? []).map(p => ({
                    name: p.name,
                    value: p.defaultValue,
                  }));
                  onAddChild(instance.id, defId, defaultParams);
                  e.target.value = '';
                }}
                style={{
                  background: 'var(--bg-deep)',
                  border: `1px dashed ${categoryColor}55`,
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  padding: '3px 6px',
                  cursor: 'pointer',
                  width: '100%',
                }}
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
