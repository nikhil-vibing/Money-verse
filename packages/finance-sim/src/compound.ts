export interface CompoundParams {
  readonly principal: number;
  readonly annualRate: number;
  readonly years: number;
  readonly compoundsPerYear?: number;
}

export function compoundInterest({
  principal,
  annualRate,
  years,
  compoundsPerYear = 1,
}: CompoundParams): number {
  if (principal < 0 || annualRate < 0 || years < 0 || compoundsPerYear <= 0) {
    throw new RangeError("compoundInterest: all numeric inputs must be non-negative");
  }
  const ratePerPeriod = annualRate / compoundsPerYear;
  const periods = compoundsPerYear * years;
  return principal * (1 + ratePerPeriod) ** periods;
}

export function simpleInterest({
  principal,
  annualRate,
  years,
}: Omit<CompoundParams, "compoundsPerYear">): number {
  if (principal < 0 || annualRate < 0 || years < 0) {
    throw new RangeError("simpleInterest: all numeric inputs must be non-negative");
  }
  return principal * (1 + annualRate * years);
}
