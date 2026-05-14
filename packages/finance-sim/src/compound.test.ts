import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { compoundInterest, simpleInterest } from "./compound";

describe("compoundInterest", () => {
  it("returns principal when years = 0", () => {
    expect(compoundInterest({ principal: 1000, annualRate: 0.1, years: 0 })).toBe(1000);
  });

  it("matches the textbook example", () => {
    // ₹10,000 at 10% pa compounded annually for 5 years ≈ ₹16,105.10
    const val = compoundInterest({ principal: 10_000, annualRate: 0.1, years: 5 });
    expect(val).toBeCloseTo(16_105.1, 0);
  });

  it("throws on negative inputs", () => {
    expect(() => compoundInterest({ principal: -1, annualRate: 0.1, years: 1 })).toThrow();
    expect(() => compoundInterest({ principal: 100, annualRate: -0.1, years: 1 })).toThrow();
  });

  it("property: compound ≥ simple for positive rate and time > 0", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1_000_000, noNaN: true }),
        fc.double({ min: 0.001, max: 0.5, noNaN: true }),
        fc.integer({ min: 1, max: 30 }),
        (p, r, y) => {
          const c = compoundInterest({ principal: p, annualRate: r, years: y });
          const s = simpleInterest({ principal: p, annualRate: r, years: y });
          return c >= s - 1e-6;
        },
      ),
    );
  });
});
