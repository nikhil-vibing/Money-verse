# Ninja Money-verse — Product Requirements Document

**Version:** 1.0 · **Status:** Draft for build · **Owner:** @admin · **Last updated:** 2026-05-14

> Every requirement traces to a master pattern documented in [MASTERS_RESEARCH.md](./MASTERS_RESEARCH.md). Citations look like `[M:Khan]`.

---

## 1. Vision

**One sentence:** *Ninja Money-verse is a 2D HD-pixel RPG that teaches anyone to manage money by training financial discipline the way a martial art is trained — one stance, one breath, one chamber at a time.*

**Pitch:** A hand-authored open-world city, painted in pixel and lit by lanterns, where you live a financial life. You wake in the old quarter — the First Dojo — receive a single envelope and a single rule, then walk seven chambers in order. Income minus expenses is a stance. Compounding is a still pool. Risk and return are caution and strike. A sensei who never lectures lives upstairs; a smooth-talking lender waits at the mouth of the alley. You will pay rent, refuse a knockoff, log a week of small leaks, lock a clay jar, open a teller window, file your first pay slip, drip-invest into a long index, hold a shield against bad cover, run a tea cart, and one day stand at the riverbank teaching the next apprentice. Multiplayer is async-first: visit friends' rooms, leave gifts, train together on weekend events.

**Better than v1 in four ways:**
1. **UI/UX** — HD-2D-lite rendering (Octopath-style post-fx), authored NPCs with schedules, no Robinhood-style dark patterns.
2. **Graphics** — Hand-painted 32×32 sprites + WebGL tilt-shift, dynamic point lights, depth fog, parallax cities; full HiDPI; mobile-touch-first responsive.
3. **Experience** — Mastery-gated progression (Khan-style), daily 5-min ritual (Duolingo-style), forgiveness mechanics (Celeste-style), Assist Mode for finance concepts.
4. **Learning** — Curriculum aligned to international personal-finance frameworks (budgeting → banking → income → investing → protection → entrepreneurship → retirement). Every concept introduced through verb-first action (DragonBox model), formal terminology revealed only after the body owns it.

---

## 2. Target users

### Primary persona — *"Ana, 21, on campus"*
- 2nd-year CS student, $0 personal income, parents cover tuition.
- Knows how to tap-pay; has never opened a savings account on her own.
- 6-hour daily phone screen-time, half on social + music.
- Tried a habit app, dropped after 11 days.
- Wants to be "the friend who actually understands money."

### Secondary persona — *"Kai, 27, in tech"*
- Software engineer, ~$50k/yr, first job 2 years in.
- Has a drip-investing plan a colleague set up for him; can't evaluate it.
- Lost about $500 chasing options last year.
- Plays Stardew, online shooters, occasional indie games.
- Wants control without spending evenings on a spreadsheet.

### Tertiary persona — *"Sana, 16, in high school"*
- Eleventh grade; school doesn't teach personal finance.
- Uses a parent-linked tap-pay app.
- Parents are open to financial-literacy media.
- Plays mostly on mobile.

**Out of scope for v1:** retired investors, professional traders, anyone seeking real-money trading advice.

---

## 3. Core gameplay loop `[M:Sethi, M:Barone, M:vonAhn]`

```
DAILY (5–10 min)                SESSION (30–60 min)
─────────────────              ─────────────────────
Wake → 1 min                    Daily routine (above)
  Check apartment / overnight   + Main quest beat (1–2)
  market / news ticker          + Free play (explore, talk,
                                   shop, decorate, invest,
1 quest beat → 5–7 min            visit friends async)
  An NPC needs help. The        + Skill-tree review
  quest IS the lesson.            (player-initiated)
                                + Close-out reflection
Reflection screen → 1 min         ("today you learned X,
  Streak, net-worth delta,        net worth changed by Y")
  one insight, glossary unlock
```

**Verbs:** walk · talk · trade · negotiate · budget · invest · decorate · visit · gift · cook · sleep.

**No verbs:** kill · loot · spin · gamble · grind.

---

## 4. Pillars (non-negotiable design constraints)

