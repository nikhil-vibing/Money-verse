# Chawl Mohalla — i18n Audit Report

**Auditor:** `i18n-curator` agent
**Date:** 2026-05-14
**Locale scope:** `en` (base) + `hi` (Indian-Hindi, Mumbai chawl register)
**Verifier:** `pnpm i18n:check` — exit 0 (green)

> Owns the contract specified in [ARCHITECTURE.md §11](../ARCHITECTURE.md) and PRD pillar #9 (Indian context first, bilingual EN+HI). The pipeline today checks **JSON key parity** between locales; Yarn dialog parity is out of scope until a later phase (see [dialog-pending stub](../../packages/content/i18n/hi/dialog-pending.md)).

---

## 1. Coverage table

| Namespace | `en` keys | `hi` keys | Parity | Status |
|---|---|---|---|---|
| `quests.json` | 12 | 12 | ✓ | Complete |
| `npcs.json` | 10 | 10 | ✓ | Complete (2 placeholders filled) |
| `districts.json` | 15 | 15 | ✓ | Complete (new file created this pass) |
| **TOTAL** | **37** | **37** | **✓** | `pnpm i18n:check` exit 0 |

### What was checked

1. **Quests.** All six Chawl Mohalla quests (`first-budget`, `needs-and-wants`, `rent-day`, `chai-receipt`, `emergency-seed`, `graduation`) declare `title_key` values that exist in both `en/quests.json` and `hi/quests.json`. The 12 keys (6 titles + 6 subtitles) are present and translated.
2. **NPCs.** All ten Chawl Mohalla NPCs (`maya-didi`, `bhola-seth`, `ravi-anna`, `sushila-aunty`, `aarav`, `lakshmi-dabbawala`, `dipu-kaka`, `maa-on-phone`, `the-postman`, `biscuit`) declare a `displayName_key` that exists in both locales. The two `[HI_PENDING]` placeholders for `the-postman` and `biscuit` have been filled.
3. **District + landmarks.** The map meta (`packages/content/maps/chawl-mohalla.meta.json`) references one district key and fourteen landmark keys. `en/districts.json` and `hi/districts.json` did not previously exist; both created this pass with all 15 keys.
4. **Maya scope manifest.** `packages/content/maya/chawl-mohalla.json` `tone_examples` array — confirmed *not* user-facing. These are prompt-engineering inputs for the LLM (system-prompt context) and stay English-only by design. No translation needed.
5. **Yarn dialogs.** Confirmed monolingual EN by spec. Not translated this pass. Pending-queue stubbed at `packages/content/i18n/hi/dialog-pending.md`.

---

## 2. Hindi quality notes per string

Quality tiers used:
- **A** — Native register, idiomatic, no concerns.
- **B** — Acceptable; minor stylistic call a human translator might tweak.
- **C** — Flag for human pass; meaning is right but register or word-choice is debatable.

### `hi/quests.json`

| Key | Hindi | Tier | Note |
|---|---|---|---|
| `quest.first-budget.title` | आपका पहला लिफ़ाफ़ा | A | Nuqta on लिफ़ाफ़ा correct; matches the chawl register. |
| `quest.first-budget.subtitle` | तीन लिफ़ाफ़े, एक तनख्वाह। | A | Persianized तनख्वाह is exactly the working-class word. |
| `quest.needs-and-wants.title` | दो कॉलम, हर रुपया | A | कॉलम Hinglish loan; natural. |
| `quest.needs-and-wants.subtitle` | खर्च से पहले छाँट लो। | A | Imperative-familiar form fits a same-age inner voice. |
| `quest.rent-day.title` | किराए का दिन | A | Idiomatic. |
| `quest.rent-day.subtitle` | माँगने से पहले दे दो। | A | Pillar #6 forgiveness register; matches. |
| `quest.chai-receipt.title` | रवि अन्ना की कॉपी | A | कॉपी = notebook in Indian English/Hindi colloquial. |
| `quest.chai-receipt.subtitle` | छोटे रिसाव, सात दिन। | B | रिसाव (leak) is slightly metaphorical; a human translator might prefer छोटे-छोटे खर्चे, सात दिन for warmth. Keeping as-is — the metaphor is on-brand. |
| `quest.emergency-seed.title` | मिट्टी का गुल्लक | A | गुल्लक is *the* clay-piggy-bank word. Perfect. |
| `quest.emergency-seed.subtitle` | पहले ₹500 पर ताला। | A | ₹ used correctly; pithy. |
| `quest.graduation.title` | सड़क के उस पार | A | Direct, evocative. |
| `quest.graduation.subtitle` | लिफ़ाफ़ों से बैंक तक। | A | बैंक is the universal Indian loan; no need for any "Persianized" alt. |

