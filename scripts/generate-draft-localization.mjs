#!/usr/bin/env node
/**
 * Draft machine translations for UI locale JSON and Read content packs.
 * Run: node scripts/generate-draft-localization.mjs [--ui-only] [--read-only] [--locale es]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import translate from 'google-translate-api-x';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiLocales = ['es', 'de', 'fr', 'pt-BR', 'ru', 'it', 'pl', 'nl', 'tr'];
const readFiles = ['stories.json', 'curious.json', 'words.json', 'observe.json', 'notice.json'];

const googleLocale = {
  es: 'es',
  de: 'de',
  fr: 'fr',
  'pt-BR': 'pt',
  ru: 'ru',
  it: 'it',
  pl: 'pl',
  nl: 'nl',
  tr: 'tr',
};

const args = new Set(process.argv.slice(2));
const uiOnly = args.has('--ui-only');
const readOnly = args.has('--read-only');
const localeArgIndex = process.argv.indexOf('--locale');
const localeFilter =
  localeArgIndex >= 0 ? process.argv[localeArgIndex + 1]?.split(',').map((v) => v.trim()) : null;

const locales = localeFilter?.length ? uiLocales.filter((l) => localeFilter.includes(l)) : uiLocales;

function collectStrings(node, bucket = []) {
  if (typeof node === 'string') {
    bucket.push(node);
    return bucket;
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      collectStrings(item, bucket);
    }
    return bucket;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'id' || key === 'topics' || key === 'type' || key === 'difficulty') {
        continue;
      }
      collectStrings(value, bucket);
    }
  }
  return bucket;
}

function applyTranslations(node, lookup, locale) {
  if (typeof node === 'string') {
    return lookup.get(node) ?? node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => applyTranslations(item, lookup, locale));
  }
  if (node && typeof node === 'object') {
    const next = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === 'id' && typeof value === 'string') {
        next[key] = value.replace(/^en-/, `${locale === 'pt-BR' ? 'pt' : locale}-`);
        continue;
      }
      next[key] = applyTranslations(value, lookup, locale);
    }
    return next;
  }
  return node;
}

async function translateStrings(uniqueStrings, locale) {
  const lookup = new Map();
  const to = googleLocale[locale] ?? locale;
  const chunkSize = 40;
  for (let index = 0; index < uniqueStrings.length; index += chunkSize) {
    const chunk = uniqueStrings.slice(index, index + chunkSize);
    const result = await translate(chunk, {
      from: 'en',
      to,
      forceBatch: true,
      rejectOnPartialFail: false,
    });
    const rows = Array.isArray(result) ? result : [result];
    rows.forEach((row, offset) => {
      const source = chunk[offset];
      lookup.set(source, row?.text && row.text !== source ? row.text : source);
    });
    console.log(`  batch ${Math.floor(index / chunkSize) + 1}/${Math.ceil(uniqueStrings.length / chunkSize)}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return lookup;
}

async function translateDocument(source, locale) {
  const strings = collectStrings(source);
  const unique = [...new Set(strings.filter((value) => value.trim().length > 0))];
  console.log(`  ${unique.length} unique strings`);
  const lookup = await translateStrings(unique, locale);
  return applyTranslations(source, lookup, locale);
}

async function translateUiLocale(locale) {
  const sourcePath = path.join(root, 'locales', 'en.json');
  const targetPath = path.join(root, 'locales', `${locale}.json`);
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  console.log(`Translating UI ${locale}…`);
  const translated = await translateDocument(source, locale);
  fs.writeFileSync(targetPath, `${JSON.stringify(translated, null, 2)}\n`);
  console.log(`Wrote ${targetPath}`);
}

async function translateReadLocale(locale) {
  const sourceDir = path.join(root, 'content', 'read', 'en');
  const targetDir = path.join(root, 'content', 'read', locale);
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of readFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    console.log(`Translating Read ${locale}/${file} (${source.length} items)…`);
    const translated = await translateDocument(source, locale);
    fs.writeFileSync(targetPath, `${JSON.stringify(translated, null, 2)}\n`);
  }
}

async function main() {
  if (!readOnly) {
    for (const locale of locales) {
      await translateUiLocale(locale);
    }
  }
  if (!uiOnly) {
    for (const locale of locales) {
      await translateReadLocale(locale);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
