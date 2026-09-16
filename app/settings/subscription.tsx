import { Linking, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BackPlusPlanPlaceholder } from '@/components/subscription/BackPlusPlanPlaceholder';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import {
  backPlusFreeForeverIds,
  backPlusLegalUrls,
  getBackPlusDisplayState,
  plannedBackPlusBenefits,
  releasedBackPlusBenefits,
} from '@/config/backPlus';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

function BenefitList({
  benefitIds,
  tone,
}: {
  benefitIds: string[];
  tone?: 'secondary';
}) {
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

function FreeBenefitList() {
  return (
    <View style={styles.listBlock} accessibilityRole="list">
      {backPlusFreeForeverIds.map((id) => (
        <View key={id} style={styles.listItem}>
          <AppText variant="body">{t(`subscription.freeForever.${id}`)}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const state = getBackPlusDisplayState();
  const released = releasedBackPlusBenefits();
  const planned = plannedBackPlusBenefits();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/settings');
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.backPlus')} />
      <View style={styles.body}>
        <AppText variant="secondary" tone="secondary">
          {t('subscription.kicker')}
        </AppText>
        <AppText variant="hero" style={styles.headline}>
          {state === 'active' ? t('subscription.headlineActive') : t('subscription.headline')}
        </AppText>
        <AppText variant="body" style={styles.copy}>
          {state === 'active' ? t('subscription.introActive') : t('subscription.intro')}
        </AppText>

        {state !== 'active' ? (
          <>
            <AppText variant="body" style={styles.sectionTitle}>
              {t('subscription.freeTitle')}
            </AppText>
            <FreeBenefitList />

            <AppText variant="body" style={styles.sectionTitle}>
              {t('subscription.includesTitle')}
            </AppText>
            {released.length > 0 ? (
              <BenefitList benefitIds={released.map((b) => b.id)} />
            ) : (
              <AppText variant="body" tone="secondary">
                {t('subscription.includesEmpty')}
              </AppText>
            )}
            {planned.length > 0 ? (
              <>
                <AppText variant="secondary" tone="secondary" style={styles.plannedNote}>
                  {t('subscription.plannedNote')}
                </AppText>
                <BenefitList benefitIds={planned.map((b) => b.id)} tone="secondary" />
              </>
            ) : null}

            <AppText variant="body" style={styles.sectionTitle}>
              {t('subscription.chooseTitle')}
            </AppText>

            {state === 'store_unavailable' ? (
              <AppText variant="body">{t('subscription.preparing')}</AppText>
            ) : (
              <AppText variant="body">{t('subscription.chooseIntro')}</AppText>
            )}

            <View style={styles.plans}>
              <BackPlusPlanPlaceholder planId="monthly" />
              <BackPlusPlanPlaceholder planId="annual" />
            </View>
            <AppText variant="secondary" tone="secondary">
              {t('subscription.regionalPricing')}
            </AppText>
          </>
        ) : null}

        <SecondaryButton
          label={t('subscription.notNow')}
          accessibilityHint={t('subscription.notNowHint')}
          onPress={close}
          style={styles.primaryAction}
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
          <TextButton
            label={t('subscription.linkSubscriptions')}
            onPress={() => {
              void Linking.openURL(backPlusLegalUrls.subscriptions);
            }}
            style={styles.link}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.md,
    maxWidth: 360,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
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
  },
  links: {
    marginTop: spacing.lg,
    gap: spacing.xxs,
  },
  link: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
});
