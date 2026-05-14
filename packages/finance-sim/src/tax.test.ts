import { describe, expect, it } from "vitest";
import { taxOldRegime, taxNewRegime } from "./tax";

describe("taxOldRegime FY 2025-26", () => {
  it("zero income → zero tax", () => {
    expect(taxOldRegime(0).totalTax).toBe(0);
  });

  it("₹2.5L → zero tax", () => {
    expect(taxOldRegime(250_000).totalTax).toBe(0);
  });

  it("₹10L with no deductions", () => {
    // (250k * 0%) + (250k * 5%) + (500k * 20%) = 12.5k + 100k = 112.5k slab; cess 4%
    const r = taxOldRegime(1_000_000);
    expect(r.slabTax).toBeCloseTo(112_500);
    expect(r.cess).toBeCloseTo(4_500);
    expect(r.totalTax).toBeCloseTo(117_000);
  });

  it("deductions reduce taxable income", () => {
    const noDed = taxOldRegime(800_000).totalTax;
    const withDed = taxOldRegime(800_000, 150_000).totalTax;
    expect(withDed).toBeLessThan(noDed);
  });
});

describe("taxNewRegime FY 2025-26", () => {
  it("₹4L threshold → zero tax", () => {
    expect(taxNewRegime(400_000).totalTax).toBe(0);
  });

  it("₹12L", () => {
    // 0 + 400k*5% + 400k*10% = 20k + 40k = 60k; cess 4%
    const r = taxNewRegime(1_200_000);
    expect(r.slabTax).toBeCloseTo(60_000);
    expect(r.totalTax).toBeCloseTo(62_400);
  });
});
