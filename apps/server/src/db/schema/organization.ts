import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const organization = pgTable('organization', {
  id: uuid('id').defaultRandom().primaryKey(),
  website: text('website'),
  name: text('name'),
  logoUrl: text('logo_url'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
