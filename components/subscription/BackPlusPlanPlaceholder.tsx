import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type PlanId = 'monthly' | 'annual';

type Props = {
  planId: PlanId;
};

export function BackPlusPlanPlaceholder({ planId }: Props) {
  const { theme } = useTheme();
  const titleKey = planId === 'monthly' ? 'subscription.planMonthly' : 'subscription.planAnnual';
  const labelKey =
    planId === 'monthly' ? 'subscription.planMonthlyLabel' : 'subscription.planAnnualLabel';

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${t(titleKey)}. ${t('subscription.planUnavailableA11y')}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <AppText variant="body" style={styles.title}>
        {t(titleKey)}
      </AppText>
      <AppText variant="secondary" tone="secondary">
        {t('subscription.planUnavailable')}
      </AppText>
      <AppText variant="secondary" tone="secondary" style={styles.note}>
        {t(labelKey)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    fontWeight: '600',
  },
  note: {
    marginTop: spacing.xxs,
  },
});
