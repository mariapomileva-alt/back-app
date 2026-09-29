import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BackPlusActivePlanCard } from '@/components/subscription/BackPlusActivePlanCard';
import { BackPlusPlanPlaceholder } from '@/components/subscription/BackPlusPlanPlaceholder';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
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
import { openManageSubscription } from '@/features/subscription/openManageSubscription';
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

  const isSubscribed = accessState === 'subscribed';
  const isTrial = accessState === 'trialActive';
  const isActive = isSubscribed || isTrial;
  const isExpired = accessState === 'expired';
  const isEligible = accessState === 'none';
  const isUnavailable = accessState === 'unavailable';
  const renewalDate = renewalOrExpirationDate;
  const activePlan = plan ?? 'annual';

  const showManagePreviewNote = isActive && (!storePurchasesAvailable || Platform.OS === 'web');

  return (
    <ScreenContainer scroll={false} phoneWidth>
      <ScreenHeader title={t('settings.subscription')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.body}>
          {isActive ? (
            <>
              <AppText variant="hero" style={styles.headline}>
                {t(isTrial ? 'subscription.headlineTrial' : 'subscription.headlineActive')}
              </AppText>
              <AppText variant="body" style={styles.copy}>
                {t(
                  isTrial ? 'subscription.introTrialActive' : 'subscription.introThankYouActive',
                )}
              </AppText>
              {renewalDate ? (
                <BackPlusActivePlanCard plan={activePlan} renewalDate={renewalDate} trial={isTrial} />
              ) : null}
              {isTrial ? (
                <AppText variant="body" tone="secondary" style={styles.copy}>
                  {t('subscription.trialAfterNote')}
                </AppText>
              ) : null}
              <AppText variant="body" style={styles.sectionTitle}>
                {t('subscription.whatsIncluded')}
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
              <PrimaryButton
                label={t(isTrial ? 'subscription.continue' : 'subscription.done')}
                onPress={close}
                accessibilityHint={t('subscription.doneHint')}
                style={styles.primaryAction}
              />
              {showManagePreviewNote ? (
                <AppText variant="secondary" tone="secondary" style={styles.previewNote}>
                  {t('subscription.managePreviewNote')}
                </AppText>
              ) : null}
              <View style={styles.links}>
                <TextButton
                  label={t('subscription.manage')}
                  onPress={() => openManageSubscription(storePurchasesAvailable)}
                  style={styles.link}
                />
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
              </View>
            </>
          ) : null}

          {isExpired ? (
            <>
              <AppText variant="hero" style={styles.headline}>
                {t('subscription.headlineExpired')}
              </AppText>
              <AppText variant="body" style={styles.copy}>
                {t('subscription.introExpired')}
              </AppText>
              <PrimaryButton
                label={t('subscription.choosePlan')}
                onPress={() => {}}
                disabled={!storePurchasesAvailable}
                style={styles.primaryAction}
              />
              <TextButton
                label={t('subscription.restore')}
                onPress={() => {}}
                disabled={!storePurchasesAvailable}
                style={styles.link}
              />
              <TextButton
                label={t('session.emergency')}
                onPress={() => router.push('/settings/emergency')}
                style={styles.link}
              />
              <SecondaryButton
                label={t('subscription.notNow')}
                accessibilityHint={t('subscription.notNowHint')}
                onPress={close}
                style={styles.secondaryAction}
              />
              <View style={styles.links}>
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
              </View>
            </>
          ) : null}

          {isEligible || isUnavailable ? (
            <>
              <AppText variant="secondary" tone="secondary">
                {t('subscription.kicker')}
              </AppText>
              <AppText variant="hero" style={styles.headline}>
                {t('subscription.headline')}
              </AppText>
              <AppText variant="body" style={styles.copy}>
                {t(isUnavailable ? 'subscription.introPreparing' : 'subscription.intro')}
              </AppText>
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
                  {isEligible ? (
                    <AppText variant="secondary" tone="secondary">
                      {t('subscription.regionalPricing')}
                    </AppText>
                  ) : null}
                </>
              ) : null}
              {isEligible ? (
                <PrimaryButton
                  label={t('subscription.startTrial')}
                  onPress={() => {}}
                  disabled={!storePurchasesAvailable}
                  style={styles.primaryAction}
                />
              ) : null}
              {isEligible ? (
                <TextButton
                  label={t('subscription.restore')}
                  onPress={() => {}}
                  disabled={!storePurchasesAvailable}
                  style={styles.link}
                />
              ) : null}
              <SecondaryButton
                label={t('subscription.notNow')}
                accessibilityHint={t('subscription.notNowHint')}
                onPress={close}
                style={styles.secondaryAction}
              />
              <View style={styles.links}>
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
                {!isUnavailable ? (
                  <TextButton
                    label={t('subscription.linkSubscriptions')}
                    onPress={() => {
                      void Linking.openURL(backPlusLegalUrls.subscriptions);
                    }}
                    style={styles.link}
                  />
                ) : null}
              </View>
            </>
          ) : null}

          {accessState === 'loading' ? (
            <AppText variant="body" tone="secondary">
              {t('subscription.loading')}
            </AppText>
          ) : null}
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
    gap: spacing.sm,
  },
  headline: {
    marginTop: spacing.xxs,
  },
  copy: {
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
  secondaryAction: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
    minHeight: touch.min,
  },
  previewNote: {
    marginTop: spacing.sm,
    lineHeight: 20,
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
