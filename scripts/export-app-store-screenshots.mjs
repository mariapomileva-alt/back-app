#!/usr/bin/env node
/**
 * Export 1320×2868 App Store screenshots from store/ios/screenshots/compose.html.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compose = path.join(root, 'store/ios/screenshots/compose.html');
const outDir = path.join(root, 'store/ios/screenshots');

const shots = [
  { file: '01-home.png', s: 'home', caption: 'Help in the first minute of panic' },
  { file: '02-breathe.png', s: 'breathe', caption: 'Breathe gently. Or pick another way' },
  { file: '01-home-offline.png', s: 'home', caption: 'No account. Works offline. Nothing leaves your phone' },
  { file: '04-listen.png', s: 'listen', caption: 'Rain, ocean, brown noise for night panic' },
  { file: '03-ground.png', s: 'ground', caption: 'Ground yourself in the room you are in' },
  { file: '06-extra-support.png', s: 'extra', caption: 'Your person, one tap away' },
  { file: '05-distract.png', s: 'distract', caption: 'Calm games with no scores' },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1320, height: 2868 },
  deviceScaleFactor: 1,
});

for (const shot of shots) {
  const url = new URL(`file://${compose}`);
  url.searchParams.set('s', shot.s);
  url.searchParams.set('caption', shot.caption);
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const dest = path.join(outDir, shot.file);
  await page.screenshot({ path: dest, type: 'png' });
  console.log(shot.file);
}

await browser.close();
