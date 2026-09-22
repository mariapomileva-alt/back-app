#!/usr/bin/env node
/**
 * Build landing/screenshots/previews/*.png from 390×844 session captures.
 * Run after replacing landing/screenshots/{tool}.png (must be 1×, not Retina 2×).
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
  breathe: [0, 118, 390, 418],
  distract: [0, 54, 390, 534],
  ground: [0, 108, 390, 502],
  move: [0, 120, 390, 455],
  listen: [0, 50, 390, 392],
  read: [0, 148, 390, 428],
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
      `from PIL import Image; im=Image.open(${JSON.stringify(input)}); assert im.size==(390,844), f'expected 390x844, got {im.size} for ${name}'; im.crop((${x0}, ${y0}, ${x1}, ${y1})).save(${JSON.stringify(output)})`,
    ],
    { stdio: 'inherit' },
  );
  console.log(`${name}: ${w}×${h} → ${path.relative(root, output)}`);
}
