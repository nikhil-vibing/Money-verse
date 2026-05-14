# Money-verse — Masters Research Brief

> Generated via the **master** skill (research-first execution engine). Every design decision in [PRD.md](./PRD.md) traces back to a pattern documented here.

This brief grounds Money-verse (a 2D RPG that teaches financial literacy, built on Phaser 3 + Colyseus + Next.js) in the documented practice of people who have actually shipped great educational games, great 2D RPGs, and great financial-education products. Every method below is attributed to a shipped, public source.

---

## Section 1 — The Masters

### MASTER 1: Jean-Baptiste Huynh (DragonBox / Kahoot! Algebra)
- **Domain:** Educational game design
- **Credential:** Former math teacher; DragonBox Algebra acquired by Kahoot!; research showed 93% of children solved algebraic equations after ~90 min of play (UW Center for Game Science).
- **Philosophy:** *The educational mechanic should be elegant and hidden.* Start abstract (how mathematicians actually experience math), then layer formal notation on top once the player owns the intuition.
- **Signature methods:**
  - Replace abstract symbols with cartoon objects, then gradually substitute the real notation — *stealth re-skin*.
  - Discovery-first: the player performs the operation before being told what it's called.
  - Single-concept levels — each puzzle teaches exactly one rule.
  - Friendly, low-fear visual language.
- **Anti-patterns:** Lectures before play; mixing multiple new rules in one level.
- **Application to Money-verse:** Teach compounding, diversification, and risk via visual abstractions (growing "saplings" for compound interest, sorting coloured tokens for diversification) **before** introducing formal terms.

### MASTER 2: Luis von Ahn (Duolingo)
- **Domain:** Educational design / retention
- **Credential:** Inventor of CAPTCHA & reCAPTCHA; >500M Duolingo learners.
- **Philosophy:** *The biggest problem in education is not that we don't know how to teach. It's that people stop showing up.*
- **Signature methods:**
  - Daily streaks as loss-aversion commitment devices (7-day completers are 3.6× more likely to retain long-term).
  - Streak Freeze / repair mechanics — a bad day doesn't nuke months of progress.
  - Short sessions (2–5 min) to keep activation energy trivial.
  - Escalating ambient pressure (animated flame, mascot, leagues).
- **Anti-patterns:** Long lessons; hard resets that destroy long-streak users.
- **Application to Money-verse:** Daily *market open* ritual — 3-5 min morning loop (check portfolio, claim insight, one micro-lesson). Streaks track financial habits, not lessons. Forgiveness via in-world "vacation days."

### MASTER 3: Sal Khan (Khan Academy)
- **Domain:** Financial / general education
- **Credential:** 155M+ registered users; standard reference for free K-12 education globally.
- **Philosophy:** Bloom's mastery learning — students progress when they have mastered a concept, not when a clock runs out.
- **Signature methods:**
  - Mastery gates: cannot advance until correct N-in-a-row.
  - Skill-tree visualisation of the macro arc.
  - Bite-sized videos paired with practice — never one without the other.
  - Spaced skill review.
- **Anti-patterns:** Time-based promotion; passive video without an exercise.
- **Application to Money-verse:** Skill tree organised by domain (Budgeting → Banking → Investing → Taxes → Insurance → Retirement). Cannot unlock the next *district* until in-game competency is proven.

### MASTER 4: Karthik Rangappa / Nithin Kamath (Zerodha Varsity)
- **Domain:** Financial education (India-specific)
- **Credential:** Largest free financial-education resource on the Indian internet — 17 modules, hundreds of chapters, Hindi library, 400K+ YouTube subs, on the government's Karmayogi platform.
- **Philosophy:** *Educate someone properly before they invest and they become a better investor, a more satisfied customer, and a natural advocate.* No paywalls.
- **Signature methods:**
  - Plain-language explanations in Indian context (SIP, PPF, NPS, FD, Sensex, Nifty).
  - Hand-drawn, friendly illustrations — anti-banker aesthetic.
  - Sequenced curriculum; no parachute-into-options.
  - 100% free, forever.
