import { pgTable, uuid, text, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  billingAddress: jsonb('billing_address'),
  paymentMethod: jsonb('payment_method'),
})
