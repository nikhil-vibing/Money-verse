import {
  CESS_RATE,
  TAX_NEW_REGIME_FY_2025_26,
  TAX_OLD_REGIME_FY_2025_26,
  type TaxSlab,
} from "@money-verse/shared/constants";

export interface TaxBreakdown {
  readonly slabTax: number;
  readonly cess: number;
  readonly totalTax: number;
  readonly effectiveRate: number;
}

function slabTaxImpl(
  taxable: number,
  slabs: readonly TaxSlab[],
): TaxBreakdown {
  if (taxable < 0) throw new RangeError("tax: taxable income must be non-negative");
  let remaining = taxable;
  let prevCap = 0;
  let slabTax = 0;
  for (const slab of slabs) {
    if (remaining <= 0) break;
    const bandWidth = slab.upTo - prevCap;
    const inBand = Math.min(remaining, bandWidth);
    slabTax += inBand * slab.rate;
    remaining -= inBand;
    prevCap = slab.upTo;
  }
  const cess = slabTax * CESS_RATE;
  const totalTax = slabTax + cess;
  const effectiveRate = taxable === 0 ? 0 : totalTax / taxable;
  return { slabTax, cess, totalTax, effectiveRate };
}

export function taxOldRegime(grossIncome: number, deductions = 0): TaxBreakdown {
  const taxable = Math.max(0, grossIncome - deductions);
  return slabTaxImpl(taxable, TAX_OLD_REGIME_FY_2025_26);
}

export function taxNewRegime(grossIncome: number): TaxBreakdown {
  return slabTaxImpl(Math.max(0, grossIncome), TAX_NEW_REGIME_FY_2025_26);
}
