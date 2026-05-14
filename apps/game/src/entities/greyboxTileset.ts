import * as Phaser from "phaser";

export const GREYBOX_TILESET_KEY = "chawl-greybox-procedural";
export const GREYBOX_TILESET_NAME = "chawl-greybox";
const TILE_SIZE = 16;
const COLS = 16;
const ROWS = 16;
const TEX_WIDTH = COLS * TILE_SIZE;
const TEX_HEIGHT = ROWS * TILE_SIZE;

const GROUND_FILL = 0x3a1e4f;
const WALL_FILL = 0x2a1242;
const PROP_FILL = 0xc87156;
const INTERACTIVE_FILL = 0xf7b733;
const SEAM = 0x140820;
const EMPTY = 0x281636;

export function ensureGreyboxTileset(scene: Phaser.Scene): void {
  if (scene.textures.exists(GREYBOX_TILESET_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(EMPTY, 1);
  g.fillRect(0, 0, TEX_WIDTH, TEX_HEIGHT);

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tileIndex = row * COLS + col;
      const gid = tileIndex + 1;
      const color = colorForGid(gid);
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;
      g.fillStyle(SEAM, 1);
      g.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      g.fillStyle(color, 1);
      g.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);

      if (isInteractive(gid)) {
        g.fillStyle(SEAM, 1);
        g.fillRect(x + 6, y + 6, 4, 4);
      }
    }
  }

  g.generateTexture(GREYBOX_TILESET_KEY, TEX_WIDTH, TEX_HEIGHT);
  g.destroy();
}

function colorForGid(gid: number): number {
  if (gid >= 1 && gid <= 9) return GROUND_FILL;
  if (gid >= 10 && gid <= 19) return WALL_FILL;
  if (gid >= 20 && gid <= 49) return PROP_FILL;
  if (gid >= 50 && gid <= 54) return INTERACTIVE_FILL;
  return EMPTY;
}

function isInteractive(gid: number): boolean {
  return gid >= 50 && gid <= 54;
}
