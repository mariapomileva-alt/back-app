import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { AppText } from '@/components/typography/AppText';
import { brand } from '@/theme/colors';
import { serif } from '@/theme/fonts';
import { useTheme } from '@/hooks/useTheme';

type Layer = {
  key: string;
  size: number;
  color: string;
  opacity: number;
};

type Props = {
  restSize: number;
  maxScale: number;
  scale: SharedValue<number>;
  cue: string;
  accessibilityLabel: string;
};

export function BreathingCircle({ restSize, maxScale, scale, cue, accessibilityLabel }: Props) {
  const { theme } = useTheme();
  const footprint = restSize * maxScale;
  const layers: Layer[] = [
    { key: 'pale', size: restSize, color: theme.colors.muted, opacity: 0.55 },
    { key: 'sage', size: restSize * 0.84, color: theme.colors.secondaryGreen, opacity: 0.58 },
    { key: 'forest', size: restSize * 0.68, color: theme.colors.forest, opacity: 0.7 },
    { key: 'deep', size: restSize * 0.52, color: brand.deepForest, opacity: 0.96 },
  ];

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[styles.wrap, { width: footprint, height: footprint }]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={[styles.stack, { width: restSize, height: restSize }, circleStyle]}
      >
        {layers.map((layer) => (
          <View
            key={layer.key}
            style={[
              styles.layer,
              {
                width: layer.size,
                height: layer.size,
                borderRadius: layer.size / 2,
                backgroundColor: layer.color,
                opacity: layer.opacity,
                top: (restSize - layer.size) / 2,
                left: (restSize - layer.size) / 2,
              },
            ]}
          />
        ))}
      </Animated.View>
      <View pointerEvents="none" style={styles.cueWrap} accessible={false}>
        <AppText
          variant="instruction"
          numberOfLines={2}
          accessible={false}
          style={[styles.cue, { color: theme.colors.buttonText, maxWidth: restSize * 0.86 }]}
        >
          {cue}
        </AppText>
      </View>
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
  layer: {
    position: 'absolute',
  },
  cueWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cue: {
    fontFamily: serif,
    fontWeight: '500',
    textAlign: 'center',
  },
});
