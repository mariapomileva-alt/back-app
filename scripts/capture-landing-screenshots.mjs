#!/usr/bin/env node
/**
 * Capture landing/screenshots/*.png from a running Expo web dev server.
 * Prerequisite: npx expo start --web --port 8081
 */
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'landing', 'screenshots');
const base = process.env.LANDING_CAPTURE_URL ?? 'http://127.0.0.1:8081';

const routes = [
  ['home', '/'],
  ['breathe', '/breathe'],
  ['distract', '/distract'],
  ['ground', '/ground'],
  ['move', '/move'],
  ['listen', '/listen'],
  ['read', '/read'],
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

for (const [name, route] of routes) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(2500);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`wrote ${path.relative(root, file)}`);
}

await browser.close();
