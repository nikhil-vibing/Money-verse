#!/usr/bin/env node
/**
 * Story-flow screenshot harness: captures the 4 onboarding states.
 * Usage: node story-screenshots.mjs <out-dir>
 *
 *   1. Just after WorldScene spawn — opening narration card visible.
 *   2. Approached Maya — dialog active.
 *   3. EnvelopeScene open.
 *   4. After confirming envelope — second objective active, Ravi anna ! showing.
 */
import { resolve } from "node:path";

const playwrightMjs =
  "/Users/nikhil/Documents/Dhaniverse.2.0/node_modules/.pnpm/node_modules/playwright/index.mjs";
const { chromium } = await import(playwrightMjs);

const outDir = resolve(process.cwd(), process.argv[2] ?? "Money");
const url = process.argv[3] ?? "http://localhost:5173/";

const browser = await chromium.launch({
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") console.error("[page]", msg.text());
});
page.on("pageerror", (err) => console.error("[pageerror]", err.message));

await page.goto(url, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(800);

// Advance past Welcome scene
await page.keyboard.press("Enter");
// Wait for Preload → World transition. The Preload waits for asset load
// plus a few seconds of tip rotation; 4s is safe.
await page.waitForTimeout(4500);

// FRAME 1: just after WorldScene spawn — opening narration card visible.
await page.screenshot({ path: resolve(outDir, "auto-story-flow-1.png") });
console.log("frame 1 captured (opening narration)");

// Click through the narration card (2 lines, 1 page → space to dismiss).
await page.keyboard.press("Space");
await page.waitForTimeout(700);
await page.keyboard.press("Space");
await page.waitForTimeout(900);

// Walk player WEST toward Maya didi.
//   Player spawn  = tile (30, 20) → world px (480, 320)
//   Maya          = tile (4,  18) → world px (64,  288)
//   Distance west ≈ 416 px. Walk velocity = 120 px/s → 3.47 s holding A.
// We deliberately overshoot a touch then nudge back to land in the
// 36 px talk radius (Npc interact radius).
async function walk(direction, ms) {
  await page.keyboard.down(direction);
  await page.waitForTimeout(ms);
  await page.keyboard.up(direction);
}
await walk("KeyA", 3200);
// Slight north nudge — Maya is 2 tiles up.
await walk("KeyW", 200);
await page.waitForTimeout(400);

// Trigger talk. Phaser binds keydown-E.
await page.keyboard.press("KeyE");
await page.waitForTimeout(900);

// FRAME 2: approached Maya — dialog active
await page.screenshot({ path: resolve(outDir, "auto-story-flow-2.png") });
console.log("frame 2 captured (maya dialog)");

// Advance through Maya's 3 lines + grant + opens envelope
await page.keyboard.press("Space");
await page.waitForTimeout(300);
await page.keyboard.press("Space");
await page.waitForTimeout(300);
await page.keyboard.press("Space");
await page.waitForTimeout(600);
// Next say beat (3 more lines)
await page.keyboard.press("Space");
await page.waitForTimeout(300);
await page.keyboard.press("Space");
await page.waitForTimeout(300);
await page.keyboard.press("Space");
await page.waitForTimeout(800);

// FRAME 3: EnvelopeScene open
await page.screenshot({ path: resolve(outDir, "auto-story-flow-3.png") });
console.log("frame 3 captured (envelope scene)");

// Allocate: press R 12 times to add ₹6,000 rent (12 x ₹500) — over the
// ₹4,800 minimum, so the budget is "balanced" in the new branch.
for (let i = 0; i < 12; i++) {
  await page.keyboard.press("r");
  await page.waitForTimeout(40);
}
// Add ₹3,000 to save (6 x ₹500) — comfortably over the ₹2,000 nudge.
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("s");
  await page.waitForTimeout(40);
}
// Confirm. The envelope resumes the World scene, which then runs
// Maya's `say-branch` beat. Give the dialog tween 350ms then the
// 260ms slide-up to settle before capturing — total ~1600ms is safe.
await page.keyboard.press("Enter");
await page.waitForTimeout(1600);

// FRAME 4: Maya's branched reaction (balanced — "Good, na. You saw the
// shape of it."). Capture the FIRST line so the dialog is visibly mid-
// conversation rather than already dismissed.
await page.screenshot({ path: resolve(outDir, "auto-story-flow-4.png") });
console.log("frame 4 captured (maya branched reaction)");

await browser.close();
console.log("done.");
