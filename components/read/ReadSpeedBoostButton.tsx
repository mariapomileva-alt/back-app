import { StyleSheet } from 'react-native';

import { AccessiblePressable } from '@/components/accessibility/AccessiblePressable';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { touch } from '@/theme/spacing';

type Props = {
  active: boolean;
  onPress: () => void;
};

export function ReadSpeedBoostButton({ active, onPress }: Props) {
  return (
    <AccessiblePressable
      accessibilityRole="button"
      accessibilityLabel={active ? t('read.speedBoostOn') : t('read.speedBoostOff')}
      accessibilityHint={active ? t('read.speedBoostOnHint') : t('read.speedBoostOffHint')}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.button}
    >
      <AppText variant="secondary" tone={active ? 'primary' : 'secondary'}>
        ×2
      </AppText>
    </AccessiblePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: touch.min,
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
