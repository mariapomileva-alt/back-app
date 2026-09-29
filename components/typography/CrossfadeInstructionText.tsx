import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
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

const EASE_SMOOTH = Easing.bezier(0.22, 0.61, 0.36, 1);

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
  const skipFirstRef = useRef(true);
  const topIsARef = useRef(true);

  const [layerA, setLayerA] = useState({ key: contentKey, text: children });
  const [layerB, setLayerB] = useState({ key: contentKey, text: children });
  const [topIsA, setTopIsA] = useState(true);

  const opacityA = useSharedValue(1);
  const opacityB = useSharedValue(0);
  const shiftA = useSharedValue(0);
  const shiftB = useSharedValue(0);

  useEffect(() => {
    if (skipFirstRef.current) {
      skipFirstRef.current = false;
      visibleKeyRef.current = contentKey;
      return;
    }
    if (contentKey === visibleKeyRef.current) {
      return;
    }
    visibleKeyRef.current = contentKey;

    const run = () => {
      if (reduceMotion) {
        setLayerA({ key: contentKey, text: children });
        setTopIsA(true);
        topIsARef.current = true;
        opacityA.value = 1;
        opacityB.value = 0;
        return;
      }

      const incomingOnA = !topIsARef.current;
      if (incomingOnA) {
        setLayerA({ key: contentKey, text: children });
        shiftA.value = INSTRUCTION_ENTER_SHIFT_PX;
        opacityA.value = outOpacity;
        shiftB.value = 0;
        opacityB.value = 1;
        opacityB.value = withTiming(0, { duration: fadeOutMs, easing: EASE_SMOOTH });
        shiftB.value = withTiming(-INSTRUCTION_ENTER_SHIFT_PX, { duration: fadeOutMs, easing: EASE_SMOOTH });
        opacityA.value = withTiming(1, { duration: fadeInMs, easing: EASE_SMOOTH });
        shiftA.value = withTiming(0, { duration: fadeInMs, easing: EASE_SMOOTH });
        setTopIsA(true);
        topIsARef.current = true;
      } else {
        setLayerB({ key: contentKey, text: children });
        shiftB.value = INSTRUCTION_ENTER_SHIFT_PX;
        opacityB.value = outOpacity;
        shiftA.value = 0;
        opacityA.value = 1;
        opacityA.value = withTiming(0, { duration: fadeOutMs, easing: EASE_SMOOTH });
        shiftA.value = withTiming(-INSTRUCTION_ENTER_SHIFT_PX, { duration: fadeOutMs, easing: EASE_SMOOTH });
        opacityB.value = withTiming(1, { duration: fadeInMs, easing: EASE_SMOOTH });
        shiftB.value = withTiming(0, { duration: fadeInMs, easing: EASE_SMOOTH });
        setTopIsA(false);
        topIsARef.current = false;
      }
    };

    queueMicrotask(run);
    // Layer swap is driven by contentKey; shared values are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, contentKey, fadeInMs, fadeOutMs, outOpacity, reduceMotion]);

  const styleA = useAnimatedStyle(() => ({
    opacity: opacityA.value,
    transform: [{ translateY: shiftA.value }],
  }));

  const styleB = useAnimatedStyle(() => ({
    opacity: opacityB.value,
    transform: [{ translateY: shiftB.value }],
  }));

  const renderLayer = (
    reactKey: 'a' | 'b',
    layer: { key: string; text: string },
    animatedStyle: typeof styleA,
    onTop: boolean,
  ) => (
    <Animated.View
      key={reactKey}
      style={[
        styles.layer,
        animatedStyle,
        onTop ? styles.layerTop : styles.layerBottom,
        styles.noPointer,
      ]}
    >
      <AppText
        variant={variant}
        accessibilityLiveRegion={onTop ? accessibilityLiveRegion : 'none'}
        accessibilityLabel={onTop ? accessibilityLabel : undefined}
        accessible={onTop ? accessible : false}
        style={style}
      >
        {layer.text}
      </AppText>
    </Animated.View>
  );

  return (
    <View
      style={[styles.container, minHeight != null ? { minHeight } : null, containerStyle]}
      collapsable={false}
    >
      {topIsA ? (
        <>
          {renderLayer('b', layerB, styleB, false)}
          {renderLayer('a', layerA, styleA, true)}
        </>
      ) : (
        <>
          {renderLayer('a', layerA, styleA, false)}
          {renderLayer('b', layerB, styleB, true)}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  layerTop: {
    position: 'relative',
  },
  noPointer: {
    pointerEvents: 'none',
  },
});
