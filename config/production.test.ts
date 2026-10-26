import { describe, expect, it } from 'vitest';

import { productionConfig } from './production';

describe('production store products', () => {
  it('uses the Back Plus product and entitlement ids', () => {
    expect(productionConfig.annualProductId).toBe('app.back.selfhelp.plus.annual');
    expect(productionConfig.monthlyProductId).toBe('app.back.selfhelp.plus.monthly');
    expect(productionConfig.entitlementId).toBe('back_plus');
  });
});
