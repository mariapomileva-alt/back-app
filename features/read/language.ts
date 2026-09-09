import type { ReadLanguage, ReadLanguagePreference } from './types';

export function isReadLanguage(value: string | null | undefined): value is ReadLanguage {
  return value === 'en';
}

export function deviceReadLanguage(): ReadLanguage {
  return 'en';
}

export function resolveReadLanguage(_preference?: ReadLanguagePreference | null): ReadLanguage {
  return 'en';
}
