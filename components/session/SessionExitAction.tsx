import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { primaryButtonRadius } from '@/theme/buttonChrome';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
};

export function SessionExitAction({ onPress }: Props) {
  const { theme, themeName } = useTheme();
  const airy = themeName === 'softBeige';

  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={t('exercise.okay')}
      accessibilityHint={t('exercise.okayHint')}
      onPress={onPress}
      style={[
        styles.action,
        {
          borderRadius: primaryButtonRadius(themeName),
          backgroundColor: airy ? theme.colors.surfaceElevated : theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: airy ? 1 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <AppText variant="button">{t('exercise.okay')}</AppText>
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  action: {
    minHeight: touch.min,
    minWidth: 220,
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    zIndex: 2,
  },
});
