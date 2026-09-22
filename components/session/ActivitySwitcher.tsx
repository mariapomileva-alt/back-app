import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import {
  SECONDARY_CONTROL_LABEL_OPACITY,
  secondaryControlLabelColor,
} from '@/theme/colors';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
  label?: string;
  accessibilityHint?: string;
};

export function ActivitySwitcher({ onPress, label, accessibilityHint }: Props) {
  const { theme } = useTheme();
  const resolved = label ?? t('exercise.tryAnother');

  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={resolved}
      accessibilityHint={accessibilityHint ?? t('exercise.tryAnotherHint')}
      onPress={onPress}
      style={styles.action}
    >
      <AppText
        variant="secondary"
        style={{
          color: secondaryControlLabelColor(theme),
          opacity: SECONDARY_CONTROL_LABEL_OPACITY,
        }}
      >
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
