import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

import {
  phaseAtElapsed,
  scaleAtElapsed,
  type BreathPattern,
  type BreathPhase,
} from '@/features/breathe/patterns';
import { useHaptics } from '@/hooks/useHaptics';

function isForeground(state: AppStateStatus): boolean {
  return state === 'active';
}

export function useBreathCycle(
  pattern: BreathPattern,
  growScale: number,
): {
  phase: BreathPhase;
  scale: SharedValue<number>;
} {
  const scale = useSharedValue(scaleAtElapsed(pattern, 0, growScale));
  const [phase, setPhase] = useState<BreathPhase>(phaseAtElapsed(pattern, 0));
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

    scale.value = scaleAtElapsed(pattern, 0, growScale);
    setPhase(current);

    const elapsedMs = () => accumulatedMs + (paused ? 0 : Date.now() - runningSince);

    const applyMoment = (ms: number) => {
      scale.value = scaleAtElapsed(pattern, ms, growScale);
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
  }, [growScale, pattern, scale]);

  return { phase, scale };
}
