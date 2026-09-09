import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings.about')} />
      <View style={styles.body}>
        <AppText variant="hero">{t('app.name')}</AppText>
        <AppText variant="body" style={styles.copy}>
          {t('about.body')}
        </AppText>
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
  version: {
    marginTop: spacing.lg,
  },
});
