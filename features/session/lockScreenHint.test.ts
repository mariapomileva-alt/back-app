import { describe, expect, it } from 'vitest';

import {
  resolveLockScreenHint,
  shouldShowLockScreenHint,
  type LockScreenHintMemory,
} from './lockScreenHint';

function memory(alreadyShown = false): LockScreenHintMemory & { shown: boolean } {
  const state = { shown: alreadyShown };
  return {
    get shown() {
      return state.shown;
    },
    hasBeenShown: async () => state.shown,
    markShown: async () => {
      state.shown = true;
    },
  };
}

describe('shouldShowLockScreenHint', () => {
  it('shows once after better or same', () => {
    expect(shouldShowLockScreenHint({ outcome: 'better', alreadyShown: false })).toBe(true);
    expect(shouldShowLockScreenHint({ outcome: 'same', alreadyShown: false })).toBe(true);
  });

  it('never shows after worse, and never a second time', () => {
    expect(shouldShowLockScreenHint({ outcome: 'worse', alreadyShown: false })).toBe(false);
    expect(shouldShowLockScreenHint({ outcome: 'better', alreadyShown: true })).toBe(false);
    expect(shouldShowLockScreenHint({ outcome: 'same', alreadyShown: true })).toBe(false);
  });
});

describe('resolveLockScreenHint', () => {
  it('marks shown only when the card will appear', async () => {
    const firstWorse = memory();
    await expect(resolveLockScreenHint({ outcome: 'worse', memory: firstWorse })).resolves.toBe('skip');
    expect(firstWorse.shown).toBe(false);

    await expect(resolveLockScreenHint({ outcome: 'same', memory: firstWorse })).resolves.toBe('show');
    expect(firstWorse.shown).toBe(true);

    await expect(resolveLockScreenHint({ outcome: 'better', memory: firstWorse })).resolves.toBe('skip');
  });
});
