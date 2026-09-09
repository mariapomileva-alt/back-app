import { getLocales } from 'expo-localization';

import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import lv from './lv.json';
import ru from './ru.json';
import uk from './uk.json';

type MessageTree = { [key: string]: string | MessageTree };

const catalogs: Record<string, MessageTree> = {
  en: en as MessageTree,
  ru: ru as MessageTree,
  lv: lv as MessageTree,
  es: es as MessageTree,
  de: de as MessageTree,
  fr: fr as MessageTree,
  uk: uk as MessageTree,
};

function readPath(tree: MessageTree, path: string): string | undefined {
  const parts = path.split('.');
  let current: string | MessageTree | undefined = tree;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === 'string' ? current : undefined;
}

function activeLanguageCode(): string {
  return getLocales()[0]?.languageCode ?? 'en';
}

export function t(path: string, vars?: Record<string, string | number>): string {
  const language = activeLanguageCode();
  const catalog = catalogs[language];
  const fromLocale = catalog ? readPath(catalog, path) : undefined;
  let value = fromLocale ?? readPath(en as MessageTree, path) ?? path;
  if (vars) {
    for (const [key, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${key}}`, String(replacement));
    }
  }
  return value;
}
