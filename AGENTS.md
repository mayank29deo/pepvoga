<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# pepvoga — project context

Adventure marketplace for **stays + experiences** (book vetted operators). See `README.md` for the full overview and run steps.

## Run it
- Local DB: `npm run db:local` (embedded Postgres on :5433 — keep running). First time: `npm run db:migrate` + `npm run db:seed`.
- App: `npm run dev` (:3000). Production DB is **Supabase** — swap `DATABASE_URL`/`DIRECT_URL` in `.env`, then `npm run db:deploy`.
- Seeded admin: `admin@pepvoga.com` / `admin1234`. Owners: `dive@pepvoga.com` etc / `owner1234`. Traveller: `traveler@pepvoga.com` / `traveler1234`.

## Conventions (important — this stack is current, not your training data)
- **Prisma 7**: generator is `prisma-client` → output `src/generated/prisma`; import `{ PrismaClient, Prisma }` from `@/generated/prisma/client`. Connection URLs live in `prisma.config.ts` (CLI) and the runtime client uses a **driver adapter** (`src/lib/db.ts`) — NOT `url` in `schema.prisma`.
- **Auth.js v5** in `src/auth.ts` (credentials + JWT). Guard pages with `requireUser` / `requireRole` from `src/lib/session.ts` (page-level, no edge middleware).
- **Tailwind v4**: design tokens are CSS `@theme` vars in `src/app/globals.css` (e.g. `bg-bg`, `text-ink`, `font-display`). No `tailwind.config`.
- Read queries → `src/lib/data/*`. Mutations → `src/lib/actions/*` (server actions). Brand content/copy → `src/lib/content.ts`.
- Money is stored in **minor units** (`priceCents`, `totalCents`). Dates for availability/bookings are **UTC midnight** — use `dateOnlyUTC`/`addDaysUTC`/`fmtDate` from `src/lib/utils.ts`.
- Moderation: public listings require `owner.status === "APPROVED"` AND `listing.status === "PUBLISHED"` (enforced in `src/lib/data/listings.ts`).
- After schema/code changes, verify with `npx tsc --noEmit` and `npm run build`.

## Status
v1 "Bookable MVP" is complete (public site, auth, owner portal, booking, reviews, admin). **Phase 2 = payments** (Razorpay India + Stripe global) — the `Payment` model and `.env.example` keys are scaffolded but inert.
