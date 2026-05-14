# Chawl Mohalla — Starting District Research Brief

> Subproblem of [Ninja Money-verse PRD §5](../PRD.md). Domain: Budgeting & expenses. Mentor: *Wren.* Setup line: "rent ₹4,800, chai ₹10."
>
> Method: research → pattern extraction → meta-framework, applied to *first hours in RPGs* and *first lessons in edu products*.

---

## 1. Master profiles

### 1.1 Eric Barone — *Stardew Valley*
Solo dev, 41M copies. **Methods:** *Letter as compass* — Lewis's mailbox letters externalise the tutorial; the world *posts you* what to do, no modal locks ([Stardew Wiki: Letters](https://stardewvalleywiki.com/Letters)). *Multi-verb day-one* — "if you didn't want to farm, you could just spend all day in the mines" ([NPR](https://www.npr.org/2025/01/24/g-s1-44510/the-legacy-and-future-of-the-farming-game-stardew-valley)). *Mayor-greets-you* — Lewis hands you the social map. *Mailbox memory* — letters trigger on world state. **Anti-pattern:** forced tutorial.
**Applied:** Wren slips a rent-due notice under the player's door at minute 0. A physical world object, not a popup.

### 1.2 Toby Fox — *Undertale Ruins*
**Methods:** *Mock-the-tutorial-then-teach* — Toriel parodies Skyward Sword's Fi ([Toriel](https://en.wikipedia.org/wiki/Toriel)). *Mechanic-as-moral-choice* — sparing teaches the game's thesis ([Hidden Level Design](https://www.gamedeveloper.com/design/the-hidden-level-design-of-undertale)). *Leitmotif memory* — Toriel's theme returns at moral pivots. *Solo-leave permission* — Toriel lets you walk away. **Anti-pattern:** aggressive tutorials, mandatory tragedy.
**Applied:** Wren is mentor but the verb she teaches is "log a chai," not "open a tutorial." She gently lets a player skip her, then watches.

### 1.3 Luis von Ahn — *Duolingo*
**Methods:** *Pre-signup play* — sign-up moved later → +20% DAU ([Juno](https://www.junoschool.org/article/duolingo-onboarding-experience/)). *Doing-is-onboarding* — first lesson IS the tutorial. *Streak-anchored daily goal* set in session 1. *Forgiveness streaks* (Streak Freeze). 16,000 A/B tests refined the loop ([Hampton](https://joinhampton.com/blog/how-luis-von-ahn-made-duolingo-so-addictive-the-10b-app-formula)). **Anti-pattern:** modal tutorials before value.
**Applied:** First 90 seconds = buy chai with ₹10 of starting cash, watch the number tick. Auth prompt only after this micro-win.

### 1.4 Jean-Baptiste Huynh — *DragonBox*
93% of kids solving algebra in 90 minutes ([itslearning](https://itslearning.com/global/news/dragonbox/)). **Methods:** *Abstract-first, words-later* — the word "algebra" never appears till mastery ([Modulo](https://www.modulo.app/all-resources/dragonbox-apps-review)). *Operation = gesture.* *Stealth progression.* *No prose pedagogy.* **Anti-pattern:** front-loading vocabulary.
**Applied:** "Fixed cost" is taught by dragging a rent envelope into a wall-jar marked with a door-icon. The term enters the glossary only after the player has done this 3 in-game days.

### 1.5 Ramit Sethi — *Conscious Spending Plan*
**Methods:** *Four buckets* — Fixed (50–60%) · Investments (5–10%) · Savings (5–10%) · Guilt-Free (20–35%) ([iwt](https://www.iwillteachyoutoberich.com/conscious-spending-basics/)). *Automation > willpower.* *Spend extravagantly on what you love.* *Rich Life framing.* **Anti-pattern:** fine-grained tracking guilt loops.
**Applied:** Wren gives the player four clay pots — Fixed, Invest, Save, Khushi (Joy). The Khushi pot is non-optional; spending it on chai with friends is a *win*.

### 1.6 Jesse Mecham — *YNAB* & Scot Osterweil — *Lure of the Labyrinth*
**Mecham** ([YNAB Method](https://www.ynab.com/ynab-method)): give every rupee a job; pre-fund "true expenses" (Diwali, scooter service); roll with the punches; age your money. **Anti-pattern:** budget as moral judgement.
**Osterweil** ([MIT TSL](https://education.mit.edu/project/lure-of-the-labyrinth/)): three "wings," each a math strand; narrative wrapper (find lost pet) carries puzzles; *never names the math.* **Anti-pattern:** worksheet framing.
**Applied:** A "Diwali in 90 days" quest pre-funds an irregular cost. The chawl itself is a *wing* — alley, kitchen, rooftop each teach one sub-concept (cash count, fixed vs variable, due dates, opportunity cost).

### 1.7 Cultural reference layer — Mumbai chawl ethnography
Sources: [Sahapedia](http://www.sahapedia.org/physical-and-social-configurations-of-the-bombay-chawls) · [Homegrown](https://homegrown.co.in/homegrown-explore/what-its-actually-like-to-live-in-a-mumbai-chawl) · [RTF](https://www.re-thinkingthefuture.com/rtf-fresh-perspectives/a931-the-old-world-charm-of-mumbais-chawls/) · [The Lunchbox (2013)](https://en.wikipedia.org/wiki/The_Lunchbox).

**Texture facts:** 350 sq ft kholis, 8–16 per floor, ₹4–8k rent. Shared toilet per floor; morning queue. Verandah is the social engine — seniors gather at dusk. Inner courtyard hosts Ganpati, Diwali kandils, Holi colours. Doors stay open by default; closed = absent. Strong inter-household borrowing. Dabbawala bell at 11am.

---

## 2. Consensus patterns for Chawl Mohalla's first 10 minutes

1. **Verb in 90 seconds.** Player spends ₹10 on chai before any screen of text. [Huynh, vonAhn]
2. **Letter, not popup.** A rent-due paper note on the floor of the kholi is the trigger for the first quest. [Barone]
3. **Four pots, not 30 fields.** Budgeting is taught as physical clay pots on the kitchen shelf. [Sethi]
4. **Named neighbour map.** The player meets 3 named NPCs in the first 10 minutes — Wren, the chai-wala, one verandah aunty. [Barone]
5. **Music memory.** A short Wren leitmotif (harmonium + tabla) plays at her every appearance. [Fox]
6. **Glossary withheld.** The words "budget," "fixed cost," "opportunity cost" appear only after the player has *done* the action three times. [Huynh]
7. **Forgiveness baked in.** Missing rent triggers a worried-Wren scene, never a "GAME OVER." Late fee is in-world consequence, not punishment screen. [vonAhn, Thorson]
8. **Setting carries the lesson.** Shared toilet queue, dabbawala bell, Ganpati prep — cultural texture is *also* gameplay (each is a budget trigger).

---

## 3. Strategic choices

| Decision | Option A | Option B | Pick | Why |
|---|---|---|---|---|
| Where player starts | Inside locked kholi | On the verandah | **A** | Forces door-opening = first interact verb; mirrors Stardew bed-wake. |
| First currency moment | Receive ₹100 from Wren | Inherit ₹500 from late father | **A — micro** | Small numbers teach scale. ₹10 chai feels like 10% of capital. Tension. |
| Wren's role | Persistent narrator | Schedule-bound NPC like everyone | **B** | Pillar 6 (authored, schedule). She works at the kirana 10am–1pm, naps 2–3, on verandah 6–9pm. |
| Budgeting metaphor | Spreadsheet UI | Clay pots on kitchen shelf | **B** | Diegetic UI, no menu walls. [Pillar §8] |
| Failure model | Hard rent-default eviction | Late fee + Wren intervention | **B** | Forgiveness pillar. |
| Quest progression | Linear 7-step | 3 mandatory + 4 optional | **B** | Player agency. Mastery-gates Bank Bazaar only on the 3 mandatory. |
| First "graduation" | XP threshold | Mechanic moment (open passbook) | **B** | Khan mastery = demonstrated competency, not points. |
| Indian context grain | Generic "city" | Specific Mumbai-chawl-ish | **B** | Pillar 9. Use Marathi/Hindi loanwords for items (kholi, jhaadu, kandil). |

---

## 4. Concrete blueprint

### 4.1 The 90-second first action

```
0:00  Black. Tabla beat. Title fades. Birdsong.
0:05  Camera fades up inside a 350 sq ft kholi. Player sprite asleep on charpai.
       Single point-light through the door slot.
0:10  Press any key. Player sits up. A folded paper slides under the door.
0:15  Walk to door (3 tiles). Pick up. It reads:
        "Rent ₹4,800 due 5 days. — Bhola seth.
         PS: Chai is ₹10. Don't forget breakfast. ❤ Wren"
0:25  Door opens onto the verandah. Sun. 4 named NPCs visible at distance.
       Mini-map appears bottom-right (PRD §6.1 smart minimap).
0:30  Wren waves from two doors down. A dotted line shows path to her,
       BUT the chai-wala cart is closer with a steaming pot icon.
0:45  Player has ₹100 in pocket (HUD: top-right). Two prompts on screen,
       both accepted:
        [E] Talk to Wren  ·  [E] Buy chai (₹10)
1:00  Player buys chai. Cup sprite in hand. ₹100 → ₹90. SFX: UPI chime homage.
       A small glossary entry quietly unlocks: "Expense — money out."
       (Word visible only if player opens glossary; no popup.)
1:30  Wren walks over: "Aa gaya? Chai pee li? Achha. Aaj se hisaab rakhna
       seekho. Andar aao." (You came. Drank chai. Good. Start keeping count
       from today. Come inside.)
```

**Why this works:** verb-first [Huynh], no signup wall [vonAhn], named NPC greet [Barone], cultural specificity [Pillar 9], forgiveness option (Wren doesn't scold if you skip her) [Thorson].

### 4.2 The seven quests (3 mandatory + 4 optional)

| # | Title | Concept (PRD §7) | Vehicle | Mandatory |
|---|---|---|---|---|
| 1 | **Chai Hisaab** | Expense logging | Pot-on-shelf drag; log 3 expenses | ✅ |
| 2 | **Char Matkis** *(Four Pots)* | 50-30-20 / Sethi's four buckets | Physically split first ₹100 into 4 clay pots | ✅ |
| 3 | **Bhada Roko** *(Hold the Rent)* | Fixed vs variable expense; rent due | Pre-fund Fixed pot before due date | ✅ |
| 4 | Dabbawala ka Dhandha | Variable expense + meal-prep trade-off | Cook dal vs order dabba — show cost delta | optional |
| 5 | Diwali ki Tayyari | True expenses (YNAB rule 2) — pre-funding irregular | Pre-save for kandils 30 days ahead | optional |
| 6 | Padosi ka Udhaar | Cost of borrowing — Bhola seth cameo | Choose: borrow ₹500 @ 10%/week or skip a treat | optional |
| 7 | **Passbook Khulao** *(Open the Passbook)* | Income vs expense vs saving — graduation | Receive payslip from kirana side-gig; record net | ✅ (graduation) |

Each quest **one concept** [Pillar 2]. The three mandatory map exactly to *Budget Mastery I* — the gate to Bank Bazaar in PRD §5.

### 4.3 NPC archetypes (12-person cast)

| Name | Role | Schedule highlight | Function |
|---|---|---|---|
| **Wren** | Mentor | Verandah dusk; kirana 10–1 | Onboarding; gentle nudges |
| **Bhola seth** | Landlord + predatory lender | Comes for rent on day 5 | Teaches consequence of skipping Fixed pot; future Credit quest hook |
| **Pintu chai-wala** | Vendor | Cart at gate, 7am–11am, 5pm–9pm | Smallest unit of expense; daily ritual anchor |
| **Mara** | Verandah elder | 6pm–9pm on bench | Tells stories that contain finance proverbs (one Marathi/Hindi saying per dusk) |
| **Iqbal dabbawala** | Daily delivery | 11am bell | Variable expense option |
| **Rekha tai** | Neighbour with toddler | Shared toilet queue 7am | Teaches "borrowing salt" — informal credit; sets up Insurance arc later |
| **Joseph uncle** | Retired postman | Reads paper 8am | Sneaks in news headlines (foreshadow Niveshak Chowk markets) |
| **Mira & Mira** | Twin schoolgirls | Play in courtyard 4pm | Carry the Ganpati/Diwali festival mini-events |
| **Kishore mama** | Auto-rickshaw driver | Idles outside 9am, 6pm | First "transport" expense decision (walk vs auto) |
| **Salma didi** | Tailor | Stall on ground floor | Side-gig hint — repairs for ₹50 |
| **Kai bhau** | Beat constable | Walks past noon | Trust anchor — appears later in Scam-Awareness arc |
| **Cat — *Biscuit*** | Stray | Wherever sun is | Cosmetic; sits on rent notice if ignored 2 days. [Pillar 7 "system responds"] |

### 4.4 The space itself — what's clickable

**Layout (top-down Tiled map, ~64×48 tiles):**

```
        ┌───────────────────────────────┐
        │      Roof terrace (water tank,│ ← Quest 5: Diwali kandils strung here
        │      drying clothes, kite)    │
        ├───────────────────────────────┤
        │ Floor 2: 8 kholis, gallery    │
        │ Wren's door • Joseph's door   │
        ├───────────────────────────────┤
        │ Floor 1: 8 kholis, gallery    │
        │ Player's kholi (door #4)      │ ← Start
        ├───────────────────────────────┤
        │      INNER COURTYARD          │ ← Ganpati pandal seasonally
        │   (4 chappals, 1 cycle,       │   Festival lanterns, kids play
        │    1 tulsi pot, washing line) │
        ├───────────────────────────────┤
        │ Ground: kirana | tailor       │
        │ Shared toilet block | water   │
        │ tap | mailbox wall            │
        └───────────────────────────────┘
                  ↓ gated archway
              ALLEY → tram stop → Bank Bazaar (locked)
```

**Inside the player's kholi (the room is the UI):**
- **Charpai** (bed) — sleep / advance day.
- **Kitchen shelf** — four clay pots (Fixed · Khushi · Save · Invest). This *is* the budget UI. Drag rupees in/out diegetically.
- **Wall calendar** — rent due date, Diwali date, festival markers.
- **Notice slot under door** — daily letters land here [Barone].
- **Mirror** — character customisation.
- **Trunk** — inventory.

**Outside:**
- **Mailbox wall** in courtyard for friends' async gifts [PRD §9].
- **Tulsi pot** — small daily ritual (water it for +0 gameplay, +texture).
- **Notice board** at archway — community announcements (quest hooks).

### 4.5 Reasons to return to Chawl Mohalla after unlocking other districts

1. **Wren AI tutor lives here.** Her schedule means she's the most-reliable hint NPC; players return for tough-concept clarification [PRD §10].
2. **Festivals only fire in the chawl.** Ganpati (Aug-Sep), Diwali (Oct-Nov), Holi (Mar). Each runs a 5-day mini-event with co-op verandah quests [PRD §6.2].
3. **The four pots are *home base*.** Budget review is always done at the kitchen shelf. Other districts deposit *into* the pots; the visualisation lives only here.
4. **Mara's proverbs unlock weekly.** A Toby-Fox-style memory mechanic: she has 52 proverbs, one a week, tied to player's recent decisions [Pillar 7].
5. **Apartment decoration.** Cosmetic items earned anywhere are displayed *here* [PRD §6.1].
6. **Async multiplayer.** Friends visit *your kholi* — verandah is the social space [PRD §9].
7. **Stray cat Biscuit.** Slow-burn pet bond; she follows you only if you've fed her — Stardew-style schedule warmth.

### 4.6 The graduation moment — unlocking Bank Bazaar

**Trigger event:** Quest 7 *Passbook Khulao.*

**Mechanic:** Player has worked a 3-day side-gig at the kirana (Salma didi referral). At end of day 3, the shop owner hands the player a small paper payslip with three rows:

```
   AMDANI (Income)  ₹600
   KHARCHA (Spent)  ₹230
   BACHAT (Saved)   ₹370
```

The player must **physically place** the BACHAT amount into the Save pot. The moment they do, the pot animates a small bloom; Wren leitmotif plays one octave higher; the wall calendar flips to a new page; the archway gate at the end of the alley unlatches with a soft click.

Bhola seth, watching from across the courtyard, mutters: *"Bachat kar raha hai? Bank Bazaar jaa, beta. Mera kaam waha bhi hai."* (Saving? Go to Bank Bazaar, kid. My work is there too.) — foreshadowing the predatory-credit arc.

**Why this graduation works:**
- It's a *demonstrated competency* [Khan mastery, Pillar 3], not XP.
- It is the player's first time the world acknowledges them as a budgeter [Pillar 7].
- It opens the *next* district while *not closing* this one — Chawl Mohalla remains canonical home.
- The leitmotif callback rewards musical memory [Fox].
- The gate is diegetic (a real gate animation), not a UI toast [Pillar 8].

---

## 5. Anti-patterns rejected for Chawl Mohalla

No tutorial NPC chains (verb-first [Huynh]). No XP bar for budgeting (Khan-mastery). No streak shame — 0-day streak shows a tulsi-pot hint, not red [vonAhn]. No real-money product placement; Bhola is fictional. No "Easy Mode" framing — Assist Mode is always-available, no-shame [Thorson]. No confetti for spending Khushi — celebrated by NPC dialog only [PRD §6.4]. No procedural NPCs — every cast member has a memory file [Pillar 6].

---

## 6. Sources

**RPG starting zones:** [Stardew: Letters](https://stardewvalleywiki.com/Letters) · [Lewis](https://stardewvalleywiki.com/Lewis) · [NPR: Barone](https://www.npr.org/2025/01/24/g-s1-44510/the-legacy-and-future-of-the-farming-game-stardew-valley) · [Toriel](https://en.wikipedia.org/wiki/Toriel) · [Undertale Hidden Level Design](https://www.gamedeveloper.com/design/the-hidden-level-design-of-undertale) · [Octopath analysis](https://annahavingfun.wordpress.com/2022/07/25/octopath-traveler-triangle-strategy-freedom-of-choice-and-breaking-immersion/) · [Chained Echoes — RPGFan](https://www.rpgfan.com/review/chained-echoes/)

**Edu onboarding:** [Duolingo — Juno](https://www.junoschool.org/article/duolingo-onboarding-experience/) · [von Ahn — Hampton](https://joinhampton.com/blog/how-luis-von-ahn-made-duolingo-so-addictive-the-10b-app-formula) · [DragonBox — Modulo](https://www.modulo.app/all-resources/dragonbox-apps-review) · [DragonBox — itslearning](https://itslearning.com/global/news/dragonbox/) · [Brilliant](https://brilliant.org/about/) · [Khan Mastery](https://support.khanacademy.org/hc/en-us/articles/360030753412-Why-Mastery-Learning-by-Sal-Khan) · [MIT: Lure of the Labyrinth](https://education.mit.edu/project/lure-of-the-labyrinth/) · [Acorns](https://www.acorns.com/learn/acorns/how-does-acorns-work/)

**Budgeting pedagogy:** [Sethi — Conscious Spending](https://www.iwillteachyoutoberich.com/conscious-spending-basics/) · [YNAB Method](https://www.ynab.com/ynab-method)

**Chawl ethnography:** [Sahapedia — configurations](http://www.sahapedia.org/physical-and-social-configurations-of-the-bombay-chawls) · [Homegrown](https://homegrown.co.in/homegrown-explore/what-its-actually-like-to-live-in-a-mumbai-chawl) · [RTF](https://www.re-thinkingthefuture.com/rtf-fresh-perspectives/a931-the-old-world-charm-of-mumbais-chawls/) · [Wikipedia: Chawl](https://en.wikipedia.org/wiki/Chawl) · [The Lunchbox](https://en.wikipedia.org/wiki/The_Lunchbox) · [White Tiger](https://en.wikipedia.org/wiki/The_White_Tiger_(Adiga_novel))

---

*Brief authored 2026-05-14 by master-researcher subagent for [PRD §5 District 1](../PRD.md).*
