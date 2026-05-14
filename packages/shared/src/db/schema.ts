import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  handle: text("handle").notNull().unique(),
  locale: text("locale").notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  flags: jsonb("flags").$type<Record<string, unknown>>().notNull().default({}),
});

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  districtProgress: jsonb("district_progress")
    .$type<Record<string, number>>()
    .notNull()
    .default({}),
  assistModeFlags: jsonb("assist_mode_flags")
    .$type<Record<string, boolean>>()
    .notNull()
    .default({}),
});

export const wallets = pgTable("wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  inrCash: integer("inr_cash").notNull().default(0),
  lastSyncedAt: timestamp("last_synced_at").notNull().defaultNow(),
});

export const masteryNodes = pgTable(
  "mastery_nodes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nodeId: text("node_id").notNull(),
    level: integer("level").notNull().default(0),
    lastReviewedAt: timestamp("last_reviewed_at"),
    nextReviewAt: timestamp("next_review_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.nodeId] })],
);

export const questsState = pgTable(
  "quests_state",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questId: text("quest_id").notNull(),
    state: text("state", { enum: ["available", "active", "done"] }).notNull(),
    step: integer("step").notNull().default(0),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.questId] }),
    index("idx_quests_state_active")
      .on(t.userId)
      .where(sql`${t.state} = 'active'`),
  ],
);

export const streaks = pgTable("streaks", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  currentLen: integer("current_len").notNull().default(0),
  longestLen: integer("longest_len").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  freezesRemaining: integer("freezes_remaining").notNull().default(2),
});

export const aiUsage = pgTable(
  "ai_usage",
  {
    userId: text("user_id").notNull(),
    day: date("day").notNull(),
    tokensIn: integer("tokens_in").notNull().default(0),
    tokensOut: integer("tokens_out").notNull().default(0),
    costEstimateUsdMicro: integer("cost_estimate_usd_micro").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.day] }),
    uniqueIndex("uq_ai_usage_user_day").on(t.userId, t.day),
  ],
);

export const friendCodes = pgTable("friend_codes", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const apartments = pgTable("apartments", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  layout: jsonb("layout").$type<Record<string, unknown>>().notNull().default({}),
  isPublic: boolean("is_public").notNull().default(false),
  lastPublishedAt: timestamp("last_published_at"),
});
