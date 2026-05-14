#!/usr/bin/env node
/**
 * Minimal Playwright screenshot harness for the standalone Phaser game.
 * Usage: node scripts/auto-screenshot.mjs <output-path> [url] [wait-ms]
 */
import { resolve } from "node:path";

const playwrightMjs =
  "/Users/nikhil/Documents/Dhaniverse.2.0/node_modules/.pnpm/node_modules/playwright/index.mjs";
const { chromium } = await import(playwrightMjs);

const args = process.argv.slice(2);
const outputArg = args[0];
if (!outputArg) {
  console.error("usage: auto-screenshot.mjs <output-path> [url] [wait-ms]");
  process.exit(1);
}
const url = args[1] ?? "http://localhost:5173/";
const waitMs = Number.parseInt(args[2] ?? "3500", 10);
const outputPath = resolve(process.cwd(), outputArg);

const browser = await chromium.launch({
  args: [
    "--enable-webgl",
    "--ignore-gpu-blocklist",
  ],
});
const reducedMotion = process.env.REDUCED_MOTION === "1";
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  ...(reducedMotion ? { reducedMotion: "reduce" } : {}),
});
const page = await ctx.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") console.error("[page]", msg.text());
});
page.on("pageerror", (err) => console.error("[pageerror]", err.message));

await page.goto(url, { waitUntil: "load", timeout: 30000 });
// Many of our scenes mount a Start button (WelcomeScene). Try to click "play".
await page.waitForTimeout(800);
const handled = await page.evaluate(async () => {
  const btn = Array.from(document.querySelectorAll("button"))
    .find((b) => /play|start|begin/i.test(b.textContent ?? ""));
  if (btn) {
    btn.click();
    return true;
  }
  return false;
});
// Sometimes the Phaser canvas needs a key press to advance from Welcome.
await page.keyboard.press("Enter").catch(() => {});
await page.keyboard.press("Space").catch(() => {});
await page.waitForTimeout(waitMs);
await page.screenshot({ path: outputPath, fullPage: false });
console.log(`saved ${outputPath} (welcome=${handled})`);
await browser.close();
