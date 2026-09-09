import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader title={t('notFound.title')} />
      <AppText variant="body" tone="secondary" style={{ marginBottom: spacing.xl }}>
        {t('notFound.body')}
      </AppText>
      <PrimaryButton label={t('notFound.home')} onPress={() => router.replace('/')} />
    </ScreenContainer>
  );
}
