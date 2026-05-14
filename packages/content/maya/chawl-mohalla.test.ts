import { describe, expect, it } from "vitest";
import {
  MAYA_MAX_RESPONSES_HARD_CEILING,
  MAYA_MAX_TOKENS_HARD_CEILING,
  MayaScopeSchema,
} from "../src/maya";
import scopeJson from "./chawl-mohalla.json" with { type: "json" };

describe("chawl-mohalla Maya scope manifest", () => {
  it("matches the MayaScopeSchema", () => {
    const result = MayaScopeSchema.safeParse(scopeJson);

    if (!result.success) {
      // Surface zod errors so a failing CI run is debuggable.
      throw new Error(
        `MayaScopeSchema parse failed: ${JSON.stringify(result.error.format(), null, 2)}`,
      );
    }

    expect(result.success).toBe(true);
  });

  it("declares at least 6 allowed concepts (one per quest, with headroom)", () => {
    const scope = MayaScopeSchema.parse(scopeJson);
    expect(scope.allowed_concepts.length).toBeGreaterThanOrEqual(6);
  });

  it("denies known real Indian brokers and risky-return phrases", () => {
    const scope = MayaScopeSchema.parse(scopeJson);
    const required = ["Zerodha", "Groww", "guaranteed returns"];

    for (const phrase of required) {
      expect(scope.deny_phrases).toContain(phrase);
    }
  });

  it("has a non-empty system prompt that never contains its own deny_phrases", () => {
    const scope = MayaScopeSchema.parse(scopeJson);

    expect(scope.system_prompt_fragment.trim().length).toBeGreaterThan(0);

    // Use word-boundary matching so a short brand like "Cred" doesn't
    // false-match "credit scores" — mirrors how the runtime output filter
    // should be implemented.
    const escapeRegex = (s: string): string =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    for (const phrase of scope.deny_phrases) {
      const pattern = new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i");
      expect(pattern.test(scope.system_prompt_fragment)).toBe(false);
    }
  });

  it("stays inside the per-response and per-session cost ceilings", () => {
    const scope = MayaScopeSchema.parse(scopeJson);

    expect(scope.max_tokens_per_response).toBeLessThanOrEqual(
      MAYA_MAX_TOKENS_HARD_CEILING,
    );
    expect(scope.max_responses_per_session).toBeLessThanOrEqual(
      MAYA_MAX_RESPONSES_HARD_CEILING,
    );
  });

  it("targets the chawl-mohalla district", () => {
    const scope = MayaScopeSchema.parse(scopeJson);
    expect(scope.district).toBe("chawl-mohalla");
  });

  it("requires in-game citations and forbids external ones", () => {
    const scope = MayaScopeSchema.parse(scopeJson);

    expect(scope.citation_requirement.factual_claims_require_citation).toBe(
      true,
    );
    expect(scope.citation_requirement.deny_external_citations).toBe(true);
    expect(
      scope.citation_requirement.allowed_citation_sources.length,
    ).toBeGreaterThan(0);
  });
});
