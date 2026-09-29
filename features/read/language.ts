import { getActiveUiLocale } from '@/locales/i18n';
import { normalizeLocale, systemDefaultLocale, type UiLocale } from '@/locales/locale';
import { isReadLocaleEnabled } from '@/locales/localizationStatus';

import type { ReadLanguage, ReadLanguagePreference } from './types';
import { readLanguages } from './types';

export function isReadLanguage(value: string | null | undefined): value is ReadLanguage {
  return (readLanguages as readonly string[]).includes(value ?? '');
}

export function deviceReadLanguage(): ReadLanguage {
  const normalized = normalizeLocale(systemDefaultLocale()) ?? 'en';
  return isReadLanguage(normalized) ? normalized : 'en';
}

function readLanguageFromUi(uiLocale: UiLocale): ReadLanguage {
  if (isReadLocaleEnabled(uiLocale) && isReadLanguage(uiLocale)) {
    return uiLocale;
  }
  return 'en';
}

export function resolveReadLanguage(preference?: ReadLanguagePreference | null): ReadLanguage {
  if (preference && isReadLanguage(preference) && isReadLocaleEnabled(preference)) {
    return preference;
  }
  return readLanguageFromUi(getActiveUiLocale());
}
