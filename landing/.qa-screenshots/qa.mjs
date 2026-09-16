import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const baseUrl = "http://127.0.0.1:8765/index.html";

const breakpoints = [
  { w: 375, h: 667 },
  { w: 390, h: 844 },
  { w: 430, h: 932 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1280, h: 720 },
  { w: 1440, h: 900 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const scrollRows = [];
for (const { w, h } of breakpoints) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  scrollRows.push({ w, h, ...metrics });
}

for (const shot of [
  { name: "390x844.png", w: 390, h: 844 },
  { name: "1280x720.png", w: 1280, h: 720 },
]) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, shot.name), fullPage: false });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.style.fontSize = "200%";
});
await page.screenshot({
  path: path.join(outDir, "390x844-text-200.png"),
  fullPage: true,
});

const ogPage = await browser.newPage();
await ogPage.setViewportSize({ width: 1200, height: 630 });
await ogPage.goto("http://127.0.0.1:8765/og-image.png");
await ogPage.screenshot({
  path: path.join(outDir, "og-image-1200x630-view.png"),
  fullPage: false,
});

const consoleErrors = [];
const failedRequests = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("requestfailed", (req) => {
  failedRequests.push(req.url());
});
page.on("response", (res) => {
  if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
});
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(baseUrl, { waitUntil: "networkidle" });

await browser.close();

console.log(JSON.stringify({ scrollRows, consoleErrors, failedRequests }, null, 2));
