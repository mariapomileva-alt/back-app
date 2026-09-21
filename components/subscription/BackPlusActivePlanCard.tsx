import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import type { BackPlusPlanKind } from '@/config/backPlus';
import { formatBackPlusDate } from '@/features/subscription/formatBackPlusDate';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type Props = {
  plan: BackPlusPlanKind;
  renewalDate: Date;
  trial?: boolean;
};

export function BackPlusActivePlanCard({ plan, renewalDate, trial = false }: Props) {
  const { theme } = useTheme();
  const titleKey = plan === 'monthly' ? 'subscription.planMonthly' : 'subscription.planAnnual';
  const dateLabel = formatBackPlusDate(renewalDate);
  const renewKey = trial
    ? 'subscription.statusTrialEnds'
    : plan === 'monthly'
      ? 'subscription.statusMonthlyRenews'
      : 'subscription.statusAnnualRenews';

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${t(titleKey)}. ${t(renewKey, { date: dateLabel })}`}
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
    >
      <AppText variant="body" style={styles.title}>
        {t(titleKey)}
      </AppText>
      <AppText variant="secondary" tone="secondary">
        {t(renewKey, { date: dateLabel })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    gap: spacing.xxs,
  },
  title: {
    fontWeight: '600',
  },
});
