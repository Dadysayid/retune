import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const organizationSocial = pgTable('organization_social', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull(),
  socialType: text('social_type').notNull(),
  url: text('url'),
  createdAt: timestamp('created_at').defaultNow(),
  title: text('title'),
  description: text('description'),
  imageUrl: text('image_url'),
})
