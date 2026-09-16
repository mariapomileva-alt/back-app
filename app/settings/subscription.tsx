import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BackPlusPlanPlaceholder } from '@/components/subscription/BackPlusPlanPlaceholder';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import {
  backPlusLegalUrls,
  plannedBackPlusBenefits,
  releasedBackPlusBenefits,
} from '@/config/backPlus';
import { formatBackPlusDate } from '@/features/subscription/formatBackPlusDate';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

function BenefitList({ benefitIds, tone }: { benefitIds: string[]; tone?: 'secondary' }) {
  return (
    <View style={styles.listBlock} accessibilityRole="list">
      {benefitIds.map((id) => (
        <View key={id} style={styles.listItem}>
          <AppText variant="body" tone={tone}>
            {t(`subscription.benefits.${id}`)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { accessState, plan, renewalOrExpirationDate, storePurchasesAvailable } = useBackPlusAccess();
  const released = releasedBackPlusBenefits();
  const planned = plannedBackPlusBenefits();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/settings');
  };

  const isActive = accessState === 'trialActive' || accessState === 'subscribed';
  const isExpired = accessState === 'expired';
  const isUnavailable = accessState === 'unavailable';
  const dateLabel =
    renewalOrExpirationDate !== null ? formatBackPlusDate(renewalOrExpirationDate) : null;

  const headlineKey = isActive
    ? 'subscription.headlineActive'
    : isExpired
      ? 'subscription.headlineExpired'
      : 'subscription.headline';

  const introKey = isActive
    ? accessState === 'trialActive'
      ? 'subscription.introTrialActive'
      : plan === 'monthly'
        ? 'subscription.introMonthlyActive'
        : 'subscription.introAnnualActive'
    : isExpired
      ? 'subscription.introExpired'
      : isUnavailable
        ? 'subscription.introPreparing'
        : 'subscription.intro';

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader title={t('settings.backPlus')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.body}>
          <AppText variant="secondary" tone="secondary">
            {t('subscription.kicker')}
          </AppText>
          <AppText variant="hero" style={styles.headline}>
            {t(headlineKey)}
          </AppText>
          <AppText variant="body" style={styles.copy}>
            {t(introKey, dateLabel ? { date: dateLabel } : undefined)}
          </AppText>

          {isActive && dateLabel ? (
            <AppText variant="body" tone="secondary" style={styles.statusLine}>
              {accessState === 'trialActive'
                ? t('subscription.statusTrialEnds', { date: dateLabel })
                : plan === 'monthly'
                  ? t('subscription.statusMonthlyRenews', { date: dateLabel })
                  : t('subscription.statusAnnualRenews', { date: dateLabel })}
            </AppText>
          ) : null}

          {!isActive ? (
            <>
              <AppText variant="body" style={styles.sectionTitle}>
                {t('subscription.benefitsTitle')}
              </AppText>
              <BenefitList benefitIds={released.map((b) => b.id)} />
              {planned.length > 0 ? (
                <>
                  <AppText variant="secondary" tone="secondary" style={styles.plannedNote}>
                    {t('subscription.plannedNote')}
                  </AppText>
                  <BenefitList benefitIds={planned.map((b) => b.id)} tone="secondary" />
                </>
              ) : null}

              <AppText variant="body" style={styles.sectionTitle}>
                {t('subscription.safetyTitle')}
              </AppText>
              <AppText variant="body" tone="secondary">
                {t('subscription.safetyBody')}
              </AppText>

              {!isExpired ? (
                <>
                  <AppText variant="body" style={styles.sectionTitle}>
                    {t('subscription.chooseTitle')}
                  </AppText>
                  {isUnavailable ? (
                    <AppText variant="body">{t('subscription.preparing')}</AppText>
                  ) : (
                    <AppText variant="body">{t('subscription.chooseIntro')}</AppText>
                  )}
                  <View style={styles.plans}>
                    <BackPlusPlanPlaceholder planId="annual" highlight />
                    <BackPlusPlanPlaceholder planId="monthly" />
                  </View>
                  {!isUnavailable ? (
                    <AppText variant="secondary" tone="secondary">
                      {t('subscription.regionalPricing')}
                    </AppText>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          {isExpired ? (
            <SecondaryButton
              label={t('subscription.choosePlan')}
              onPress={() => {}}
              disabled={!storePurchasesAvailable}
              style={styles.primaryAction}
            />
          ) : null}

          <SecondaryButton
            label={t('subscription.notNow')}
            accessibilityHint={t('subscription.notNowHint')}
            onPress={close}
            style={styles.primaryAction}
          />

          <View style={styles.links}>
            <TextButton
              label={t('subscription.restore')}
              onPress={() => {}}
              disabled={!storePurchasesAvailable}
              style={styles.link}
            />
            {isActive ? (
              <TextButton
                label={t('subscription.manage')}
                onPress={() => {}}
                disabled={!storePurchasesAvailable}
                style={styles.link}
              />
            ) : null}
            {isExpired ? (
              <TextButton
                label={t('session.emergency')}
                onPress={() => router.push('/settings/emergency')}
                style={styles.link}
              />
            ) : null}
            <TextButton
              label={t('subscription.linkSupport')}
              onPress={() => {
                void Linking.openURL(backPlusLegalUrls.support);
              }}
              style={styles.link}
            />
            <TextButton
              label={t('subscription.linkPrivacy')}
              onPress={() => {
                void Linking.openURL(backPlusLegalUrls.privacy);
              }}
              style={styles.link}
            />
            <TextButton
              label={t('subscription.linkTerms')}
              onPress={() => {
                void Linking.openURL(backPlusLegalUrls.terms);
              }}
              style={styles.link}
            />
            <TextButton
              label={t('subscription.linkSubscriptions')}
              onPress={() => {
                void Linking.openURL(backPlusLegalUrls.subscriptions);
              }}
              style={styles.link}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  body: {
    marginTop: spacing.md,
    maxWidth: 360,
    gap: spacing.sm,
  },
  headline: {
    marginTop: spacing.xxs,
  },
  copy: {
    marginTop: spacing.xs,
  },
  statusLine: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  listBlock: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  listItem: {
    paddingLeft: spacing.xs,
  },
  plannedNote: {
    marginTop: spacing.md,
  },
  plans: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  primaryAction: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    minHeight: touch.min,
  },
  links: {
    marginTop: spacing.lg,
    gap: spacing.xxs,
  },
  link: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    minHeight: touch.min,
  },
});
