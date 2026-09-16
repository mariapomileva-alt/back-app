import AsyncStorage from '@react-native-async-storage/async-storage';

import { normalizeLocale, systemDefaultLocale, type UiLocale } from '@/locales/locale';
import { isUiLocaleEnabled } from '@/locales/localizationStatus';

import { storageKeys } from './keys';

let cachedPreference: UiLocale | null | undefined;

export function peekLanguagePreference(): UiLocale | null | undefined {
  return cachedPreference;
}

export async function loadLanguagePreference(): Promise<UiLocale | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKeys.languagePreference);
    const normalized = normalizeLocale(raw);
    cachedPreference = normalized;
    return normalized;
  } catch {
    cachedPreference = cachedPreference ?? null;
    return null;
  }
}

export async function saveLanguagePreference(locale: UiLocale): Promise<void> {
  cachedPreference = locale;
  try {
    await AsyncStorage.setItem(storageKeys.languagePreference, locale);
  } catch {
    // Keep in-memory preference if storage is unavailable.
  }
}

/**
 * Stored preference when enabled, otherwise device default when enabled, otherwise English.
 */
export function resolveUiLocale(preference: UiLocale | null | undefined): UiLocale {
  const candidates = [preference, systemDefaultLocale(), 'en' as const];
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (isUiLocaleEnabled(candidate)) {
      return candidate;
    }
  }
  return 'en';
}
