import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 runtime uses a driver adapter. We point node-postgres at the pooled
// connection. Accept either our own DATABASE_URL or the names injected by the
// Vercel–Supabase integration (POSTGRES_PRISMA_URL / POSTGRES_URL).
const raw =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

// Supabase's pooler presents a self-signed cert chain. Strip any sslmode from
// the URL and force `sslmode=no-verify` (+ the ssl option) so TLS connects with
// relaxed verification. Local Postgres has no TLS, so leave it plain.
let connectionString = raw
  ?.replace(/([?&])sslmode=[^&]*&?/gi, "$1")
  .replace(/[?&]$/, "");
const isLocal = !!connectionString && /localhost|127\.0\.0\.1/.test(connectionString);
if (connectionString && !isLocal) {
  connectionString += (connectionString.includes("?") ? "&" : "?") + "sslmode=no-verify";
}

const adapter = new PrismaPg({
  connectionString,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
