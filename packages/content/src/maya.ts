import { z } from "zod";
import { District } from "@money-verse/shared";

/**
 * Cost guardrails — kept here so tests and the runtime agree on the cap.
 * 220 tokens × 12 responses ≈ 2,640 tokens / player / session, well under
 * the daily $X-per-user envelope defined in docs/PRD.md §10.
 */
export const MAYA_MAX_TOKENS_HARD_CEILING = 300;
export const MAYA_MAX_RESPONSES_HARD_CEILING = 20;

const InGameCitationPattern = z
  .string()
  .regex(
    /^(in-game-quest:|in-game-npc:|glossary:)<.+>$|^(in-game-quest|in-game-npc|glossary):[a-z0-9-]+$/,
    "citation source must be in-game (quest/npc/glossary)",
  );

export const MayaCitationRequirementSchema = z.object({
  factual_claims_require_citation: z.literal(true),
  allowed_citation_sources: z.array(InGameCitationPattern).min(1),
  deny_external_citations: z.literal(true),
});

export const MayaScopeSchema = z.object({
  district: District,
  allowed_concepts: z.array(z.string().min(1)).min(1),
  out_of_scope_concepts: z.array(z.string().min(1)).min(1),
  system_prompt_fragment: z.string().min(1),
  refusal_redirects: z.record(z.string().min(1), z.string().min(1)),
  deny_phrases: z.array(z.string().min(1)).min(1),
  max_tokens_per_response: z
    .number()
    .int()
    .positive()
    .max(MAYA_MAX_TOKENS_HARD_CEILING),
  max_responses_per_session: z
    .number()
    .int()
    .positive()
    .max(MAYA_MAX_RESPONSES_HARD_CEILING),
  fallback_yarn_node: z.string().min(1),
  citation_requirement: MayaCitationRequirementSchema,
  tone_examples: z.array(z.string().min(1)).min(1),
});

export type MayaScope = z.infer<typeof MayaScopeSchema>;
