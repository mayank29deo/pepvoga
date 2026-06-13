-- ════════════════════════════════════════════════════════════════════════
--  pepvoga — Supabase setup (schema + demo data)
--  Paste into the Supabase SQL editor and Run. Safe to re-run — it drops &
--  recreates the app's (demo-only) tables, then loads the demo data.
--  Demo logins:  admin@pepvoga.com / admin1234 · dive@pepvoga.com / owner1234
--                traveler@pepvoga.com / traveler1234
--  To remove the demo data later (keeping the schema):
--     TRUNCATE "reviews","bookings","availability","listings","owners",
--              "newsletter_signups" CASCADE;
--     DELETE FROM "users" WHERE email LIKE '%@pepvoga.com';
-- ════════════════════════════════════════════════════════════════════════

-- ──────────── CLEAN SLATE (drops the app's demo tables only) ─────────────
DROP TABLE IF EXISTS "payments","reviews","bookings","availability","saved_listings","listings","owners","sessions","accounts","verification_tokens","newsletter_signups","users" CASCADE;
DROP TYPE IF EXISTS "Role","Space","ListingType","ListingStatus","OwnerStatus","PriceUnit","BookingStatus","PaymentStatus","ExperienceLevel" CASCADE;

-- ─────────────────────────────── ENUMS ──────────────────────────────────
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER', 'ADMIN');
CREATE TYPE "Space" AS ENUM ('WILDERNESS', 'OCEAN', 'URBAN');
CREATE TYPE "ListingType" AS ENUM ('STAY', 'EXPERIENCE');
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "OwnerStatus" AS ENUM ('PENDING', 'REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "PriceUnit" AS ENUM ('PER_NIGHT', 'PER_PERSON', 'PER_SESSION', 'PER_DAY', 'PER_GROUP');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'COMPLETED', 'EXPIRED');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PROCESSING', 'PAID', 'REFUNDED', 'FAILED');
CREATE TYPE "ExperienceLevel" AS ENUM ('ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- ─────────────────────────────── TABLES ─────────────────────────────────
CREATE TABLE "users" (
    "id" TEXT NOT NULL, "name" TEXT, "email" TEXT NOT NULL, "emailVerified" TIMESTAMP(3),
    "image" TEXT, "hashedPassword" TEXT, "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL, "refresh_token" TEXT, "access_token" TEXT, "expires_at" INTEGER,
    "token_type" TEXT, "scope" TEXT, "id_token" TEXT, "session_state" TEXT,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL, "sessionToken" TEXT NOT NULL, "userId" TEXT NOT NULL, "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL, "token" TEXT NOT NULL, "expires" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "owners" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "businessName" TEXT NOT NULL, "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL, "description" TEXT NOT NULL, "city" TEXT NOT NULL, "country" TEXT NOT NULL,
    "website" TEXT, "instagram" TEXT, "yearEstablished" INTEGER, "staffCount" INTEGER, "certifications" TEXT,
    "languages" TEXT, "targetLevel" TEXT, "services" TEXT[], "maxGroupSize" TEXT, "priceRange" TEXT,
    "seasons" TEXT, "leadTime" TEXT, "contactEmail" TEXT NOT NULL, "contactPhone" TEXT, "extraNotes" TEXT,
    "logoUrl" TEXT, "status" "OwnerStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "listings" (
    "id" TEXT NOT NULL, "ownerId" TEXT NOT NULL, "type" "ListingType" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT', "title" TEXT NOT NULL, "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL, "description" TEXT NOT NULL, "space" "Space" NOT NULL, "sport" TEXT,
    "city" TEXT NOT NULL, "country" TEXT NOT NULL, "region" TEXT, "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION, "priceCents" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR',
    "priceUnit" "PriceUnit" NOT NULL, "maxGuests" INTEGER, "minNights" INTEGER DEFAULT 1,
    "maxGroupSize" INTEGER, "durationMinutes" INTEGER, "level" "ExperienceLevel" NOT NULL DEFAULT 'ALL',
    "images" TEXT[], "amenities" TEXT[], "highlights" TEXT[], "included" TEXT[],
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0, "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "availability" (
    "id" TEXT NOT NULL, "listingId" TEXT NOT NULL, "date" DATE NOT NULL, "startTime" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1, "booked" INTEGER NOT NULL DEFAULT 0,
    "priceCentsOverride" INTEGER, "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL, "code" TEXT NOT NULL, "listingId" TEXT NOT NULL, "userId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL, "startDate" TIMESTAMP(3) NOT NULL, "endDate" TIMESTAMP(3), "startTime" TEXT,
    "guests" INTEGER NOT NULL DEFAULT 1, "unitPriceCents" INTEGER NOT NULL, "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR', "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID', "guestNote" TEXT, "ownerNote" TEXT,
    "confirmedAt" TIMESTAMP(3), "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL, "listingId" TEXT NOT NULL, "userId" TEXT NOT NULL, "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL, "title" TEXT, "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "payments" (
    "id" TEXT NOT NULL, "bookingId" TEXT NOT NULL, "provider" TEXT NOT NULL, "providerOrderId" TEXT,
    "providerPaymentId" TEXT, "amountCents" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID', "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "saved_listings" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "saved_listings_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "newsletter_signups" (
    "id" TEXT NOT NULL, "email" TEXT NOT NULL, "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "newsletter_signups_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────── INDEXES ────────────────────────────────
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
CREATE UNIQUE INDEX "owners_userId_key" ON "owners"("userId");
CREATE UNIQUE INDEX "owners_slug_key" ON "owners"("slug");
CREATE INDEX "owners_status_idx" ON "owners"("status");
CREATE UNIQUE INDEX "listings_slug_key" ON "listings"("slug");
CREATE INDEX "listings_type_status_idx" ON "listings"("type", "status");
CREATE INDEX "listings_space_idx" ON "listings"("space");
CREATE INDEX "listings_city_idx" ON "listings"("city");
CREATE INDEX "listings_featured_idx" ON "listings"("featured");
CREATE INDEX "availability_listingId_date_idx" ON "availability"("listingId", "date");
CREATE UNIQUE INDEX "availability_listingId_date_startTime_key" ON "availability"("listingId", "date", "startTime");
CREATE UNIQUE INDEX "bookings_code_key" ON "bookings"("code");
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");
CREATE INDEX "bookings_ownerId_idx" ON "bookings"("ownerId");
CREATE INDEX "bookings_listingId_idx" ON "bookings"("listingId");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");
CREATE INDEX "reviews_listingId_idx" ON "reviews"("listingId");
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");
CREATE UNIQUE INDEX "saved_listings_userId_listingId_key" ON "saved_listings"("userId", "listingId");
CREATE UNIQUE INDEX "newsletter_signups_email_key" ON "newsletter_signups"("email");

-- ─────────────────────────────── FOREIGN KEYS ───────────────────────────
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "owners" ADD CONSTRAINT "owners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "listings" ADD CONSTRAINT "listings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "availability" ADD CONSTRAINT "availability_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ════════════════════════════════ DEMO DATA ════════════════════════════
-- Users (passwords: admin1234 / owner1234 / traveler1234)
INSERT INTO "users" (id, name, email, "hashedPassword", role, "createdAt", "updatedAt") VALUES
  ('u_admin',    'pepvoga Admin', 'admin@pepvoga.com',    '$2b$10$qYwBdietaRkU5xPpMwSf8.YGki4huRLt9uSKB4XFjdqAkrX.Hjize', 'ADMIN', now(), now()),
  ('u_traveler', 'Alex Rivera',   'traveler@pepvoga.com', '$2b$10$UAwoYfOgd4T35T7nT1s/6O2zOHdyxOhEw8T8H71hgpCAKPDl45bzK', 'USER',  now(), now()),
  ('u_dive',  'Marin Cole',   'dive@pepvoga.com',  '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_surf',  'Indah Putri',  'surf@pepvoga.com',  '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_climb', 'Rohan Desai',  'climb@pepvoga.com', '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_fly',   'Tenzin Norbu', 'fly@pepvoga.com',   '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_camp',  'Aisha Khan',   'camp@pepvoga.com',  '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now())
ON CONFLICT DO NOTHING;

-- Owners (all APPROVED so their listings are publicly visible)
INSERT INTO "owners" (id, "userId", "businessName", slug, category, description, city, country, website, instagram, certifications, languages, services, "contactEmail", status, "submittedAt", "reviewedAt", "createdAt", "updatedAt") VALUES
  ('o_dive','u_dive','Blue Horizon Diving','blue-horizon-diving','Dive Operator',$$Award-winning PADI 5-Star dive centre on Koh Tao with small groups and a house reef on the doorstep.$$,'Koh Tao','Thailand','https://bluehorizon.example','@bluehorizon','PADI 5-Star CDC','English, Thai',ARRAY['Open Water Courses','Advanced Courses','Reef Dives','Wreck Diving','Equipment Rental'],'dive@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_surf','u_surf','Swell Seekers Bali','swell-seekers-bali','Surf School',$$A fun, local-run surf school in Canggu turning first-timers into confident surfers.$$,'Canggu','Indonesia','https://swellseekers.example','@swellseekersbali','ISA Certified','English, Indonesian',ARRAY['Beginner Lessons','Surf Camps','Board Rental','Video Analysis'],'surf@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_climb','u_climb','Vertical Ground','vertical-ground','Climbing Gym / Guide',$$Bouldering specialists guiding climbers across Hampi's legendary granite.$$,'Hampi','India',NULL,'@verticalground','UIAA Affiliated','English, Hindi, Kannada',ARRAY['Bouldering','Sport Climbing','Multi-pitch Guiding'],'climb@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_fly','u_fly','Sky Tribe Paragliding','sky-tribe-paragliding','Adventure Operator',$$Tandem flights and P2 courses from Bir Billing, India's paragliding capital.$$,'Bir Billing','India',NULL,'@skytribe','APPI Certified','English, Hindi',ARRAY['Tandem Paragliding','Solo P2 Courses','Thermal Flights'],'fly@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_camp','u_camp','Himalaya Basecamp','himalaya-basecamp','Adventure Camp',$$A high-altitude basecamp and expedition outfit in the Kullu valley.$$,'Manali','India',NULL,'@himalayabasecamp','AMC Registered','English, Hindi',ARRAY['Multi-day Treks','Basecamp Runs','Bikepacking Nights'],'camp@pepvoga.com','APPROVED',now(),now(),now(),now())
ON CONFLICT DO NOTHING;

-- Listings (all PUBLISHED)
INSERT INTO "listings" (id,"ownerId",type,status,title,slug,summary,description,space,sport,city,country,region,"priceCents",currency,"priceUnit","maxGuests","minNights","maxGroupSize","durationMinutes",level,images,amenities,highlights,included,"ratingAvg","ratingCount",featured,"createdAt","updatedAt") VALUES
  ('l_padi','o_dive','EXPERIENCE','PUBLISHED','PADI Open Water Course — Koh Tao','padi-open-water-course-koh-tao',
   $$Become a certified diver in 3 days on the world's most popular island to learn.$$,
   $$Your gateway to the underwater world. Over three days you'll move from confined-water skills to four open-water dives on Koh Tao's vibrant reefs, guided by instructors who keep groups to four students max. All theory, equipment, and certification included.$$,
   'OCEAN','Scuba Diving','Koh Tao','Thailand','Gulf of Thailand',29900,'USD','PER_PERSON',NULL,NULL,4,1440,'BEGINNER',
   ARRAY['https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
   ARRAY[]::text[],ARRAY['Max 4 students per instructor','House reef access','Free accommodation nights'],ARRAY['All equipment','PADI certification','Theory & e-learning','4 open-water dives'],4.9,1,true,now(),now()),
  ('l_lodge','o_dive','STAY','PUBLISHED','Beachfront Dive Lodge — Koh Tao','beachfront-dive-lodge-koh-tao',
   $$Simple, sun-bleached rooms steps from the water and the dive shop.$$,
   $$A relaxed lodge built for divers — rinse tanks, dry rooms for gear, hammocks for surface intervals, and a beachfront cafe. Walk to three dive sites; fall asleep to the surf.$$,
   'OCEAN',NULL,'Koh Tao','Thailand','Gulf of Thailand',4500,'USD','PER_NIGHT',2,2,NULL,NULL,'ALL',
   ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
   ARRAY['Wi-Fi','Air conditioning','Breakfast','Dive shop on-site','Beachfront'],ARRAY[]::text[],ARRAY[]::text[],0,0,false,now(),now()),
  ('l_surf','o_surf','EXPERIENCE','PUBLISHED','5-Day Beginner Surf Camp — Canggu','5-day-beginner-surf-camp-canggu',
   $$Daily dawn sessions, video coaching, and a crew that becomes your travel family.$$,
   $$Five mornings in the water at Canggu's forgiving beach breaks, with afternoon theory, video analysis, and yoga to keep you loose. Boards, rash guards, and reef-safe sunscreen provided. Suitable for absolute beginners and improvers.$$,
   'OCEAN','Surfing','Canggu','Indonesia','Bali',35000,'USD','PER_PERSON',NULL,NULL,6,1440,'BEGINNER',
   ARRAY['https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['Dawn patrol daily','Video analysis','Small groups of 6'],ARRAY['Board & wetsuit','5 coached sessions','Daily yoga','Airport transfer'],4.7,1,true,now(),now()),
  ('l_boulder','o_climb','EXPERIENCE','PUBLISHED','Bouldering Weekend — Hampi Boulders','bouldering-weekend-hampi-boulders',
   $$Two days problem-solving on world-class granite among ancient ruins.$$,
   $$Hampi is a boulderer's dream — endless granite among a UNESCO ruin-scape. Crash pads, spotting, and beta provided for all grades. We finish each day watching the sunset from the top of a boulder field.$$,
   'WILDERNESS','Rock Climbing','Hampi','India','Karnataka',650000,'INR','PER_PERSON',NULL,NULL,8,1440,'ALL',
   ARRAY['https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['All grades welcome','Crash pads provided','Sunset sessions'],ARRAY['Crash pads & chalk','Certified guide','Transport to boulders'],0,0,false,now(),now()),
  ('l_tandem','o_fly','EXPERIENCE','PUBLISHED','Tandem Paragliding Flight — Bir Billing','tandem-paragliding-flight-bir-billing',
   $$Launch at 2,400m and soar over the Dhauladhar range with a certified pilot.$$,
   $$The classic Bir Billing tandem: a short hike to launch, then 20–30 minutes airborne over terraced valleys and monasteries with the Himalaya as your backdrop. GoPro footage available. No experience needed.$$,
   'WILDERNESS','Paragliding','Bir Billing','India','Himachal Pradesh',250000,'INR','PER_PERSON',NULL,NULL,6,30,'ALL',
   ARRAY['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['2,400m launch','Certified APPI pilots','Himalayan panorama'],ARRAY['Certified pilot','All safety gear','Launch transfer'],0,0,false,now(),now()),
  ('l_tents','o_camp','STAY','PUBLISHED','Alpine Basecamp Tents — Manali','alpine-basecamp-tents-manali',
   $$Insulated geo-domes at 2,600m with valley views and a wood-fired mess tent.$$,
   $$Sleep under the stars without giving up warmth. Our insulated dome tents come with real beds, hot-water bottles, and a shared mess tent serving hearty mountain food. The perfect launchpad for treks and rides.$$,
   'WILDERNESS',NULL,'Manali','India','Himachal Pradesh',180000,'INR','PER_NIGHT',3,1,NULL,NULL,'ALL',
   ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'],
   ARRAY['Mountain views','Wood-fired meals','Hot water','Bonfire','Parking'],ARRAY[]::text[],ARRAY[]::text[],0,0,false,now(),now()),
  ('l_bikepack','o_camp','EXPERIENCE','PUBLISHED','Manali–Leh Bikepacking Expedition (9 Days)','manali-leh-bikepacking-expedition-9-days',
   $$479 km and five high passes across the Himalaya, fully supported.$$,
   $$One of the world's great rides. Nine days from Manali to Leh over passes above 5,000m, with a support vehicle, mechanic, and chef. For fit, experienced riders ready for the adventure of a lifetime.$$,
   'WILDERNESS','Expedition Cycling','Manali','India','Himachal Pradesh',4500000,'INR','PER_PERSON',NULL,NULL,10,1440,'ADVANCED',
   ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['5 high passes','Full support vehicle','Mechanic & chef'],ARRAY['Support vehicle','All meals & camping','Mechanic','Permits'],0,0,true,now(),now())
ON CONFLICT DO NOTHING;

-- Completed bookings + reviews (so ratings render)
INSERT INTO "bookings" (id,code,"listingId","userId","ownerId","startDate","endDate","startTime",guests,"unitPriceCents","totalCents",currency,status,"paymentStatus","confirmedAt","createdAt","updatedAt") VALUES
  ('b_seed0','PV-SEED0','l_padi','u_traveler','o_dive', now() - interval '20 days', NULL, '09:00', 1, 29900, 29900, 'USD','COMPLETED','PAID', now() - interval '21 days', now(), now()),
  ('b_seed1','PV-SEED1','l_surf','u_traveler','o_surf', now() - interval '18 days', NULL, '09:00', 1, 35000, 35000, 'USD','COMPLETED','PAID', now() - interval '19 days', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO "reviews" (id,"listingId","userId","bookingId",rating,title,body,"createdAt") VALUES
  ('r_seed0','l_padi','u_traveler','b_seed0',5,'Unforgettable',$$Exactly what I hoped for — professional crew, beautiful location, and zero hassle booking through pepvoga.$$, now()),
  ('r_seed1','l_surf','u_traveler','b_seed1',5,'Unforgettable',$$Exactly what I hoped for — professional crew, beautiful location, and zero hassle booking through pepvoga.$$, now())
ON CONFLICT DO NOTHING;

INSERT INTO "newsletter_signups" (id, email, source, "createdAt") VALUES
  ('n_1','early1@example.com','seed', now()),
  ('n_2','early2@example.com','seed', now())
ON CONFLICT DO NOTHING;

-- ── Additional demo providers, stays & experiences (richer catalog) ──────
INSERT INTO "users" (id, name, email, "hashedPassword", role, "createdAt", "updatedAt") VALUES
  ('u_alps',  'Élise Laurent', 'alps@pepvoga.com',      '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_kite',  'Diego Morales', 'kite@pepvoga.com',      '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_tokyo', 'Yuki Tanaka',   'tokyo@pepvoga.com',     '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_raja',  'Sari Wijaya',   'raja@pepvoga.com',      '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now()),
  ('u_pata',  'Mateo Fuentes', 'patagonia@pepvoga.com', '$2b$10$7exAvn2.KUbuGSsBzfVtLe.viXdumeVTcUYPthlBiv7iSCQOgbh4W', 'OWNER', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO "owners" (id,"userId","businessName",slug,category,description,city,country,instagram,certifications,languages,services,"contactEmail",status,"submittedAt","reviewedAt","createdAt","updatedAt") VALUES
  ('o_alps','u_alps','Chamonix Alpine Guides','chamonix-alpine-guides','Climbing Gym / Guide',$$IFMGA-certified mountain guides for alpine climbs, ice routes and ski touring around Mont Blanc.$$,'Chamonix','France','@chamonixguides','IFMGA Guides','English, French',ARRAY['Alpine Routes','Ice Climbing','Ski Touring','Mountaineering'],'alps@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_kite','u_kite','Tarifa Kite Co.','tarifa-kite-co','Surf School',$$Kitesurfing lessons and downwinders on the wind-blessed beaches of Tarifa.$$,'Tarifa','Spain','@tarifakite','IKO Certified','English, Spanish',ARRAY['Kitesurfing Lessons','Board Rental','Downwinders'],'kite@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_tokyo','u_tokyo','Tokyo Vertical','tokyo-vertical','Independent Guide / Trainer',$$Urban adventures across Tokyo — rooftop lines, night bouldering and hidden-city exploration.$$,'Tokyo','Japan','@tokyovertical',NULL,'English, Japanese',ARRAY['Urban Exploration','Bouldering','Night Tours'],'tokyo@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_raja','u_raja','Raja Ampat Liveaboards','raja-ampat-liveaboards','Dive Operator',$$Small-group liveaboard safaris through the richest reefs on Earth.$$,'Raja Ampat','Indonesia','@rajaliveaboard','PADI / SSI','English, Indonesian',ARRAY['Liveaboard','Reef Dives','Snorkeling','Wreck Diving'],'raja@pepvoga.com','APPROVED',now(),now(),now(),now()),
  ('o_pata','u_pata','Patagonia Trails','patagonia-trails','Adventure Camp',$$Guided treks and trail-running camps through Torres del Paine and the Patagonian wild.$$,'Torres del Paine','Chile','@patagoniatrails','AEGM Guides','English, Spanish',ARRAY['Trekking','Trail Running','Camping','Navigation'],'patagonia@pepvoga.com','APPROVED',now(),now(),now(),now())
ON CONFLICT DO NOTHING;

INSERT INTO "listings" (id,"ownerId",type,status,title,slug,summary,description,space,sport,city,country,region,"priceCents",currency,"priceUnit","maxGuests","minNights","maxGroupSize","durationMinutes",level,images,amenities,highlights,included,"ratingAvg","ratingCount",featured,"createdAt","updatedAt") VALUES
  ('l_iceclimb','o_alps','EXPERIENCE','PUBLISHED','Ice Climbing Day — Chamonix','ice-climbing-day-chamonix',
   $$Swing tools into blue alpine ice beneath Mont Blanc with an IFMGA guide.$$,
   $$A full day on frozen waterfalls and couloirs above Chamonix. Your guide handles ropes, screws and route choice; you bring the stoke. Boots, crampons, axes and helmet included — suitable for fit beginners and improvers.$$,
   'WILDERNESS','Ice Climbing','Chamonix','France','French Alps',18000,'EUR','PER_PERSON',NULL,NULL,4,480,'INTERMEDIATE',
   ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['IFMGA guide','All technical gear','Mont Blanc views'],ARRAY['Crampons & axes','Helmet & harness','Certified guide'],0,0,false,now(),now()),
  ('l_chalet','o_alps','STAY','PUBLISHED','Timber Alpine Chalet — Chamonix','timber-alpine-chalet-chamonix',
   $$A warm wood chalet with Mont Blanc from the balcony and a sauna for tired legs.$$,
   $$Sleeps six in a classic Savoyard chalet — exposed beams, a crackling stove, ski-locker by the door, and a wood-fired sauna. Ten minutes from the Aiguille du Midi lift; the perfect basecamp for a climbing or ski week.$$,
   'WILDERNESS',NULL,'Chamonix','France','French Alps',12000,'EUR','PER_NIGHT',6,2,NULL,NULL,'ALL',
   ARRAY['https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
   ARRAY['Sauna','Wood stove','Ski locker','Mountain views','Kitchen','Parking'],ARRAY[]::text[],ARRAY[]::text[],0,0,false,now(),now()),
  ('l_kite','o_kite','EXPERIENCE','PUBLISHED','Kitesurfing Starter Course — Tarifa','kitesurfing-starter-course-tarifa',
   $$Three hours on Europe's windiest beach — from zero to riding the bar.$$,
   $$Tarifa's steady Levante wind makes it the best place in Europe to learn. IKO-certified instructors, radio helmets and the latest gear get you controlling the kite and water-starting fast. Small groups, big grins.$$,
   'OCEAN','Kitesurfing','Tarifa','Spain','Costa de la Luz',9000,'EUR','PER_PERSON',NULL,NULL,6,180,'BEGINNER',
   ARRAY['https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['IKO instructors','Radio helmets','All gear included'],ARRAY['Kite & board','Wetsuit','Insurance'],4.8,1,false,now(),now()),
  ('l_rooftop','o_tokyo','EXPERIENCE','PUBLISHED','After-Dark Tokyo Rooftop Walk','after-dark-tokyo-rooftop-walk',
   $$See the city from the in-between places — rooftops, alleys and neon backstreets.$$,
   $$A small-group night walk through the Tokyo most visitors never see: service rooftops, lantern-lit alleys, and viewpoints stacked above the neon. Led by local explorers who know exactly where, and how, to look.$$,
   'URBAN','Urban Exploration','Tokyo','Japan','Kanto',6500,'USD','PER_PERSON',NULL,NULL,8,180,'ALL',
   ARRAY['https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['Local explorer guide','Hidden viewpoints','Small group'],ARRAY['Guide','Transit between spots'],0,0,false,now(),now()),
  ('l_loft','o_tokyo','STAY','PUBLISHED','Neon-View Loft — Shibuya','neon-view-loft-shibuya',
   $$A compact designer loft above the Shibuya buzz, floor-to-ceiling city lights.$$,
   $$Minimalist concrete-and-timber loft a few minutes from the Scramble. Big windows, fast Wi-Fi, a proper coffee setup, and the whole electric city laid out below you. Ideal for an urban-adventure weekend.$$,
   'URBAN',NULL,'Tokyo','Japan','Kanto',9000,'USD','PER_NIGHT',2,1,NULL,NULL,'ALL',
   ARRAY['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=85'],
   ARRAY['Wi-Fi','City view','Coffee bar','Self check-in','Air conditioning'],ARRAY[]::text[],ARRAY[]::text[],0,0,false,now(),now()),
  ('l_liveaboard','o_raja','EXPERIENCE','PUBLISHED','7-Night Liveaboard Safari — Raja Ampat','7-night-liveaboard-safari-raja-ampat',
   $$Up to four dives a day across the most biodiverse reefs on the planet.$$,
   $$A week aboard a traditional phinisi, chasing mantas, wobbegongs and walls of fish through Raja Ampat. Nitrox, expert dive guides, en-suite cabins and a chef who somehow tops every meal. The trip of a diving lifetime.$$,
   'OCEAN','Scuba Diving','Raja Ampat','Indonesia','West Papua',240000,'USD','PER_PERSON',NULL,NULL,12,1440,'ADVANCED',
   ARRAY['https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1200&q=80'],
   ARRAY[]::text[],ARRAY['Up to 4 dives/day','Nitrox included','En-suite cabins'],ARRAY['All dives & gear','Full board','Airport transfers'],5,1,true,now(),now()),
  ('l_trek','o_pata','EXPERIENCE','PUBLISHED','W-Trek Trail Camp — Torres del Paine','w-trek-trail-camp-torres-del-paine',
   $$Five days running and hiking the iconic W through Patagonia's granite towers.$$,
   $$Cover the classic W route light and fast, with a guide, hut-to-hut logistics and dinners handled. Granite spires, glacial lakes, and Patagonian wind that makes every summit earned. For fit hikers and trail runners.$$,
   'WILDERNESS','Trail Running','Torres del Paine','Chile','Magallanes',4500,'USD','PER_PERSON',NULL,NULL,10,1440,'INTERMEDIATE',
   ARRAY['https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85'],
   ARRAY[]::text[],ARRAY['Guided W route','Hut logistics','All dinners'],ARRAY['Mountain guide','Refugio nights','Park permits'],0,0,true,now(),now()),
  ('l_refugio','o_pata','STAY','PUBLISHED','Mountain Refugio Bunk — Paine','mountain-refugio-bunk-paine',
   $$A cozy bunk and hot meal inside the national park, steps from the trailhead.$$,
   $$Simple, warm and perfectly placed — a bunk in a classic Patagonian refugio with hearty dinners, hot showers and a drying room for wet gear. Wake up already inside the park, trail at your door.$$,
   'WILDERNESS',NULL,'Torres del Paine','Chile','Magallanes',8000,'USD','PER_NIGHT',4,1,NULL,NULL,'ALL',
   ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'],
   ARRAY['Hot meals','Hot showers','Drying room','In-park location'],ARRAY[]::text[],ARRAY[]::text[],0,0,false,now(),now())
ON CONFLICT DO NOTHING;

-- Extra completed bookings + reviews for two of the new listings
INSERT INTO "bookings" (id,code,"listingId","userId","ownerId","startDate","endDate","startTime",guests,"unitPriceCents","totalCents",currency,status,"paymentStatus","confirmedAt","createdAt","updatedAt") VALUES
  ('b_seed2','PV-SEED2','l_liveaboard','u_traveler','o_raja', now() - interval '30 days', NULL, '09:00', 1, 240000, 240000, 'USD','COMPLETED','PAID', now() - interval '31 days', now(), now()),
  ('b_seed3','PV-SEED3','l_kite','u_traveler','o_kite', now() - interval '12 days', NULL, '09:00', 1, 9000, 9000, 'EUR','COMPLETED','PAID', now() - interval '13 days', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO "reviews" (id,"listingId","userId","bookingId",rating,title,body,"createdAt") VALUES
  ('r_seed2','l_liveaboard','u_traveler','b_seed2',5,'Best week of my life',$$Four dives a day in the most insane reefs I have ever seen. Crew, food, cabins — flawless. Worth every cent.$$, now()),
  ('r_seed3','l_kite','u_traveler','b_seed3',5,'Up and riding by day three',$$Patient instructors and perfect wind. Went from never having flown a kite to riding short stretches. So much fun.$$, now())
ON CONFLICT DO NOTHING;

-- Availability for the next 45 days
--   experiences → a 09:00 slot/day;  stays → per-night inventory
INSERT INTO "availability" (id,"listingId",date,"startTime",capacity,booked,"isBlocked")
SELECT gen_random_uuid()::text, l.id, d::date, '09:00', COALESCE(l."maxGroupSize", 8), 0, false
FROM "listings" l
CROSS JOIN generate_series((CURRENT_DATE + 1)::timestamp, (CURRENT_DATE + 45)::timestamp, interval '1 day') AS d
WHERE l.type = 'EXPERIENCE'
ON CONFLICT DO NOTHING;

INSERT INTO "availability" (id,"listingId",date,"startTime",capacity,booked,"isBlocked")
SELECT gen_random_uuid()::text, l.id, d::date, NULL, COALESCE(l."maxGuests", 4), 0, false
FROM "listings" l
CROSS JOIN generate_series((CURRENT_DATE + 1)::timestamp, (CURRENT_DATE + 45)::timestamp, interval '1 day') AS d
WHERE l.type = 'STAY'
ON CONFLICT DO NOTHING;
