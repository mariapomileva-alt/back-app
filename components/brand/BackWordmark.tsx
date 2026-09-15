import { PixelRatio, StyleSheet, View, type AccessibilityRole, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';
import {
  resolveWordmarkColor,
  type WordmarkVariant,
} from '@/theme/brandIdentity';
import { maxFontSizeMultiplier } from '@/theme/typography';

import { wordmarkHeight, wordmarkPaths, wordmarkViewBox, wordmarkWidth } from './wordmarkPaths';

type Props = {
  size?: number;
  color?: string;
  variant?: WordmarkVariant;
  decorative?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  style?: StyleProp<ViewStyle>;
};

export function BackWordmark({
  size = 22,
  color,
  variant = 'theme',
  decorative = false,
  accessibilityLabel = 'Back',
  accessibilityRole,
  style,
}: Props) {
  const { theme } = useTheme();
  const fill = resolveWordmarkColor(variant, theme.name, color);
  const fontScale = Math.min(PixelRatio.getFontScale(), maxFontSizeMultiplier);
  const height = size * (wordmarkHeight / 2048) * fontScale;
  const width = height * (wordmarkWidth / wordmarkHeight);

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : accessibilityRole}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      style={[styles.wrap, { width, height }, style]}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={wordmarkViewBox}
        accessible={false}
        importantForAccessibility="no"
      >
        <Path fill={fill} d={wordmarkPaths.B} />
        <Path fill={fill} d={wordmarkPaths.a} />
        <Path fill={fill} d={wordmarkPaths.c} />
        <Path fill={fill} d={wordmarkPaths.k} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
  },
});
