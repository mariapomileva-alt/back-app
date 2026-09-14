import { Linking, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { productionConfig } from '@/config/production';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function TermsScreen() {
  const router = useRouter();
  const termsUrl = productionConfig.termsUrl;

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.terms')} />
      <View style={styles.body}>
        <AppText variant="body">{t('terms.selfHelp')}</AppText>
        <AppText variant="body">{t('terms.emergency')}</AppText>
        <AppText variant="body">{t('terms.calls')}</AppText>
        <AppText variant="body">{t('terms.data')}</AppText>
        <TextButton
          label={t('privacy.extraSupport')}
          accessibilityHint={t('privacy.extraSupportHint')}
          onPress={() => router.push('/settings/emergency')}
          style={styles.link}
        />
        {termsUrl ? (
          <TextButton
            label={t('legal.openWeb')}
            onPress={() => {
              void Linking.openURL(termsUrl);
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
