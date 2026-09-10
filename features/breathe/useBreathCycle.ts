import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  opennessAtElapsed,
  phaseAtElapsed,
  type BreathPattern,
  type BreathPhase,
} from '@/features/breathe/patterns';
import { useHaptics } from '@/hooks/useHaptics';

function isForeground(state: AppStateStatus): boolean {
  if (Platform.OS === 'web') {
    return state !== 'background';
  }
  return state === 'active';
}

export function useBreathCycle(pattern: BreathPattern): {
  phase: BreathPhase;
  openness: number;
} {
  const [phase, setPhase] = useState<BreathPhase>(phaseAtElapsed(pattern, 0));
  const [openness, setOpenness] = useState(() => opennessAtElapsed(pattern, 0));
  const haptics = useHaptics();
  const lightRef = useRef(haptics.light);
  lightRef.current = haptics.light;

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let accumulatedMs = 0;
    let runningSince = Date.now();
    let paused = !isForeground(AppState.currentState);
    let current = phaseAtElapsed(pattern, 0);

    setPhase(current);
    setOpenness(opennessAtElapsed(pattern, 0));

    const elapsedMs = () => accumulatedMs + (paused ? 0 : Date.now() - runningSince);

    const applyMoment = (ms: number) => {
      const nextOpen = opennessAtElapsed(pattern, ms);
      setOpenness((prev) => (Math.abs(prev - nextOpen) < 0.0008 ? prev : nextOpen));
      const next = phaseAtElapsed(pattern, ms);
      if (next === current) {
        return;
      }
      current = next;
      setPhase(next);
      if (next === 'inhale' || next === 'exhale') {
        lightRef.current();
      }
    };

    const onAppState = (state: AppStateStatus) => {
      if (isForeground(state)) {
        if (paused) {
          runningSince = Date.now();
          paused = false;
        }
        return;
      }
      if (!paused) {
        accumulatedMs += Date.now() - runningSince;
        paused = true;
        applyMoment(accumulatedMs);
      }
    };

    const loop = () => {
      if (cancelled) {
        return;
      }
      applyMoment(elapsedMs());
      frame = requestAnimationFrame(loop);
    };

    const subscription = AppState.addEventListener('change', onAppState);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      subscription.remove();
    };
  }, [pattern]);

  return { phase, openness };
}
