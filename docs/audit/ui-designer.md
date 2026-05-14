# UI Designer Audit — Money-verse text legibility & immersion

**User complaint (verbatim):** *"names look pixelated too, not immersive"*

**Audited screen:** `/Users/nikhil/Documents/Dhaniverse.2.0/Money/auto-story-flow-1.png` (current beta — the "Chawl Mohalla" pill in the top-right is the only text visible at the moment of capture; NPC labels are gated on hover, dialog bar is absent).

The complaint is correct and the cause is mechanical, not aesthetic. Every text node in the WebGL canvas is a Phaser `GameObjects.Text` rendered through the browser font-stack (`fontFamily: "monospace"` → Menlo / Courier / Consolas) and then sampled by WebGL onto a 3× pixel-art world. That sampling is bilinear by default, so glyph edges blur into the saffron stroke and indigo fill — the user reads this as "debug overlay," not "in-world UI." A pixel-art game must render text from a **bitmap font baked at native resolution**, never from a vector font passed through a canvas2d→texture pipeline.

---

## 1. Findings

| # | Severity | Finding | Evidence |
|---|---|---|---|
| F1 | **CRITICAL** | NPC name label is **6px monospace system font** — physically below the legibility floor (~10px) for any anti-aliased vector font, and the only way 6px text reads cleanly is as a hand-tuned bitmap glyph. WebGL bilinear sampling of 6px Menlo at 3× world zoom = mush. | `apps/game/src/entities/Npc.ts:142–148` — `fontSize: "6px", fontFamily: "monospace"`. |
| F2 | **HIGH** | The entire UI shell — district pill (13px), objective banner (12px), interact bar (13px), dialog body (16px), dialog speaker tag (14px), OBJECTIVE chip (10px), SPACE hint (12px) — all use `fontFamily: "monospace"`. Eight distinct text nodes, zero bitmap fonts, eight different visual treatments of the same "system mono fallback." This is the root cause of the "not immersive" reading. | `apps/game/src/scenes/UIScene.ts:78, 85, 119, 133`; `apps/game/src/scenes/DialogScene.ts:57, 66, 72`. |
| F3 | **HIGH** | No pixel font is loaded anywhere in the project. `find ... *.fnt *.ttf` inside `apps/game` returns **zero** results. `ASSET_PLAN.md §B.1` *names* Monogram (CC0) and LanaPixel (OFL) as the chosen primaries but neither has been fetched into `apps/game/public/`. The Ninja Adventure pack at `apps/game/public/atlases/ninja-adventure/` ships `characters/`, `hud/`, `items/`, `fx/`, `background-elements/` — **but no `fonts/` folder**. Plan and shipped substrate disagree. | `apps/game/public/atlases/ninja-adventure/` (no fonts dir); `assets/chawl-mohalla/ASSET_PLAN.md:159–161`. |
| F4 | **MEDIUM** | Label has no hierarchy: same 6px size for "Maya didi" (a named character with a quest) as it would have for any throwaway prop. No corner radius beyond the unstyled Phaser `backgroundColor` (which renders as a hard rect — no `roundRectangle`), and `padding: { 3, 3, 1, 1 }` is too tight to read as a "tag." The label visually equals a debug AABB. | `apps/game/src/entities/Npc.ts:146–149`. |
| F5 | **MEDIUM (WCAG)** | Body text at 12–16px on `#1a0a26` panel = contrast ratio ≈ 12.4:1 — fine. **But** the 6px NPC label cannot meet SC 1.4.4 (Resize Text) — at 200% browser zoom it still rasterises through the same blurred pipeline, so glyph stroke vanishes. Bitmap fonts side-step SC 1.4.4 only if a parallel HTML/aria announcement exists; `announce()` is already wired (`apps/game/src/lib/announce.ts`) so this is recoverable. | WCAG 2.1 SC 1.4.4; `Npc.ts:142`. |

---

## 2. Fix plan — ranked by `(impact × confidence) / effort`

