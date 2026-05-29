import { useState, useEffect, useCallback, useRef } from 'react';
import type { TelemetryData } from '../types';

const INITIAL_STATE: TelemetryData = {
  altitude: 0,
  velocity: 0,
  battery: 85,
  heading: 342,
  isFlying: false,
};

type UpdateArg = Partial<TelemetryData> | ((prev: TelemetryData) => Partial<TelemetryData>);

export function useTelemetry() {
  const [data, setData] = useState<TelemetryData>({ ...INITIAL_STATE });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const update = useCallback((arg: UpdateArg) => {
    setData(prev => {
      const patch = typeof arg === 'function' ? arg(prev) : arg;
      return { ...prev, ...patch };
    });
  }, []);

  const reset = useCallback(() => {
    setData({ ...INITIAL_STATE });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData(prev => {
        if (!prev.isFlying) return prev;

        const altFluc = (Math.random() - 0.5) * 0.2;
        const velFluc = (Math.random() - 0.5) * 0.4;
        const headFluc = (Math.random() - 0.5) * 1.5;
        const battDrain = 0.02;

        return {
          ...prev,
          altitude: Math.max(0, prev.altitude + altFluc),
          velocity: Math.max(0, prev.velocity + velFluc),
          heading: ((prev.heading + headFluc) % 360 + 360) % 360,
          battery: Math.max(0, prev.battery - battDrain),
        };
      });
    }, 800);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { data, update, reset };
}
