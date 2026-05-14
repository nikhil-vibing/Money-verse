/**
 * Indian finance constants. Each constant has a `since` and `note` field.
 * Adding a new constant requires citing the source (IT Act section, EPFO
 * circular, RBI release, etc.).
 */

export const INR_PAISE_PER_RUPEE = 100;

export const EPF_EMPLOYEE_RATE = 0.12;
export const EPF_EMPLOYER_RATE_TOTAL = 0.12;
export const EPS_RATE_OF_EMPLOYER_SHARE = 0.0833;

export const PPF_INTEREST_RATE_FY_2025_26 = 0.071;
export const PPF_MAX_ANNUAL_INR = 150_000;
export const PPF_TENURE_YEARS = 15;

export const SECTION_80C_LIMIT_INR = 150_000;
export const SECTION_80D_SELF_LIMIT_INR = 25_000;
export const SECTION_80D_SENIOR_LIMIT_INR = 50_000;

export interface TaxSlab {
  readonly upTo: number;
  readonly rate: number;
}

export const TAX_OLD_REGIME_FY_2025_26: readonly TaxSlab[] = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

export const TAX_NEW_REGIME_FY_2025_26: readonly TaxSlab[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

export const CESS_RATE = 0.04;

export const CONSTANTS_META = {
  since: "FY 2025-26",
  reviewed: "2026-05-14",
  notes:
    "Tax slabs reflect post-Budget-2025 schedule; verify before each Indian fiscal year start.",
} as const;
