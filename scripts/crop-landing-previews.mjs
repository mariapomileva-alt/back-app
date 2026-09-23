#!/usr/bin/env node
/**
 * Build landing/screenshots/previews/*.png from 390×844 session captures.
 * Visual-only crops — titles live under each card on the landing page.
 * Distract and Read use Home marks in index.html instead of these PNGs.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'landing/screenshots');
const outDir = path.join(srcDir, 'previews');

/** @type {Record<string, [number, number, number, number]>} */
const crops = {
  // Extra vertical padding so soft glows (e.g. Breathe circle) are not sheared.
  breathe: [30, 115, 360, 415],
  ground: [16, 95, 374, 385],
  move: [24, 95, 366, 405],
  listen: [24, 130, 366, 455],
};

mkdirSync(outDir, { recursive: true });

for (const [name, box] of Object.entries(crops)) {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0;
  const h = y1 - y0;
  const input = path.join(srcDir, `${name}.png`);
  const output = path.join(outDir, `${name}.png`);
  execFileSync(
    'python3',
    [
      '-c',
      `from PIL import Image; im=Image.open(${JSON.stringify(input)}); assert im.size==(390,844), f'expected 390x844, got {im.size}'; im.crop((${x0}, ${y0}, ${x1}, ${y1})).save(${JSON.stringify(output)})`,
    ],
    { stdio: 'inherit' },
  );
  console.log(`${name}: ${w}×${h} → ${path.relative(root, output)}`);
}
