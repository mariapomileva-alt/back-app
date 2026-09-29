import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { getEmergencyByCountryCode } from '@/features/emergency/numbers';
import { formatBackPlusDate } from '@/features/subscription/formatBackPlusDate';
import { openBackPlusPaywall } from '@/features/subscription/openBackPlusPaywall';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadEmergencyCountryCode } from '@/storage/emergencyCountry';
import { spacing } from '@/theme/spacing';

function backPlusSubtitle(access: ReturnType<typeof useBackPlusAccess>): string {
  const { accessState, plan, renewalOrExpirationDate } = access;
  const date =
    renewalOrExpirationDate !== null ? formatBackPlusDate(renewalOrExpirationDate) : null;

  if (accessState === 'unavailable') {
    return t('settings.backPlusSubtitleUnavailable');
  }
  if (accessState === 'trialActive' && date) {
    return t('settings.backPlusSubtitleTrial', { date });
  }
  if (accessState === 'subscribed' && date) {
    return plan === 'monthly'
      ? t('settings.backPlusSubtitleMonthly', { date })
      : t('settings.backPlusSubtitleAnnual', { date });
  }
  if (accessState === 'expired' || accessState === 'none') {
    return t('settings.backPlusSubtitleRequired');
  }
  return t('settings.backPlusSubtitleRequired');
}

export default function SettingsScreen() {
  const router = useRouter();
  const { nativeName: languageName } = useLocale();
  const { themeName, hapticsEnabled, reduceMotionOverride, setHapticsEnabled, setReduceMotionOverride } =
    useTheme();
  const [emergencyCountry, setEmergencyCountry] = useState<string | null>(null);
  const backPlusAccess = useBackPlusAccess();
  const { hasPaidAccess } = backPlusAccess;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadEmergencyCountryCode().then((code) => {
        if (!active) {
          return;
        }
        setEmergencyCountry(getEmergencyByCountryCode(code)?.countryName ?? null);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const openPaidExperience = (path: '/settings/patterns' | '/settings/themes') => {
    if (!hasPaidAccess) {
      openBackPlusPaywall(router);
      return;
    }
    router.push(path);
  };

  return (
    <ScreenContainer phoneWidth>
      <ScreenHeader title={t('settings.title')} />
      <View style={styles.list}>
        <SettingsSection title={t('settings.groups.subscription')} first>
          <SettingsRow
            label={t('settings.subscription')}
            value={backPlusSubtitle(backPlusAccess)}
            accessibilityHint={t('settings.subscriptionHint')}
            onPress={() => router.push('/settings/subscription')}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.groups.experience')}>
          <SettingsRow
            label={t('settings.theme')}
            value={t(`themes.${themeName}`)}
            accessibilityHint={t('settings.themeHint')}
            onPress={() => openPaidExperience('/settings/themes')}
          />
          <SettingsRow
            label={t('settings.language')}
            value={languageName}
            accessibilityHint={t('settings.languageHint')}
            onPress={() => router.push('/settings/language')}
          />
          <SettingsRow
            label={t('settings.voice')}
            onPress={() => router.push('/settings/voice')}
          />
          <SettingsRow
            label={t('settings.haptics')}
            accessibilityHint={t('settings.hapticsHint')}
            switchValue={hapticsEnabled}
            onSwitchChange={setHapticsEnabled}
          />
          <SettingsRow
            label={t('settings.reduceMotion')}
            accessibilityHint={t('settings.reduceMotionHint')}
            switchValue={reduceMotionOverride}
            onSwitchChange={setReduceMotionOverride}
          />
          <SettingsRow
            label={t('settings.read')}
            accessibilityHint={t('settings.readHint')}
            onPress={() => router.push('/settings/read')}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.groups.personal')}>
          <SettingsRow
            label={t('settings.profile')}
            accessibilityHint={t('settings.profileHint')}
            onPress={() => router.push('/settings/profile')}
          />
          <SettingsRow
            label={t('settings.supportContact')}
            onPress={() => router.push('/support/setup')}
          />
          <SettingsRow
            label={t('settings.patterns')}
            onPress={() => openPaidExperience('/settings/patterns')}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.groups.safetyLegal')}>
          <SettingsRow
            label={t('settings.emergency')}
            value={emergencyCountry ?? undefined}
            onPress={() => router.push('/settings/emergency')}
          />
          <SettingsRow
            label={t('settings.privacy')}
            onPress={() => router.push('/settings/privacy')}
          />
          <SettingsRow
            label={t('settings.terms')}
            onPress={() => router.push('/settings/terms')}
          />
          <SettingsRow
            label={t('settings.about')}
            onPress={() => router.push('/settings/about')}
            showDivider={false}
          />
        </SettingsSection>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});
