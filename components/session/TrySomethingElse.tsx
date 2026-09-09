import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
};

export function TrySomethingElse({ onPress }: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={t('session.tryElse')}
      accessibilityHint={t('session.tryElseHint')}
      onPress={onPress}
      style={styles.action}
    >
      <AppText variant="secondary" tone="secondary">
        {t('session.tryElse')}
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