### `hi/npcs.json`

| Key | Hindi | Tier | Note |
|---|---|---|---|
| `npc.maya-didi.displayName` | माया दीदी | A | Universal. |
| `npc.bhola-seth.displayName` | भोला सेठ | A | Universal. |
| `npc.ravi-anna.displayName` | रवि अन्ना | A | Tamil honorific preserved. |
| `npc.sushila-aunty.displayName` | सुशीला आंटी | A | "आंटी" is the spoken word, not the textbook "मौसी"; correct. |
| `npc.aarav.displayName` | आरव | A | Standard. |
| `npc.lakshmi-dabbawala.displayName` | लक्ष्मी डब्बावाली | A | Feminine -वाली ending matches the NPC role. |
| `npc.dipu-kaka.displayName` | दीपू काका | A | काका is the Marathi-flavoured uncle — perfect for chawl. |
| `npc.maa-on-phone.displayName` | माँ (फ़ोन पर) | A | Chandrabindu correct on माँ; nuqta on फ़ोन correct. |
| `npc.the-postman.displayName` | डाकिया जी | A | **Filled this pass.** Respectful "जी" particle matches the calm-bureaucratic NPC role. |
| `npc.biscuit.displayName` | बिस्किट | A | **Filled this pass.** Transliteration is the correct call for a dog's name. |

### `hi/districts.json` (new this pass)

| Key | Hindi | Tier | Note |
|---|---|---|---|
| `district.chawl-mohalla.displayName` | चॉल मोहल्ला | A | Both words are loanwords (English chawl + Persianized mohalla); Devanagari rendering is the standard one. |
| `landmark.mayas-room` | माया का कमरा | A | Generic कमरा acceptable here since it's Maya's private space, not a kholi. |
| `landmark.bhola-office` | भोला सेठ का दफ़्तर | A | दफ़्तर (Persianized) > कार्यालय (Sanskritised) for the seedy-lender register. Nuqta correct. |
| `landmark.chai-stall` | रवि अन्ना की चाय टपरी | B | टपरी is Mumbai-Marathi slang for chai stall. Strong fit for chawl. Alternative: चाय की दुकान (more neutral). Human translator should confirm टपरी doesn't read as too-regional. |
| `landmark.kirana-shop` | सुशीला आंटी की किराने की दुकान | A | किराने की दुकान is exactly right. |
| `landmark.aaravs-room` | आरव की खोली | A | खोली = chawl-room (Marathi-Hindi loan). Used consistently across landmarks for chawl rooms. |
| `landmark.dipus-room` | दीपू काका की खोली | A | Same as above. |
| `landmark.player-kholi` | आपकी खोली | A | "आपकी" (respectful 2nd-person) matches NPC dialog register where they address the player. |
| `landmark.courtyard` | आँगन | A | Standard. |
| `landmark.rooftop` | छत | A | Standard. |
| `landmark.building-entrance` | इमारत का दरवाज़ा | A | Nuqta on दरवाज़ा correct. |
| `landmark.street` | बड़ी सड़क | B | "मुख्य सड़क" is textbook; "बड़ी सड़क" is spoken. Human translator may prefer just सड़क or बाहरी सड़क. |
| `landmark.dabbawala-route` | डब्बावाला रास्ता | A | Direct. |
| `landmark.phone-line` | फ़ोन पर | A | Matches existing `maa-on-phone` displayName phrasing for consistency. |
| `landmark.alley` | गली | A | Standard. |

**Strings flagged for human pass (tier B):** 3 — `quest.chai-receipt.subtitle`, `landmark.chai-stall`, `landmark.street`. None block shipping; all are register-preference calls.

---

## 3. Yarn dialog status (out of scope this audit)

See **[`packages/content/i18n/hi/dialog-pending.md`](../../packages/content/i18n/hi/dialog-pending.md)** — created this pass.

Summary of EN dialog corpus:
- 6 yarn files, ~120 dialog lines, ~2,121 words total.
- All character voices preserved in EN-only form; deliberate decision per agent brief.
- Translation pipeline NOT extended to `.yarn` yet — pending the post-launch i18n phase.

---

