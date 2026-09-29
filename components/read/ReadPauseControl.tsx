import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  paused: boolean;
  onPress: () => void;
};

export function ReadPauseControl({ paused, onPress }: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={paused ? t('read.continue') : t('read.pause')}
      accessibilityHint={paused ? t('read.continueHint') : t('read.pauseHint')}
      accessibilityState={{ selected: paused }}
      onPress={onPress}
      style={styles.action}
    >
      <AppText variant="secondary" tone="secondary">
        {paused ? t('read.continue') : t('read.pause')}
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
