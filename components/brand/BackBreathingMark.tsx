import { useId } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { breathingStops, type BreathingMarkVariant } from '@/theme/brandIdentity';

type Props = {
  size?: number;
  variant?: BreathingMarkVariant;
  decorative?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function BackBreathingMark({
  size = 72,
  variant = 'warmEarth',
  decorative = true,
  accessibilityLabel = 'Back',
  style,
}: Props) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `backBreath${rawId}`;
  const stops = breathingStops[variant];

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      style={[styles.wrap, { width: size, height: size }, style]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100" accessible={false}>
        <Defs>
          <RadialGradient id={gradientId} cx="38%" cy="34%" r="68%" fx="34%" fy="30%">
            {stops.map((stop) => (
              <Stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
