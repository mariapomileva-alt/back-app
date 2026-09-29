import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useHomeMarkMotionActive } from '@/hooks/useHomeMarkMotionActive';

const SETTLE_MS = 1600;
const HOLD_MS = 2200;
const REST_MS = 1400;
const QUIET_MS = 3200;

export function useGroundMarkSettleMotion(): {
  progress: SharedValue<number>;
  motionActive: SharedValue<number>;
} {
  const motionAllowed = useHomeMarkMotionActive();
  const progress = useSharedValue(0);
  const motionActive = useSharedValue(motionAllowed ? 1 : 0);

  useEffect(() => {
    motionActive.value = motionAllowed ? 1 : 0;
  }, [motionActive, motionAllowed]);

  useEffect(() => {
    cancelAnimation(progress);
    if (!motionAllowed) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: SETTLE_MS, easing: Easing.inOut(Easing.quad) }),
        withDelay(HOLD_MS, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: REST_MS, easing: Easing.inOut(Easing.quad) }),
        withDelay(QUIET_MS, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [motionAllowed, progress]);

  return { progress, motionActive };
}

export function groundMarkSettleTranslateY(
  progress: number,
  motionActive: number,
  settlePx: number,
): number {
  'worklet';
  if (motionActive === 0) {
    return 0;
  }
  return progress * settlePx;
}

export function groundMarkRootOpacity(
  progress: number,
  motionActive: number,
  resting: number,
  peak: number,
): number {
  'worklet';
  if (motionActive === 0) {
    return resting;
  }
  return resting + progress * (peak - resting);
}

export function groundMarkSoilOpacity(
  progress: number,
  motionActive: number,
  base: number,
  peakBoost: number,
): number {
  'worklet';
  if (motionActive === 0) {
    return base;
  }
  return base + progress * peakBoost;
}
