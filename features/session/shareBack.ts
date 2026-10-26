import { Share } from 'react-native';

import { t } from '@/locales/i18n';

import { shareBackMessage, tellThemAboutBackMessage } from './shareCopy';

export type ShareBackResult = 'shared' | 'cancelled' | 'unavailable';

export { TELL_THEM_GUIDE_URL, shareBackMessage, tellThemAboutBackMessage } from './shareCopy';

export async function shareBack(): Promise<ShareBackResult> {
  try {
    const result = await Share.share({
      title: t('session.share'),
      message: shareBackMessage(t('session.shareMessage')),
    });
    if (result.action === Share.dismissedAction) {
      return 'cancelled';
    }
    return 'shared';
  } catch {
    return 'unavailable';
  }
}

export async function shareTellThemAboutBack(): Promise<ShareBackResult> {
  try {
    const result = await Share.share({
      title: t('supportSetup.tellThem'),
      message: tellThemAboutBackMessage(t('supportSetup.tellThemMessage')),
    });
    if (result.action === Share.dismissedAction) {
      return 'cancelled';
    }
    return 'shared';
  } catch {
    return 'unavailable';
  }
}
