import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core"
import { subscriptionStatus } from "./enums"

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  status: subscriptionStatus("status"),
  metadata: jsonb("metadata"),
  priceId: text("price_id"),
  quantity: integer("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
  }).defaultNow(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
  }).defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  cancelAt: timestamp("cancel_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),
})