- **Anti-patterns:** Jargon without translation; US-centric examples; paywalled foundational content.
- **Application to Money-verse:** All currency in INR; instruments grounded in Indian reality. 100% free core game. Treat the player as a future evangelist.

### MASTER 5: Ramit Sethi (I Will Teach You To Be Rich)
- **Domain:** Financial education / behavior change
- **Credential:** Stanford psych; bestselling 6-week program; Netflix series.
- **Philosophy:** *Behavior trumps information.* Automation > willpower. 85% right beats 100% paralysed.
- **Signature methods:**
  - Automation as the killer mechanic — set up once, run forever.
  - Conscious spending plan — permit guilt-free spending on what you love.
  - Small wins first to build self-efficacy.
  - Concrete scripts ("say exactly these words to your bank").
- **Anti-patterns:** Latte-shaming; optimising math while ignoring psychology.
- **Application to Money-verse:** In-game NPC quests mirror IWT scripts. Auto-SIP is a literal building the player constructs. Game rewards systems-thinking, not penny-pinching.

### MASTER 6: Eric Barone / ConcernedApe (Stardew Valley)
- **Domain:** 2D pixel-art RPG craft
- **Credential:** Solo dev — 41M+ copies; redefined cozy-life-sim; 9+ years of free updates.
- **Philosophy:** Make a world that *feels natural*; let themes (community, anti-corporate, burnout) live underneath gameplay, not on top of it.
- **Signature methods:**
  - Persistent NPCs with hand-authored schedules and seasonal-evolving dialog.
  - Daily/seasonal loop — energy budget + season arcs.
  - Parallel progression vectors (farming/mining/fishing/friendship/museum).
  - Hidden depth — basic loop is friendly; min-max systems exist for the hardcore.
- **Anti-patterns:** Time pressure that punishes casual sessions; paid DLC for content.
- **Application to Money-verse:** Authored NPCs with schedules and dialog that responds to financial state. Parallel vectors: career, business, investing, real estate, philanthropy. Free updates as a brand promise.

### MASTER 7: Sabotage Studio / Thierry Boulanger (Sea of Stars, The Messenger)
- **Domain:** 2D pixel-art RPG craft
- **Credential:** Sea of Stars >5M copies in year one; Game Awards nominee.
- **Philosophy:** *Capture what you loved about the games of old; leave behind the parts that wouldn't survive today.*
- **Signature methods:**
  - No random encounters — every fight is visible on the overworld.
  - No grinding — XP curves tuned so the critical path is sufficient.
  - Timed-hit combat — active inputs inside turn-based structure.
  - Seamless transitions; no loading-screen interrupts.
- **Anti-patterns:** Grinding gates; random encounters; menu walls.
- **Application to Money-verse:** Economy advances with skill, not time. Market events are visible and avoidable. Active inputs during financial decisions keep turn-based learning kinetic.

### MASTER 8: Maddy Thorson (Celeste, TowerFall)
- **Domain:** 2D pixel-art craft + accessibility
- **Credential:** Celeste — Game Awards Best Indie 2018; reference text for indie game-feel and accessibility.
- **Philosophy:** Difficulty is a feature, but never a gate. The game is about the player's relationship to challenge.
- **Signature methods:**
  - *Coyote time*, input buffering, corner correction — invisible forgiveness that tips physics in the player's favour.
  - **Assist Mode** (never "Easy" or "Cheat"): slow time, infinite stamina, skip — fully optional, never judged.
  - Mechanically minimalist (1 button = dash) → maximal expressive depth.
  - Deliberate post-processing (CRT, screen-shake) for game feel.
- **Anti-patterns:** Naming accessibility "Easy" or "Cheat"; one-difficulty-for-all design.
- **Application to Money-verse:** Assist Mode for finance — slower market ticks, hint NPCs, exposed math, optional tutorial replays. Forgiveness mechanics; never silently fail.

### MASTER 9: Toby Fox (Undertale)
- **Domain:** 2D RPG craft + narrative
- **Credential:** Solo dev; >5M copies; gold standard for "small game with big soul."
- **Philosophy:** Question the genre's assumptions; choices should reshape the world, not just dialogue trees.
- **Signature methods:**
  - Branching morality where the *system* responds (NPCs remember, music changes).
  - Hybrid mechanics: turn-based menu + real-time bullet-hell — interactive without losing strategy.
  - Silent protagonist for projection.
  - Soundtrack as narrative engine; motifs evolve with relationships.
