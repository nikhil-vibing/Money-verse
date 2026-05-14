export interface FdParams {
  readonly principal: number;
  readonly annualRate: number;
  readonly tenureMonths: number;
  readonly compoundsPerYear?: number;
}

export function fdMaturity({
  principal,
  annualRate,
  tenureMonths,
  compoundsPerYear = 4,
}: FdParams): number {
  if (principal < 0 || annualRate < 0 || tenureMonths < 0 || compoundsPerYear <= 0) {
    throw new RangeError("fdMaturity: invalid inputs");
  }
  const years = tenureMonths / 12;
  const r = annualRate / compoundsPerYear;
  const n = compoundsPerYear * years;
  return principal * (1 + r) ** n;
}

export interface RdParams {
  readonly monthly: number;
  readonly annualRate: number;
  readonly months: number;
}

/**
 * Recurring deposit maturity — quarterly compounding per RBI convention.
 */
export function rdMaturity({ monthly, annualRate, months }: RdParams): number {
  if (monthly < 0 || annualRate < 0 || months < 0) {
    throw new RangeError("rdMaturity: invalid inputs");
  }
  const r = annualRate / 4;
  let maturity = 0;
  for (let m = 1; m <= months; m += 1) {
    const remainingQuarters = (months - m + 1) / 3;
    maturity += monthly * (1 + r) ** remainingQuarters;
  }
  return maturity;
}
