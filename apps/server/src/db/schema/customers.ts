import { pgTable, uuid, text } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey(),
  stripeCustomerId: text('stripe_customer_id'),
})
