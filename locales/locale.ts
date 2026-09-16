import { getLocales } from 'expo-localization';

/** UI locales shipped in Back. No lv, ja, ko, or zh variants in the selector. */
export const supportedUiLocales = [
  'en',
  'es',
  'de',
  'fr',
  'pt-BR',
  'ru',
  'it',
  'pl',
  'nl',
  'tr',
] as const;

export type UiLocale = (typeof supportedUiLocales)[number];

export const localeNativeNames: Record<UiLocale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  'pt-BR': 'Português (Brasil)',
  ru: 'Русский',
  it: 'Italiano',
  pl: 'Polski',
  nl: 'Nederlands',
  tr: 'Türkçe',
};

const excludedLanguageCodes = new Set(['lv', 'ja', 'ko', 'zh']);

function isUiLocale(value: string): value is UiLocale {
  return (supportedUiLocales as readonly string[]).includes(value);
}

/**
 * Maps device or stored tags to a supported UI locale, or null when unsupported / excluded.
 */
export function normalizeLocale(input: string | null | undefined): UiLocale | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim().replace(/_/g, '-');
  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();

  if (lower === 'pt-br' || lower === 'pt') {
    return 'pt-BR';
  }

  const base = lower.split('-')[0] ?? lower;
  if (excludedLanguageCodes.has(base) || base.startsWith('zh')) {
    return null;
  }

  if (isUiLocale(trimmed)) {
    return trimmed as UiLocale;
  }

  if (isUiLocale(base)) {
    return base;
  }

  const titleCase = base.length === 2 ? base : null;
  if (titleCase && isUiLocale(titleCase)) {
    return titleCase;
  }

  return null;
}

export function deviceLocaleTag(): string | null {
  const locale = getLocales()[0];
  if (!locale) {
    return null;
  }
  return locale.languageTag ?? locale.languageCode ?? null;
}

/** Best supported locale from the device, or English when unknown or excluded. */
export function systemDefaultLocale(): UiLocale {
  return normalizeLocale(deviceLocaleTag()) ?? 'en';
}

export function isSupportedUiLocale(value: string | null | undefined): value is UiLocale {
  return normalizeLocale(value) !== null && isUiLocale(normalizeLocale(value)!);
}
