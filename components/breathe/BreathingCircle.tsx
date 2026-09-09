import { useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

import { brand } from '@/theme/colors';

type Props = {
  restSize: number;
  maxScale: number;
  scale: SharedValue<number>;
  reduceMotion?: boolean;
  accessibilityLabel: string;
};

export function BreathingCircle({
  restSize,
  maxScale,
  scale,
  reduceMotion = false,
  accessibilityLabel,
}: Props) {
  const footprint = restSize * maxScale;
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `breathFill${rawId}`;
  const reduceMotionValue = useSharedValue(reduceMotion ? 1 : 0);
  const maxScaleValue = useSharedValue(maxScale);

  useEffect(() => {
    reduceMotionValue.value = reduceMotion ? 1 : 0;
    maxScaleValue.value = maxScale;
  }, [maxScale, maxScaleValue, reduceMotion, reduceMotionValue]);

  const circleStyle = useAnimatedStyle(() => {
    const value = scale.value;
    const span = maxScaleValue.value - 1;
    const t = span <= 0 ? 0 : Math.min(1, Math.max(0, (value - 1) / span));
    const reduced = reduceMotionValue.value;
    return {
      transform: [{ scale: value }],
      opacity: 1 - reduced * (1 - (0.74 + t * 0.26)),
    };
  });

  return (
    <View
      style={[styles.wrap, { width: footprint, height: footprint }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        accessible={false}
        importantForAccessibility="no"
        style={[styles.stack, { width: restSize, height: restSize }, circleStyle]}
      >
        <Svg width={restSize} height={restSize} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id={gradientId} cx="48%" cy="44%" r="54%">
              <Stop offset="0" stopColor={brand.deepForest} stopOpacity={0.9} />
              <Stop offset="0.34" stopColor={brand.forestGreen} stopOpacity={0.82} />
              <Stop offset="0.58" stopColor={brand.sage} stopOpacity={0.7} />
              <Stop offset="0.8" stopColor={brand.paleSage} stopOpacity={0.38} />
              <Stop offset="1" stopColor={brand.paleSage} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  stack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
