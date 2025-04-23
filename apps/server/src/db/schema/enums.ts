import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role_enum', ['member']) // ← ajoute + si nécessaire
export const subscriptionStatus = pgEnum('subscription_status', ['active', 'trialing', 'canceled']) // adapte à tes valeurs réelles
