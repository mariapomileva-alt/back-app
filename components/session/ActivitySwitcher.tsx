import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
  label?: string;
  accessibilityHint?: string;
};

export function ActivitySwitcher({ onPress, label, accessibilityHint }: Props) {
  const resolved = label ?? t('exercise.tryAnother');

  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={resolved}
      accessibilityHint={accessibilityHint ?? t('exercise.tryAnotherHint')}
      onPress={onPress}
      style={styles.action}
    >
      <AppText variant="secondary" tone="secondary">
        {resolved}
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
