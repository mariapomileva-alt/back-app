import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Very subtle stage motion — must not read larger than the WebP loop itself. */
const BREATHE_MS = 5_600;

export function useListenPremiumStageMotion(enabled: boolean) {
  const breathe = useSharedValue(0.5);

  useEffect(() => {
    cancelAnimation(breathe);
    if (!enabled) {
      breathe.value = withTiming(0.5, { duration: 200 });
      return;
    }
    breathe.value = withRepeat(
      withTiming(1, {
        duration: BREATHE_MS,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [breathe, enabled]);

  return useAnimatedStyle(() => {
    if (!enabled) {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    const t = breathe.value - 0.5;
    return {
      opacity: 0.97 + (0.5 - Math.abs(t)) * 0.03,
      transform: [{ scale: 1 }],
    };
  });
}
