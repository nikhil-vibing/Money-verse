# Ninja Money-verse — Landing Page Rebuild Brief

> Applies the **master** skill to one problem: the current landing page is a
> PRD wearing a marketing skin. It surfaces pillars, citations, anti-patterns,
> the OSS stack, two-door personas, anti-Robinhood manifestos, and 12-step IA.
> A landing page is not a PRD. This brief replaces it with one that *shows the
> game*. Targets the `(landing)/` route in `apps/web`.

---

## Phase 1 — Decode: what the page is actually for

Conversion goal: **press Play, the game starts in-browser.** No signup, no card, no email.

| Window | Visitor learns | What lands it |
|---|---|---|
| **3s** | Hand-painted pixel-RPG. Teaches money. | One dominant hero image. One sentence. |
| **30s** | Cast, verb, loop. Playable. | NPC cards, 3-verb explainer, one screenshot. |
| **3m** | Tap Play, or share. | A 60s playable beat + final CTA. |

If a section serves none of those three tiers, it doesn't belong.

---

## Phase 2 — Discover: masters of game landings

Seven references that **show the game, not the deck**. Each entry: first-4s visual / what to steal.

1. **Stardew Valley** (`stardewvalley.net`) — one hand-painted farm illo, pixel logo, two buttons. Calm letter copy. **Steal: calm as differentiation; the game art *is* the marketing art.**
2. **Cult of the Lamb** (`cultofthelamb.com`) — full-bleed pastel illo of the Lamb; marketing illos are enlarged in-game art. **Steal: the page should *feel like* the game — tonal continuity beats tonal variety.**
3. **Balatro** (`playbalatro.com`) — ~6s gameplay clip of cards exploding. Raw capture, no marketing veneer. **Steal: a hero loop that shows ONE verb at peak satisfaction.** Our verb: split-the-envelope.
4. **Sea of Stars** (`seaofstarsgame.com`) — animated sky over painted horizon, logo rises, CTA delayed. **Steal: let the world speak first.**
5. **Cookie Clicker** (`orteil.dashnet.org/cookieclicker`) — the game is on the page. **Steal: the CTA should feel like a door already cracked open.**
6. **Among Us** (`innersloth.com/games/among-us`) — friendly cartoon crewmate, wordmark, "Play free." **Steal: big friendly hero, tiny copy, big CTA. Childlike-not-childish.**
7. **Brilliant.org** — a tiny live interactive in the hero, "Learn by doing." **Steal: playable beat IN the hero. Edu products earn trust by letting you do.**

Tone references (non-game): Animal Crossing's site, Headspace's hand-drawn UI, Things 3's pastel calm. All "playful without patronising."

---

## Phase 3 — Childish-but-intuitive: the tone register

Read "childish" as **playful, warm, low-friction, slight whimsy** — Cult of the Lamb's pastel-horror, Among Us's friendly crewmate, Cookie Clicker's "tap me" innocence. **Not** condescending. **Not** corporate.

Operational rules:

- **One-syllable verbs** wherever possible: *Train. Save. Strike. Play.*
- **Sentence cap ~12 words.** Anything longer is a draft.
- **No jargon** — never *financial literacy*, *curriculum*, *gamified*. A 10-year-old reads the H1; a 30-year-old isn't patronised.
- **Game art everywhere** — the page wears the game's clothes.
- **Lean amber + cream** more than ink-black.
- **Whimsy reserved** — Biscuit wagging in a corner, a kunai-cursor on the CTA — each used once. Whimsy stops being charming on the third repeat.

---

## Phase 4 — Extract the meta-framework

### Consensus across masters (≥3 agree)

1. **One dominant visual carries the hero.** Words shrink, world expands.
2. **One CTA, repeated.** Never "Play / Learn / Watch" stacked.
3. **The marketing art IS the game art.** Don't commission a marketing illustration when sprites exist.
4. **Tone matches game tone.** No corporate veneer over a cozy product.
5. **Motion restrained.** One moving element at a time. `prefers-reduced-motion` honoured.
6. **The "what it is" sentence lands within 200 words of top.** Genre + verb + feeling.

### Divergences and our pick

| Decision | Our pick | Why |
|---|---|---|
| Static illustration (Stardew) vs looping clip (Balatro) | **In-game screenshot + tiny ambient motion** (one NPC idle-pulse). | A clip needs a recording pipeline. A still + one looping sprite is a Tuesday. |
| CTA above fold (Balatro) vs delayed (Sea of Stars) | **Above fold, big, single.** | Brilliant's lesson: edu wins by letting you do. Friction kills converts. |
| Marketing illustrations (Among Us) vs raw sprites (Stardew) | **Raw sprites + a tiny diorama composite.** | We *have* the assets — use them. |
| Anti-promise manifesto section | **Cut entirely.** | Belongs in footer fineprint, not as a band. The current page lectures. |

