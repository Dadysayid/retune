import * as dotenv from "dotenv"
dotenv.config()
console.log('💡 DATABASE_URL:', process.env.DATABASE_URL)


export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql", // ✅ remplace driver: 'pg'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}
