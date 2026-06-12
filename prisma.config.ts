import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI/migrations use the DIRECT (non-pooled) connection when available.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations use the DIRECT (non-pooled) connection. Accept our own names
    // or the ones injected by the Vercel–Supabase integration.
    url:
      process.env.DIRECT_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL,
  },
});
