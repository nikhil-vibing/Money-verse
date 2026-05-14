# Narrative Designer Audit — Chawl Mohalla

> Audit of authored content in `packages/content/{quests,npcs}/` and the hardcoded greetings in `apps/game/src/entities/Npc.ts`, against PRD pillars #1 #4 #7 and the chawl research brief.

---

## 1. Premise check

**The premise is implicit, not legible.** Read `first-budget.yarn` cold and you can infer "first salary, ₹15,000, rent ₹4,800" — but a fresh player who walks into the chawl via the current `Npc.ts` greetings (a single 2-liner each, dispatched on E-press) has **no idea** they just got paid, that this is Day 1, that ₹15k is everything they have for the month, or that Bhola seth owns the room. The PRD's stated 90-second hook — *"buy chai with ₹10 of starting cash, watch the number tick"* — is not enacted anywhere in the current build. There is no physical envelope under the door (the Stardew "letter-as-compass" pattern from the research brief is *unbuilt*), no Mom-on-phone landline ring, no payslip pinned on the fridge. The player wakes into ambient texture but the **dramatic question** — "₹15,000 in your hand and the wolf at the door, what do you do?" — is invisible until they happen to walk up to Wren and press E. **Verdict: premise fails the 30-second test.**

## 2. Voice register table

| NPC | Distinct? | Best line | Risk |
|---|---|---|---|
| Wren | A — warm-patient, tea metaphor recurring | *"Mistake? Good. Now you have a story instead of just a number."* | Solid. |
| Bhola seth | A — smooth-fast, fake-friendly | *"Sign here. Just here. The other page is just formality, don't read."* | Excellent menace under courtesy. |
| Arlo | A — hype/slang, EMI-brained | *"If I die tomorrow, I want to die in good shoes."* | Distinct, but one-note (only sells). |
| Mom-on-phone | A — worried-warm, food-before-money | *"Khaana khaaya? Sach bata. Don't lie to your mother."* | Voice strong; **only used in JSON, never wired** to a landline interaction. |
| Lia | A — terse-efficient, system-religion | *"Late by two minutes — that's a complaint already. System has no mood."* | Excellent. |
| Tobias | A — slow-dignified, withholding | *"Ask me once and I'll smile. Ask me twice and I'll teach."* | Excellent. |
| Mara | A — matter-of-fact, no-nonsense | *"Memory is for poetry, not for groceries."* | Excellent. |
| Kai | B — Tamil-flavoured info-broker | *"Morning chai is for thinking. Evening chai is for talking. Don't mix."* | Voice solid in JSON but the **`Npc.ts` greeting** (*"Seventy rupees a day. Times three sixty-five."*) bleeds into Wren's didactic register. Flag. |
| Postman | C — bureaucratic-minimal | *"Not me, beta. I just deliver. Read it inside."* | Functional but interchangeable with any office NPC. |
| Biscuit | A — action tokens | *"\*flops over for belly rub\*"* | Distinct by being non-verbal. |

**Same-y risk:** Kai's hardcoded greeting reads like Wren in disguise. Fix by restoring the Tamil-flavour ("aiyo," "anna") and refusing to do the math himself.

## 3. Missing emotional beats (ranked)

Every existing quest is **informational** — even `rent-day.yarn` and `needs-and-wants.yarn` lecture without making the player *feel*. Five concrete beats to author:

1. **Empty fridge open at 11pm** *(regret, hunger)*. After buying the AirPods in `needs-and-wants`, the player walks home, opens the fridge, finds nothing. Mom rings on the landline mid-search: "Beta, khaana khaaya?" Player must lie, skip, or admit. No mastery node — pure consequence.
2. **Mom's call interrupts the Bhola signing** *(shame, secrecy)*. The moment you put pen to the loan paper, the landline rings. Pick up → Mom: *"Don't borrow from anyone there. Anyone."* Hang up → Bhola smiles wider. This is pillar #7 in pure form.
3. **Arlo at the rooftop, 9pm, EMI overdue** *(empathy, role-flip)*. His 21:00–22:30 "venting-about-money" schedule block exists in JSON but no quest fires there. He defaults on his sneaker EMI; the player who once said no to fake AirPods is now the one who must teach. This is the *anti-hero-redemption-by-mentoring* beat.
4. **Wren re-explaining without sighing** *(warmth, being-seen)*. After `failed_quest:first-budget:3x` her memory hook fires `maya-assist-mode-offer` — but the line itself isn't authored. Write it as the *un*-frustrated re-teach: *"Phir se. Slowly. Same envelopes. New day."* This is the Assist Mode pillar made human.
5. **Bhola's hand on your shoulder when you sign** *(pride-then-dread)*. Right now Bhola is voiced but never *staged*. Author a beat where he physically walks you to his folding chair, sits you down, makes chai appear, treats you like family — *then* the paper. The seduction must work for the trap to mean anything.

## 4. Anti-hero arc opportunity

**Yes — and the bones already exist in the memory hooks, but no quest connects them.** Bhola's `bhola-offers-first-loan` (triggered at `wallets_inr_lte:200`), `bhola-pitches-harder`, `bhola-no-problem-no-problem`, `bhola-mask-slips`, and `bhola-pretends-not-to-know-you` describe a *complete five-act seduction-and-betrayal arc* — but there is no `bhola-debt-trap.yarn` file in `packages/content/quests/`. **Author it.** Let the player take the ₹500 loan willingly, miss a payment willingly, watch the interest compound, watch Bhola's voice register shift from "beta" to silent, then — and only then — let Wren offer the hand out: *"You learned the lesson cheap. It costs everyone something. Some pay in money. You paid in pride. Now come."* The arc respects pillar #4 (forgiveness, not punishment) **only** if the player gets to make the wrong choice in the first place. Right now the build pre-empts the fall.

## 5. Single biggest narrative move for the in-flight onboarding

**Open with the under-the-door letter, the landline ring, and the empty fridge — in that order, before any NPC speaks.** Sixty seconds of authored environment that *states the premise*: an envelope of ₹15,000 with a hand-written "first salary — Wren" sticky note; a rent demand from Bhola folded under the door; the landline rings (Mom: *"Khaana khaaya?"*); the fridge holds one egg and an empty achaar jar. The player has now seen, heard, and felt the question — *"₹15k, rent due, mother worried, fridge empty: what now?"* — before a single tutorial line. Only **then** does Wren knock. This is pillar #1 (hide the lesson in the verb) applied to the *story* itself: the premise is hidden in the props.

---

## Single-paragraph TL;DR

The three highest-leverage missing beats, ranked: (1) **Mom's landline call interrupting the Bhola signing** — wires the existing-but-orphaned `maa-on-phone` voice to the existing-but-orphaned Bhola seduction arc and lets pillar #7 sing; (2) **empty fridge at 11pm after the AirPods purchase** — turns `needs-and-wants.yarn` from a lecture into a regret; (3) **Arlo venting on the rooftop at 9pm with an EMI he can't pay**, with the player now in the mentor seat. The single biggest add to the in-flight `chawlOnboarding.ts` is to **stage the premise environmentally in the first 60 seconds — letter under door, landline ring, empty fridge — before Wren ever speaks**, so the player walks into "₹15k, rent due, Mom worried, fridge empty" already understanding the stakes the StoryDirector is about to develop.
