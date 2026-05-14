# Money-verse — Product Requirements Document

**Version:** 1.0 · **Status:** Draft for build · **Owner:** @admin · **Last updated:** 2026-05-14

> Every requirement traces to a master pattern documented in [MASTERS_RESEARCH.md](./MASTERS_RESEARCH.md). Citations look like `[M:Khan]`.

---

## 1. Vision

**One sentence:** *Money-verse is a 2D HD-pixel RPG that teaches Indians to manage money by making financial life feel like an adventure — without ever pretending speculation is a game.*

**Pitch:** A hand-authored open-world city set in a near-future India, where you live a financial life. You wake in a chawl, get a first job, learn to budget, open a bank account, file your first taxes, navigate scams, build a portfolio, start a side hustle, and eventually buy a home — all by playing through quests with NPCs modelled on the people you'd actually meet (a chartered accountant aunty, a Zerodha-clone broker, a fixer landlord, an EPF-confused colleague). Multiplayer is async-first: visit friends' apartments, leave gifts, cooperate on weekend market events.

**Better than v1 in four ways:**
1. **UI/UX** — HD-2D-lite rendering (Octopath-style post-fx), authored NPCs with schedules, no Robinhood-style dark patterns.
2. **Graphics** — Hand-painted 32×32 sprites + WebGL tilt-shift, dynamic point lights, depth fog, parallax cities; full HiDPI; mobile-touch-first responsive.
3. **Experience** — Mastery-gated progression (Khan-style), daily 5-min ritual (Duolingo-style), forgiveness mechanics (Celeste-style), Assist Mode for finance concepts.
4. **Learning** — Curriculum aligned to NCFE / SEBI financial literacy framework + Zerodha Varsity. Every concept introduced through verb-first action (DragonBox model), formal terminology revealed only after mastery.

---

## 2. Target users

### Primary persona — *"Ananya, 21, Bengaluru"*
- 2nd-year CS student, ₹0 personal income, parents pay fees.
- Knows what UPI is, doesn't know what an ELSS is.
- 6-hour daily phone screen-time, half on Instagram + Spotify.
- Has tried Duolingo, dropped after 11 days.
- Wants to "be the cousin who knows about money."

### Secondary persona — *"Rohit, 27, Pune"*
- Software engineer, ₹14L CTC, first job 2 years in.
- Has a mutual fund SIP someone set up for him, doesn't know how to evaluate it.
- Got burned ₹40k on F&O in 2024.
- Plays Stardew, OW2, occasionally indie games on Steam.
- Wants control without spending evenings on Excel.

### Tertiary persona — *"Saanvi, 16, Delhi"*
- Class 11; school doesn't teach personal finance.
- Has a UPI account on her dad's number.
- Parents are open to financial-literacy media.
- Plays mostly mobile.

**Out of scope for v1:** retired investors, NRIs (different tax stack), professional traders, US-centric users.

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
| 8 | **Free forever; no dark patterns** | `[M:Khan, M:Rangappa]` | No confetti on speculative wins; no notifications hyping volatility |
| 9 | **Indian context first** | `[M:Rangappa]` | All examples ₹, SIP/PPF/NPS/FD/Sensex/Nifty; bilingual EN+HI |
| 10 | **Assist Mode for finance** | `[M:Thorson]` | Every concept has slowed-tick, exposed-math, hint-NPC variant |

---

## 5. World structure

### Setting
*Money-verse* — a hand-painted near-future Indian metropolis amalgamating Mumbai's chawls, Bengaluru's tech parks, Delhi's markets, and Kolkata's older banking houses.

### Districts (= skill-tree branches `[M:Khan]`)

| # | District | Theme | Skill domain | Unlocks via |
|---|---|---|---|---|
| 1 | **Chawl Mohalla** | Starting home | Budgeting, expenses | (start) |
| 2 | **Bank Bazaar** | Old banking houses | Banking, savings, FDs | Budget Mastery I |
| 3 | **Karyalaya Park** | Tech-park offices | Income, EPF, taxes | Banking Mastery I |
| 4 | **Niveshak Chowk** | Stock exchange | Investing (equity, MF, SIP) | Income Mastery I |
| 5 | **Rakshak Lane** | Insurance & protection | Insurance, emergency fund | Investing Mastery I |
| 6 | **Vyapaar Mandi** | SME bazaar | Entrepreneurship, side hustle | Income Mastery II |
| 7 | **Bhavishya Ghat** | Riverside retirees | Retirement, NPS, estate | Investing Mastery II + Insurance I |

