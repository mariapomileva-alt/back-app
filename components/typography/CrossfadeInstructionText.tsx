import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/typography/AppText';
import {
  INSTRUCTION_CROSSFADE_DIM,
  INSTRUCTION_CROSSFADE_IN_MS,
  INSTRUCTION_CROSSFADE_OUT_MS,
  INSTRUCTION_ENTER_SHIFT_PX,
  INSTRUCTION_REDUCE_FADE_MS,
} from '@/features/ground/transitions';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import type { TypographyVariant } from '@/theme/typography';

const EASE_OUT = Easing.bezier(0.4, 0, 0.2, 1);

type Props = {
  contentKey: string;
  children: string;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  minHeight?: number;
  accessibilityLiveRegion?: 'polite' | 'assertive' | 'none';
  accessibilityLabel?: string;
  accessible?: boolean;
};

export function CrossfadeInstructionText({
  contentKey,
  children,
  variant = 'instruction',
  style,
  containerStyle,
  minHeight,
  accessibilityLiveRegion = 'polite',
  accessibilityLabel,
  accessible,
}: Props) {
  const reduceMotion = useReduceMotion();
  const fadeOutMs = reduceMotion ? INSTRUCTION_REDUCE_FADE_MS : INSTRUCTION_CROSSFADE_OUT_MS;
  const fadeInMs = reduceMotion ? INSTRUCTION_REDUCE_FADE_MS : INSTRUCTION_CROSSFADE_IN_MS;
  const outOpacity = reduceMotion ? 0 : INSTRUCTION_CROSSFADE_DIM;

  const visibleKeyRef = useRef(contentKey);
  const [displayText, setDisplayText] = useState(children);
  const pendingRef = useRef({ key: contentKey, text: children });
  const skipFirstRef = useRef(true);

  const opacity = useSharedValue(1);
  const shiftY = useSharedValue(0);

  const fadeInNative = (text: string, key: string) => {
    visibleKeyRef.current = key;
    setDisplayText(text);
    if (reduceMotion) {
      opacity.value = 1;
      shiftY.value = 0;
      return;
    }
    shiftY.value = INSTRUCTION_ENTER_SHIFT_PX;
    opacity.value = outOpacity;
    opacity.value = withTiming(1, { duration: fadeInMs, easing: EASE_OUT });
    shiftY.value = withTiming(0, { duration: fadeInMs, easing: EASE_OUT });
  };

  const fadeOutNative = () => {
    const latest = pendingRef.current;
    if (reduceMotion) {
      fadeInNative(latest.text, latest.key);
      return;
    }
    shiftY.value = withTiming(-INSTRUCTION_ENTER_SHIFT_PX, { duration: fadeOutMs, easing: EASE_OUT });
    opacity.value = withTiming(outOpacity, { duration: fadeOutMs, easing: EASE_OUT }, (finished) => {
      if (!finished) {
        return;
      }
      const pending = pendingRef.current;
      runOnJS(fadeInNative)(pending.text, pending.key);
    });
  };

  useEffect(() => {
    pendingRef.current = { key: contentKey, text: children };
    if (skipFirstRef.current) {
      skipFirstRef.current = false;
      visibleKeyRef.current = contentKey;
      return;
    }
    if (contentKey === visibleKeyRef.current) {
      return;
    }
    fadeOutNative();
    // Crossfade runs when contentKey changes; motion values are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, contentKey]);

  const nativeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: shiftY.value }],
  }));

  return (
    <View
      style={[styles.container, minHeight != null ? { minHeight } : null, containerStyle]}
      collapsable={false}
    >
      <Animated.View style={nativeStyle}>
        <AppText
          variant={variant}
          accessibilityLiveRegion={accessibilityLiveRegion}
          accessibilityLabel={accessibilityLabel}
          accessible={accessible}
          style={style}
        >
          {displayText}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
