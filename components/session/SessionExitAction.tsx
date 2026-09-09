import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
};

export function SessionExitAction({ onPress }: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={t('exercise.okay')}
      accessibilityHint={t('exercise.okayHint')}
      onPress={onPress}
      style={styles.action}
    >
      <AppText variant="body" tone="secondary">
        {t('exercise.okay')}
      </AppText>
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  action: {
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
