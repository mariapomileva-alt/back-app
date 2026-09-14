import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function NotFoundScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('app.name')} onClose={() => router.replace('/')} />
        <AppText style={styles.title}>{t('notFound.title')}</AppText>
        <AppText variant="body" tone="secondary" style={styles.body}>
          {t('notFound.body')}
        </AppText>
        <PrimaryButton
          label={t('notFound.home')}
          accessibilityHint={t('notFound.homeHint')}
          onPress={() => router.replace('/')}
        />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '500',
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  body: {
    marginBottom: spacing.xl,
    maxWidth: 340,
  },
});
