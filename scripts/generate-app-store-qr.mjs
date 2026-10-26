/**
 * One-shot SVG QR for the desktop hero.
 * Run: node scripts/generate-app-store-qr.mjs
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const APP_STORE_ID = '6811918141';
const APP_STORE_PROVIDER_TOKEN = '';
const campaign = 'web_qr';

const params = new URLSearchParams({ mt: '8', ct: campaign });
if (APP_STORE_PROVIDER_TOKEN) {
  params.set('pt', APP_STORE_PROVIDER_TOKEN);
}
const url = `https://apps.apple.com/app/id${APP_STORE_ID}?${params.toString()}`;

const svg = await QRCode.toString(url, {
  type: 'svg',
  margin: 1,
  color: {
    dark: '#0C3B2E',
    light: '#F3EDE1',
  },
});

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'landing', 'app-store-qr.svg');
writeFileSync(out, svg);
console.log(`Wrote ${out}\n${url}`);
