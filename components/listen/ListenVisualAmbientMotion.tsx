import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';

type Props = {
  children: ReactNode;
  /** When false, motion settles to a calm still frame. */
  active?: boolean;
  style?: object;
};

const DRIFT_MS = 14_000;
const SHIMMER_MS = 9_500;

export function useListenVisualAmbientMotion(active = true) {
  const reduceMotion = useReduceMotion();
  const drift = useSharedValue(0.5);
  const shimmer = useSharedValue(0.5);

  useEffect(() => {
    cancelAnimation(drift);
    cancelAnimation(shimmer);

    if (reduceMotion || !active) {
      drift.value = 0.5;
      shimmer.value = 0.5;
      return;
    }

    drift.value = withRepeat(
      withTiming(1, { duration: DRIFT_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    shimmer.value = withRepeat(
      withTiming(1, { duration: SHIMMER_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [active, drift, reduceMotion, shimmer]);

  const contentStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { transform: [{ scale: 1.03 }] };
    }
    const t = drift.value;
    const s = shimmer.value;
    return {
      transform: [
        { scale: 1.045 + t * 0.018 },
        { translateX: (t - 0.5) * 7 },
        { translateY: (s - 0.5) * 5 },
      ],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    if (reduceMotion || !active) {
      return { opacity: 0 };
    }
    const s = shimmer.value;
    return { opacity: 0.04 + s * 0.07 };
  });

  return { contentStyle, shimmerStyle, reduceMotion, showShimmer: !reduceMotion && active };
}

/**
 * Slow drift + shimmer for Listen visuals — photos and abstract graphics.
 * Respects Reduce Motion (static frame, no shimmer).
 */
export function ListenVisualAmbientMotion({ children, active = true, style }: Props) {
  const { contentStyle, shimmerStyle, showShimmer } = useListenVisualAmbientMotion(active);

  return (
    <View style={[styles.shell, style]}>
      <Animated.View style={[styles.content, contentStyle]}>{children}</Animated.View>
      {showShimmer ? (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  shimmer: {
    backgroundColor: '#ffffff',
  },
});