Each district has 8–12 authored NPCs, 5–8 quests, 1 boss-tier "challenge event," and is laid out on a Tiled map.

### Key NPCs (illustrative — full cast in `docs/CAST.md` later)

| NPC | Role | Inspiration | Function |
|---|---|---|---|
| **Maya didi** | Mentor | original Money-verse Maya | First-quest guide; replaces "tutorial" |
| **CA Lakshmi aunty** | Tax mentor | Real CA archetype | Filing season quests |
| **Bhola seth** | Predatory lender | Cautionary | Teaches the cost of borrowing |
| **Karthik bhai** | Broker | Karthik Rangappa nod | Stock-market mentor; never pushes trades |
| **Ramit-sir** | Career coach | Ramit Sethi nod | Negotiation rhythm-game quests |
| **Grandma at Ghat** | Wisdom NPC | — | Retirement / estate planning arcs |

---

## 6. Feature inventory

### 6.1 Must-have (v1 launch)
- [ ] **Onboarding (90-sec to first action)** — buy first item / make first deposit before any tutorial. `[M:Huynh, M:Acorns]`
- [ ] **Open-world 2D exploration** — 7 districts, Tiled maps, Phaser 3 + WebGL post-fx pipeline.
- [ ] **Day/night + seasonal cycle** — real-world-clock-linked (Indian financial calendar). `[M:Barone]`
- [ ] **Quest system** — 40+ quests at launch, JSON-authored, mastery-gated.
- [ ] **Skill tree** — 7 branches, ~80 nodes; mastery unlocks. `[M:Khan]`
- [ ] **Banking system** — SB account, FD, RD, debit/credit, statement view, EMIs.
- [ ] **Investment system** — Sensex/Nifty index sim (historical playback + simulated future), Mutual Fund SIP, ELSS, PPF, NPS.
- [ ] **Tax system** — Old vs new regime quest; 80C, 80D, HRA explained via quests.
- [ ] **Insurance system** — Term, health, motor; "emergency fund" mechanic.
- [ ] **Side-hustle / business sim** — chai stall, freelance gigs, scaling decisions.
- [ ] **Inventory & apartment decoration** — cosmetic, not gameplay; visit-friendly.
- [ ] **NPC schedules + dialog system** — `Inkjs` or custom Yarn-flavoured DSL. `[M:Barone]`
- [ ] **Smart minimap** — Phaser camera + pathfinding (EasyStar.js).
- [ ] **Async multiplayer** — visit friends' apartments, leave gifts, see public profile. `[M:Nintendo-AC]`
- [ ] **Optional sync rooms** — Colyseus-powered "Trading Floor" weekly events.
- [ ] **AI tutor NPC ("Maya AI")** — Vercel AI Gateway, streaming responses, context-aware (player state). `[M:Brilliant]`
- [ ] **Bilingual dialog** — EN + HI from launch; framework supports more.
- [ ] **Daily streak + forgiveness ("vacation days")** `[M:vonAhn]`
- [ ] **Assist Mode** — slow market ticks, exposed math, hint NPCs, replay tutorials. `[M:Thorson]`
- [ ] **Accessibility** — keyboard nav, screen reader for menus, colorblind palettes, dyslexia-friendly font option, scalable UI.
- [ ] **Mobile responsive + touch controls** — same WebGL build, virtual joystick on touch.
- [ ] **Save sync** — Postgres + local IndexedDB fallback.
- [ ] **Auth** — Better-Auth or Clerk (Marketplace integration).
- [ ] **Glossary (player-opened only)** — formal terms revealed after mastery. `[M:Huynh]`

