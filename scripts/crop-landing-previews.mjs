#!/usr/bin/env node
/**
 * Build landing/screenshots/previews/*.png from full-height QA captures.
 * Run after replacing landing/screenshots/{tool}.png.
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
  breathe: [0, 52, 390, 348],
  distract: [0, 68, 390, 398],
  ground: [0, 72, 390, 382],
  move: [0, 88, 390, 378],
  listen: [0, 48, 390, 368],
  read: [0, 108, 390, 388],
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
      `from PIL import Image; Image.open(${JSON.stringify(input)}).crop((${x0}, ${y0}, ${x1}, ${y1})).save(${JSON.stringify(output)})`,
    ],
    { stdio: 'inherit' },
  );
  console.log(`${name}: ${w}×${h} → ${path.relative(root, output)}`);
}
