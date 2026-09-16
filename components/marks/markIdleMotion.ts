import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';

export type MarkIdleTool = 'breathe' | 'distract' | 'ground' | 'move' | 'listen' | 'read';

const MARK_IDLE_TIMING: Record<MarkIdleTool, { durationMs: number; delayMs: number }> = {
  breathe: { durationMs: 12_000, delayMs: 0 },
  distract: { durationMs: 10_800, delayMs: 350 },
  ground: { durationMs: 13_200, delayMs: 150 },
  move: { durationMs: 11_400, delayMs: 550 },
  listen: { durationMs: 9_600, delayMs: 250 },
  read: { durationMs: 14_000, delayMs: 700 },
};

export function useMarkIdlePhase(tool: MarkIdleTool): {
  phase: SharedValue<number>;
  motionActive: SharedValue<number>;
  timing: { durationMs: number; delayMs: number };
} {
  const reduceMotion = useReduceMotion();
  const timing = MARK_IDLE_TIMING[tool];
  const phase = useSharedValue(0);
  const motionActive = useSharedValue(reduceMotion ? 0 : 1);

  useEffect(() => {
    motionActive.value = reduceMotion ? 0 : 1;
  }, [motionActive, reduceMotion]);

  useEffect(() => {
    cancelAnimation(phase);
    if (reduceMotion) {
      phase.value = 0;
      return;
    }
    phase.value = withDelay(
      timing.delayMs,
      withRepeat(
        withTiming(1, {
          duration: timing.durationMs,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.Never,
        }),
        -1,
        true,
      ),
    );
  }, [phase, reduceMotion, timing.delayMs, timing.durationMs]);

  return { phase, motionActive, timing };
}

/** Smooth 0..1 layer mix with staggered phase offset (0..1). */
export function markIdleMix(phaseValue: number, offset: number): number {
  'worklet';
  return 0.5 + 0.5 * Math.sin((phaseValue + offset) * Math.PI * 2);
}

export function markIdleRange(mix: number, min: number, max: number): number {
  'worklet';
  return min + mix * (max - min);
}

/** Reserved for optional web-only CSS idle layers (see MoveKineticObject). */
export const HOME_MARK_WEB_IDLE = Platform.OS === 'web';
