import type { UiLocale } from './locale';

/** Read content locales mirror UI locales for now. */
export type ReadContentLocale = UiLocale;

export type LocaleReleaseStatus = 'complete' | 'draft' | 'disabled';

const uiReleaseStatus: Record<UiLocale, LocaleReleaseStatus> = {
  en: 'complete',
  es: 'draft',
  de: 'draft',
  fr: 'draft',
  'pt-BR': 'draft',
  ru: 'draft',
  it: 'draft',
  pl: 'draft',
  nl: 'draft',
  tr: 'draft',
};

const readReleaseStatus: Record<ReadContentLocale, LocaleReleaseStatus> = {
  en: 'complete',
  es: 'draft',
  de: 'draft',
  fr: 'draft',
  'pt-BR': 'draft',
  ru: 'draft',
  it: 'draft',
  pl: 'draft',
  nl: 'draft',
  tr: 'draft',
};

function isProductionBuild(): boolean {
  return typeof __DEV__ === 'boolean' ? !__DEV__ : process.env.NODE_ENV === 'production';
}

export function uiLocaleReleaseStatus(locale: UiLocale): LocaleReleaseStatus {
  return uiReleaseStatus[locale];
}

export function readLocaleReleaseStatus(locale: ReadContentLocale): LocaleReleaseStatus {
  return readReleaseStatus[locale];
}

/** Production ships English UI only until native review completes. */
export function isUiLocaleEnabled(locale: UiLocale): boolean {
  if (!isProductionBuild()) {
    return uiReleaseStatus[locale] !== 'disabled';
  }
  return locale === 'en';
}

/** Read sessions never mix English with another language in production. */
export function isReadLocaleEnabled(locale: ReadContentLocale): boolean {
  if (!isProductionBuild()) {
    return readReleaseStatus[locale] !== 'disabled';
  }
  return locale === 'en';
}

export function enabledUiLocales(): UiLocale[] {
  return (Object.keys(uiReleaseStatus) as UiLocale[]).filter(isUiLocaleEnabled);
}

export function enabledReadLocales(): ReadContentLocale[] {
  return (Object.keys(readReleaseStatus) as ReadContentLocale[]).filter(isReadLocaleEnabled);
}
