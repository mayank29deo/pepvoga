// ── Demo mode ────────────────────────────────────────────────────────────
// When ON, the app bypasses auth so the whole platform (book, onboard, owner
// portal, admin) can be shown end-to-end WITHOUT logging in. All the real auth
// code stays in place — set NEXT_PUBLIC_DEMO_MODE="false" to require login again
// when the platform goes live.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

// Seeded identities the demo "acts as" for each area.
export const DEMO_EMAILS = {
  USER: "traveler@pepvoga.com",
  OWNER: "dive@pepvoga.com",
  ADMIN: "admin@pepvoga.com",
} as const;