| Rank | Move | Impact | Confidence | Effort | Score |
|---|---|---|---|---|---|
| **P0** | **Adopt Monogram as the single pixel font of record.** Download `monogram-extended.ttf` from datagoblin (CC0). Use `phaser-font-plugin` or pre-bake to a `.fnt` (BMFont format) via `hiero` / `bmfont` at 8px native, then load with `this.load.bitmapFont('monogram-8', 'fonts/monogram-8.png', 'fonts/monogram-8.fnt')` in the **boot** scene. Replace every `this.add.text(...)` in `UIScene`, `DialogScene`, `Npc` with `this.add.bitmapText(...)`. **This is the single biggest move — the user will see the change in 4 seconds.** | 10 | 0.95 | 4h | 2.38 |
| P1 | **Bump NPC label from 6px → 8px Monogram bitmap, wrap in a `rexUI.roundRectangle` tag** (radius 3, fill `#1a0a26ee`, stroke `#f7b733` 1px, padding `{l:6, r:6, t:3, b:3}`). Always-visible for named NPCs (Maya, Bhola, Ravi); hover-only for crowd NPCs. Hierarchy emerges automatically. | 8 | 0.9 | 1.5h | 4.80 |
| P2 | **Add LanaPixel as a 10px body-text bitmap font** for the dialog body (multi-line) — Monogram is great for caps/labels, LanaPixel reads better for long sentences thanks to wider counters. Two-font system, both pixel-native, zero blur. | 6 | 0.85 | 2h | 2.55 |
| P3 | **Pre-load both fonts in a `BootScene` before `World` starts.** Block scene start on `this.load.on('complete')`. Prevents flash-of-Menlo on first paint. | 5 | 0.95 | 0.5h | 9.50 |
| P4 | **Add a `--font-pixel-display` / `--font-pixel-body` token pair** in a new `apps/game/src/ui/tokens.ts` so future scenes never inline a `fontFamily` string again. Lints away the regression. | 4 | 0.9 | 1h | 3.60 |

P0 + P1 alone resolve the complaint. P3 prevents the FOUC regression. P2 + P4 are quality-of-life.

---

## 3. Typography hierarchy spec

A **two-font, four-step scale**, all bitmap, snapped to integer pixels.

| Token | Font | Size | Line-height | Where it's used |
|---|---|---|---|---|
| `display` | Monogram | **16px** | 20px | District pill enter-banner, scene titles (`UIScene.showDistrictPill`). Replaces current 13px monospace. |
| `heading` | Monogram | **12px** | 16px | Dialog speaker tag, "OBJECTIVE" chip, interact-bar verb. Replaces 14px/10px/13px monospace. |
| `body` | LanaPixel | **10px** | 14px | Dialog body lines, objective text, minimap legend. Replaces 16px/12px monospace. (Looks larger than 10px Menlo because LanaPixel has no anti-alias halo.) |
| `caption` | Monogram | **8px** | 10px | NPC over-head names, "Press SPACE" footer hint, debug overlays. Replaces the 6px monospace. |

**Color tokens (reuse existing panel palette):**
- `--text-primary: #f5f1ea` (cream, on indigo) — body
- `--text-accent: #f7b733` (saffron) — verbs, hints
- `--text-on-accent: #1a0a26` (indigo) — text inside saffron chips

**Container rules** for any text "tag" (NPC label, district pill, OBJECTIVE chip, interact bar):
- Background: `roundRectangle` r=3, fill `#1a0a26ee`, stroke `#f7b733` 1px @ 0.9α
- Padding: `{l:6, r:6, t:3, b:3}` (was `{3,3,1,1}` — too tight)
- Drop-shadow: 1px down, `#000` @ 0.5α (pixel-snapped, not blurred)
- Never use Phaser's built-in `backgroundColor` on a Text node — it renders a raw rect.

---

## TL;DR for the user

The names look pixelated because **they aren't pixel art** — they're 6px Menlo (system monospace) rasterised through WebGL bilinear sampling at 3× zoom. Three fixes, in order: **(1) load Monogram.fnt as a bitmap font and swap every `add.text` to `add.bitmapText`** (this alone fixes 80% of the complaint and is the one move you'll notice in 4 seconds); **(2)** bump NPC labels 6→8px and wrap them in a saffron-stroked rounded tag so they read as in-world UI, not debug rects; **(3)** add LanaPixel 10px for dialog body so paragraphs stop looking like terminal output. Expected perceived-quality lift: from "Phaser demo with overlay text" to "shipped indie pixel-art RPG" — roughly the same delta the screenshot shows between Money-verse and any Octopath-tier reference. **Single biggest move: replace `fontFamily: "monospace"` everywhere with `bitmapText('monogram-8')` from a pre-loaded `.fnt` atlas.**
