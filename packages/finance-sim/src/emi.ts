export interface EmiParams {
  readonly principal: number;
  readonly annualRate: number;
  readonly tenureMonths: number;
}

export function emi({ principal, annualRate, tenureMonths }: EmiParams): number {
  if (principal < 0 || annualRate < 0 || tenureMonths <= 0) {
    throw new RangeError("emi: invalid inputs");
  }
  if (annualRate === 0) return principal / tenureMonths;
  const r = annualRate / 12;
  return (principal * r * (1 + r) ** tenureMonths) / ((1 + r) ** tenureMonths - 1);
}

export interface EmiScheduleRow {
  readonly month: number;
  readonly emiInr: number;
  readonly principalPaid: number;
  readonly interestPaid: number;
  readonly outstanding: number;
}

export function emiSchedule(params: EmiParams): readonly EmiScheduleRow[] {
  const { principal, annualRate, tenureMonths } = params;
  const r = annualRate / 12;
  const monthlyEmi = emi(params);
  const rows: EmiScheduleRow[] = [];
  let outstanding = principal;
  for (let m = 1; m <= tenureMonths; m += 1) {
    const interest = outstanding * r;
    const principalPaid = monthlyEmi - interest;
    outstanding = Math.max(0, outstanding - principalPaid);
    rows.push({
      month: m,
      emiInr: monthlyEmi,
      principalPaid,
      interestPaid: interest,
      outstanding,
    });
  }
  return rows;
}
