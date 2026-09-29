import { StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { touch } from '@/theme/spacing';

type Props = {
  muted: boolean;
  onPress: () => void;
  labelOn?: string;
  labelOff?: string;
  hintOn?: string;
  hintOff?: string;
};

export function SfxMuteButton({ muted, onPress, labelOn, labelOff, hintOn, hintOff }: Props) {
  const { theme } = useTheme();
  const color = theme.colors.icon;
  const onLabel = labelOn ?? t('distract.soundOn');
  const offLabel = labelOff ?? t('distract.soundOff');
  const onHint = hintOn ?? t('distract.soundOnHint');
  const offHint = hintOff ?? t('distract.soundOffHint');

  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={muted ? offLabel : onLabel}
      accessibilityHint={muted ? onHint : offHint}
      accessibilityState={{ selected: !muted }}
      onPress={onPress}
      style={styles.button}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
          d="M4 10h3l4-3v10l-4-3H4v-4z"
          fill="none"
          stroke={color}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        {muted ? (
          <Path d="M16 9l5 6M21 9l-5 6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
        ) : (
          <Circle cx="18" cy="12" r="3" stroke={color} strokeWidth={1.4} fill="none" />
        )}
      </Svg>
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
