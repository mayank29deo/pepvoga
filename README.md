# pepvoga

An adventure-niche **marketplace for stays + experiences** — book vetted local operators
worldwide (scuba, surf, climb, fly, ride). Built out from a single-file HTML prototype into
a full, production-buildable Next.js application.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4**
- **Prisma 7** ORM → **PostgreSQL** (via the `@prisma/adapter-pg` driver adapter)
- **Auth.js v5** — credentials, JWT sessions, roles `USER` / `OWNER` / `ADMIN`
- **Local dev DB:** embedded Postgres 18 (no Docker needed). **Production:** Supabase.

## Getting started

Run the database and the app in two terminals:

```bash
npm install
npm run db:local      # terminal 1 — starts local Postgres on :5433 (keep running)
npm run db:migrate    # first run only — creates the schema
npm run db:seed       # first run only — loads sample owners, listings, bookings
npm run dev           # terminal 2 — app on http://localhost:3000
```

### Seeded logins

| Role      | Email                                                     | Password       |
| --------- | --------------------------------------------------------- | -------------- |
| Admin     | `admin@pepvoga.com`                                       | `admin1234`    |
| Traveller | `traveler@pepvoga.com`                                    | `traveler1234` |
| Owner     | `dive@pepvoga.com` (+ `surf@`, `climb@`, `fly@`, `camp@`) | `owner1234`    |

## What's built (v1 — "Bookable MVP")

- **Public marketplace** — home, the three Spaces (+ detail pages), browse/search/filter for
  Stays and Experiences, rich listing pages, About, Partners.
- **Accounts** — register / login / logout, role-aware navigation.
- **Travellers** — request a booking (date/slot + guests), view & cancel bookings, review
  completed trips (ratings roll up onto the listing).
- **Owners** — 5-step application → partner portal → create/edit listings → generate
  availability → manage incoming bookings (confirm / decline / complete).
- **Admin** — moderate partner applications (approve / review / reject / suspend) and listings
  (publish / suspend).
- **Moderation model** — a listing is visible to travellers only when the **owner is APPROVED**
  *and* the **listing is PUBLISHED**.

Smoke-test the core booking transaction any time with `npm run smoke`.

## Project structure

```
src/app/(site)        public marketplace (shared nav + footer)
src/app/(auth)        login / register
src/app/owner         partner portal (guarded: owners only)
src/app/admin         moderation dashboard (guarded: admins only)
src/app/account       traveller dashboard
src/lib/db.ts         Prisma client (driver adapter)
src/lib/data/*        read queries
src/lib/actions/*     server actions (auth, owner, listing, booking, review, admin)
src/lib/content.ts    brand content ported from the prototype
prisma/schema.prisma  data model
prisma/seed.ts        seed data
```

## Switching to Supabase (production)

1. Create a Supabase project and grab the connection strings (Connect → ORMs / Prisma).
2. In `.env`, set:
   - `DATABASE_URL` → **pooled** connection (port 6543), append `?pgbouncer=true&connection_limit=1`
   - `DIRECT_URL` → **direct** connection (port 5432)
   - (see `.env.example` for the exact shapes + Storage keys)
3. `npm run db:deploy` (applies migrations) then optionally `npm run db:seed`.
4. You no longer need `npm run db:local`.

## Roadmap (phase 2)

- **Payments** — Razorpay (India) + Stripe (global). The `Payment` model and env keys are
  already scaffolded; the booking flow is built to slot them in.
- **Image uploads** to Supabase Storage (owners currently paste image URLs).
- **Email** notifications for booking requests/confirmations.
- Wishlist/saved, messaging, partner analytics.
