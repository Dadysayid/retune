import { pgTable, uuid, text, primaryKey } from "drizzle-orm/pg-core"

export const organizationMembers = pgTable(
  "organization_members",
  {
    userId: uuid("user_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    role: text("role"),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.organizationId), // ✅ clé composite
  })
)
