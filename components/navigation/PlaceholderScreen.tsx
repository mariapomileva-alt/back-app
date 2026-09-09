import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  body?: string;
};

export function PlaceholderScreen({ title, body }: Props) {
  return (
    <ScreenContainer>
      <ScreenHeader title={title} />
      <AppText variant="instruction" style={{ marginTop: spacing.xl }}>
        {body ?? t('placeholders.settings')}
      </AppText>
    </ScreenContainer>
  );
}
