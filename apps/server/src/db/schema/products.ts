import { pgTable, text, boolean, jsonb } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  active: boolean('active'),
  name: text('name'),
  description: text('description'),
  image: text('image'),
  metadata: jsonb('metadata'),
})
