import { appStoreUrl } from '@/config/storeLinks';

/** Hub URL until how-to-help-someone-having-a-panic-attack is published. */
export const TELL_THEM_GUIDE_URL = 'https://backapp.live/guides/';

export function shareBackMessage(text: string): string {
  return `${text} ${appStoreUrl('share')}`;
}

export function tellThemAboutBackMessage(template: string): string {
  return template.replaceAll('{url}', TELL_THEM_GUIDE_URL);
}
