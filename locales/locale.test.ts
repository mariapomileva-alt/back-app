import { describe, expect, it, vi } from 'vitest';

import { normalizeLocale, systemDefaultLocale } from './locale';
import { isReadLocaleEnabled, isUiLocaleEnabled } from './localizationStatus';
import { resolveUiLocale } from '@/storage/languagePreference';

vi.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'de-DE', languageCode: 'de', regionCode: 'DE' }],
}));

describe('normalizeLocale', () => {
  it('maps supported tags and base codes', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('pt-BR')).toBe('pt-BR');
    expect(normalizeLocale('pt')).toBe('pt-BR');
    expect(normalizeLocale('fr-CA')).toBe('fr');
  });

  it('excludes lv, ja, ko, and zh variants', () => {
    expect(normalizeLocale('lv')).toBeNull();
    expect(normalizeLocale('ja-JP')).toBeNull();
    expect(normalizeLocale('ko-KR')).toBeNull();
    expect(normalizeLocale('zh-Hans')).toBeNull();
  });
});

describe('systemDefaultLocale', () => {
  it('uses the device locale when supported', () => {
    expect(systemDefaultLocale()).toBe('de');
  });
});

describe('resolveUiLocale', () => {
  it('prefers stored preference when enabled in dev', () => {
    expect(resolveUiLocale('es')).toBe('es');
  });

  it('falls back to English when preference is excluded', () => {
    expect(resolveUiLocale(null)).toBe('de');
  });
});

describe('production gating', () => {
  it('enables only English in production builds', () => {
    vi.stubGlobal('__DEV__', false);
    expect(isUiLocaleEnabled('en')).toBe(true);
    expect(isUiLocaleEnabled('es')).toBe(false);
    expect(isReadLocaleEnabled('es')).toBe(false);
    vi.unstubAllGlobals();
  });
});
