---
description: Author a new quest end-to-end — research masters, write Yarn dialog, add JSON frontmatter, queue i18n, run a11y review.
argument-hint: <district-id> <concept> [working-title]
allowed-tools: [Read, Edit, Write, Bash, Agent]
---

# /new-quest — orchestrated quest authoring

Arguments: `$1` = district-id, `$2` = concept (single concept, see PRD §7), `$3` = optional working title.

You are the orchestrator. Spawn the right subagents and assemble the result. Do not write the quest yourself.

## Steps

1. **Sanity-check arguments.**
   - If district-id is not in PRD §5, stop and ask for clarification.
   - If concept is not in PRD §7 curriculum table, stop and ask the user whether to add it to the curriculum first.

2. **Spawn `master-researcher`** with brief:
   > "Quick-depth (2-3 masters, 5-10 searches). The new quest teaches `$2` in the `$1` district. Find masters of teaching this specific concept via interactive systems. Output to `docs/research/quest-$2.md`."

3. **In parallel, spawn:**
   - `npc-author` — "Confirm the NPC(s) for this quest exist with schedule + memory hooks; create any missing files."
   - `art-curator` — "Find OSS sprites for the NPC(s) if missing."

4. **Spawn `quest-writer`** with brief that includes:
   - The master-researcher brief link.
   - The PRD pillars #1, #2, #3, #5 to satisfy.
   - The NPC roster from `npc-author`.
   - "Output: `packages/content/quests/$2.yarn` + `.json`. ≤10 min playtime, one concept, verb-first onboarding."

5. **Spawn `i18n-curator`** with brief: "Generate translation keys; queue HI machine-translation for human review."

6. **Spawn `a11y-reviewer`** with brief: "Author screen-reader summary for this quest."

7. **Spawn `finance-sim`** ONLY IF the quest needs new math — check the curriculum mapping in PRD §7.

8. **Run** `pnpm content:compile && pnpm i18n:check && pnpm test --filter content`.

9. **Summarise** the result to the user with the pillars satisfied and the path to the new files.
