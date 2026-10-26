import { describe, expect, it } from 'vitest';

import { BREATHE_DEEP_LINK, HOME_DEEP_LINK, pathForBackUrl } from './deepLinks';

describe('pathForBackUrl', () => {
  it('maps home and breathe widget links', () => {
    expect(pathForBackUrl(HOME_DEEP_LINK)).toBe('/');
    expect(pathForBackUrl('back://')).toBe('/');
    expect(pathForBackUrl(BREATHE_DEEP_LINK)).toBe('/breathe');
    expect(pathForBackUrl('back://breathe')).toBe('/breathe');
    expect(pathForBackUrl('back://breathe/')).toBe('/breathe');
  });

  it('keeps ordinary router paths', () => {
    expect(pathForBackUrl('/listen')).toBe('/listen');
  });
});
