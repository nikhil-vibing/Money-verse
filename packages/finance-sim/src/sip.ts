export interface SipParams {
  readonly monthlyInr: number;
  readonly annualReturnRate: number;
  readonly months: number;
}

/**
 * Future value of a SIP — equal monthly contributions at the start of each
 * period, compounded monthly.
 */
export function sipFinalValue({
  monthlyInr,
  annualReturnRate,
  months,
}: SipParams): number {
  if (monthlyInr < 0 || annualReturnRate < 0 || months < 0) {
    throw new RangeError("sipFinalValue: inputs must be non-negative");
  }
  if (months === 0) return 0;
  const r = annualReturnRate / 12;
  if (r === 0) return monthlyInr * months;
  return monthlyInr * ((((1 + r) ** months - 1) / r) * (1 + r));
}

export function sipMonthlyForTarget({
  targetInr,
  annualReturnRate,
  months,
}: {
  readonly targetInr: number;
  readonly annualReturnRate: number;
  readonly months: number;
}): number {
  if (targetInr < 0 || annualReturnRate < 0 || months <= 0) {
    throw new RangeError("sipMonthlyForTarget: invalid inputs");
  }
  const r = annualReturnRate / 12;
  if (r === 0) return targetInr / months;
  const factor = (((1 + r) ** months - 1) / r) * (1 + r);
  return targetInr / factor;
}
