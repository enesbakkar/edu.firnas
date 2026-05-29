import { useRef, useCallback } from 'react';
import type { BlockInstance, TelemetryData } from '../types';
import { BLOCK_DEFS } from '../components/Blocks/blockDefinitions';

type SetActiveBlock = (id: string | null) => void;
type UpdateTelemetry = (arg: Partial<TelemetryData> | ((prev: TelemetryData) => Partial<TelemetryData>)) => void;
type ResetTelemetry = () => void;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useDroneSimulation(
  setActiveBlock: SetActiveBlock,
  updateTelemetry: UpdateTelemetry,
  resetTelemetry: ResetTelemetry,
) {
  const abortedRef = useRef(false);

  const executeBlock = useCallback(async (block: BlockInstance): Promise<void> => {
    if (abortedRef.current) return;

    const def = BLOCK_DEFS.find(d => d.id === block.defId);
    if (!def) return;

    setActiveBlock(block.id);
    await sleep(600);

    if (abortedRef.current) return;

    const getParam = (name: string, fallback: number) => {
      const p = block.params.find(p => p.name === name);
      return p !== undefined ? p.value : fallback;
    };

    switch (block.defId) {
      case 'takeoff':
        updateTelemetry({ isFlying: true, altitude: 2, velocity: 1.0 });
        break;

      case 'land':
        updateTelemetry({ isFlying: false, altitude: 0, velocity: 0 });
        break;

      case 'ascend': {
        const h = getParam('height', 2);
        updateTelemetry(prev => ({ altitude: prev.altitude + h }));
        break;
      }

      case 'descend': {
        const h = getParam('height', 2);
        updateTelemetry(prev => ({ altitude: Math.max(0, prev.altitude - h) }));
        break;
      }

      case 'move_forward':
      case 'move_back':
        updateTelemetry({ velocity: 5.5 });
        await sleep(300);
        if (!abortedRef.current) updateTelemetry({ velocity: 1.2 });
        break;

      case 'rotate_cw': {
        const angle = getParam('angle', 90);
        updateTelemetry(prev => ({ heading: ((prev.heading + angle) % 360 + 360) % 360 }));
        break;
      }

      case 'rotate_ccw': {
        const angle = getParam('angle', 90);
        updateTelemetry(prev => ({ heading: ((prev.heading - angle) % 360 + 360) % 360 }));
        break;
      }

      case 'wait': {
        const secs = getParam('seconds', 2);
        await sleep(secs * 400);
        break;
      }

      case 'repeat': {
        const times = getParam('times', 10);
        for (let i = 0; i < times; i++) {
          if (abortedRef.current) return;
          for (const child of block.children) {
            await executeBlock(child);
            if (abortedRef.current) return;
          }
        }
        break;
      }

      case 'repeat_forever': {
        // In simulation, run children 3 times to avoid infinite loop
        for (let i = 0; i < 3; i++) {
          if (abortedRef.current) return;
          for (const child of block.children) {
            await executeBlock(child);
            if (abortedRef.current) return;
          }
        }
        break;
      }

      case 'if_then':
      case 'if_else':
        // Always true in simulation
        for (const child of block.children) {
          if (abortedRef.current) return;
          await executeBlock(child);
        }
        break;

      default:
        break;
    }

    if (!abortedRef.current) {
      setActiveBlock(null);
    }
  }, [setActiveBlock, updateTelemetry]);

  const runBlocks = useCallback(async (blocks: BlockInstance[]): Promise<void> => {
    abortedRef.current = false;

    for (const block of blocks) {
      if (abortedRef.current) break;
      await executeBlock(block);
    }

    setActiveBlock(null);
  }, [executeBlock, setActiveBlock]);

  const stop = useCallback(() => {
    abortedRef.current = true;
    setActiveBlock(null);
    resetTelemetry();
  }, [setActiveBlock, resetTelemetry]);

  return { runBlocks, stop };
}
