import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type PlanId = 'monthly' | 'annual';

type Props = {
  planId: PlanId;
  highlight?: boolean;
};

export function BackPlusPlanPlaceholder({ planId, highlight }: Props) {
  const { theme } = useTheme();
  const titleKey = planId === 'monthly' ? 'subscription.planMonthly' : 'subscription.planAnnual';
  const labelKey =
    planId === 'monthly' ? 'subscription.planMonthlyLabel' : 'subscription.planAnnualLabel';
  const trialKey = planId === 'annual' ? 'subscription.planAnnualTrial' : 'subscription.planMonthlyNoTrial';

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${t(titleKey)}. ${t('subscription.planUnavailableA11y')}`}
      style={[
        styles.card,
        highlight ? styles.cardHighlight : null,
        {
          backgroundColor: theme.colors.surface,
          borderColor: highlight ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      {highlight ? (
        <AppText variant="secondary" tone="secondary" style={styles.badge}>
          {t('subscription.bestValue')}
        </AppText>
      ) : null}
      <AppText variant="body" style={styles.title}>
        {t(titleKey)}
      </AppText>
      <AppText variant="secondary" tone="secondary">
        {t(trialKey)}
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
  cardHighlight: {
    borderWidth: 1.5,
  },
  badge: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 11,
  },
  title: {
    fontWeight: '600',
  },
  note: {
    marginTop: spacing.xxs,
  },
});
