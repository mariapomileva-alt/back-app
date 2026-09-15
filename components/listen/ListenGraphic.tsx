import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';

import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/theme/colors';

type Variant = 'fan' | 'brown';

type Props = {
  variant: Variant;
};

export function ListenGraphic({ variant }: Props) {
  const { theme } = useTheme();

  if (variant === 'brown') {
    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
          <Rect x="0" y="0" width="220" height="120" fill={hexToRgba(theme.colors.clay, 0.18)} />
          <Circle cx="58" cy="64" r="46" fill={hexToRgba(theme.colors.clay, 0.34)} />
          <Circle cx="122" cy="48" r="38" fill={hexToRgba(theme.colors.highlight, 0.22)} />
          <Circle cx="168" cy="72" r="42" fill={hexToRgba(theme.colors.forest, 0.2)} />
          <Circle cx="96" cy="88" r="28" fill={hexToRgba(theme.colors.clay, 0.28)} />
        </Svg>
      </View>
    );
  }

  const cool = theme.colors.cool;
  const sage = theme.colors.secondaryGreen;

  return (
    <View {...skipA11yNode()} style={styles.frame}>
      <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
        <Path
          d="M18 28 C70 8 150 48 202 24"
          fill="none"
          stroke={cool}
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.38}
        />
        <Path
          d="M14 48 C72 28 148 68 206 46"
          fill="none"
          stroke={sage}
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.62}
        />
        <Path
          d="M20 68 C76 50 146 86 200 70"
          fill="none"
          stroke={cool}
          strokeWidth={1.3}
          strokeLinecap="round"
          opacity={0.44}
        />
        <Path
          d="M24 88 C80 74 140 102 196 90"
          fill="none"
          stroke={sage}
          strokeWidth={1.15}
          strokeLinecap="round"
          opacity={0.4}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
