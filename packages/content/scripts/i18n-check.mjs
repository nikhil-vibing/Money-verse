#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const baseDir = new URL("../i18n", import.meta.url).pathname;
const locales = readdirSync(baseDir);
if (!locales.includes("en")) {
  console.error("[i18n] missing 'en' locale (base).");
  process.exit(1);
}

const enFiles = readdirSync(join(baseDir, "en"));
let failed = 0;

for (const locale of locales.filter((l) => l !== "en")) {
  for (const file of enFiles) {
    const enKeys = Object.keys(JSON.parse(readFileSync(join(baseDir, "en", file), "utf8")));
    let other;
    try {
      other = JSON.parse(readFileSync(join(baseDir, locale, file), "utf8"));
    } catch {
      console.error(`[i18n] ${locale}/${file} missing or invalid JSON`);
      failed += 1;
      continue;
    }
    const missing = enKeys.filter((k) => !(k in other));
    if (missing.length > 0) {
      console.error(`[i18n] ${locale}/${file} missing keys: ${missing.join(", ")}`);
      failed += missing.length;
    }
  }
}

if (failed > 0) {
  console.error(`[i18n] FAIL — ${failed} missing keys`);
  process.exit(1);
}
console.log("[i18n] OK — all locales complete");
