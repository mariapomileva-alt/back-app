import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba, mixHex } from '@/theme/colors';

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
  const bg = theme.colors.background;
  const onDark = theme.name === 'deepGreen';
  const airy = theme.name === 'softBeige';
  const core = airy ? '#5494F7' : onDark ? mixHex(sage, forest, 0.16) : mixHex(forest, sage, 0.26);
  const mid = airy ? '#9FC4AD' : mixHex(sage, pale, 0.14);
  const rim = airy ? '#BBD3FB' : mixHex(pale, sage, onDark ? 0.08 : 0.2);
  const fillOpacity = reduceMotion ? 0.46 + t * 0.5 : 1;
  const topFeather = Math.max(28, diameter * 0.14);

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
        <Svg width={diameter} height={diameter} viewBox="-6 -6 112 112">
          <Defs>
            <RadialGradient id={gradientId} cx="48%" cy="50%" r="62%">
              <Stop offset="0%" stopColor={core} stopOpacity={1} />
              <Stop offset="26%" stopColor={core} stopOpacity={0.97} />
              <Stop offset="52%" stopColor={mid} stopOpacity={0.92} />
              <Stop offset="78%" stopColor={rim} stopOpacity={onDark ? 0.22 : 0.38} />
              <Stop offset="92%" stopColor={bg} stopOpacity={0} />
              <Stop offset="100%" stopColor={bg} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
        </Svg>
        <LinearGradient
          pointerEvents="none"
          colors={[bg, hexToRgba(bg, 0)]}
          style={[styles.topFeather, { height: topFeather, width: diameter }]}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topFeather: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
