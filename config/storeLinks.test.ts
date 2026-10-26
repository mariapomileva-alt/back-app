import { describe, expect, it } from 'vitest';
import { APP_STORE_ID, APP_STORE_PROVIDER_TOKEN, appStoreUrl } from './storeLinks';

describe('appStoreUrl', () => {
  it('builds a campaign URL without inventing a provider token', () => {
    expect(APP_STORE_ID).toBe('6811918141');
    expect(APP_STORE_PROVIDER_TOKEN).toBe('');
    expect(appStoreUrl('web_qr')).toBe(
      'https://apps.apple.com/app/id6811918141?mt=8&ct=web_qr',
    );
  });
});