## 4. Maya scope manifest — confirmation of non-translatable strings

File: `packages/content/maya/chawl-mohalla.json`

| Field | Player-facing? | Translate? |
|---|---|---|
| `allowed_concepts`, `out_of_scope_concepts` | No (LLM input) | ✗ Stays English |
| `system_prompt_fragment` | No (LLM prompt) | ✗ Stays English (LLM produces Hindi/Hinglish output regardless of system-prompt language; verified pattern across Llama 3.3 / Qwen 2.5) |
| `refusal_redirects` | **Yes — Maya speaks these** | ⚠ **Currently English-only.** These need a Hindi pass before HI players see Maya AI. NOT done this audit because the AI tutor isn't wired yet, but flagging for the next i18n cycle. |
| `deny_phrases` | No (filter input) | ✗ Stays English (brand names are roman regardless) |
| `tone_examples` | No (LLM in-context examples) | ✗ Stays English |
| `fallback_yarn_node` | No (Yarn node ref) | ✗ Stays English |
| `citation_requirement.allowed_citation_sources` | No (programmatic IDs) | ✗ Stays English |

**Action item parked:** when Maya AI launches, audit `refusal_redirects` for Hindi. Not blocking for Chawl Mohalla's static-content launch.

---

## 5. Gaps closed this pass

1. ✓ Filled `[HI_PENDING]` placeholders for `the-postman` (`डाकिया जी`) and `biscuit` (`बिस्किट`).
2. ✓ Created `packages/content/i18n/en/districts.json` with 15 keys (1 district + 14 landmarks).
3. ✓ Created `packages/content/i18n/hi/districts.json` with 15 matching translated keys.
4. ✓ Stubbed `packages/content/i18n/hi/dialog-pending.md` with the human-translator queue for Yarn dialogs.
5. ✓ `pnpm i18n:check` passes (exit 0).

---

## 6. Gaps remaining

| Item | Severity | Owner | Notes |
|---|---|---|---|
| 3 strings flagged tier B for register-tuning | LOW | human-translator | Optional polish, not blocking. |
| Yarn dialogs (6 quests, ~2,121 words) need Hindi pass | HIGH (for HI launch) | human-translator | Tracked in `hi/dialog-pending.md`. Pipeline doesn't enforce yet. |
| Maya AI `refusal_redirects` need Hindi when AI tutor goes live | MEDIUM | i18n-curator (next cycle) | Tutor not in v1 launch path of Chawl Mohalla static content. |
| `i18n:check` script does not yet detect orphaned `_key` references in source JSON/yarn (i.e., a quest referencing a `title_key` not present in locales) | MEDIUM | infra | Extend script in a follow-up. Today the audit relied on manual cross-check; works at 6-quest scale, fragile at 40+. |
| Devanagari font fallback chain in `apps/web` CSS not yet verified | LOW (separate audit) | a11y-reviewer | Per agent brief, hand off after touching UI surfaces — not applicable this pass since no UI was touched. |

---

## 7. Recommended next steps for the human-translator queue

**Prioritised (1 = first):**

1. **Yarn pass for `first-budget`** — it's the onboarding quest. Highest impact for HI day-1 activation. ~391 words.
2. **Yarn pass for `rent-day`** — Bhola seth's predatory register is the hardest to localise well. Get a senior reviewer on this one.
3. **Yarn pass for the remaining four quests** — straightforward once the chawl-register glossary is established from quests #1 and #3.
4. **Tier-B string polish** — `landmark.chai-stall` (टपरी vs दुकान), `landmark.street` (बड़ी vs मुख्य), `quest.chai-receipt.subtitle` (रिसाव vs खर्चे).
5. **Maya AI `refusal_redirects` Hindi authoring** — defer until AI tutor lands.
6. **Extend `i18n-check.mjs`** to scan all JSON content (`packages/content/quests/*.json`, `packages/content/npcs/*.json`, `packages/content/maps/*.meta.json`) for `*_key` properties and assert each value exists in every locale file. Today the check is structural (key-parity between en/hi) but not referential (does the key actually get used?).

---

## Verification commands

```bash
# All audits pass at the time of this report:
pnpm i18n:check          # exit 0
# Manual cross-checks:
grep -r '_key' packages/content/quests/*.json packages/content/npcs/*.json packages/content/maps/*.meta.json
# Devanagari sanity: open hi/*.json in a Devanagari-aware editor and verify nuqta rendering
```
