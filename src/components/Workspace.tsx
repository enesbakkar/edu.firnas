import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Block } from './Blocks/Block';
import { BlockPalette } from './Blocks/BlockPalette';
import { CodeView } from './CodeView';
import { BLOCK_DEFS } from './Blocks/blockDefinitions';
import { createT } from '../i18n';
import type { BlockInstance, Language } from '../types';

interface Props {
  blocks: BlockInstance[];
  activeBlockId: string | null;
  activeCategory: string | null;
  onUpdateParam: (blockId: string, paramName: string, value: number) => void;
  onDeleteBlock: (id: string) => void;
  onAddChild: (parentId: string, defId: string, defaultParams: { name: string; value: number }[]) => void;
  onCloseCategory: () => void;
  lang: Language;
}

type WorkspaceTab = 'blocks' | 'code';

export function Workspace({
  blocks,
  activeBlockId,
  activeCategory,
  onUpdateParam,
  onDeleteBlock,
  onAddChild,
  onCloseCategory,
  lang,
}: Props) {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('blocks');
  const t = createT(lang);

  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace-drop',
  });

  const sortableIds = blocks.map(b => `instance-${b.id}`);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Block palette panel (slide in from left) */}
      {activeCategory && (
        <BlockPalette
          categoryKey={activeCategory}
          onClose={onCloseCategory}
          lang={lang}
        />
      )}

      {/* Main workspace */}
      <div
        className="app-workspace"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Tab header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            flexShrink: 0,
            gap: '4px',
          }}
        >
          {(['blocks', 'code'] as WorkspaceTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setWorkspaceTab(tab)}
              style={{
                padding: '13px 18px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                color: workspaceTab === tab ? '#00b8d4' : 'var(--text-secondary)',
                borderBottom: `2px solid ${workspaceTab === tab ? '#00b8d4' : 'transparent'}`,
                letterSpacing: '0.06em',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textShadow: workspaceTab === tab ? '0 0 12px rgba(0,184,212,0.5)' : 'none',
              }}
            >
              {tab === 'blocks' ? t('tab.blocks') : t('tab.code_view')}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <span style={{
            fontSize: '10px',
            color: 'var(--firnas-teal)',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: 'rgba(0,184,212,0.08)',
            border: '1px solid rgba(0,184,212,0.15)',
            padding: '2px 10px',
            borderRadius: '100px',
          }}>
            {blocks.length} {t('word.block')}
          </span>
        </div>

        {/* Content */}
        {workspaceTab === 'blocks' ? (
          <div
            ref={setNodeRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              position: 'relative',
              // Hexagon background pattern
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zM28 100L0 84V50l28-16 28 16v34L28 100z' fill='none' stroke='%2300b8d4' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`,
              backgroundSize: '56px 100px',
              outline: isOver ? '2px dashed #00b8d4' : 'none',
              outlineOffset: '-4px',
              transition: 'outline 0.1s',
            }}
          >
            {blocks.length === 0 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  color: 'var(--border)',
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  width: '120px', height: '120px',
                  border: '2px dashed rgba(0,184,212,0.2)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  background: 'rgba(0,184,212,0.03)',
                }}>
                  🧩
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                }}>
                  {t('workspace.empty')}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: "'Inter', sans-serif",
                  textAlign: 'center',
                }}>
                  {t('workspace.hint')}
                </div>
              </div>
            ) : (
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {blocks.map(block => {
                  const def = BLOCK_DEFS.find(d => d.id === block.defId);
                  if (!def) return null;
                  return (
                    <Block
                      key={block.id}
                      instance={block}
                      def={def}
                      depth={0}
                      activeBlockId={activeBlockId}
                      onUpdateParam={onUpdateParam}
                      onDelete={onDeleteBlock}
                      onAddChild={onAddChild}
                    />
                  );
                })}
              </SortableContext>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <CodeView blocks={blocks} />
          </div>
        )}
      </div>
    </div>
  );
}
