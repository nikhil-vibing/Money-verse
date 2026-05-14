# Hindi Yarn Dialog — Pending Translation Queue

**Status:** Yarn quest dialogs ship monolingual (EN) for v1 of Chawl Mohalla. The proper i18n pipeline for `.yarn` files is a later-phase deliverable.

**Scope:** This file lists every Chawl Mohalla quest whose Yarn dialog still needs a Hindi authoring pass. Translation is human-only — these are character-voice lines, not UI strings. Machine translation will flatten the register (Mumbai chawl Hinglish does not survive Google Translate).

## Queue

| Quest ID | Dialog lines | Words | Notes |
|---|---|---|---|
| `first-budget` | 24 | 391 | Maya didi voice. Lots of Hinglish already (`Khol le na`, `Theek hai`). Translator should preserve, not Devanagari-ise the loanwords (`envelope`, `Rent`, `Save`, `Spend` should likely stay roman or be transliterated as चयन terms). |
| `needs-and-wants` | 20 | 312 | Two-column sorting. Aarav voice is hype-slangy; preserve. |
| `rent-day` | 21 | 333 | Maya + Bhola seth. Bhola's voice is the predatory-lender register — keep menacing-warm. |
| `chai-receipt` | 21 | 367 | Ravi anna Tamil-flavoured Hinglish. Hard to localise — flag for native Tamil-Hindi speaker. |
| `emergency-seed` | 21 | 445 | Clay jar metaphor. Currency: ₹500 must stay as ₹500. |
| `graduation` | 13 | 273 | Maya hands player off to Bank Bazaar. Shorter quest. |

**Totals:** 6 quests · 120 dialog lines · ~2,121 words.

## Translation rules (must follow)

1. Use `₹` for currency (not `Rs.` or `रुपये` unless a character literally says the word).
2. Preserve Persianized vocab where realistic: `तनख्वाह`, `लिफ़ाफ़ा`, `दफ़्तर`, `दरवाज़ा` — use the nuqta (़) accurately.
3. Mumbai chawl register: `खोली`, not `कमरा`, when characters refer to their own room.
4. Keep Hinglish code-switching — do not over-translate. If Maya says "Three envelopes. That's it.", the Hindi pass can keep "Three envelopes" in roman or use "तीन लिफ़ाफ़े", but should NOT flatten to "तीन डाक-आवरण".
5. Never use `रोबिनहुड`, `Zerodha`, or any real brand — Maya's deny-phrase list applies in HI too.
6. Yarn `<<commands>>` (e.g., `<<wait_for_action>>`, `<<jump>>`, `<<grant_mastery>>`) MUST NOT be translated. Only the spoken lines after `npcId:`.

## Pipeline (when activated)

1. Yarn → JSON compile preserves node IDs.
2. Translator opens a `.yarn.hi.draft` alongside each `.yarn`.
3. Reviewed by a native Hindi/Hinglish speaker who lives the chawl register (Mumbai, working-class, late-20s).
4. Diff against EN source; flag any quest where line count diverges (signals dropped beats).
5. Land via PR; CI extends `i18n:check` to also enforce Yarn parity.

**Owner of this queue:** i18n-curator agent + a single human reviewer per quest.