### 6.2 Should-have (post-launch within 90 days)
- [ ] Cooperative weekly challenge (e.g., budget a wedding within a team)
- [ ] Festival seasonal events (Diwali, Sankranti, FY-end, monsoon insurance month)
- [ ] Player-authored quest editor (sandbox; can't unlock skills)
- [ ] Stock-market historical-backtest mode
- [ ] Achievement codex with art unlocks (cosmetic only — no monetisation)
- [ ] Newsletter integration: weekly real-Indian-market summary tied to in-game NPC

### 6.3 Could-have (v2+)
- [ ] More cities (Hyderabad, Kolkata, Chennai)
- [ ] Tamil, Bengali, Marathi, Telugu localisation
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
- ❌ US-centric examples
- ❌ Silent failures
- ❌ PvP combat
- ❌ Leaderboards by speculative gains
- ❌ Ads, dark patterns, attention-mining

---

## 7. Learning curriculum (mapped to NCFE + Zerodha Varsity)

| Level | Domain | Concept | In-game vehicle |
|---|---|---|---|
| 1 | Budgeting | Income / Expense / Savings | First-week-at-job quest chain |
| 1 | Budgeting | 50-30-20 rule | Conscious-spending NPC quest `[M:Sethi]` |
| 1 | Banking | Savings vs current | Open-first-account quest |
| 2 | Banking | Compound interest | "Growth Sapling" mini-game `[M:Huynh]` |
| 2 | Banking | FD / RD ladders | Bank Bazaar bonsai-ladder mini-game |
| 2 | Credit | Credit score, EMI math | Bhola-seth predatory-lender quest |
| 3 | Income | EPF, gratuity, ESOP | First-payslip puzzle |
| 3 | Income | Old vs new tax regime | CA Lakshmi quest with branching outcomes |
| 4 | Investing | Risk vs return | "Weather forecast" market metaphor `[M:Huynh]` |
| 4 | Investing | Diversification | Coloured-token sorting mini-game |
| 4 | Investing | SIP and DCA | Karthik-bhai monthly-temple ritual |
| 5 | Investing | Index funds / active vs passive | Two-broker storefront contrast |
| 5 | Insurance | Term vs ULIP (anti-mis-selling) | Predatory-agent NPC quest |
| 5 | Insurance | Emergency fund | "Six-month vault" mechanic |
| 6 | Entrepreneurship | Cash flow vs profit | Chai-stall sim |
| 6 | Entrepreneurship | Unit economics | Stall-expansion decision tree |
| 7 | Retirement | NPS, compounding over 40y | Bhavishya Ghat time-fast-forward telescope |
| 7 | Estate | Will, nominee, joint accounts | Grandma quest |

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
- **Colour palette:** Warm Indian-evening base (terracotta, saffron, indigo); cool night palette swap; festival re-skins.
- **UI chrome:** Frosted-glass over pixel — modern reverse-skeuomorphic; Tailwind + shadcn for menus, Phaser for diegetic UI inside the world.

### Audio identity
- **Soundtrack:** Original chiptune layered with sitar / tabla / harmonium / bansuri. Toby Fox-style NPC leitmotifs.
- **Dynamic by district** — Chawl is acoustic-warm, Niveshak Chowk is digital-percussive, Bhavishya Ghat is ambient-strings.
- **SFX:** UPI-success chime homage, rotary-phone dials, paper rustles — culturally specific.

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

**Maya AI** — the in-game tutor — uses Vercel AI Gateway with provider failover (open weights default: Llama / Mistral / Qwen; closed for premium quality where free quota allows).

- **Context-aware:** the model sees the player's anonymised in-game financial state and current quest; nothing identifying.
- **Streaming responses** in the speech-bubble UI.
- **Bounded prompt:** Maya can only answer finance-education questions tied to current quest scope; refuses to give real-money advice.
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
| AI tutor hallucinates wrong tax advice | M | H | Bounded scope, citations required, disclaimer NPC, fallback to authored dialog |
| Content perceived as "actual financial advice" (SEBI risk) | M | H | Explicit disclaimer screen, no real-money links, no real broker integrations in v1 |
| Mobile WebGL perf | M | M | Resolution-tier auto-detect; "low" tier disables post-fx |
| Multiplayer abuse | M | M | Friend-codes only, server moderation queue, no public chat |
| Players churn before mastery unlock | H | M | Day-3 streak start, generous forgiveness, shorter day-1 quest |
| Art-asset legality | M | H | OSS-only assets (CC0 / CC-BY); commission custom under work-for-hire if needed |

---

## 13. Open questions (tracked, not blockers)

1. Real broker integration (Zerodha Kite open API) post-v1? — *legal review needed*
2. Real bank UPI sandbox integration? — *out of scope for v1*
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
- **Varsity-context** (INR + Indian instruments + free forever) —
explicitly *rejects* Robinhood's dark-pattern playbook.

Deviations from the original Money-verse:
- We move *away* from the "Get rich or die trying" framing (speculative tone) toward "Master your money calmly."
- We expand to 7 districts with mastery gates vs the original's flatter exploration.
- We commit to async-first multiplayer (less infra-heavy than persistent sync world).

**Suggested deep-dives before build kickoff:** Celeste GDC accessibility talk; Sea of Stars combat designer breakdown; Zerodha Varsity Module 1; *I Will Teach You To Be Rich* chapters 1-3.
