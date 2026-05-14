import { copyFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..", "..");
const contentRoot = join(repoRoot, "packages", "content");
const publicRoot = resolve(__dirname, "..", "public", "content");
const atlasSrcRoot = resolve(repoRoot, "apps", "game", "public", "atlases");
const atlasDestRoot = resolve(__dirname, "..", "public", "atlases");

const targets = [
  { srcDir: join(contentRoot, "maps"), destDir: join(publicRoot, "maps"), match: /^chawl-mohalla(\.meta)?\.json$/ },
  { srcDir: join(contentRoot, "npcs"), destDir: join(publicRoot, "npcs"), match: /\.index\.json$/ },
  { srcDir: join(contentRoot, "quests"), destDir: join(publicRoot, "quests"), match: /\.index\.json$/ },
  // Runtime atlases for the Phaser game. The game canvas is mounted inside the
  // Next.js web app, so atlases must live under apps/web/public/atlases/ to be
  // fetched at /atlases/*.png.
  { srcDir: atlasSrcRoot, destDir: atlasDestRoot, match: /\.(png|md|txt)$/ },
];

async function copyMatching({ srcDir, destDir, match }) {
  if (!existsSync(srcDir)) return 0;
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!match.test(entry.name)) continue;
    await copyFile(join(srcDir, entry.name), join(destDir, entry.name));
    count += 1;
  }
  return count;
}

async function main() {
  let total = 0;
  for (const target of targets) {
    total += await copyMatching(target);
  }
  console.log(`[copy-content] mirrored ${total} files into ${publicRoot}`);
}

main().catch((err) => {
  console.error("[copy-content] failed:", err);
  process.exit(1);
});
