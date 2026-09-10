import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function SettingsScreen() {
  const router = useRouter();
  const { themeName, hapticsEnabled, reduceMotionOverride, setHapticsEnabled, setReduceMotionOverride } =
    useTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.title')} />
      <View style={styles.list}>
        <SettingsSection title={t('settings.groups.experience')} first>
          <SettingsRow
            label={t('settings.theme')}
            value={t(`themes.${themeName}`)}
            accessibilityHint={t('settings.themeHint')}
            onPress={() => router.push('/settings/themes')}
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
            label={t('settings.supportContact')}
            onPress={() => router.push('/support/setup')}
          />
          <SettingsRow
            label={t('settings.patterns')}
            onPress={() => router.push('/settings/patterns')}
          />
          <SettingsRow
            label={t('settings.subscription')}
            onPress={() => router.push('/settings/subscription')}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.groups.safetyLegal')}>
          <SettingsRow
            label={t('settings.emergency')}
            onPress={() => router.push('/settings/emergency')}
          />
          <SettingsRow
            label={t('settings.privacy')}
            onPress={() => router.push('/settings/privacy')}
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
