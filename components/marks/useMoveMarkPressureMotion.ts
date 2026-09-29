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

const APPROACH_MS = 1350;
const HOLD_MS = 750;
const RELEASE_MS = 1550;
const PAUSE_MS = 2100;
const SEPARATION_PX = 3.5;

export function useMoveMarkPressureMotion(): {
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
        withTiming(1, { duration: APPROACH_MS, easing: Easing.inOut(Easing.quad) }),
        withDelay(HOLD_MS, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: RELEASE_MS, easing: Easing.inOut(Easing.quad) }),
        withDelay(PAUSE_MS, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [motionAllowed, progress]);

  return { progress, motionActive };
}

export function moveMarkPressureOffset(
  progress: number,
  side: 'left' | 'right',
  motionActive: number,
): number {
  'worklet';
  if (motionActive === 0) {
    return 0;
  }
  const toward = side === 'left' ? SEPARATION_PX : -SEPARATION_PX;
  return progress * toward;
}
