import { getLocales } from 'expo-localization';

import en from './en.json';

type MessageTree = { [key: string]: string | MessageTree };

const english = en as MessageTree;

/** English is the only complete locale. Missing catalogs and keys fall back to it. */
const catalogs: Record<string, MessageTree> = {
  en: english,
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

function resolveCatalog(): MessageTree {
  const language = getLocales()[0]?.languageCode ?? 'en';
  return catalogs[language] ?? english;
}

export function t(path: string, vars?: Record<string, string | number>): string {
  const catalog = resolveCatalog();
  let value = readPath(catalog, path) ?? readPath(english, path) ?? path;
  if (vars) {
    for (const [key, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${key}}`, String(replacement));
    }
  }
  return value;
}
