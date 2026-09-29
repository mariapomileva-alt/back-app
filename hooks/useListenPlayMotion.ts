import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';

/** Drift + gentle breathe while Listen plays. Reanimated works on web and native. */
export function useListenPlayMotionStyle(active: boolean) {
  const reduceMotion = useReduceMotion();
  const drift = useSharedValue(0.5);
  const breathe = useSharedValue(1);
  const activeSv = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeSv.value = active ? 1 : 0;
  }, [active, activeSv]);

  useEffect(() => {
    cancelAnimation(drift);
    cancelAnimation(breathe);

    if (reduceMotion || !active) {
      drift.value = withTiming(0.5, { duration: 320 });
      breathe.value = withTiming(1, { duration: 320 });
      return;
    }

    drift.value = withRepeat(
      withTiming(1, { duration: 2_800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    breathe.value = withRepeat(
      withTiming(0.88, { duration: 2_200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [active, breathe, drift, reduceMotion]);

  return useAnimatedStyle(() => {
    if (activeSv.value === 0) {
      return {
        opacity: 1,
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
      };
    }
    const t = drift.value;
    const b = breathe.value;
    return {
      opacity: 0.84 + (1 - b) * 0.16,
      transform: [
        { translateX: (t - 0.5) * 48 },
        { translateY: (t - 0.5) * -28 },
        { scale: 1 + (t - 0.5) * 0.07 },
      ],
    };
  });
}
