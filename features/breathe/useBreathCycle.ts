import { useEffect, useRef, useState } from 'react';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { phaseAtElapsed, type BreathPattern, type BreathPhase } from '@/features/breathe/patterns';
import { useHaptics } from '@/hooks/useHaptics';

const PHASE_TICK_MS = 120;

export function useBreathCycle(
  pattern: BreathPattern,
  growScale: number,
): {
  phase: BreathPhase;
  scale: SharedValue<number>;
} {
  const scale = useSharedValue(1);
  const [phase, setPhase] = useState<BreathPhase>(pattern.steps[0]?.phase ?? 'inhale');
  const haptics = useHaptics();
  const lightRef = useRef(haptics.light);
  lightRef.current = haptics.light;

  useEffect(() => {
    const easing = Easing.inOut(Easing.sin);
    const animations = pattern.steps.map((step) =>
      withTiming(step.target === 'open' ? growScale : 1, {
        duration: step.durationMs,
        easing: step.phase === 'hold' ? Easing.linear : easing,
      }),
    );
    const first = animations[0];
    if (!first) {
      return;
    }

    cancelAnimation(scale);
    scale.value = 1;
    scale.value = withRepeat(
      animations.length === 1 ? first : withSequence(first, ...animations.slice(1)),
      -1,
      false,
    );

    const startedAt = Date.now();
    let current = phaseAtElapsed(pattern, 0);
    setPhase(current);

    const tick = () => {
      const next = phaseAtElapsed(pattern, Date.now() - startedAt);
      if (next === current) {
        return;
      }
      current = next;
      setPhase(next);
      if (next === 'inhale' || next === 'exhale') {
        lightRef.current();
      }
    };

    const id = setInterval(tick, PHASE_TICK_MS);
    return () => {
      clearInterval(id);
      cancelAnimation(scale);
    };
  }, [growScale, pattern, scale]);

  return { phase, scale };
}
