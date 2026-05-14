---
description: Verify the current changes respect the 10 PRD pillars. Fail loudly if any pillar is violated.
allowed-tools: [Read, Bash]
---

# /pillar-check — PRD §4 pillar enforcement

Read `docs/PRD.md` §4. Then `git diff` the current branch vs base.

For each pillar (1-10), decide:
- Does the change touch this pillar? (yes/no)
- If yes, does the change satisfy it? (yes/no/unclear)

Report a table. Any "no" is a blocker — explain why and propose the smallest change to make it green. "Unclear" prompts a question to the user.
