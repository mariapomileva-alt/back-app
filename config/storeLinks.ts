export const APP_STORE_ID = '6811918141';

// TODO(Maria): pt= number from App Store Connect → Analytics → Campaigns
export const APP_STORE_PROVIDER_TOKEN = '';

export function appStoreUrl(campaign: string): string {
  const params = new URLSearchParams({ mt: '8', ct: campaign });
  if (APP_STORE_PROVIDER_TOKEN) {
    params.set('pt', APP_STORE_PROVIDER_TOKEN);
  }
  return `https://apps.apple.com/app/id${APP_STORE_ID}?${params.toString()}`;
}
