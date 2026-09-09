import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { touch } from '@/theme/spacing';

type Props = {
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: 'close' | 'back';
};

export function CloseButton({ onPress, accessibilityLabel, accessibilityHint, variant = 'close' }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const color = theme.colors.icon;
  const isBack = variant === 'back';

  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isBack ? t('common.back') : t('common.close'))}
      accessibilityHint={accessibilityHint ?? t('common.closeHint')}
      onPress={onPress ?? (() => router.back())}
      style={styles.button}
    >
      <View accessible={false}>
        <Svg width={22} height={22} viewBox="0 0 22 22">
          {isBack ? (
            <Path
              d="M14 4 L6 11 L14 18"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <>
              <Line
                x1="4"
                y1="4"
                x2="18"
                y2="18"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Line
                x1="18"
                y1="4"
                x2="4"
                y2="18"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </>
          )}
        </Svg>
      </View>
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
