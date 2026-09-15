import { Linking, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { productionConfig } from '@/config/production';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function PrivacyScreen() {
  const router = useRouter();
  const privacyUrl = productionConfig.privacyUrl;

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.privacy')} />
      <View style={styles.body}>
        <AppText variant="body">{t('privacy.onDevice')}</AppText>
        <AppText variant="body">{t('privacy.stored')}</AppText>
        <AppText variant="body">{t('privacy.notSent')}</AppText>
        <AppText variant="body">{t('privacy.emergency')}</AppText>
        <AppText variant="body">{t('privacy.notMedical')}</AppText>
        <TextButton
          label={t('privacy.extraSupport')}
          accessibilityHint={t('privacy.extraSupportHint')}
          onPress={() => router.push('/settings/emergency')}
          style={styles.link}
        />
        {privacyUrl ? (
          <TextButton
            label={t('privacy.policy')}
            onPress={() => {
              void Linking.openURL(privacyUrl);
            }}
            style={styles.link}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.xl,
    maxWidth: 360,
    gap: spacing.md,
  },
  link: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
});
