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

const DRIFT_MS = 8_800;
const SHIMMER_MS = 6_200;

export function useListenVisualAmbientMotion(active = true) {
  const reduceMotion = useReduceMotion();
  const drift = useSharedValue(0.5);
  const shimmer = useSharedValue(0.5);
  const motionActive = useSharedValue(active && !reduceMotion ? 1 : 0);

  useEffect(() => {
    motionActive.value = active && !reduceMotion ? 1 : 0;
  }, [active, motionActive, reduceMotion]);

  useEffect(() => {
    cancelAnimation(drift);
    cancelAnimation(shimmer);

    if (reduceMotion || !active) {
      drift.value = withTiming(0.5, { duration: 420, easing: Easing.out(Easing.quad) });
      shimmer.value = withTiming(0.5, { duration: 420, easing: Easing.out(Easing.quad) });
      return;
    }

    const timing = (duration: number) =>
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      });

    drift.value = withRepeat(timing(DRIFT_MS), -1, true);
    shimmer.value = withRepeat(timing(SHIMMER_MS), -1, true);
  }, [active, drift, reduceMotion, shimmer]);

  const contentStyle = useAnimatedStyle(() => {
    if (motionActive.value === 0) {
      return { transform: [{ scale: 1 }, { translateX: 0 }, { translateY: 0 }] };
    }
    const t = drift.value;
    const s = shimmer.value;
    return {
      transform: [
        { scale: 1.02 + t * 0.022 },
        { translateX: (t - 0.5) * 11 },
        { translateY: (s - 0.5) * 8 },
      ],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    if (motionActive.value === 0) {
      return { opacity: 0 };
    }
    const s = shimmer.value;
    return { opacity: 0.04 + s * 0.11 };
  });

  return { contentStyle, shimmerStyle, reduceMotion, showShimmer: !reduceMotion && active };
}

/**
 * Slow drift + shimmer for Listen visuals while playing.
 * Paused = still. Respects Reduce Motion.
 */
export function ListenVisualAmbientMotion({ children, active = true, style }: Props) {
  const { contentStyle, shimmerStyle, showShimmer } = useListenVisualAmbientMotion(active);

  return (
    <View style={[styles.shell, style]}>
      <Animated.View style={[styles.content, contentStyle]}>{children}</Animated.View>
      {showShimmer ? (
        <Animated.View style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle, styles.noPointer]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    width: '100%',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  shimmer: {
    backgroundColor: '#ffffff',
  },
  noPointer: {
    pointerEvents: 'none',
  },
});
