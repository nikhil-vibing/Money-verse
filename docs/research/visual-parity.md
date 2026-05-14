# Visual Parity Brief — Closing the Gap with Original Dhaniverse

> **Author:** master-researcher subagent. **Date:** 2026-05-14. **Scope:** Sub-problem of [PRD.md](../PRD.md) — close the in-game visual-quality gap with the original Dhaniverse while keeping our OSS-only, anti-Robinhood, Indian-context-first constraints intact.
>
> **Companion docs:** [MASTERS_RESEARCH.md](../MASTERS_RESEARCH.md) (general pillars), [district-chawl-mohalla.md](./district-chawl-mohalla.md) (chawl-specific design), [assets/chawl-mohalla/ASSET_PLAN.md](../../assets/chawl-mohalla/ASSET_PLAN.md) (curator round 1).

---

## 1. Honest gap analysis — what ships vs what doesn't

The original Dhaniverse is shipping a *finished-looking* HD-pixel RPG; we are shipping a procedurally-coloured greybox. The gap is roughly equal parts **engineering** (scenes, UI components, scaffolding) and **art** (tilesets, sprites). Engineering is wholly within our control today. Art is partly OSS-feasible, partly commission-only.

| System | Original Dhaniverse (observed) | Ninja Money-verse today | Gap type |
|---|---|---|---|
| **Welcome splash** | Galaxy bg + glow title + tagline + "Press to Start" | None | Engineering only |
| **Loading scene** | Branded pixel font, percentage, animated tip ticker | None | Engineering only |
| **Tileset (ground)** | Grass + dirt road + paved sidewalk + curb (real pixel art) | Procedural purple grid (`greyboxTileset.ts`) | Art + engineering |
| **Tileset (buildings)** | Pixel-art facades with depth, roofs, windows, signs, ATMs, lamp posts, post boxes, benches | Coloured rectangles | Art primarily |
| **Character sprite** | 4-direction animated walk cycle with hood/cape detailing | Single solid sprite from `Player.ts` | Art |
| **NPCs** | Distinct silhouettes, hats, vendor outfits | Named-coloured rectangles | Art |
| **Dialog box** | Bottom-anchored bordered pixel speech box + nameplate + portrait | None (only `interact:show` prompt) | Engineering only |
| **Speech bubble (world-space)** | Bordered pixel bubble above NPC head | None | Engineering only |
| **Objective banner** | Top-centre "Current Quest:" strip with title + step | None | Engineering only |
| **HUD currency** | Top-right ₹ counter with icon | None (only assist toggle visible) | Engineering only |
| **Character avatar slot** | Bottom-right portrait + name + level pip | None | Engineering only |
| **Minimap** | Bordered thumbnail with player dot, NPC pings, exits | Featureless filled rectangle (`emitMinimapTick`) | Engineering only |
| **ATM panel modal** | Tabbed dashboard (Overview / Deposit / Withdraw / Balance / Transactions) + Quick Actions cards | None | Engineering only |
| **Ambient FX** | Dust motes, lamp glow, depth fog | None | Engineering — shaders |
| **Sound** | Ambient + chime SFX on UPI/transaction | Silent | Out of scope here |

**Reading:** of the 14 visible visual systems, **8 are 100% engineering** (zero new art needed) and **6 need real art**. Today's procedural greybox is a perfectly defensible engineering choice — what is missing is the *scaffolding* around the greybox that makes a game feel like a game. That is the single biggest cheap win available.

---

## 2. Masters — first-30-seconds breakdown