- **Anti-patterns:** Cosmetic dialogue branches; cutscene-heavy storytelling that pauses gameplay.
- **Application to Money-verse:** Financial decisions ripple through the world. Active mini-games inside otherwise passive financial moments (rhythm-game negotiation, e.g.).

### MASTER 10 (Anti-Master): Robinhood — *what NOT to do*
- **Domain:** Financial UX
- **Credential:** Cited by SEC, FINRA, Yale Law Journal, Massachusetts Securities as the central case study in harmful financial gamification.
- **Philosophy (rejected):** Engagement = trading frequency. More taps = more revenue.
- **Anti-patterns to actively avoid:**
  - Confetti / dopamine animations on trades.
  - Push notifications hyping "biggest movers."
  - Lottery-style surprise-stock rewards.
  - Tap-to-climb-the-waitlist mini-games training compulsive money interaction.
  - Curated "popular stocks" lists.
- **Application to Money-verse:** No confetti on speculative wins. Celebrate *consistency*, not transactions. Show drawdown alongside gains. No fake urgency.

### Honourable mentions
- **Squad (KSP)** — let the simulation be the textbook.
- **Lucas Pope (Papers, Please)** — systems thinking via bureaucratic friction; weight of small repeated decisions.
- **UW Center for Game Science (Foldit)** — friendly names for hard concepts ("wiggle / shake / freeze" not "biochemistry").
- **Brilliant.org** — pre-tests before instruction; one concept per lesson; spaced repetition.
- **CodeCombat / Lure of the Labyrinth (MIT)** — play first, name later.
- **Square Enix Acquire (HD-2D)** — pixel sprites + 3D environment + tilt-shift + dynamic lighting = diorama identity.
- **Heart Machine (Hyper Light Drifter)** — no text dialog; mood-first; modern post-processing on 240p pixels.
- **Acorns / Stash** — instant first-investment after bank link; tiny dollar amounts neutralise loss anxiety.
- **Nintendo EAD (Animal Crossing)** — asynchronous social visits; daily ritual on real-world time; gentle multiplayer with persistent world.

---

## Section 2 — Consensus Patterns (non-negotiable for the PRD)

Where 3+ masters agree:

1. **Hide the lesson in the verb.** Teach by doing, never lecture-first.
2. **Daily ritual > marathon session.** Target 5-10 min core loop.
3. **Forgiveness mechanics.** Reduce shame; never silently punish.
4. **Free, transparent, no dark patterns.** Foundational content cannot be paywalled.
5. **One concept per unit.** Isolate a single new rule per encounter.
6. **The system responds.** NPCs, music, world state must visibly remember choices.
7. **Authored, not procedural, content.** Hand-authored worlds lead; procedural supplements.

---

## Section 3 — Divergences & Strategic Choices

| Question | Camp A | Camp B | Our choice |
|---|---|---|---|
| Narrative density | Undertale, Stardew — heavy NPC dialog | Hyper Light Drifter — textless, mood-first | **A, but compact.** Bilingual (EN+HI), never blocking. |
| Combat/conflict | Sea of Stars, Undertale — keep, reframe | Stardew, AC — none | **Hybrid:** "challenges" not "combat." No PvP. |
| Difficulty | Celeste — single curve + assist mode | Khan — mastery gates | **Khan-gated, Celeste-assisted.** |
| Multiplayer | Animal Crossing — async | Palia — sync | **Async-first + optional sync rooms.** |
| Visual identity | Stardew — 16×16 traditional pixel | HD-2D — pixel + 3D + post-fx | **HD-2D-lite** (WebGL post-fx in Phaser 3). |
| Monetization | Robinhood — engagement-driven dark patterns | Varsity / Khan — fully free | **Fully free core.** |

---

## Section 4 — Meta-Framework (the playbook)

