import { useReducer, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { TelemetryPanel } from './components/TelemetryPanel/TelemetryPanel';
import { useTelemetry } from './hooks/useTelemetry';
import { useDroneSimulation } from './hooks/useDroneSimulation';
import { BLOCK_DEFS } from './components/Blocks/blockDefinitions';
import { createT } from './i18n';
import type { BlockInstance, BlockAction, AppTab, Language } from './types';

// ─── Reducer ────────────────────────────────────────────────────────────────

function blocksReducer(state: BlockInstance[], action: BlockAction): BlockInstance[] {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlock: BlockInstance = {
        id: crypto.randomUUID(),
        defId: action.defId,
        params: action.defaultParams,
        children: [],
      };
      if (action.index !== undefined) {
        const next = [...state];
        next.splice(action.index, 0, newBlock);
        return next;
      }
      return [...state, newBlock];
    }

    case 'DELETE_BLOCK':
      return state.filter(b => b.id !== action.id);

    case 'MOVE_BLOCK':
      return arrayMove(state, action.fromIndex, action.toIndex);

    case 'UPDATE_PARAM':
      return state.map(b => {
        if (b.id === action.blockId) {
          return {
            ...b,
            params: b.params.map(p =>
              p.name === action.paramName ? { ...p, value: action.value } : p,
            ),
          };
        }
        return {
          ...b,
          children: updateParamInChildren(b.children, action.blockId, action.paramName, action.value),
        };
      });

    case 'ADD_CHILD_BLOCK': {
      if (!action.defId) return state;
      return state.map(b => {
        if (b.id === action.parentId) {
          const newChild: BlockInstance = {
            id: crypto.randomUUID(),
            defId: action.defId,
            params: action.defaultParams,
            children: [],
          };
          return { ...b, children: [...b.children, newChild] };
        }
        return b;
      });
    }

    default:
      return state;
  }
}

function updateParamInChildren(
  children: BlockInstance[],
  blockId: string,
  paramName: string,
  value: number,
): BlockInstance[] {
  return children.map(c => {
    if (c.id === blockId) {
      return {
        ...c,
        params: c.params.map(p => (p.name === paramName ? { ...p, value } : p)),
      };
    }
    return { ...c, children: updateParamInChildren(c.children, blockId, paramName, value) };
  });
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [blocks, dispatch] = useReducer(blocksReducer, []);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('logic');
  const [lang, setLang] = useState<Language>('TR');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const t = createT(lang);

  const { data: telemetry, update: updateTelemetry, reset: resetTelemetry } = useTelemetry();

  const { runBlocks, stop } = useDroneSimulation(
    setActiveBlockId,
    updateTelemetry,
    resetTelemetry,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      // Palette block dropped onto workspace
      if (activeId.startsWith('palette-')) {
        const defId = activeId.replace('palette-', '');
        const def = BLOCK_DEFS.find(d => d.id === defId);
        if (!def) return;

        const defaultParams = (def.params ?? []).map(p => ({
          name: p.name,
          value: p.defaultValue,
        }));

        dispatch({ type: 'ADD_BLOCK', defId, defaultParams });
        return;
      }

      // Workspace block reorder
      if (activeId.startsWith('instance-') && overId.startsWith('instance-')) {
        const fromBlockId = activeId.replace('instance-', '');
        const toBlockId = overId.replace('instance-', '');
        const fromIndex = blocks.findIndex(b => b.id === fromBlockId);
        const toIndex = blocks.findIndex(b => b.id === toBlockId);
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          dispatch({ type: 'MOVE_BLOCK', fromIndex, toIndex });
        }
      }
    },
    [blocks],
  );

  const handleRun = useCallback(async () => {
    if (isRunning || blocks.length === 0) return;
    setIsRunning(true);
    try {
      await runBlocks(blocks);
    } finally {
      setIsRunning(false);
      setActiveBlockId(null);
    }
  }, [isRunning, blocks, runBlocks]);

  const handleStop = useCallback(() => {
    stop();
    setIsRunning(false);
  }, [stop]);

  const handleUpdateParam = useCallback(
    (blockId: string, paramName: string, value: number) => {
      dispatch({ type: 'UPDATE_PARAM', blockId, paramName, value });
    },
    [],
  );

  const handleDeleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', id });
  }, []);

  const handleAddChild = useCallback(
    (parentId: string, defId: string, defaultParams: { name: string; value: number }[]) => {
      dispatch({ type: 'ADD_CHILD_BLOCK', parentId, defId, defaultParams });
    },
    [],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className="app-layout"
        data-theme={theme}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--bg-deep)',
        }}
      >
        {/* Top bar */}
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lang={lang}
          onLangChange={setLang}
          connected={true}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        {/* Main content */}
        <div
          className="app-main"
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {/* Left sidebar */}
          <Sidebar
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            isRunning={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            lang={lang}
          />

          {/* Workspace area */}
          {activeTab === 'logic' && (
            <Workspace
              blocks={blocks}
              activeBlockId={activeBlockId}
              activeCategory={activeCategory}
              onUpdateParam={handleUpdateParam}
              onDeleteBlock={handleDeleteBlock}
              onAddChild={handleAddChild}
              onCloseCategory={() => setActiveCategory(null)}
              lang={lang}
            />
          )}

          {activeTab === 'telemetry' && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '48px' }}>📡</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('tab.telemetry')}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {t('telemetry.data')}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '48px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('tab.tasks')}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {t('coming_soon')}
              </div>
            </div>
          )}

          {/* Right telemetry panel */}
          <TelemetryPanel data={telemetry} lang={lang} />
        </div>

        {/* Footer */}
        <footer
          className="app-footer"
          style={{
            height: '32px',
            background: 'rgba(15, 46, 74, 0.85)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {t('footer.slogan')}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            FiCo Studio v1.0 · © 2024 Firnas Teknoloji
          </span>
        </footer>
      </div>

      <DragOverlay />
    </DndContext>
  );
}