### M1. Stardew Valley (Eric Barone, solo)
- **First-30-sec spell:** the player wakes in a hand-painted cabin, sees a *letter*, walks outside to a sunlit hand-painted town, and is greeted by Lewis. No menus, no cutscene-overload — the world *is* the tutorial. [district-chawl-mohalla §1.1] [NPR profile](https://www.npr.org/2025/01/24/g-s1-44510/the-legacy-and-future-of-the-farming-game-stardew-valley).
- **Signature:** 16×16 tiles, ~24-colour warm palette, *single* light direction (NW), 4-frame walk cycles, character portraits in dialog boxes.
- **What's borrowable under our licence:** the *form* — letter-as-tutorial, dialog box with portrait, single-light-direction discipline — is design pattern, free to copy. Barone hand-painted everything over years; we cannot. But his palette discipline and animation thrift map directly onto our OSS substrate.

### M2. Coral Island (Stairway Games)
- **First-30-sec spell:** higher-resolution Stardew with depth, drop shadows, ambient particles (fireflies, dust), water reflection on the dock.
- **Signature:** ~32×32 tiles, multi-tone shadows under every object, ambient looping particle systems, mild bloom.
- **Borrowable:** ambient particle layer (firefly, dust, monsoon-drizzle) is cheap in Phaser. Drop-shadow-under-everything is a 4-line shader. These two changes alone read as "modern" vs "1996".

### M3. Sun Haven (Pixel Sprout Studios)
- **First-30-sec spell:** parallax sky behind the town, distant mountains scrolling at 0.3x, foreground grass at 1.0x. Aggressive ambient lighting after dusk.
- **Signature:** parallax depth on a tight 16×16 base; coloured point lights at night (windows glow); a *lot* of subtle animation (chimneys smoke, fish jump, NPCs blink).
- **Borrowable:** Phaser supports parallax layers natively. Window-glow point lights are a custom shader pipeline (~80 lines). The "everything moves a little" texture is a configuration question, not a rendering one — every NPC needs a 2-frame idle and a swayable hair/dupatta layer.

### M4. CrossCode (Radical Fish Games)
- **First-30-sec spell:** the pixel art *looks 3D*. Walls have height, projectiles cast shadows on the ground, sprites occlude correctly with terrain layers.
- **Signature:** Each tile has a "ground" + "shadow caster" + "wall top" layer; sprites have a separate shadow blob that sits on the ground layer regardless of jump height. See [Creative Bloq write-up](https://www.creativebloq.com/3d/video-game-design/this-technique-for-making-2d-pixel-art-look-3d-is-blowing-peoples-minds) on this technique.
- **Borrowable:** the *ground-shadow-as-separate-blob* technique is free engineering. Adds depth to flat sprites without touching art.

### M5. Eastward (Pixpil)
- **First-30-sec spell:** painterly pixel art with cinematic dialog boxes, character portraits with animated mouth/eyes, slow-pan cameras inside dialog. [80.lv profile](https://80.lv/articles/eastward-charming-chinese-pixel-art-adventure), [GameDeveloper interview](https://www.gamedeveloper.com/art/eastward-s-creators-share-insights-on-making-pixel-art-adventures).
- **Signature:** Their pipeline is *3D-lit then projected back to pixel art*. Dialog box is a high-contrast bordered black panel, white text, animated portrait left, name plate top-left. Cinematic letterbox bars during cutscenes.
- **Borrowable:** the *dialog UI* is the cheapest, highest-impact lift. A bordered pixel panel + portrait + name + animated typewriter text + a small "▼" continue indicator is one component file. We will not reproduce their lighting pipeline; we can reproduce their UI presentation in a session.

### M6. Coromon (TRAGsoft)
- **First-30-sec spell:** charming animated 4-direction character sprites with smooth interpolation. Player character is *expressive* in a few pixels — emotive idle, run cycle, surprise reaction.
- **Signature:** larger 32×32 characters, 6-frame run, expressive blink-and-bob idle, hair physics layer drawn separately.
- **Borrowable:** Coromon's "expressive idle" rule — every character has a blink + breath idle, not just a static frame — is a tiny code change with disproportionate liveliness gain.

### M7. The original Dhaniverse (game.dhaniverse.in)
- **First-30-sec spell:** branded splash → loading bar with tip → spawn into a sunlit pixel city → bottom-right avatar tells you who you are → top-centre banner tells you what to do → currency top-right tells you what you have → nearby NPC has a "!" → press E → dialog box drops in. The whole *grammar* of a modern RPG, executed in pixel art.
- **Borrowable:** **the grammar itself.** Splash → loading → spawn → HUD-on → first NPC has "!" → dialog → first action. This is the template; we should clone the *flow* even if not the art.

---

## 3. Consensus + divergences

### Consensus (where 3+ masters agree)
1. **Dialog-box UI is the silent hero.** Stardew, Eastward, Dhaniverse all use a bordered, bottom-anchored panel + portrait + typewriter text + continue indicator. Same shape, same rhythm. *Without it the game feels like a tech demo.*
2. **Single light direction, drop-shadow under everything.** Coral Island, CrossCode, Stardew. The illusion of 3D inside 2D is sold by consistent shadows more than by lighting itself.
3. **"Everything moves a little."** Sun Haven, Coral Island, Coromon. Idle blink, hair sway, chimney smoke, foliage breath. Static = lifeless.
4. **HUD elements stay diegetic-adjacent but never inside the world.** All seven masters keep HUD in screen-space; minimaps and currency don't float in 3D.
5. **First NPC visible within 5 seconds of spawn.** Stardew (Lewis), Dhaniverse (Wren), Eastward (Sam) — all stage the first social anchor on entry.

### Divergence + our pick

| Question | Camp A | Camp B | Our pick |
|---|---|---|---|
| Tile baseline | 16×16 (Stardew) | 32×32 (Coral Island, Coromon) | **16×16** — matches our OSS substrate and PRD §8 |
| Character size | 24px (Stardew) | 32px (Coromon, Eastward) | **24px** — leaves vertical headroom for emoji bubbles & speech tails |
| Dialog box style | Eastward (bordered black, white text) | Stardew (wood-frame painterly) | **Eastward-leaning** — a saffron-bordered indigo panel reads as both ours-and-cinematic |
| Lighting | CrossCode (full dynamic) | Stardew (baked) | **Baked + 1 point light per lamp** — pragmatic for WebGL perf |
| Camera | Sea of Stars (free) | Eastward (slow cinematic pans) | **Free, with optional cinematic pan on dialog start** |

---

## 4. The concrete plan — phased & immediately actionable

### Phase A — Scene scaffolding (1-2 sessions, zero new art needed)

This is the single biggest perceived-quality win available. None of it needs a tile. All of it is React (UI scene) and Phaser (overlays/scenes). Component-by-component:

| # | Component | File / location (proposed) | Owns |
|---|---|---|---|
| A1 | **WelcomeSplashScene** | `apps/game/src/scenes/WelcomeSplashScene.ts` | Phaser scene that fades from black → indigo gradient → title glow → "Press any key" pulse → tabla beat → fades to LoadingScene |
| A2 | **LoadingScene** | `apps/game/src/scenes/LoadingScene.ts` | Loads asset bundle; shows a bordered pixel progress bar, a percentage, and a rotating *insight ticker* drawn from `data/loading-tips.json` (15-20 Indian-context finance one-liners) |
| A3 | **DialogBox React component** | `apps/web/src/components/game/DialogBox.tsx` (or in `apps/game/src/ui/DialogBox.ts` if Phaser-side) | Bottom-anchored 9-slice panel + 24×24 portrait slot + nameplate + typewriter text + "▼" continue indicator + branching-choice list (max 4). Subscribes to `dialog:show`/`dialog:advance`/`dialog:choose` events |
| A4 | **SpeechBubble world-space sprite** | `apps/game/src/entities/SpeechBubble.ts` | 9-slice bubble sprite attached above an NPC for the 2-3-word ambient bark ("Chai?", "Sab badhiya?"). Disappears on distance |
| A5 | **ObjectiveBanner** | `apps/web/src/components/game/ObjectiveBanner.tsx` | Top-centre strip: "Current Quest: Chai Hisaab" + sub-step "Buy chai for ₹10". Slides down on quest change, slides up on completion |
| A6 | **CurrencyHud** | `apps/web/src/components/game/CurrencyHud.tsx` | Top-right ₹ pixel-glyph + amount + small +/- delta tween on change. Subscribes to `wallet:change` |
| A7 | **AvatarSlot** | `apps/web/src/components/game/AvatarSlot.tsx` | Bottom-right 48×48 portrait + name + "Day 1, Chawl Mohalla" + four-pot mini-readout (Fixed/Save/Invest/Khushi) — diegetic from chawl §4.4 |
| A8 | **Minimap (real)** | `apps/web/src/components/game/Minimap.tsx` | Reads `minimap:tick` and `world:ready`. Draws bordered pixel canvas: roads light-tan, walls dark-indigo, player saffron dot, NPCs muted dots, exits as small ▴ marks. ~100 LoC with `OffscreenCanvas` |
| A9 | **InteractPrompt** (upgrade) | already exists conceptually; promote to bordered pixel pill | Replaces today's hidden behaviour with a bordered "[E] Talk to Wren" pixel pill 36px above the player |
| A10 | **TipsTicker** | `apps/game/src/lib/tipsTicker.ts` + JSON | Shared between LoadingScene and an optional in-world bottom-bar |
| A11 | **DayClockHud** (small) | `apps/web/src/components/game/DayClockHud.tsx` | "Day 1 · 9:14 AM" — top-left. Cheap, hugely grounding |
| A12 | **ToastQueue** | `apps/web/src/components/game/ToastQueue.tsx` | Quest-step-complete, glossary-unlocked, "Wren will see you on the verandah at 6pm" — non-intrusive, bottom-left |

**Phase A line-of-code budget:** ~1100-1500 LoC across 12 files. **Component count:** 12. **No new asset required** — A1/A2 can use procedurally-drawn glow + gradient; A3-A12 use Tailwind + Inter/JetBrains Mono pixel-styled fonts (already in the project) with a `border-image` 9-slice using a 16×16 PNG we hand-paint in <30 minutes.

**Acceptance test for Phase A:** loading the game from scratch must produce a flow indistinguishable in *shape* from the original Dhaniverse's first 30 seconds — splash, loading-with-tip, spawn, banner appears, currency appears, avatar appears, minimap appears, first NPC has prompt, press E → dialog box drops in. All using the existing procedural greybox underneath.

### Phase B — Tileset upgrade (1 session, real OSS art)

**Chosen pack:** **George Bailey's "16x16 Game Assets" (CC-BY 4.0, already in ASSET_PLAN.md as PRIMARY)** as the structural base, supplemented by **Kenney's RPG Urban Kit (CC0)** for street/lamp/sign props. Reasoning:

- George Bailey's pack is the most cohesive 16×16 top-down structure pack available under permissive licence today, with consistent palette and a single light direction. The interior subset is also strong, which lets us re-use it inside the player's kholi.
- We add a **single-tone drop-shadow underlay** in code (CrossCode trick) — every prop sprite gets a -2px-offset 35%-alpha black ellipse rendered to a separate Phaser layer below the props layer. This is ~30 LoC and changes the entire game's perceived quality more than any single asset would.
- Procedural greybox stays — we put it behind a feature flag (`render.greybox = true|false`) so we can A/B against the real tileset.

**Anti-recommendation (despite the temptation):**
- **Mana Seed** — *do not adopt*. Beautiful, but the [user licence](https://selieltheshaper.weebly.com/user-license.html) prohibits redistribution and requires per-product purchase. Worse, the licence is hostile to AI-generated content in the same project (we plan a Wren-AI tutor, this could be read as touching that clause). Not OSS by our standard.
- **LPC** — CC-BY-SA contaminates our codebase under share-alike. Already rejected in round 1.
- **Whispers of Avalon / Time Fantasy** — share-alike or paid-no-redistribute. Rejected.

**What stays OSS-feasible vs not:**
- ✅ Generic road, sidewalk, dirt, plaster wall, generic door, window, lamp post, post-box, ATM box, bench (Kenney + George Bailey covers all of this).
- ⚠️ *Generic* shopfront covered; **chai stall, kirana shop, chawl-specific architecture is not.** See Phase D.

### Phase C — Character sprites (1 session)

**Player:** Adopt the **anon 16×16 base** from ASSET_PLAN.md (CC0) at 24px tall scale, recolour to two South-Asian skin tones and a saffron kurta + indigo jeans. Add a 2-frame breath idle + 4-frame 4-direction walk + 1-frame blink overlay every 3-4 seconds (Coromon trick).

**Three NPC variants for the chawl opening:** Wren (sari overlay on anon base), Pintu chai-wala (apron + cap), Mara (older posture + sari + glasses). Three sprites is enough for the first 90 seconds [district-chawl-mohalla §4.1].

**Engineering:** add a tiny `SpriteAnimator` helper that picks the right walk-cycle direction from velocity sign and falls back to direction-of-last-press during idle.

### Phase D — Indian-specific re-skin (open scope, partial commission)

The honest part. The art-curator round 1 estimated **60-80 artist-hours** for the chawl to be visually distinct from a generic Western RPG town. We endorse that number.

| Item | Source | Hand-pixel? | Hours |
|---|---|---|---|
| Chai stall + brass kettle + glass cups (32×32 + 16×16 props) | Commission or hand-pixel | Yes | 8-10 |
| Dabbawala bicycle + tiffin tower (32×32 with 4-frame ride) | Hand-pixel | Yes | 6-8 |
| Chawl building re-skin (terracotta roof, iron-grille railing, hanging laundry sprites with 2-frame sway) | Recolour Kenney + hand-pixel | Mixed | 12-16 |
| Tulsi pot + small shrine + diya | Hand-pixel | Yes | 3-4 |
| Kirana shop facade (Hindi sign, snack-packet wall) | Hand-pixel + recolour | Mixed | 6-8 |
| Indian-formal-wear character overlays (saree, kurta, lungi, dupatta sway) for 8 named NPCs | Hand-pixel | Yes | 24-32 |
| ₹ pixel glyph + paisa coin icons | Hand-pixel | Yes | 1-2 |
| **Total** | | | **60-80 hours** |

**Budget recommendation:** at an indie pixel-artist rate of ₹600-1000/hour (Indian market), the chawl-only commission is **₹36,000-80,000**. This is the *honest* cost of getting our starting district to look like a chawl. There is no permissive-licence shortcut to Indian-specific 16×16 pixel art at this density. (Itch.io has Asian-flavoured packs, but every one I checked was either paid + non-redistributable, or CC-BY-SA which contaminates the rest of the codebase.)

**Note on AI-generated pixel art (Stable Diffusion etc.):** the 2025 USCO + DC-Circuit guidance ([Terms.Law write-up](https://terms.law/ai-output-rights/stable-diffusion/), [Stability AI License](https://stability.ai/license)) is that *purely AI-generated* outputs are not copyrightable; *substantially human-directed* outputs may be. Stable Diffusion 1.5 / SDXL outputs are commercially usable. **However:** pixel art at our resolution looks *bad* from raw SD output (aliasing, inconsistent palette, broken seams), and using SD outputs alongside Mana-Seed-style assets is forbidden by their licence (irrelevant for us, since we are not using Mana Seed). Verdict: **SD/Flux is acceptable as a sketch/mood-board input** that a human pixel artist then re-pixels by hand, but **never as the shipped asset**. We must not ship raw model output.

### Phase E — Diegetic UIs (2-3 sessions)

The financial UIs (ATM panel, bank counter, passbook, payslip puzzle) are pure React. They are also where we visually differentiate from the original Dhaniverse the most — *theirs* is a Western-style dashboard with cards and tabs (we screenshot this in §1). *Ours* should be diegetic-Indian:

- **ATM panel:** styled as an actual Indian PSU-bank ATM screen (cream + green palette, ALL-CAPS prompts, "INSERT CARD"-shaped prompts) → not as a SaaS dashboard.
- **Bank counter:** styled as a passbook-handover scene with a teller portrait, not as a settings panel.
- **Passbook:** literally a paper-textured booklet with rows of stamped entries — see chawl §4.6's payslip mock.
- **Payslip puzzle:** a paper-texture overlay with three drag-targets (income/expense/savings) on top of clay-pot icons — leans on the four-pot metaphor from PRD §7.

These are *visually authored* differentiation. Diegetic-UI work is some of the highest-leverage design work we can do; it makes us look *not like Robinhood* on contact.

---

## 5. Anti-patterns to NOT copy from original Dhaniverse

Observed in the competitor's shipped product — deliberately rejected by us per PRD §6.4:

1. **Casino card on the landing page.** A "Casino" tile prominently featured alongside Bank, Stock Market, Real Estate. This is speculative-gain framing — exactly what pillar #8 rejects. We have no casino.
2. **"Get rich or die trying" tagline framing.** The original positions financial life as a high-stakes individual quest. We position it as calm mastery + community ritual (chawl) + Indian-context grounding (Pillar 9). Our tone is *aaj se hisaab rakhna seekho*, not "moon mode".
3. **Achievement names like "Paper Hands" / "Bean Lord".** Imported r/wallstreetbets vocabulary. Our achievements should be in our Wren-and-aunty vernacular: *"Pehli SIP"*, *"Hisaab Pakka"*, *"Mara ki shabaashi"*.
4. **"Connection failed. Please refresh." full-overlay.** Brittle networking pattern. Our offline-first architecture (IndexedDB fallback per PRD §6.1) and Colyseus optional-sync rooms mean we never block the player on a network blip.
5. **Visible typos / copy quality.** "Hello their we have it all" is a polish failure. Our copy goes through a bilingual EN+HI review per PRD §6.1.
6. **Trading-history vanity stats as a primary achievement category.** This celebrates *transactions*; we celebrate *consistency* (Pillar §11 anti-metrics).

---

## 6. The single biggest move

**Ship Phase A in one session. It closes the largest perceived-quality gap with zero new art.**

The reason our game looks like a tech demo is not that the tiles are purple. It is that there is no splash, no loading screen, no dialog box, no objective banner, no currency counter, no avatar, no real minimap. The original Dhaniverse looks polished because it has those twelve scaffolding components, every one of which we can build today with the assets we already have. Once Phase A lands, the procedural greybox will read as a *deliberate stylistic choice* (think *Hyper Light Drifter*'s minimalism) rather than as a placeholder. Then Phase B (real tileset) and Phase C (real player sprite) move us from "stylised" to "shipping pixel-art RPG" in a further two sessions.

---

## Summary

**The single biggest move:** build Phase A (12 scaffolding UI components — splash, loading, dialog box, speech bubble, objective banner, currency, avatar, real minimap, interact pill, tip ticker, day clock, toast queue) in one session, zero new art needed. **Phase-A component count: 12.** Honest session estimate to reach *visual parity for the chawl district only*: **Phase A (1-2 sessions) + Phase B tileset adoption + drop-shadow shader (1 session) + Phase C player + 3 NPC sprites (1 session) + Phase E diegetic ATM/passbook UI (2-3 sessions) = 5-7 working sessions of engineering** — *plus* an unavoidable **60-80 artist-hours of commissioned/in-house pixel work (~₹36k-80k budget)** to make the chawl actually look like a chawl rather than a generic Western RPG town. No permissive-licence shortcut exists for the Indian-specificity layer; this is the cost of Pillar #9.
