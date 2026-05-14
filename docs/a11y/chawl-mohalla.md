# A11y Audit — Chawl Mohalla (District 1)

**Audit date:** 2026-05-14
**Auditor:** a11y-reviewer
**Standard:** WCAG 2.2 AA + Ninja Money-verse pillars (esp. #10 Assist Mode for finance)
**Scope:** `apps/game/src/scenes/{WorldScene,UIScene,PreloadScene}.ts`, `apps/game/src/entities/{Player,Npc,InteractZone}.ts`, 6 `.yarn` quest files, 10 NPC `.json` files, `packages/content/i18n/{en,hi}/{npcs,quests}.json`.

---

## TL;DR — Ship status

**Not ship-able under WCAG 2.2 AA today.** Five CRITICAL findings, five HIGH, six MEDIUM, four LOW. The single most blocking issue is the **complete absence of any ARIA-live region in the React overlay** (`apps/web/app/play/GameMount.tsx`) despite `ARCHITECTURE.md §12` calling for one — every quest dialog, district transition, interact prompt, and load error is invisible to screen-reader users. Until that pipe exists and the Phaser scenes push into it, the chawl is unplayable by a blind or low-vision user, which is a P0 WCAG 4.1.3 / 1.3.1 violation. Once the live region, an Assist Mode toggle, a focus-visible state on the canvas, and translated NPC voice lines land, the chawl can be re-audited for ship readiness.

---

## Quick wins — 3 smallest changes that close ~80% of findings

1. **Add a single visually-hidden `aria-live="polite"` region to `GameMount.tsx`** and a tiny `aria-live="assertive"` region for errors. Wire `WorldScene`, `UIScene`, and `DialogScene` to push interact prompts, district pill text, load errors, and quest line speakers through a `game.events.emit('a11y:announce', { text, priority })` channel that the React overlay subscribes to. *Closes WCAG 1.3.1, 4.1.3, 3.3.1, 2.4.6 across roughly half of all findings below.*

2. **Render an Assist Mode toggle in the play-route overlay** (top-left, focusable button, persists via `localStorage` and `profiles.assist_mode_flags`). Wire it to set `scene.registry.set('assistMode', true)` so quest runners can branch on `<<if assist_mode>>` and the WorldScene can already-reduce-motion / slow camera. *Closes pillar #10 violation, the missing-Assist toggle finding, and the time-pressure landlord finding in one stroke.*

3. **Replace the bare 16×16 `InteractZone` collision rectangle with a padded ≥32×32 effective hit area on pointer/touch builds** (keep the visual zone unchanged; just inflate the physics body when `this.sys.game.device.input.touch`). And: on the touch joystick, draw a visible base+thumb circle so the touch target is discoverable. *Closes WCAG 2.5.8 (target size minimum) and discoverability NOTE.*

---

## CRITICAL findings

### C1 · [WCAG 4.1.3 Status Messages, 1.3.1 Info & Relationships] No ARIA-live region anywhere in the React overlay
- **Surface:** `apps/web/app/play/GameMount.tsx` (lines 39–46); `apps/game/src/scenes/UIScene.ts` (full file); `apps/game/src/scenes/WorldScene.ts:298–302, 347–355`.
- **Description:** `ARCHITECTURE.md §12` mandates: *"Phaser scenes mirror critical state to an off-screen ARIA-live region (in the React overlay) so screen readers can follow."* The overlay contains only `role="application" aria-label="Ninja Money-verse game"` on a `<div>` — no live region exists, and no scene emits to one. The interact bar (`UIScene.showInteract`), the district pill text ("Chawl Mohalla"), the minimap player position, and the load-error text in `WorldScene.showLoadError` are all rendered into the Phaser WebGL canvas and therefore opaque to AT.
- **Severity:** CRITICAL — a blind user cannot perceive *any* game state change.
- **Remediation:**
  ```tsx
  // GameMount.tsx
  <div role="application" aria-label="Ninja Money-verse game" className="h-screen w-screen relative">
    <div ref={ref} className="absolute inset-0" />
    <div
      id="a11y-live-polite"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
    <div
      id="a11y-live-assertive"
      role="alert"
      aria-live="assertive"
      className="sr-only"
    />
  </div>
  ```
  Add a single emitter API: `scene.game.events.emit('a11y:announce', { text, priority: 'polite'|'assertive' })`. Wire from `UIScene.showInteract`, `UIScene.createDistrictPill`, `WorldScene.showLoadError`, and (when it exists) `DialogScene` line changes.

### C2 · [WCAG 2.1.1 Keyboard, 2.4.3 Focus Order] The Phaser canvas never receives keyboard focus when the page loads
- **Surface:** `apps/web/app/play/GameMount.tsx` (lines 39–46); `apps/game/src/entities/Player.ts:78–94`.
- **Description:** `Player.bindInputs` calls `scene.input.keyboard.createCursorKeys()`, but the canvas element produced by Phaser is not focusable by default (no `tabindex`), the parent `<div>` has `role="application"` but no `tabindex="0"`, and nothing auto-focuses on mount. A keyboard-only user tabbing through the page will skip the game entirely, and even if they click, focus may remain on a Next.js layout element. Result: arrow keys / WASD / E are silently dropped.
- **Severity:** CRITICAL — keyboard nav fully broken on first paint.
- **Remediation:** Set `tabIndex={0}` on the root play div and auto-focus on mount; also call `this.game.canvas.setAttribute('tabindex', '0')` after `new Phaser.Game(...)`. Add a visible `:focus-visible` ring around the canvas region so sighted keyboard users see where focus is.

### C3 · [WCAG 2.4.7 Focus Visible] No focus indicator on the canvas or any interactive surface
- **Surface:** `apps/web/app/play/GameMount.tsx`; `apps/game/src/scenes/UIScene.ts`.
- **Description:** No CSS rule applies a `:focus-visible` outline to the game container. There is also no in-game cursor / selection ring on the player or the active interact zone — sighted keyboard users have zero visual confirmation that input will route to the game.
- **Severity:** CRITICAL.
- **Remediation:** Add `.outline-2 outline-saffron focus-visible:outline` (or equivalent token) to the play div. In `UIScene.showInteract`, also render a 2-px stroked rectangle around the active `InteractZone` so on-screen focus state is visible.

### C4 · [WCAG 3.3.1 Error Identification, 1.3.1 Info & Relationships] `showLoadError` is an unannounced piece of canvas text
- **Surface:** `apps/game/src/scenes/WorldScene.ts:347–355`.
- **Description:** When district meta or tileset binding fails, the user sees `"Missing district meta"` or `"Failed to bind tileset"` rendered as Phaser `Text` at canvas center, `#f7b733` on whatever the scene background is, with no:
  - announcement to AT;
  - recovery action (no Retry button, no link to support, no instruction);
  - language localisation (English-only string).
  This violates 3.3.1 (must identify the error *and* suggest a fix) and 3.3.3 (error suggestion). It also fails 1.4.3 — a saffron `#f7b733` text on `#0a0612` (the scene's `backgroundColor` from `GameMount`) is 12.5:1 which passes, but if the tileset fails it could be on a partial map render with much worse contrast.
- **Severity:** CRITICAL — players hitting this will be stuck silently.
- **Remediation:** Emit `'a11y:announce'` with priority `assertive`; render an HTML overlay (in React) with the error message, a Retry button (focusable), a "Reload page" fallback, and a link to a support address. Localise via `i18n/<locale>/errors.json`.

### C5 · [WCAG 1.3.1, 4.1.2 Name/Role/Value] Quest dialog (`.yarn`) speakers and lines have no screen-reader pipeline
- **Surface:** All 6 `.yarn` files in `packages/content/quests/`; consumed by `DialogScene` (referenced in `GameMount.tsx:20`, not in audit scope but the contract is broken here).
- **Description:** `ARCHITECTURE.md §12` mandates: *"Every quest must compile a 'screen-reader summary' string (Yarn metadata)."* None of the 6 chawl yarns carry SR metadata in their `tags:` block. There is also no convention for tagging the speaker — `maya-didi: ...` is parsed by humans but not by any compiler in the repo. When DialogScene runs, AT users will hear nothing.
- **Severity:** CRITICAL — the entire learning surface is inaccessible.
- **Remediation:**
  - Add `tags: sr-summary="Maya gives you ₹15,000 and three envelopes."` to every Yarn node, or a top-of-file `sr-summary:` field.
  - In the Yarn → JSON compiler (lives in `packages/content/scripts/` per ARCHITECTURE.md §11), emit `{ speakerKey, speakerName, line, srSummary }` per beat and have `DialogScene` push the speaker+line into `aria-live="polite"` on every advance, and the `srSummary` on node entry.

---

## HIGH findings

### H1 · [WCAG 1.4.3 Contrast (Minimum)] Minimap inner fill `#3a1e4f` on `#1a0a26` is 1.33:1
- **Surface:** `apps/game/src/scenes/UIScene.ts:154,163` (the minimap inner rect uses `fillStyle(0x3a1e4f, 0.95)` over the `0x1a0a26` outer frame).
- **Description:** The "playable area" tint inside the minimap fails 1.4.11 (Non-text Contrast). Even when treated as a non-essential decoration, the player dot (`#f7b733` at radius 2 on `#3a1e4f`) is 7.96:1 which is fine, but the *shape of the playable area* is invisible against the frame. Calculated:
  - `#3a1e4f` on `#1a0a26` = **1.33:1** (FAIL 1.4.11 ≥3:1)
  - `#2a1242` on `#1a0a26` = **1.13:1** (would also FAIL)
- **Severity:** HIGH — low-vision players cannot distinguish map from frame.
- **Remediation:** Raise inner fill to at least `#5a3a72` or stroke the inner rect with `#f5f1ea` 1px (≥3:1 vs both). Alternatively render the minimap as an HTML/SVG element in the React overlay so it can also be announced.

### H2 · [WCAG 1.4.11 Non-text Contrast] Locked-archway block `0x1a0a26` @ 0.6 alpha on dark ground is sub-3:1
- **Surface:** `apps/game/src/scenes/WorldScene.ts:165–185`.
- **Description:** `maybeBuildArchwayLock` paints a `0x1a0a26` rectangle at alpha 0.6 with a `0xf7b733` 1-px stroke. The fill effectively blends to ~`#160820`, which is indistinguishable from the surrounding `#1a0a26` UI palette. The thin saffron stroke is 10.56:1 against `#1a0a26` (fine), but a 1-px stroke is below the 3:1 *area* threshold for being the sole indicator.
- **Severity:** HIGH — players (especially color-blind) may not see they are blocked, just bump invisibly.
- **Remediation:** Thicken stroke to 2 px; add a small lock icon and an "Unlock with Budget I" text label inside the rect. Emit an `a11y:announce` on first collision: *"Archway to Bank Bazaar is locked. Finish the Graduation quest to unlock."*

### H3 · [WCAG 2.5.8 Target Size (Minimum)] Interact zones default to 16×16 — fingers can't reliably tap
- **Surface:** `apps/game/src/scenes/WorldScene.ts:207–232` (zones inherit `obj.width ?? 16, obj.height ?? 16` from Tiled); `apps/game/src/entities/InteractZone.ts:36`.
- **Description:** WCAG 2.2 introduces 2.5.8 (Target Size Minimum) requiring 24×24 CSS-px minimum. Even on desktop at integer scale, 16 game-pixels rarely renders to >24 CSS-px. Mobile users will struggle to position the avatar's body-sized 8-px tall feet collider on top of a 16-px zone.
- **Severity:** HIGH — touch ux is gated.
- **Remediation:** In `InteractZone` constructor, when `scene.sys.game.device.input.touch`, inflate the physics body by 8 px in each axis (visual zone stays the same to not bleed neighbours). Alternatively widen the `isPlayerOnZone` tolerance from `+6` (`WorldScene.ts:397`) to `+12` on touch.

### H4 · [WCAG 3.1.2 Language of Parts] Hindi locale leaves all NPC `voiceExamples` and all Yarn dialog in English
- **Surface:** All 10 NPC JSONs and 6 Yarn files; `packages/content/i18n/hi/npcs.json` (only `displayName` keys exist).
- **Description:** `displayName` is translated to Devanagari (good), but `voiceExamples` arrays in NPC JSON, and 100% of Yarn dialog lines, are English-with-Hindi-vocatives (`arre`, `na`, `beta`). When a user picks Hindi locale, the heading reads "माया दीदी" and then renders a wall of English speech. WCAG 3.1.2 requires marking parts in a different language with the correct `lang` attribute *and* internationalising user-facing strings per PRD §6.1 ("Bilingual dialog — EN + HI from launch").
- **Severity:** HIGH — half the bilingual promise is unfulfilled; also breaks AT pronunciation (a screen reader in Hindi mode will mangle Hinglish lines).
- **Remediation:**
  1. Move every voice line to `packages/content/i18n/<locale>/npc-voicelines.json` keyed `npc.<id>.voiceExamples.<n>`.
  2. Author Devanagari Hindi versions (Maya's "Three envelopes" → "तीन लिफ़ाफ़े. बस इतना ही.").
  3. Compile Yarn beats with `lang` attribute per line; if a line is intentionally code-mixed, wrap the non-locale span in `<span lang="hi">arre</span>`.
  4. Until translation lands, mark NPCs / quests as English-only in the locale picker rather than serving English-as-Hindi.

### H5 · [WCAG 2.2.1 Timing Adjustable] Time-pressure dialogue in `rent-day.yarn` has no Assist override
- **Surface:** `packages/content/quests/rent-day.yarn:5–7` ("Seven taarikh hai. … No 'kal de dunga'. Aaj.").
- **Description:** While there is no real-clock timer, the in-fiction landlord's pressure plus the cooldown-emitted prompt at 250 ms (`WorldScene.ts:285`) puts time pressure on cognition-impaired players. PRD pillar #4 ("Forgiveness over punishment") and #10 ("Assist Mode") together require an option to slow or remove pressure. The yarn does branch to `RentDay_PayLate` (good — forgiveness present), but there is no UI affordance for "always grant me extra time" / "skip pressure framing."
- **Severity:** HIGH — pillar #10 violation.
- **Remediation:** Define an Assist Mode flag (`profiles.assist_mode_flags.removeTimePressure`) that the Yarn runner reads to skip pressure framing lines (`<<if !assist_mode>>landlord: No "kal de dunga". Aaj.<<endif>>`). Also see C-level Quick Win #2.

---

## MEDIUM findings

### M1 · [WCAG 1.3.1] Phaser-rendered text is invisible to AT — NPC labels, district pill, interact prompt
- **Surface:** `apps/game/src/entities/Npc.ts:47–56`; `apps/game/src/scenes/UIScene.ts:69–75, 97–103`.
- **Description:** Every diegetic label ("Maya didi", "Press E to talk", "Chawl Mohalla") is a Phaser `Text` object rendered to canvas. None of them appear in the DOM accessibility tree. (Subsumed by C1's remediation if announcements are wired through.)
- **Severity:** MEDIUM — same root cause as C1, but specific to these labels.
- **Remediation:** When approaching an NPC and the interact prompt becomes "Press E to talk to Maya didi", emit `a11y:announce` with the NPC's `displayName_key` resolved to the current locale.

### M2 · [WCAG 1.4.12 Text Spacing, 1.4.4 Resize Text] Hard-coded `13px` / `10px` / `16px` fonts cannot scale
- **Surface:** `apps/game/src/scenes/UIScene.ts:71,99`; `apps/game/src/entities/Npc.ts:50`; `apps/game/src/scenes/WorldScene.ts:350`.
- **Description:** `fontSize: "13px"` etc. are baked. PRD §8 promises "Scalable UI: 100% / 125% / 150% / 200%." There is no current mechanism to multiply Phaser text sizes by a user-selected scale.
- **Severity:** MEDIUM.
- **Remediation:** Introduce a `getUiScale()` helper that reads from `scene.registry.get('uiScale')`. Multiply every `fontSize` and the minimap dimensions by it. Add a Settings panel to set the scale.

### M3 · [WCAG 1.3.3 Sensory Characteristics] Interact prompts say "Press E" — touch users have no analogue
- **Surface:** `apps/game/src/entities/InteractZone.ts:5–10`.
- **Description:** `PROMPTS: { door: "Press E to enter", ... }` assumes a keyboard. On touch devices the user has no "E" key; the joystick "left half of screen" hint isn't surfaced either, and there is no on-screen interact button.
- **Severity:** MEDIUM.
- **Remediation:** Detect input modality and swap prompt: `"Press E to enter"` ↔ `"Tap to enter"`. Add an on-screen interact button (right side, ≥44×44 CSS-px) that emits the same `'keydown-E'` semantics.

### M4 · [WCAG 2.4.6 Headings and Labels] District pill auto-hides after 3 s with no way to recall
- **Surface:** `apps/game/src/scenes/UIScene.ts:80–87` (`DISTRICT_PILL_MS = 3000` then tweened to alpha 0).
- **Description:** The pill is the only label naming the current location. Once gone, a player who joins mid-session or returns from a tab switch has no way to re-read it. Also fails 3.2.4 (consistent identification) because pages elsewhere have persistent headings.
- **Severity:** MEDIUM.
- **Remediation:** Make the pill recallable — e.g., persist a smaller version in the corner permanently, or re-show on `'visibilitychange' → visible`, or bind a `H` (header / where-am-I) key that re-shows and announces it.

### M5 · [WCAG 2.3.3 Animation from Interactions] Minimap and district-pill tween ignore `prefers-reduced-motion`
- **Surface:** `apps/game/src/scenes/UIScene.ts:80–88` (district pill 500ms fade tween); `apps/game/src/scenes/UIScene.ts:148–170` (minimap redraws every frame).
- **Description:** `WorldScene.init` reads `prefers-reduced-motion` and disables camera ease — good. But `UIScene` never receives or honors that flag: the district pill still fades, and the minimap redraws (cheap, but with the player dot moving smoothly under follow). PRD §8: "Reduce-motion option (kills screen-shake, parallax, particle effects)."
- **Severity:** MEDIUM.
- **Remediation:** Pass `prefersReducedMotion` into `UIScene` via the `data` payload in `PreloadScene.ts:36` (or read it from registry). When set, hide the district pill by `setVisible(false)` instead of tweening, and update the minimap dot only every 4th tick (or snap to integer grid).

### M6 · [WCAG 3.1.1 Language of Page, 3.1.2 Language of Parts] `<html lang="en">` is hardcoded even when content is Hindi
- **Surface:** `apps/web/app/layout.tsx:48`.
- **Description:** Root `<html lang="en">` is static. When a user opens `/play` with Hindi content, the HTML lang attribute lies. Per PRD §6.1 we ship bilingual on day one.
- **Severity:** MEDIUM.
- **Remediation:** Derive `lang` from a cookie / route segment / user profile in a server component, e.g., `const lang = (await cookies()).get('locale')?.value ?? 'en'`.

---

## LOW / NOTE findings

### L1 · [NOTE — Pillar #10] No Assist Mode UI exists anywhere in the chawl
- **Surface:** Codebase-wide — only one indirect reference (`packages/content/npcs/maya-didi.memory.json` mentions a `maya-assist-mode-offer` dialog branch unlocked after 3 fails). No settings panel, no toggle, no documented `assist_mode_flags` writer.
- **Description:** Pillar #10 is non-negotiable: "Every concept has slowed-tick, exposed-math, hint-NPC variant." The data model has `profiles.assist_mode_flags(jsonb)` (`ARCHITECTURE.md §4`) but no UI sets it. PRD anti-pattern: never call it "Easy" — must read "Assist".
- **Severity:** NOTE here (because outside chawl-specific surfaces), but blocks ship in conjunction with H5.
- **Remediation:** See Quick Win #2.

### L2 · [WCAG 1.4.8 Visual Presentation — best practice] NPC label background `#1a0a26cc` over arbitrary world tiles can hit poor contrast
- **Surface:** `apps/game/src/entities/Npc.ts:53` (`backgroundColor: "#1a0a26cc"`).
- **Description:** The cream `#f5f1ea` text on `#1a0a26` is 16.7:1 (great), but the bg is alpha 0xCC (80%) layered over whatever tile is behind. In bright-tile areas the blend can degrade below 4.5:1.
- **Severity:** LOW.
- **Remediation:** Set background to opaque `#1a0a26ff` or add a 1-px outline to the text via `setStroke('#1a0a26', 2)` so it survives any underlying tile.

### L3 · [NOTE — Audio] No audio assets exist; captions/transcripts are N/A but flag for re-audit
- **Surface:** N/A.
- **Description:** PRD §8 ("Audio identity") promises tabla / harmonium / SFX. None present yet. Re-audit per WCAG 1.2.1 / 1.2.2 once audio lands.
- **Severity:** NOTE.
- **Remediation:** Track as a re-audit checklist item; require captions for any UPI-success chime / NPC leitmotif before they merge.

### L4 · [NOTE — Photo-sensitivity] No flashes above 3 Hz detected in the chawl surfaces
- **Surface:** Verified — `apps/web/app/(landing)/HeroDiorama.tsx` lamp flicker is ~0.83 Hz (1.2 s loop), `PreloadScene.ts` progress bar is monotonic. No strobing in game scenes.
- **Severity:** Compliant.
- **Remediation:** None. Maintain a 3 Hz cap as a CI check (e.g., a unit-test on animation manifests).

---

## Summary table

| Finding | WCAG | Surface | Severity |
|---|---|---|---|
| C1 No ARIA-live region anywhere | 4.1.3, 1.3.1 | `GameMount.tsx`, `UIScene.ts`, `WorldScene.ts` | CRITICAL |
| C2 Canvas never receives focus | 2.1.1, 2.4.3 | `GameMount.tsx`, `Player.ts` | CRITICAL |
| C3 No focus-visible indicator | 2.4.7 | `GameMount.tsx`, `UIScene.ts` | CRITICAL |
| C4 `showLoadError` is silent canvas text | 3.3.1, 1.3.1 | `WorldScene.ts:347` | CRITICAL |
| C5 Yarn dialog has no SR pipeline | 1.3.1, 4.1.2 | all `.yarn`, `DialogScene` | CRITICAL |
| H1 Minimap inner contrast 1.33:1 | 1.4.11 | `UIScene.ts:163` | HIGH |
| H2 Archway block ≤3:1 | 1.4.11 | `WorldScene.ts:174–183` | HIGH |
| H3 Interact zones 16×16 too small | 2.5.8 | `InteractZone.ts:36` | HIGH |
| H4 Hindi locale serves English content | 3.1.2 | `i18n/hi/*`, all `.yarn`, all NPC `.json` | HIGH |
| H5 Time-pressure dialog no Assist override | 2.2.1 (+ pillar 10) | `rent-day.yarn` | HIGH |
| M1 Phaser text invisible to AT | 1.3.1 | `Npc.ts`, `UIScene.ts` | MEDIUM |
| M2 Hardcoded font sizes | 1.4.4, 1.4.12 | `UIScene.ts`, `Npc.ts`, `WorldScene.ts:350` | MEDIUM |
| M3 "Press E" prompts on touch | 1.3.3 | `InteractZone.ts:5–10` | MEDIUM |
| M4 District pill un-recallable | 2.4.6 | `UIScene.ts:80–87` | MEDIUM |
| M5 UIScene ignores reduce-motion | 2.3.3 | `UIScene.ts:80–88, 148–170` | MEDIUM |
| M6 `<html lang="en">` hardcoded | 3.1.1 | `layout.tsx:48` | MEDIUM |
| L1 No Assist Mode UI | Pillar #10 | codebase-wide | NOTE |
| L2 NPC label bg alpha can blend poorly | 1.4.8 | `Npc.ts:53` | LOW |
| L3 Audio: re-audit when added | 1.2.x | N/A | NOTE |
| L4 No flashes >3 Hz | 2.3.1 | landing/game | PASS |

**Totals: 5 CRITICAL · 5 HIGH · 6 MEDIUM · 3 LOW/NOTE · 1 PASS.**

---

## Contrast math (for the record)

Greybox palette computed against the dominant background `#1a0a26`:

| Pair | Ratio | WCAG AA |
|---|---|---|
| `#f7b733` (saffron) on `#1a0a26` | **10.56 : 1** | PASS body + large |
| `#f5f1ea` (cream) on `#1a0a26` | **16.72 : 1** | PASS body + large |
| `#c87156` (terracotta) on `#1a0a26` | **5.34 : 1** | PASS body + large |
| `#3a1e4f` (purple) on `#1a0a26` | **1.33 : 1** | **FAIL** |
| `#2a1242` (deep purple) on `#1a0a26` | **1.13 : 1** | **FAIL** |
| `#f7b733` (saffron) on `#3a1e4f` | **7.96 : 1** | PASS body + large |
| `#1a0a26` on `#f5f1ea` | **16.72 : 1** | PASS body + large |

NPC palette swatches against the assumed `#3a1e4f` ground: range **3.58 : 1 → 7.82 : 1**. The two reddish swatches (`#d05a8d`, `#d05a5a`) sit close to the 3:1 floor — they pass non-text contrast but would need a stroke to comfortably pass against a slightly lighter ground tint.
