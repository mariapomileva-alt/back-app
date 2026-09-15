import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { useTheme } from '@/hooks/useTheme';
import { mixHex } from '@/theme/colors';

type Props = {
  restSize: number;
  openSize: number;
  openness: number;
  reduceMotion?: boolean;
  accessibilityLabel: string;
};

export function BreathingCircle({
  restSize,
  openSize,
  openness,
  reduceMotion = false,
  accessibilityLabel,
}: Props) {
  const { theme } = useTheme();
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `breathFill${rawId}`;
  const t = Math.min(1, Math.max(0, openness));
  // Real width/height (not Reanimated/CSS scale). Reduce Motion only dims fill.
  const diameter = restSize + (openSize - restSize) * t;
  const forest = theme.colors.forest;
  const sage = theme.colors.secondaryGreen;
  const pale = theme.colors.muted;
  const onDark = theme.name === 'deepGreen';
  const core = onDark ? mixHex(sage, forest, 0.16) : mixHex(forest, sage, 0.26);
  const mid = mixHex(sage, pale, 0.14);
  const rim = mixHex(pale, sage, onDark ? 0.08 : 0.2);
  const fillOpacity = reduceMotion ? 0.46 + t * 0.5 : 1;

  return (
    <View
      style={[styles.wrap, { width: openSize, height: openSize }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <View
        testID="breath-orb"
        collapsable={false}
        {...skipA11yNode()}
        style={[styles.orb, { width: diameter, height: diameter, opacity: fillOpacity }]}
      >
        <Svg width={diameter} height={diameter} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id={gradientId} cx="47%" cy="45%" r="56%">
              <Stop offset="0%" stopColor={core} stopOpacity={1} />
              <Stop offset="28%" stopColor={core} stopOpacity={0.96} />
              <Stop offset="58%" stopColor={mid} stopOpacity={0.94} />
              <Stop offset="84%" stopColor={rim} stopOpacity={onDark ? 0.28 : 0.5} />
              <Stop offset="100%" stopColor={rim} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
        </Svg>
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
  orb: {
    overflow: 'visible',
  },
});
