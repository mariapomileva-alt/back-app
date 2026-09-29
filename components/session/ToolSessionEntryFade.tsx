import { type ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';

const ENTRY_MS = 270;

type Props = {
  children: ReactNode;
};

/** Soft Home → session visual continuity for Move and Ground (no layout shift). */
export function ToolSessionEntryFade({ children }: Props) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = 0;
    opacity.value = withTiming(1, {
      duration: ENTRY_MS,
      easing: Easing.inOut(Easing.quad),
    });
  }, [opacity, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.wrap, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