### 1. Core gameplay loop (5-10 min daily; 30-60 min session)
1. **Wake → check finances** (1 min) — morning apartment routine, overnight market, daily news ticker.
2. **One quest or lesson** (5-10 min) — an NPC needs help (negotiate a salary, evaluate a loan, file a tax). *The quest is the lesson.*
3. **Free play** (variable) — explore, talk, shop, invest, decorate, visit friends.
4. **Close out** — end-of-session reflection screen (what you learned, net-worth delta).

### 2. Learning integration (Huynh / Foldit / CodeCombat model)
- Never lecture before action.
- Friendly names for hard concepts ("growth saplings" = compounding; "weather forecasts" = market signals).
- Single concept per quest.
- Formal terminology revealed *after* mastery, in a glossary the player opens by choice.
- Mastery tracked invisibly; surfaced only as skill-tree progress.

### 3. Visual / audio identity (HD-2D-lite)
- **Sprites:** 32×32 character / 16×16 tile baseline, warm palette (Eastward + Stardew references). Mumbai / Delhi / Bengaluru-inspired districts.
- **Depth:** WebGL post-fx — tilt-shift, dynamic point lights, depth fog, parallax (Phaser 3 pipelines).
- **Ambient NPCs:** emoji-bubble micro-language; full dialog only in quests.
- **Audio:** Chiptune + acoustic Indian instruments (sitar, tabla, harmonium), dynamic by district. Toby Fox-style leitmotifs per major NPC.

### 4. Onboarding & retention
- **First 90 sec:** Player buys first stock / makes first deposit *before* any tutorial. Mastery from doing.
- **First 7 days:** Graduated daily quests; day-7 completion is the retention milestone. Streak begins on day 3 to avoid early shame.
- **First 30 days:** Khan mastery — unlock the second district by demonstrating budgeting competency in-game.
- **Long-term:** Seasonal events tied to Indian financial calendar (Diwali bonus, FY-end March, tax season, monsoon insurance month).

### 5. Monetization-free engagement
- 100% free core (Varsity / Khan / original Money-verse promise).
- Cosmetic-only optional pack *if* monetization is ever introduced — never gameplay, never lessons.
- Treat the player as a future advocate, not a conversion target.

### 6. Multiplayer / social
- **Async-first** (Animal Crossing): visit friends' apartments, leave messages, gift cosmetic items.
- **Optional sync rooms** (Colyseus): "Trading Floor" lobby for live market sessions, weekend "town hall" events.
- **Public profile by opt-in only.** No leaderboards by speculative gains; leaderboard *consistency* (longest streak, lessons completed, quests helped).
- **No PvP combat.** Cooperative challenges only.

### 7. Anti-patterns to actively avoid
1. No confetti on speculative wins.
2. No notifications hyping volatility.
3. No lottery / surprise-stock / spin-the-wheel rewards on real-money behavior.
4. No paywall on foundational lessons.
5. No "Cheat Mode" framing — call it Assist.
6. No long sessions required for progress.
7. No random encounters / grinding.
8. No US-centric financial examples.
9. No silent failures — always warn, then let the player choose.
10. No procedural content as the primary world.

---

## Master's Margin Note

- **Masters studied:** Huynh, von Ahn, Khan, Rangappa/Kamath, Sethi, Barone, Sabotage Studio, Thorson, Toby Fox, + 8 honourable mentions; Robinhood as anti-master.
- **Key patterns applied:** Hide-the-lesson-in-the-verb, daily-ritual loop, forgiveness mechanics, mastery gates + assist mode, async-first multiplayer, HD-2D-lite visual identity, no-dark-patterns financial UX.
- **Where we deviate:** We are *more aggressive* than the original Money-verse on (a) Indian-context grounding (currency, instruments, festivals), and (b) explicit anti-Robinhood rules; the original markets itself as "Get rich or die trying" — we tone that down to avoid the speculative framing.
- **Recommended deep-dives:** Zerodha Varsity (free, indispensable for Indian context); *Celeste's accessibility design* (GDC talk); *Designing Sea of Stars combat* (PlayStation Blog); Ramit Sethi's IWT book (chapters 1-3 for automation patterns).