| # | Pillar | Source | Test |
|---|---|---|---|
| 1 | **Hide the lesson in the verb** | `[M:Huynh, M:Foldit, M:CodeCombat]` | No screen >60 chars of explanatory text before player acts |
| 2 | **One concept per quest** | `[M:Brilliant, M:Huynh]` | Quest doc lists exactly one new concept; tests fail if more |
| 3 | **Mastery gates, not time gates** | `[M:Khan]` | Cannot progress without demonstrated in-world competency |
| 4 | **Forgiveness over punishment** | `[M:Thorson, M:vonAhn]` | No silent failure; "almost-failing" warns once before applying |
| 5 | **Daily ritual stays short** | `[M:vonAhn]` | Daily loop ≤10 min wall-clock, measured in playtests |
| 6 | **Authored, never procedural, world** | `[M:Barone, M:Sabotage]` | Every named NPC has a schedule + memory file |
| 7 | **The system responds** | `[M:Fox, M:Barone]` | Major financial decisions change ≥3 NPC dialog branches |
| 8 | **Free forever; no dark patterns** | `[M:Khan, M:Holiday]` | No confetti on speculative wins; no notifications hyping volatility |
| 9 | **Universal context, distinctive voice** | `[M:Miyagi, M:Holiday, M:Lau]` | All examples `$` whole-number coin; instruments reframed (Steady Contributions, Long Vault, Pension Path, Term Vault, etc. — see research §6). English-only baseline with sensei cadence: short sentences, present tense, observation-then-pause |
| 10 | **Assist Mode for finance** | `[M:Thorson]` | Every concept has slowed-tick, exposed-math, hint-NPC variant |

---

## 5. World structure

### Setting
*Ninja Money-verse* — a hand-painted, implicitly South-Asian-coded city in an unspecified near-future. Lanterns, tile roofs, alley shrines, a river at the south edge. The art carries the world's flavour; the writing speaks an international English with a sensei cadence.

### Districts (= chambers, the 7-chamber arc `[M:Lau, M:Khan]`)

District IDs are stable identifiers; only the *display label* is the chamber name.

| # | ID | Chamber name | Virtue | Skill domain | Unlocks via |
|---|---|---|---|---|---|
| 1 | `chawl-mohalla` | **The First Dojo** | First stance — attention before action | Budgeting, expenses | (start) |
| 2 | `bank-bazaar` | **The Still Pool** | Patience as foundation | Banking, savings, term vaults | First Dojo graduation |
| 3 | `karyalaya-park` | **The Daimyo's Office** | Duty to the system | Income, pay slip, tax paths | Still Pool Mastery I |
| 4 | `niveshak-chowk` | **The Crossroads of Coin** | The patient strike, never the panicked one | Drip Investing, Pooled Funds, Long Index | Income Mastery I |
| 5 | `rakshak-lane` | **The Shield Form** | Defense before offense | Emergency vault, term cover | Investing Mastery I |
| 6 | `vyapaar-mandi` | **The Merchant Path** | Make your own coin | Side hustle, unit economics | Income Mastery II |
| 7 | `bhavishya-ghat` | **The Path of the Elders** | The long path — and the duty to teach | Pension Path, the long telescope, the last will | Investing Mastery II + Shield Form I |

Each chamber has 8–12 authored NPCs, 5–8 quests, 1 "challenge form," and is laid out on a Tiled map.

### Key NPCs (illustrative — full cast in `docs/CAST.md` later)

| NPC | Role | Function |
|---|---|---|
| **Sensei Wren** | Mentor | First-quest guide; replaces "tutorial" |
| **Master Lia the Auditor** | Pay-slip mentor | Filing-season quests |
| **The Lender** | Predatory loanseat | Teaches the cost of borrowing |
| **Karthik of the Crossroads** | Drip-investing mentor | Patient-strike teaching; never pushes trades |
| **Master Ramit** | Career coach | Negotiation rhythm-game quests |
| **The Elder at the Riverbank** | Wisdom NPC | Pension-path / last-will arcs |

---

## 6. Feature inventory

