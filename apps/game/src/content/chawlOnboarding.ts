/**
 * Chawl Mohalla — onboarding story (Day 1).
 *
 * ~3 minutes of play. Each beat hits exactly one concept:
 *   1.  Where am I — the chawl, salary on the table.
 *   2.  Who teaches me — Maya didi, upstairs neighbour, points at !
 *   3.  Why pay rent first — Maya's nine-day cautionary tale.
 *   4.  The verb itself — open Envelope panel, allocate ₹15,000.
 *   5.  Maya's reaction — branches on save >= 2,000 (balanced vs shaky).
 *   6.  Hand-off — Ravi anna at the chai stall; show the ₹70/day math.
 *   7.  Free play — gentle nudge toward Bhola seth (the antagonist).
 *
 * All dialog lines are ORIGINAL Money-verse writing in the voice register
 * established by:
 *   - packages/content/quests/first-budget.yarn (Maya, warm Hinglish)
 *   - packages/content/npcs/maya-didi.json voiceExamples
 *   - packages/content/npcs/ravi-anna.json voiceExamples (Tamil-flavoured)
 *
 * No lines are lifted verbatim from those files — that's a separate
 * canonical quest. These are NEW lines that live next to the canonical
 * yarn and stay register-consistent.
 */
import type { StorySequence } from "../lib/storyDirector";

const MAYA = "Maya didi";
const RAVI = "Ravi anna";

export const CHAWL_ONBOARDING_SEQUENCE: StorySequence = {
  id: "chawl-onboarding",
  beats: [
    {
      kind: "narrate",
      lines: [
        "Day 1 in the chawl. Your first salary is on the small wooden table.",
        "The fan above is uneven. The window smells like onions and rain.",
      ],
    },
    {
      kind: "objective",
      text: "Find Maya didi — look for the ! above her head.",
    },
    {
      kind: "indicator",
      npcId: "maya-didi",
      show: true,
    },
    {
      kind: "move-to",
      targetNpcId: "maya-didi",
      hintText: "WASD or arrows to walk. Press E near Maya didi to talk.",
    },
    {
      kind: "wait-for-interact",
      npcId: "maya-didi",
    },
    {
      kind: "say",
      speaker: MAYA,
      lines: [
        "Aagaye? Good. Sit, sit. I won't bite — that's Bhola's job.",
        "I heard the postman. First salary. ₹15,000, na?",
        "Listen — money is just attention. Today, we give it some.",
      ],
    },
    {
      kind: "grant-inr",
      amount: 15_000,
      reason: "First month salary",
    },
    {
      kind: "say",
      speaker: MAYA,
      lines: [
        "Three envelopes. That is the whole lesson. Don't make it complicated.",
        "Rent first. Then Save — that one is for future-you. Then Spend — chai, dabba, bus pass.",
        "Open the drawer. Try it now.",
      ],
    },
    {
      kind: "show-envelope-split",
    },
    {
      kind: "say",
      speaker: MAYA,
      lines: [
        "Achha. You paid Bhola, you paid yourself, and you still have chai money.",
        "Tomorrow Aarav will try to sell you AirPods. Now your envelope can say no.",
      ],
    },
    {
      kind: "indicator",
      npcId: "maya-didi",
      show: false,
    },
    {
      kind: "indicator",
      npcId: "ravi-anna",
      show: true,
    },
    {
      kind: "objective",
      text: "Walk to Ravi anna — the chai stall in the courtyard.",
    },
    {
      kind: "wait-for-interact",
      npcId: "ravi-anna",
    },
    {
      kind: "say",
      speaker: RAVI,
      lines: [
        "One cutting? Sit anna. First chai on me, since first salary.",
        "But — small math. ₹70 a day, times 365 — that is ₹25,550 a year. From chai. Just chai.",
        "I am not saying stop. I am saying — know. That is all.",
      ],
    },
    {
      kind: "indicator",
      npcId: "ravi-anna",
      show: false,
    },
    {
      kind: "objective",
      text: "Walk around. Try Bhola seth across the alley (red robes) — but careful.",
    },
  ],
};
