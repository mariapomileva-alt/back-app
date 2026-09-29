#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = path.join(root, 'locales');
const baseLocale = 'en';

const targetLocales = ['es', 'de', 'fr', 'pt-BR', 'ru', 'it', 'pl', 'nl', 'tr'];

function flattenKeys(tree, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(tree)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      keys.push(next);
    } else if (value && typeof value === 'object') {
      keys.push(...flattenKeys(value, next));
    }
  }
  return keys.sort();
}

function readJson(name) {
  const filePath = path.join(localesDir, `${name}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const base = readJson(baseLocale);
const baseKeys = flattenKeys(base);
let failed = false;

for (const locale of targetLocales) {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing locale file: locales/${locale}.json`);
    failed = true;
    continue;
  }
  const target = readJson(locale);
  const targetKeys = new Set(flattenKeys(target));
  const missing = baseKeys.filter((key) => !targetKeys.has(key));
  const extra = [...targetKeys].filter((key) => !baseKeys.includes(key));
  if (missing.length > 0 || extra.length > 0) {
    failed = true;
    console.error(`\nlocales/${locale}.json`);
    if (missing.length > 0) {
      console.error(`  missing (${missing.length}):`, missing.slice(0, 12).join(', '), missing.length > 12 ? '…' : '');
    }
    if (extra.length > 0) {
      console.error(`  extra (${extra.length}):`, extra.slice(0, 12).join(', '), extra.length > 12 ? '…' : '');
    }
  } else {
    console.log(`OK locales/${locale}.json (${baseKeys.length} keys)`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`\nAll ${targetLocales.length} locale files match en (${baseKeys.length} keys).`);
}
