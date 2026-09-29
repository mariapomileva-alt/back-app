import { Share } from 'react-native';

import { t } from '@/locales/i18n';

export type ShareBackResult = 'shared' | 'cancelled' | 'unavailable';

/** Opens the system share sheet. Never invents a store URL. */
export async function shareBack(): Promise<ShareBackResult> {
  try {
    const result = await Share.share({
      title: t('session.share'),
      message: t('session.shareMessage'),
    });
    if (result.action === Share.dismissedAction) {
      return 'cancelled';
    }
    return 'shared';
  } catch {
    return 'unavailable';
  }
}
