/**
 * The First Dojo — onboarding story (Day 1).
 *
 * ~3 minutes of play. Each beat hits exactly one concept:
 *   1.  Where am I — the old quarter, paycheck on the table.
 *   2.  Who teaches me — Sensei Wren, upstairs neighbour, points at !
 *   3.  Why pay rent first — Sensei Wren's nine-day cautionary tale.
 *   4.  The verb itself — open Envelope panel, allocate $1,500.
 *   5.  Sensei Wren's reaction — branches on save >= 200 (balanced vs shaky).
 *   6.  Hand-off — Kai at the Cart; show the $7/day math.
 *   7.  Free play — gentle nudge toward The Lender (the antagonist).
 *
 * All dialog lines are ORIGINAL Ninja Money-verse writing in the sensei
 * cadence established by:
 *   - packages/content/quests/first-budget.yarn (Sensei Wren, warm-patient)
 *   - packages/content/npcs/maya-didi.json voiceExamples
 *   - packages/content/npcs/ravi-anna.json voiceExamples (brief-vendor)
 *
 * No lines are lifted verbatim from those files — that's a separate
 * canonical quest. These are NEW lines that live next to the canonical
 * yarn and stay register-consistent.
 */
import type { StorySequence } from "../lib/storyDirector";
import { readFirstBudget } from "../lib/storyDirector";

const MAYA = "Sensei Wren";
const RAVI = "Kai at the Cart";

/**
 * Sensei Wren's reaction after the player confirms the envelope split.
 *
 * The audit asked for two branches off `readFirstBudget(scene)`:
 *   - balanced (save >= 200 AND rent >= 480): warm, send-on-your-way
 *   - shaky   (everything else):              gentle, try-again
 *
 * Today the executor wires the branch as a `say-branch` beat — a thin
 * extension of `say` that picks lines from a resolver. The resolver runs
 * once when the beat fires (after the envelope has stamped `firstBudget`
 * in the registry) and returns the line list to display. See
 * lib/storyDirector.ts for the implementation.
 */
const MAYA_REACTION_BALANCED: ReadonlyArray<string> = [
  "Good. You saw the shape of it.",
  "Now go buy tea. A coin or two over budget is fine.",
];

const MAYA_REACTION_SHAKY: ReadonlyArray<string> = [
  "Save is thin. One emergency wipes it.",
  "Try again tomorrow. The envelope doesn't run away.",
];

export const CHAWL_ONBOARDING_SEQUENCE: StorySequence = {
  id: "chawl-onboarding",
  beats: [
    {
      kind: "narrate",
      lines: [
        "Day one in the old quarter. Your first paycheck sits on the small wooden table.",
        "The fan above is uneven. The window smells like rain and woodsmoke.",
      ],
    },
    {
      kind: "objective",
      text: "Find Sensei Wren — look for the ! above her head.",
    },
    {
      kind: "indicator",
      npcId: "maya-didi",
      show: true,
    },
    {
      kind: "move-to",
      targetNpcId: "maya-didi",
      hintText: "WASD or arrows to walk. Press E near Sensei Wren to talk.",
    },
    {
      kind: "wait-for-interact",
      npcId: "maya-didi",
    },
    {
      kind: "say",
      speaker: MAYA,
      lines: [
        "You came. Good. Sit. I won't bite — that is the chair at the alley's job.",
        "The Postman told me. First paycheck. Fifteen hundred.",
        "Money is attention. Today, we give it some.",
      ],
    },
    {
      kind: "grant-inr",
      amount: 1_500,
      reason: "First month paycheck",
    },
    {
      kind: "say",
      speaker: MAYA,
      lines: [
        "Three envelopes. That is the whole lesson. Don't complicate it.",
        "Rent first. Then Save — that one is for future-you. Then Spend — tea, food, bus.",
        "Open the drawer. Try it now.",
      ],
    },
    {
      kind: "show-envelope-split",
    },
    {
      // Sensei Wren's reaction now branches on the player's actual split.
      // The resolver reads `firstBudget` out of the scene registry (stamped
      // by EnvelopeScene.tryConfirm) and picks the warm or the gentle
      // line set. The hardcoded single-line beat was the audit's last
      // remaining "in-flight" gap — wired here so neither branch is
      // dead-code.
      kind: "say-branch",
      speaker: MAYA,
      resolveLines: (scene) => {
        const result = readFirstBudget(scene);
        if (result === undefined) return MAYA_REACTION_BALANCED;
        return result.grade === "balanced"
          ? MAYA_REACTION_BALANCED
          : MAYA_REACTION_SHAKY;
      },
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
      text: "Walk to Kai at the Cart — the tea cart in the courtyard.",
    },
    {
      kind: "wait-for-interact",
      npcId: "ravi-anna",
    },
    {
      kind: "say",
      speaker: RAVI,
      lines: [
        "One cup. First one is on me, since first paycheck.",
        "Small math. Seven a day, times three sixty-five — two thousand five hundred and fifty-five a year. From tea. Just tea.",
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
      text: "Walk around. The chair at the alley (red robes) is The Lender — careful.",
    },
  ],
};
