import { z } from "zod";
import { District, SkillDomain } from "@dhaniverse/shared";

export const QuestSchema = z.object({
  id: z.string().min(1),
  title_key: z.string().min(1),
  district: District,
  concept: z.string().min(1),
  domain: SkillDomain,
  preconditions: z.object({
    mastery: z.array(z.object({ nodeId: z.string(), minLevel: z.number().int() })).default([]),
    completedQuests: z.array(z.string()).default([]),
  }),
  rewards: z.object({
    masteryNodeId: z.string(),
    masteryDelta: z.number().int().min(0).max(3),
    inrReward: z.number().int().nonnegative().default(0),
  }),
  estMinutes: z.number().int().min(1).max(15),
});

export type Quest = z.infer<typeof QuestSchema>;

export const NpcSchema = z.object({
  id: z.string().min(1),
  displayName_key: z.string().min(1),
  role: z.string(),
  district: District,
  voiceExamples: z.array(z.string()).min(1).max(5),
});

export type Npc = z.infer<typeof NpcSchema>;
