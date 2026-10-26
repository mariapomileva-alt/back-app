import { describe, expect, it } from 'vitest';

import {
  freeForeverToolIds,
  hasToolAccess,
  isFreeForeverTool,
  paidToolIds,
  type BackPlusAccessState,
} from './backPlus';

const states: BackPlusAccessState[] = [
  'loading',
  'unavailable',
  'trialActive',
  'subscribed',
  'expired',
  'none',
];

describe('Back Plus free-forever tools', () => {
  it('keeps Breathe and Listen out of the paid list', () => {
    expect(freeForeverToolIds).toEqual(['breathe', 'listen']);
    expect(paidToolIds).toEqual(['distract', 'ground', 'move', 'read']);
    expect(paidToolIds).not.toContain('breathe');
    expect(paidToolIds).not.toContain('listen');
  });

  it('never locks Breathe or Listen in any entitlement state', () => {
    for (const state of states) {
      expect(hasToolAccess('breathe', state)).toBe(true);
      expect(hasToolAccess('listen', state)).toBe(true);
      expect(isFreeForeverTool('breathe')).toBe(true);
      expect(isFreeForeverTool('listen')).toBe(true);
    }
  });

  it('keeps paid tools locked without an active entitlement', () => {
    expect(hasToolAccess('distract', 'none')).toBe(false);
    expect(hasToolAccess('ground', 'expired')).toBe(false);
    expect(hasToolAccess('move', 'none')).toBe(false);
    expect(hasToolAccess('read', 'expired')).toBe(false);
    expect(hasToolAccess('distract', 'trialActive')).toBe(true);
    expect(hasToolAccess('read', 'subscribed')).toBe(true);
    expect(hasToolAccess('ground', 'unavailable')).toBe(true);
    expect(hasToolAccess('move', 'loading')).toBe(true);
  });
});
