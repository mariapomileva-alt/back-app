import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
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

const DRIFT_MS = 11_500;
const SHIMMER_MS = 7_800;

export function useListenVisualAmbientMotion(active = true) {
  const reduceMotion = useReduceMotion();
  const drift = useSharedValue(0.5);
  const shimmer = useSharedValue(0.5);
  const motionActive = useSharedValue(active && !reduceMotion ? 1 : 0);
  const calmStatic = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    motionActive.value = active && !reduceMotion ? 1 : 0;
    calmStatic.value = reduceMotion ? 1 : 0;
  }, [active, calmStatic, motionActive, reduceMotion]);

  useEffect(() => {
    cancelAnimation(drift);
    cancelAnimation(shimmer);

    if (reduceMotion || !active) {
      drift.value = 0.5;
      shimmer.value = 0.5;
      return;
    }

    const timing = (duration: number) =>
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.Never,
      });

    drift.value = withRepeat(timing(DRIFT_MS), -1, true);
    shimmer.value = withRepeat(timing(SHIMMER_MS), -1, true);
  }, [active, drift, reduceMotion, shimmer]);

  const contentStyle = useAnimatedStyle(() => {
    if (motionActive.value === 0) {
      return { transform: [{ scale: calmStatic.value === 1 ? 1.03 : 1 }] };
    }
    const t = drift.value;
    const s = shimmer.value;
    return {
      transform: [
        { scale: 1.04 + t * 0.032 },
        { translateX: (t - 0.5) * 14 },
        { translateY: (s - 0.5) * 10 },
      ],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    if (motionActive.value === 0) {
      return { opacity: 0 };
    }
    const s = shimmer.value;
    return { opacity: 0.05 + s * 0.09 };
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
