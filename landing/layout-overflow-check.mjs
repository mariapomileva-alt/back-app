/**
 * Layout overflow check for backapp.live landing.
 * Run: npx playwright install chromium && node landing/layout-overflow-check.mjs
 * Optional: BASE_URL=http://127.0.0.1:8765/ node landing/layout-overflow-check.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, ".layout-qa");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8765/";

const widths = [1440, 1280, 1024, 834, 768, 430, 390, 375, 320];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const overflowRows = [];
let pageHeight1280 = null;

for (const w of widths) {
  const h = w <= 430 ? 844 : 900;
  await page.setViewportSize({ width: w, height: h });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
    pageHeight: document.documentElement.scrollHeight,
    mainId: document.querySelector("main")?.id || null,
    topOnHero: document.getElementById("top")?.classList.contains("hero"),
    placeholderCount: document.querySelectorAll(".moment-placeholder-label").length,
  }));
  overflowRows.push({
    width: w,
    overflow: metrics.scrollWidth > metrics.clientWidth,
    delta: metrics.scrollWidth - metrics.clientWidth,
    ...metrics,
  });
  if (w === 1280) {
    pageHeight1280 = metrics.pageHeight;
    await page.screenshot({
      path: path.join(outDir, "1280x900-full.png"),
      fullPage: true,
    });
  }
  await page.screenshot({
    path: path.join(outDir, `viewport-${w}.png`),
    fullPage: false,
  });
}

await browser.close();

const failures = overflowRows.filter((r) => r.overflow);
const report = {
  baseUrl,
  pageHeight1280,
  overflowRows,
  ok: failures.length === 0 && overflowRows.every((r) => r.placeholderCount === 0),
  failures,
};

console.log(JSON.stringify(report, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
