// Local development Postgres via embedded-postgres (real Postgres 18, no Docker).
// Starts a server on :5433 and keeps it alive. Swap for Supabase in production.
import { existsSync } from "node:fs";
import EmbeddedPostgresDefault from "embedded-postgres";

const EmbeddedPostgres = EmbeddedPostgresDefault.default ?? EmbeddedPostgresDefault;

const DATA_DIR = "./.pgdata";
const PORT = 5433;

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: "postgres",
  password: "postgres",
  port: PORT,
  persistent: true,
});

if (!existsSync(DATA_DIR)) {
  console.log("initialising postgres data dir…");
  await pg.initialise();
}

await pg.start();

try {
  await pg.createDatabase("pepvoga");
  console.log("created database pepvoga");
} catch {
  console.log("database pepvoga already exists (ok)");
}

console.log(`LOCAL_PG_READY postgresql://postgres:postgres@localhost:${PORT}/pepvoga`);

const shutdown = async () => {
  try {
    await pg.stop();
  } catch {
    /* ignore */
  }
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Keep the process (and the Postgres child) alive.
await new Promise(() => {});
