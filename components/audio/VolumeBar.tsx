import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const STEPS = [0.2, 0.4, 0.6, 0.8, 1];

export function VolumeBar({ value, onChange }: Props) {
  const { theme } = useTheme();

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={t('listen.volume')}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={styles.row}
    >
      {STEPS.map((step) => {
        const active = value + 0.001 >= step;
        return (
          <Pressable
            key={step}
            accessibilityRole="button"
            accessibilityLabel={`${t('listen.volume')} ${Math.round(step * 100)}`}
            onPress={() => onChange(step)}
            style={styles.step}
          >
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: active ? theme.colors.secondaryGreen : theme.colors.surfaceSecondary,
                },
              ]}
            />
          </Pressable>
        );
      })}
      <AppText variant="body" tone="secondary" style={styles.label}>
        {t('listen.volume')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touch.min,
  },
  step: {
    flex: 1,
    minHeight: touch.min,
    justifyContent: 'center',
  },
  bar: {
    height: 10,
    borderRadius: radius.circle,
  },
  label: {
    marginLeft: spacing.xs,
  },
});
