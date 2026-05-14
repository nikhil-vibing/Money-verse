import { z } from "zod";

export const SkillDomain = z.enum([
  "budgeting",
  "banking",
  "income",
  "investing",
  "insurance",
  "entrepreneurship",
  "retirement",
]);
export type SkillDomain = z.infer<typeof SkillDomain>;

export const District = z.enum([
  "chawl-mohalla",
  "bank-bazaar",
  "karyalaya-park",
  "niveshak-chowk",
  "rakshak-lane",
  "vyapaar-mandi",
  "bhavishya-ghat",
]);
export type District = z.infer<typeof District>;

export const MasteryLevel = z.number().int().min(0).max(3);
export type MasteryLevel = z.infer<typeof MasteryLevel>;

export const Inr = z.number().int().nonnegative();
export type Inr = z.infer<typeof Inr>;
