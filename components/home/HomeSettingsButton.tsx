import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { SettingsIcon } from '@/components/icons/ToolIcons';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onPress: () => void;
};

export function HomeSettingsButton({ onPress }: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={t('home.openSettings')}
      accessibilityHint={t('home.openSettingsHint')}
      onPress={onPress}
      style={styles.hit}
    >
      <SettingsIcon size={20} />
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
});
