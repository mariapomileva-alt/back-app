import { useState } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { shareBack } from '@/features/session/shareBack';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const [shareUnavailable, setShareUnavailable] = useState(false);

  return (
    <ScreenContainer phoneWidth>
      <ScreenHeader title={t('settings.about')} />
      <View style={styles.body}>
        <AppText variant="hero">{t('app.name')}</AppText>
        <AppText variant="body" style={styles.copy}>
          {t('about.body')}
        </AppText>
        <AppText variant="body" tone="secondary" style={styles.copy}>
          {t('about.disclaimer')}
        </AppText>
        <SecondaryButton
          label={t('session.share')}
          accessibilityHint={t('session.shareHint')}
          onPress={() => {
            void shareBack().then((result) => {
              setShareUnavailable(result === 'unavailable');
            });
          }}
          style={styles.share}
        />
        {shareUnavailable ? (
          <AppText variant="secondary" tone="secondary">
            {t('session.shareUnavailable')}
          </AppText>
        ) : null}
        <AppText variant="secondary" tone="secondary" style={styles.version}>
          {version}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.xl,
    maxWidth: 360,
  },
  copy: {
    marginTop: spacing.md,
  },
  share: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  version: {
    marginTop: spacing.lg,
  },
});