### Anti-patterns specific to our current page (each must die)

- **Anti-promise manifesto band** (`AntiPromise.tsx`) — six refusals telegraph distrust before earning it. Move to one footer line.
- **PRD-pillar callouts** (the "seven chambers… attention, patience, duty…") — internal language; means nothing to a first-time visitor.
- **OSS stack as a section** (`OpenSourceSection.tsx` with the fake terminal) — engineer trust signal; should be one footer badge, not 30vh.
- **Two-door persona block** (`PersonaSection.tsx` — *"For the curious / For the educators"*) — audience-routing is a SaaS pattern.
- **Fictional testimonials** in `ProofSection.tsx` (Aria, Dylan, Mei don't exist) — real or absent.
- **3D shuriken in `HeroBackdrop`** — three.js + drei + postprocessing for one spinning star is a developer flex, not the game.
- **Hero copy** *"Train your money like a ninja trains the body"* — two-line haiku, adult-coded, plus the metadata still says "Set in an India you'll recognise" though the game pivoted international.
- **Eyebrow chips on every section** — they read as deck markers.

---

## Phase 5 — Blueprint for the rebuild

### 5.1 Section list (6 sections, top → bottom)

1. **`UtilityBar`** — minimal, transparent, just wordmark + Play. No nav.
2. **`Hero`** — hero diorama (real game art, see 5.4) + H1 + 1-sentence subhead + Play button. **No badge chip.** No "scroll" cue.
3. **`ThreeVerbs`** — *Train. Save. Strike.* Three big icons (kunai / coin / shuriken from `hud/`), each with one sentence. Replaces the 3-beat scroll-pin.
4. **`MeetTheCast`** — six polaroid cards using the actual NPC sprites: Sensei Wren, Kai, Mara, Arlo, The Lender, Biscuit. Each card: sprite + name + one quoted line.
5. **`PaydayDemo`** *(client)* — the existing envelope-split mini-interaction, re-skinned with NPC sprite + Sensei Wren's actual line. Single h2: *"Try it. Split your first paycheck."*
6. **`PlayBand`** — full-bleed amber stripe, giant **Play free →** button, one-line trust signal: *"Free. No signup. Open source."* Footer below.

That's it. Six sections. No anti-promise, no OSS section, no testimonials, no personas.

### 5.2 Hero composition — the load-bearing visual

A horizontal **2.5D diorama**, internal resolution 480×270, `image-rendering: pixelated`, scaled to `100% width, max-height 540px`. Built from real assets in `apps/game/public/atlases/ninja-adventure/`. Three planes:

- **Background plane (z-back):** `background-elements/tileset.png` cropped to a grass-and-stone strip; two `background-elements/plant.gif` props; one `flower.gif` blooming at the right edge. Static.
- **Mid plane (z-mid):** four NPC sprites lined up like a school photo at the dojo gate:
  - `characters/3.png` — Sensei Wren (centre-left).
  - `characters/4.png` — Kai at the Cart (right of centre).
  - `characters/25.png` — Mara (left of Sensei).
  - `characters/dog.png` — Biscuit (front-right, smaller).
  Each idle-pulses on a 1.2s yoyo (the same `scaleY 1 → 0.97` trick used in `Npc.ts`), staggered by `(i * 180ms)`.
- **Foreground plane (z-front):** one `fx/4.gif` sparkle near Sensei Wren's `!` (quest indicator), one `items/coin-2.gif` floating on the cart. The amber light wash from the existing `noise-bg` gradient is preserved.

Overlaid text, anchored bottom-left of the diorama frame (not floating over centre):

- **H1** at 56–80px display weight: *Money, like a ninja learns it.*
- **Subhead** at 18px: *A free pixel-art game. Earn. Save. Spend. Strike.*
- **Primary CTA** — the existing `Play free →` rounded-pill button. **Cream fill, ink text, amber-on-hover.** Keep the magnetic-hover from `useMagneticHover`.
- **One quiet trust line below the CTA:** *Plays in a browser. No signup.* (11px caps, `text-paper-muted`.)

No top eyebrow chip. No "scroll" cue. No secondary "See how a quest plays" link — Verb 1 is right below the fold.

### 5.3 Voice register — sample copy

**Three Verbs section:**
> **Train.** Sensei Wren teaches you the moves. Three envelopes, one drawer.
>
> **Save.** Future-you needs a buffer. The dojo helps you build one.
>
> **Strike.** The Lender is real, and he's polite. Learn to walk past him.

That's it. Verbs and sentences. No "in a world where…" copy.

**Meet the Cast cards** — pull lines straight from `NPC_GREETINGS` in `apps/game/src/entities/Npc.ts` (they're already in the right voice):

- *Sensei Wren* — "Three envelopes. Pick one to start."
- *Kai at the Cart* — "Seven a day. Times three sixty-five. You do the math."
- *Mara* — "Onions are up. Bread is down. We adjust."
- *Arlo* — "Bro. New shoes. Three payments. Basically free."
- *The Lender* — "Sign here. The other page is just paper."
- *Biscuit* — "*wags tail*"

The cast section's H2: **People you'll meet.** No subtext.

### 5.4 Game asset usage — exact files

All paths relative to `apps/game/public/atlases/ninja-adventure/`. Either copy into `apps/web/public/game-art/` at build time, or symlink. Specific files to surface on the landing:

| Where | File(s) |
|---|---|
| Hero NPCs | `characters/3.png` (Sensei Wren), `characters/4.png` (Kai), `characters/25.png` (Mara), `characters/dog.png` (Biscuit) |
| Hero background | `background-elements/tileset.png` (cropped strip), `background-elements/plant.gif`, `background-elements/flower.gif` |
| Hero FX | `fx/4.gif` (sparkle), `items/coin-2.gif` (cart coin) |
| Three-verbs icons | `hud/kunai.png` (Train), `items/gold-coin.png` (Save), `hud/shuriken.png` (Strike) |
| Meet-the-Cast cards | `characters/faceset/3.png`, `4.png`, `25.png`, `20.png` (Arlo), `12.png` (The Lender), `8.png` or `dog.png` (Biscuit) |
| Payday Demo NPC | `characters/faceset/3.png` (Sensei Wren bust-shot) |
| Site favicon / mark | Keep the existing amber shuriken — it's good. |
| Footer ornament | `hud/dialogue-bubble.png` (tiny, decorative) |

Faceset crops live in `characters/faceset/` (8 files). Use the `faceset/` variants for cast cards — they're already framed as portraits.

### 5.5 Delete from current landing

| File | Action |
|---|---|
| `apps/web/app/(landing)/HeroBackdrop.tsx` | **Delete.** The 3D shuriken and three.js dependency go. |
| `apps/web/app/(landing)/AntiPromise.tsx` | **Delete.** Replace with one sentence in the footer. |
| `apps/web/app/(landing)/PersonaSection.tsx` | **Delete.** Two-door routing is not a landing job. |
| `apps/web/app/(landing)/OpenSourceSection.tsx` | **Delete.** Replace with a small "Open source · AGPL" badge in the footer. |
| `apps/web/app/(landing)/ProofSection.tsx` | **Delete.** No fake testimonials. Bring back when real ones exist. |
| `apps/web/app/(landing)/MechanicDemo.tsx` | **Delete or fully refactor.** The "scroll-pin 3 beats" pattern is replaced by `ThreeVerbs` (static, no scroll-jacking) + `PaydayDemo` (playable). |
| `apps/web/app/(landing)/SmoothScroll.tsx` | **Delete.** Lenis-style smooth scroll adds JS and breaks native expectations. |
| Three.js / react-three / drei deps | **Uninstall.** No 3D on the landing. |

### 5.6 Keep / Refactor

| File | Action |
|---|---|
| `apps/web/app/(landing)/HeroSection.tsx` | **Refactor.** Drop the `HeroBackdrop`. Drop the eyebrow chip. Drop the two-line H1 and the scroll cue. Replace background with the new diorama component. New H1 + subhead. Keep the magnetic CTA. |
| `apps/web/app/(landing)/FinalCTA.tsx` | **Refactor → `PlayBand`.** Strip *"Pick up the first quest"* — that's a riddle. Replace with a single amber band: H2 *"Step in."* + the Play button + trust line. Lose the "no account · no card · no ads · open source" stamp row; just one line. |
| `apps/web/app/(landing)/SiteFooter.tsx` | **Refactor.** Three columns become one: wordmark, repo link, AGPL line, "not financial advice" microcopy. Drop the "Play / Build / Read" link tower. |
| `apps/web/app/(landing)/UtilityBar.tsx` | **Refactor.** Drop the nav (`How it works / What we refuse / Open source` — those sections are gone). Keep wordmark, Play button, optional GitHub star button. |
| `apps/web/lib/motion.ts` | **Keep.** `useMagneticHover`, `useInView` still useful. Drop `useScrollProgress` — no scroll-pin sections. |
| `apps/web/app/globals.css` | **Keep tokens; add `.pixelated { image-rendering: pixelated; }`** and an `@keyframes idle-pulse` for the diorama NPCs. |
| `apps/web/app/play/page.tsx` | **Keep — out of scope.** |

### 5.7 New components to create

| File | Purpose |
|---|---|
| `apps/web/app/(landing)/HeroDiorama.tsx` | Client component. Composes the diorama in 5.2 with `next/image` (unoptimized) + idle-pulse CSS. ~120 lines. |
| `apps/web/app/(landing)/ThreeVerbs.tsx` | Server component. Three cards (kunai / coin / shuriken) + verb + sentence. Static. |
| `apps/web/app/(landing)/MeetTheCast.tsx` | Server component. Six polaroid-style cards using `characters/faceset/*.png`. |
| `apps/web/app/(landing)/PaydayDemo.tsx` | Client component. Reuse the spirit of the deleted `MechanicDemo`, but as a real drag-and-drop envelope split (rent / save / spend), with Sensei Wren's actual `say-branch` lines piped in. ~180 lines. |

### 5.8 The H1 — workshop

The current page ships *"Train your money like a ninja trains the body."* That's:
- Two lines (extra parsing cost).
- A simile dressed as a thesis.
- Adult-coded ("trains the body" is yoga-mat language, not 14-year-old language).

**Proposed H1:**
> **Money, like a ninja learns it.**

Six words. Both verbs (money, learns) and the genre (ninja) in one line. Reads at a glance.

Alternates, ranked:

1. *Money, like a ninja learns it.* ← **pick this**
2. *Train. Save. Strike.* (verbs-only; works only if the diorama carries the noun)
3. *A ninja school for your money.* (warm; lifts directly from the existing chip — promotes a good line)
4. *Your first paycheck. Three envelopes. One sensei.* (concrete and specific, but two beats long for an H1)

**Subhead under the H1:**
> *A free pixel-art game. Earn. Save. Spend. Strike.*

Twelve words. The four verbs map to the four chamber-types and to the four cast roles. They land without explanation.

### 5.9 KEEP from current landing

- Brand tokens in `globals.css` (amber/paper/ink/moss) — well-tuned, don't touch.
- `useMagneticHover` CTA — slight, premium, intuitive.
- Fraunces + Inter pairing.
- The `Play free →` button shape and the colour-fill-on-hover.
- The noise/grain treatment under the diorama.
- The AGPL footer line (small).

### 5.10 What the team will miss but has to go

- **The "anti-Robinhood" identity** — real and correct, but a landing page isn't where you fight that fight. The visitor doesn't know who Robinhood is; the manifesto reads as a chip on a shoulder. Lives in the README and in-game writing.
- **"Inspired by Stardew/Khan/Celeste" framing** — true, beloved internally, irrelevant to first-30-second visitors. Move to `/about`.
- **The 3D shuriken hero** — beautiful, but shows engineering, not the game.

---

## Phase 6 — Implementation order

1. Copy ninja-adventure atlas subset into `apps/web/public/game-art/`.
2. Delete the five components in 5.5. Page will break — that's the point.
3. Refactor `HeroSection.tsx`: drop `HeroBackdrop`, render `<HeroDiorama />` + new H1.
4. Build `HeroDiorama.tsx` (`next/image` + CSS idle-pulse, no JS animation lib).
5. Build `ThreeVerbs.tsx` (~40 lines) and `MeetTheCast.tsx` (~80 lines).
6. Refactor `MechanicDemo.tsx` into `PaydayDemo.tsx` — drag-drop with Sensei Wren's `MAYA_REACTION_BALANCED`/`SHAKY` branch logic surfaced inline.
7. Trim `FinalCTA.tsx` → `PlayBand.tsx`, `SiteFooter.tsx`, `UtilityBar.tsx`.
8. Uninstall `three`, `@react-three/fiber`, `@react-three/drei`.

---

## Single biggest move

**Replace the 3D shuriken hero with a real diorama of Sensei Wren, Kai, Mara, and Biscuit standing at the dojo gate using the actual game sprites.** That single swap does more than every other change combined: it tells the visitor what the game looks like, who lives in it, and why it's warm — in under a second, with no copy. Everything else in this brief is in service of that one swap.
