import { describe, expect, it } from 'vitest';

import { appStoreUrl } from '@/config/storeLinks';

import { TELL_THEM_GUIDE_URL, shareBackMessage, tellThemAboutBackMessage } from './shareCopy';

describe('shareBack copy', () => {
  it('includes the App Store campaign URL after the message', () => {
    const text = 'Back is quiet support for the next minute. Six tools, on this device.';
    expect(shareBackMessage(text)).toBe(`${text} ${appStoreUrl('share')}`);
    expect(shareBackMessage(text)).toContain('https://apps.apple.com/app/id6811918141?mt=8&ct=share');
  });

  it('uses the guides hub until the help-someone article is published', () => {
    const template =
      "I added you as my person in Back, a small app I use when panic rises. If I call, you don't have to fix anything. This explains what helps: {url}";
    expect(TELL_THEM_GUIDE_URL).toBe('https://backapp.live/guides/');
    expect(tellThemAboutBackMessage(template)).toBe(
      "I added you as my person in Back, a small app I use when panic rises. If I call, you don't have to fix anything. This explains what helps: https://backapp.live/guides/",
    );
    expect(tellThemAboutBackMessage(template)).not.toContain('how-to-help-someone-having-a-panic-attack');
  });
});
