import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';
import pl from './pl.json';
import ptBr from './pt-BR.json';
import ru from './ru.json';
import tr from './tr.json';
import {
  loadLanguagePreference,
  peekLanguagePreference,
  resolveUiLocale,
} from '@/storage/languagePreference';
import type { UiLocale } from './locale';

type MessageTree = { [key: string]: string | MessageTree };

const english = en as MessageTree;

const catalogs: Record<UiLocale, MessageTree> = {
  en: english,
  es: es as MessageTree,
  de: de as MessageTree,
  fr: fr as MessageTree,
  'pt-BR': ptBr as MessageTree,
  ru: ru as MessageTree,
  it: it as MessageTree,
  pl: pl as MessageTree,
  nl: nl as MessageTree,
  tr: tr as MessageTree,
};

let activeUiLocale: UiLocale = 'en';

export function setActiveUiLocale(locale: UiLocale): void {
  activeUiLocale = locale;
}

export function getActiveUiLocale(): UiLocale {
  return activeUiLocale;
}

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
  return catalogs[activeUiLocale] ?? english;
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

/** Bootstraps locale before React mounts (SplashScreen). */
export async function bootstrapI18nLocale(): Promise<UiLocale> {
  const peeked = peekLanguagePreference();
  if (peeked !== undefined) {
    const effective = resolveUiLocale(peeked);
    setActiveUiLocale(effective);
    return effective;
  }
  const stored = await loadLanguagePreference();
  const effective = resolveUiLocale(stored);
  setActiveUiLocale(effective);
  return effective;
}
