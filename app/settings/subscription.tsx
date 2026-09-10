import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TextButton } from '@/components/buttons/TextButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { hasRevenueCatConfig } from '@/config/production';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.subscription')} />
      <View style={styles.body}>
        <AppText variant="body">{t('subscription.available')}</AppText>
        <AppText variant="body">{t('subscription.noPaywall')}</AppText>
        <AppText variant="body">
          {hasRevenueCatConfig() ? t('subscription.later') : t('subscription.mock')}
        </AppText>
        <TextButton
          label={t('subscription.settings')}
          accessibilityHint={t('subscription.settingsHint')}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }
            router.replace('/settings');
          }}
          style={styles.link}
        />
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
