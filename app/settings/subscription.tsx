import { PlaceholderScreen } from '@/components/navigation/PlaceholderScreen';
import { t } from '@/locales/i18n';

export default function SubscriptionScreen() {
  return (
    <PlaceholderScreen title={t('settings.subscription')} body={t('placeholders.subscription')} />
  );
}
