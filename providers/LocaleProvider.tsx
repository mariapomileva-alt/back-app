import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { localeNativeNames, type UiLocale } from '@/locales/locale';
import { isUiLocaleEnabled } from '@/locales/localizationStatus';
import { setActiveUiLocale } from '@/locales/i18n';
import { loadReadMemory, saveReadMemory } from '@/features/read/storage';
import { isReadLanguage } from '@/features/read/language';
import {
  loadLanguagePreference,
  resolveUiLocale,
  saveLanguagePreference,
} from '@/storage/languagePreference';

type LocaleContextValue = {
  locale: UiLocale;
  preference: UiLocale | null;
  nativeName: string;
  setLocale: (locale: UiLocale) => Promise<void>;
  reloadLocale: () => Promise<void>;
  isLocaleEnabled: (locale: UiLocale) => boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function LocaleProvider({ children }: Props) {
  const [preference, setPreference] = useState<UiLocale | null>(null);
  const [locale, setLocaleState] = useState<UiLocale>('en');
  const [ready, setReady] = useState(false);

  const applyPreference = useCallback((nextPreference: UiLocale | null) => {
    setPreference(nextPreference);
    const effective = resolveUiLocale(nextPreference);
    setLocaleState(effective);
    setActiveUiLocale(effective);
  }, []);

  const reloadLocale = useCallback(async () => {
    const stored = await loadLanguagePreference();
    applyPreference(stored);
  }, [applyPreference]);

  useEffect(() => {
    let active = true;
    void loadLanguagePreference().then((stored) => {
      if (!active) {
        return;
      }
      applyPreference(stored);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [applyPreference]);

  const setLocale = useCallback(
    async (next: UiLocale) => {
      if (!isUiLocaleEnabled(next)) {
        return;
      }
      await saveLanguagePreference(next);
      if (isReadLanguage(next)) {
        const memory = await loadReadMemory();
        await saveReadMemory({ ...memory, language: next });
      }
      applyPreference(next);
    },
    [applyPreference],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      preference,
      nativeName: localeNativeNames[locale],
      setLocale,
      reloadLocale,
      isLocaleEnabled: isUiLocaleEnabled,
    }),
    [locale, preference, reloadLocale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{ready ? children : null}</LocaleContext.Provider>;
}

export function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocaleContext must be used within LocaleProvider');
  }
  return value;
}