### 6.1 Must-have (v1 launch)
- [ ] **Onboarding (90-sec to first action)** — buy first item / make first deposit before any tutorial. `[M:Huynh, M:Acorns]`
- [ ] **Open-world 2D exploration** — 7 districts, Tiled maps, Phaser 3 + WebGL post-fx pipeline.
- [ ] **Day/night + seasonal cycle** — real-world-clock-linked (in-game financial calendar). `[M:Barone]`
- [ ] **Quest system** — 40+ quests at launch, JSON-authored, mastery-gated.
- [ ] **Skill tree** — 7 chambers, ~80 nodes; mastery unlocks. `[M:Khan]`
- [ ] **Banking system** — Checking-style account, Term Vault (FD-equivalent), recurring savings, debit/credit, statement view, repayments.
- [ ] **Investment system** — Long Index sim (historical playback + simulated future), Pooled Funds, Drip Investing, Long Vault, Pension Path.
- [ ] **Tax system** — Two Tax Paths quest; deductions explained through forms (Path of the Receipt).
- [ ] **Insurance system** — Term Cover, health cover; "Six-Month Vault" mechanic.
- [ ] **Side-hustle / business sim** — Tea-cart sim, freelance gigs, scaling decisions.
- [ ] **Inventory & room decoration** — cosmetic, not gameplay; visit-friendly.
- [ ] **NPC schedules + dialog system** — `Inkjs` or custom Yarn-flavoured DSL. `[M:Barone]`
- [ ] **Smart minimap** — Phaser camera + pathfinding (EasyStar.js).
- [ ] **Async multiplayer** — visit friends' rooms, leave gifts, see public profile. `[M:Nintendo-AC]`
- [ ] **Optional sync rooms** — Colyseus-powered "Crossroads of Coin" weekly events.
- [ ] **AI tutor NPC ("Sensei Wren AI")** — Vercel AI Gateway, streaming responses, context-aware (player state). `[M:Brilliant]`
- [ ] **English-first dialog with i18n-ready Yarn keys** — Latin-script baseline at launch; framework supports more.
- [ ] **Daily streak + forgiveness ("vacation days")** `[M:vonAhn]`
- [ ] **Assist Mode** — slow market ticks, exposed math, hint NPCs, replay tutorials. `[M:Thorson]`
- [ ] **Accessibility** — keyboard nav, screen reader for menus, colorblind palettes, dyslexia-friendly font option, scalable UI.
- [ ] **Mobile responsive + touch controls** — same WebGL build, virtual joystick on touch.
- [ ] **Save sync** — Postgres + local IndexedDB fallback.
- [ ] **Auth** — Better-Auth or Clerk (Marketplace integration).
- [ ] **Glossary (player-opened only)** — formal terms revealed after mastery. `[M:Huynh]`

