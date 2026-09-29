import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useHomeMarkMotionActive } from '@/hooks/useHomeMarkMotionActive';

export type MarkIdleTool = 'breathe' | 'distract' | 'ground' | 'move' | 'listen' | 'read';

const MARK_IDLE_TIMING: Record<MarkIdleTool, { durationMs: number; delayMs: number }> = {
  breathe: { durationMs: 10_400, delayMs: 0 },
  distract: { durationMs: 9_000, delayMs: 280 },
  ground: { durationMs: 11_200, delayMs: 120 },
  move: { durationMs: 9_600, delayMs: 420 },
  listen: { durationMs: 8_200, delayMs: 200 },
  read: { durationMs: 12_400, delayMs: 520 },
};

/** Home tool cards — motion strength vs original art spec (1 = subtle). */
export const MARK_IDLE_DRIFT = 1.85;
export const MARK_IDLE_SCALE_BOOST = 1.55;
export const MARK_IDLE_OPACITY_BOOST = 1.75;

export function useMarkIdlePhase(tool: MarkIdleTool): {
  phase: SharedValue<number>;
  motionActive: SharedValue<number>;
  timing: { durationMs: number; delayMs: number };
} {
  const motionAllowed = useHomeMarkMotionActive();
  const timing = MARK_IDLE_TIMING[tool];
  const phase = useSharedValue(0);
  const motionActive = useSharedValue(motionAllowed ? 1 : 0);

  useEffect(() => {
    motionActive.value = motionAllowed ? 1 : 0;
  }, [motionActive, motionAllowed]);

  useEffect(() => {
    cancelAnimation(phase);
    if (!motionAllowed) {
      phase.value = 0;
      return;
    }
    phase.value = withDelay(
      timing.delayMs,
      withRepeat(
        withTiming(1, {
          duration: timing.durationMs,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [motionAllowed, phase, timing.delayMs, timing.durationMs]);

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

export function markIdleScaleRange(mix: number, min: number, max: number): number {
  'worklet';
  const value = markIdleRange(mix, min, max);
  const mid = (min + max) / 2;
  return mid + (value - mid) * MARK_IDLE_SCALE_BOOST;
}

export function markIdleDriftRange(mix: number, min: number, max: number): number {
  'worklet';
  const mid = (min + max) / 2;
  const half = ((max - min) / 2) * MARK_IDLE_DRIFT;
  return markIdleRange(mix, mid - half, mid + half);
}

export function markIdleOpacityRange(mix: number, min: number, max: number): number {
  'worklet';
  const value = markIdleRange(mix, min, max);
  const mid = (min + max) / 2;
  const boosted = mid + (value - mid) * MARK_IDLE_OPACITY_BOOST;
  return Math.min(1, Math.max(0, boosted));
}

/** Reserved for optional web-only CSS idle layers (see MoveKineticObject). */
export const HOME_MARK_WEB_IDLE = Platform.OS === 'web';