### 6.2 Should-have (post-launch within 90 days)
- [ ] Cooperative weekly challenge (e.g., budget a courtyard celebration as a team)
- [ ] Chamber-graduation seasonal events (lantern festivals, year-end retrospectives, rain-season cover month)
- [ ] Player-authored quest editor (sandbox; can't unlock skills)
- [ ] Long-Index historical-backtest mode
- [ ] Achievement codex with art unlocks (cosmetic only — no monetisation)
- [ ] Newsletter integration: weekly market-reading summary tied to in-game NPC

### 6.3 Could-have (v2+)
- [ ] More cities (alternative skylines, alternative chambers)
- [ ] Additional locale packs (community-contributed)
- [ ] Mod support (community quests)
- [ ] Cross-progression with a future companion mobile app

### 6.4 Will not have (explicit rejections — anti-patterns)
- ❌ Confetti / dopamine animations on speculative wins `[anti-M:Robinhood]`
- ❌ Notifications hyping volatility ("biggest mover today!")
- ❌ Lottery / surprise-stock / spin-the-wheel rewards
- ❌ Paywalled foundational lessons `[M:Khan, M:Rangappa]`
- ❌ "Easy Mode" or "Cheat Mode" framing (call it Assist) `[M:Thorson]`
- ❌ Long sessions required for progression
- ❌ Random encounters or grinding `[M:Sabotage]`
- ❌ Silent failures
- ❌ PvP combat
- ❌ Leaderboards by speculative gains
- ❌ Ads, dark patterns, attention-mining

---

## 7. Learning curriculum (international personal-finance baseline)

| Level | Domain | Concept | In-game vehicle |
|---|---|---|---|
| 1 | Budgeting | Income / Expense / Savings | First-week quest chain in the First Dojo |
| 1 | Budgeting | Conscious-spending allocation | Two-column needs-vs-wants NPC quest `[M:Sethi]` |
| 1 | Banking | Wallet vs account | Open-first-account quest in the Still Pool |
| 2 | Banking | Patient Growth (compounding) | "Growth Sapling" mini-game `[M:Huynh]` |
| 2 | Banking | Term Vault ladders | Still Pool bonsai-ladder mini-game |
| 2 | Credit | Cost of borrowing | The Lender's predatory-loan quest |
| 3 | Income | Pay-slip anatomy, Worker's Vault | First-pay-slip puzzle |
| 3 | Income | The Two Tax Paths | Master Lia quest with branching outcomes |
| 4 | Investing | Caution vs Strike (risk / return) | "Reading the Sky" market metaphor `[M:Huynh]` |
| 4 | Investing | Many Stances (diversification) | Coloured-token sorting mini-game |
| 4 | Investing | Drip Investing | Karthik's monthly-bell ritual |
| 5 | Investing | The Long Index — active vs passive | Two-storefront contrast |
| 5 | Insurance | Term Cover vs the Faulty Promise | Predatory-agent NPC quest |
| 5 | Insurance | Six-Month Vault | "Jar that doesn't open" mechanic |
| 6 | Entrepreneurship | Cash flow vs profit | Tea-cart sim |
| 6 | Entrepreneurship | Unit economics | Cart-expansion decision tree |
| 7 | Retirement | Pension Path, Forty-Year Telescope | Path of the Elders fast-forward telescope |
| 7 | Estate | The Last Will, nominees, joint accounts | The Elder at the Riverbank quest |

---

## 8. UI / UX requirements

### Visual identity — "HD-2D-lite"
- **Base resolution:** 480×270 internal, scaled to viewport via integer-multiple where possible, bilinear otherwise.
- **Pixel art:** 32×32 character sprites, 16×16 tile baseline.
- **Post-processing pipeline (Phaser 3 custom shaders):**
  - Tilt-shift blur on overworld
  - Dynamic point lights (lamps, windows)
  - Depth fog on far parallax layers
  - Subtle CRT scanline option (off by default)
  - Bloom on light sources
- **Colour palette:** Warm-evening base (terracotta, saffron, indigo); cool night palette swap; chamber-graduation re-skins.
- **UI chrome:** Frosted-glass over pixel — modern reverse-skeuomorphic; Tailwind + shadcn for menus, Phaser for diegetic UI inside the world.

### Audio identity
- **Soundtrack:** Original chiptune layered with shakuhachi-adjacent flute, taiko-adjacent percussion, and bowed strings. Toby Fox-style NPC leitmotifs.
- **Dynamic by chamber** — First Dojo is acoustic-warm, Crossroads of Coin is digital-percussive, Path of the Elders is ambient-strings.
- **SFX:** Tap-pay chime, paper rustles, wooden gong, lantern hiss — atmospheric, not pastiche.

### Interactions
- **Single-button core verb:** *interact* (E / Space / tap). `[M:Thorson]`
- **No modal dialog walls** longer than 6 lines without an interactive choice.
- **Diegetic UI** where possible — bank passbook is an in-world object, not a menu.

### Accessibility (WCAG 2.2 AA target)
- Keyboard-only playable end-to-end.
- Screen-reader for menus (NVDA, VoiceOver tested).
- Colour-blind palettes (Deuteranopia, Protanopia, Tritanopia).
- Dyslexia-friendly font option (OpenDyslexic + Atkinson Hyperlegible).
- Scalable UI: 100% / 125% / 150% / 200%.
- Captions for all audio cues.
- Reduce-motion option (kills screen-shake, parallax, particle effects).
- Photosensitive-safe mode (no flashes >3 Hz).

---

## 9. Multiplayer / social

- **Async-first** — server-authoritative apartments, public profiles (opt-in), gift system, message wall. `[M:Nintendo-AC]`
- **Optional sync rooms (Colyseus):**
  - *Trading Floor* — weekly live market sim (no real-money signal); cooperative challenge.
  - *Town Hall* — Saturday-night NPC-hosted event; quizzes, group quests.
  - *Apartment hangout* — invite friends to your space; voice optional (WebRTC, opt-in).
- **Leaderboards by consistency only** — longest streak, lessons mastered, quests helped with. **Never** by net-worth or speculative P&L.
- **Friend codes only** — no public discovery, no "people you may know."
- **Anti-abuse:** rate-limited messages, profanity filter, instant report-and-block, server-side moderation queue.

---

## 10. AI / personalisation

**Sensei Wren AI** — the in-game tutor — uses Vercel AI Gateway with provider failover (open weights default: Llama / Mistral / Qwen; closed for premium quality where free quota allows).

- **Context-aware:** the model sees the player's anonymised in-game financial state and current quest; nothing identifying.
- **Streaming responses** in the speech-bubble UI.
- **Bounded prompt:** Sensei Wren can only answer finance-education questions tied to current quest scope; refuses to give real-money advice.
- **Cost cap per player per day** — hard limit; falls back to authored dialog when exceeded.
- **Cached responses** for common questions (Runtime Cache).
- **No personal data leaves the server-side** — player_id hashed before any model call.

---

## 11. Success metrics

### North-star
- **Day-7 retention ≥ 35%** (vs Duolingo ~13% baseline for language apps — but our session is shorter, comparable to Stash ~35%).

### Activation
- ≥ 80% of new users complete the 90-sec first-action (buy first item / first deposit).
- ≥ 50% complete first quest (Budget I).

### Engagement
- Median DAU session = 8–12 min; long-tail 30–60 min weekly.
- 7-day streak rate ≥ 25% of weekly-active users.

### Learning (the real KPI)
- Pre/post quiz on each district shows ≥ 30 percentile-point improvement.
- Players who complete Investing I correctly answer "what is compounding?" in free-text 90%+ of the time.

### Community
- ≥ 10% of users invite ≥ 1 friend within 14 days.
- Net Promoter Score ≥ 50.

### Anti-metrics (deliberately not optimised)
- Time spent — not optimising. We will *not* be sticky-by-design.
- Transactions per session — capped, never celebrated.

---

## 12. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI tutor hallucinates wrong tax or investing advice | M | H | Bounded scope, citations required, disclaimer NPC, fallback to authored dialog |
| Content perceived as "actual financial advice" | M | H | Explicit disclaimer screen, no real-money links, no real broker integrations in v1 |
| Mobile WebGL perf | M | M | Resolution-tier auto-detect; "low" tier disables post-fx |
| Multiplayer abuse | M | M | Friend-codes only, server moderation queue, no public chat |
| Players churn before mastery unlock | H | M | Day-3 streak start, generous forgiveness, shorter day-1 quest |
| Art-asset legality | M | H | OSS-only assets (CC0 / CC-BY); commission custom under work-for-hire if needed |

---

## 13. Open questions (tracked, not blockers)

1. Real broker integration (any open broker API) post-v1? — *legal review needed*
2. Real bank tap-pay sandbox integration? — *out of scope for v1*
3. Mobile-native wrappers (Capacitor / Tauri)? — *web-first, evaluate quarterly*
4. Pay-once cosmetic pack as a possible future monetisation? — *post-v1, never gameplay*

---

## 14. Out of scope (v1)

- Real-money trading
- Real broker / bank API integration
- Crypto education or simulation (deliberately excluded — too volatile to model responsibly)
- Native mobile apps
- VR / AR
- Procedural world generation
- Voice acting (audio is musical only; dialog is text)
- User-generated quest sharing (post-launch only)

---

## Master's Margin Note

This PRD blends:
- **Khan-mastery** (gated skill tree) +
- **Celeste-assist** (assist mode for finance) +
- **Duolingo-streak** (daily ritual + forgiveness) +
- **DragonBox-stealth** (verb-first concept teaching) +
- **Stardew-author** (hand-painted world with memory) +
- **Sabotage-anti-grind** (no encounter padding) +
- **Sethi-automation** (in-world automation as the killer mechanic) +
- **Miyagi / 36-Chambers / Holiday** (chamber-per-virtue, hide-the-lesson-in-the-chore, present-tense sensei voice) —
explicitly *rejects* Robinhood's dark-pattern playbook.

Deviations from the original Ninja Money-verse:
- We move *away* from the "Get rich or die trying" framing (speculative tone) toward "Master your money calmly."
- We expand to 7 chambers with mastery gates vs the original's flatter exploration.
- We commit to async-first multiplayer (less infra-heavy than persistent sync world).

**Suggested deep-dives before build kickoff:** Celeste GDC accessibility talk; Sea of Stars combat designer breakdown; Lau Kar-leung's *36th Chamber of Shaolin*; Ryan Holiday's *The Daily Stoic*; Robert Greene's *Mastery*.
