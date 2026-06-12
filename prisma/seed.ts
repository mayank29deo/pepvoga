import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// ── helpers ──────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const pw = (p: string) => bcrypt.hashSync(p, 10);
const dateOnly = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const IMG = {
  scuba: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1400&q=85",
  ocean: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
  surf: "https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?auto=format&fit=crop&w=1400&q=85",
  climb: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=85",
  para: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85",
  cycle: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85",
  camp: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  lodge: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
};

type ListingSeed = {
  type: "STAY" | "EXPERIENCE";
  title: string;
  summary: string;
  description: string;
  space: "WILDERNESS" | "OCEAN" | "URBAN";
  sport?: string;
  city: string;
  country: string;
  region?: string;
  priceCents: number;
  currency: string;
  priceUnit: "PER_NIGHT" | "PER_PERSON" | "PER_SESSION" | "PER_DAY" | "PER_GROUP";
  maxGuests?: number;
  minNights?: number;
  maxGroupSize?: number;
  durationMinutes?: number;
  level?: "ALL" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  images: string[];
  amenities?: string[];
  highlights?: string[];
  included?: string[];
  featured?: boolean;
  rating?: { avg: number; count: number };
};

type OwnerSeed = {
  email: string;
  password: string;
  contactName: string;
  businessName: string;
  category: string;
  description: string;
  city: string;
  country: string;
  website?: string;
  instagram?: string;
  certifications?: string;
  languages?: string;
  services: string[];
  listings: ListingSeed[];
};

const OWNERS: OwnerSeed[] = [
  {
    email: "dive@pepvoga.com",
    password: "owner1234",
    contactName: "Marin Cole",
    businessName: "Blue Horizon Diving",
    category: "Dive Operator",
    description: "Award-winning PADI 5-Star dive centre on Koh Tao with small groups and a house reef on the doorstep.",
    city: "Koh Tao",
    country: "Thailand",
    website: "https://bluehorizon.example",
    instagram: "@bluehorizon",
    certifications: "PADI 5-Star CDC",
    languages: "English, Thai",
    services: ["Open Water Courses", "Advanced Courses", "Reef Dives", "Wreck Diving", "Equipment Rental"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "PADI Open Water Course — Koh Tao",
        summary: "Become a certified diver in 3 days on the world's most popular island to learn.",
        description:
          "Your gateway to the underwater world. Over three days you'll move from confined-water skills to four open-water dives on Koh Tao's vibrant reefs, guided by instructors who keep groups to four students max. All theory, equipment, and certification included.",
        space: "OCEAN",
        sport: "Scuba Diving",
        city: "Koh Tao",
        country: "Thailand",
        region: "Gulf of Thailand",
        priceCents: 29900,
        currency: "USD",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 4,
        level: "BEGINNER",
        images: [IMG.scuba, IMG.ocean],
        highlights: ["Max 4 students per instructor", "House reef access", "Free accommodation nights"],
        included: ["All equipment", "PADI certification", "Theory & e-learning", "4 open-water dives"],
        featured: true,
        rating: { avg: 4.9, count: 1 },
      },
      {
        type: "STAY",
        title: "Beachfront Dive Lodge — Koh Tao",
        summary: "Simple, sun-bleached rooms steps from the water and the dive shop.",
        description:
          "A relaxed lodge built for divers — rinse tanks, dry rooms for gear, hammocks for surface intervals, and a beachfront cafe. Walk to three dive sites; fall asleep to the surf.",
        space: "OCEAN",
        city: "Koh Tao",
        country: "Thailand",
        region: "Gulf of Thailand",
        priceCents: 4500,
        currency: "USD",
        priceUnit: "PER_NIGHT",
        maxGuests: 2,
        minNights: 2,
        images: [IMG.lodge, IMG.ocean],
        amenities: ["Wi-Fi", "Air conditioning", "Breakfast", "Dive shop on-site", "Beachfront"],
      },
    ],
  },
  {
    email: "surf@pepvoga.com",
    password: "owner1234",
    contactName: "Indah Putri",
    businessName: "Swell Seekers Bali",
    category: "Surf School",
    description: "A fun, local-run surf school in Canggu turning first-timers into confident surfers.",
    city: "Canggu",
    country: "Indonesia",
    website: "https://swellseekers.example",
    instagram: "@swellseekersbali",
    certifications: "ISA Certified",
    languages: "English, Indonesian",
    services: ["Beginner Lessons", "Surf Camps", "Board Rental", "Video Analysis"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "5-Day Beginner Surf Camp — Canggu",
        summary: "Daily dawn sessions, video coaching, and a crew that becomes your travel family.",
        description:
          "Five mornings in the water at Canggu's forgiving beach breaks, with afternoon theory, video analysis, and yoga to keep you loose. Boards, rash guards, and reef-safe sunscreen provided. Suitable for absolute beginners and improvers.",
        space: "OCEAN",
        sport: "Surfing",
        city: "Canggu",
        country: "Indonesia",
        region: "Bali",
        priceCents: 35000,
        currency: "USD",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 6,
        level: "BEGINNER",
        images: [IMG.surf],
        highlights: ["Dawn patrol daily", "Video analysis", "Small groups of 6"],
        included: ["Board & wetsuit", "5 coached sessions", "Daily yoga", "Airport transfer"],
        featured: true,
        rating: { avg: 4.7, count: 1 },
      },
    ],
  },
  {
    email: "climb@pepvoga.com",
    password: "owner1234",
    contactName: "Rohan Desai",
    businessName: "Vertical Ground",
    category: "Climbing Gym / Guide",
    description: "Bouldering specialists guiding climbers across Hampi's legendary granite.",
    city: "Hampi",
    country: "India",
    instagram: "@verticalground",
    certifications: "UIAA Affiliated",
    languages: "English, Hindi, Kannada",
    services: ["Bouldering", "Sport Climbing", "Multi-pitch Guiding"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "Bouldering Weekend — Hampi Boulders",
        summary: "Two days problem-solving on world-class granite among ancient ruins.",
        description:
          "Hampi is a boulderer's dream — endless granite among a UNESCO ruin-scape. Crash pads, spotting, and beta provided for all grades. We finish each day watching the sunset from the top of a boulder field.",
        space: "WILDERNESS",
        sport: "Rock Climbing",
        city: "Hampi",
        country: "India",
        region: "Karnataka",
        priceCents: 650000,
        currency: "INR",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 8,
        level: "ALL",
        images: [IMG.climb],
        highlights: ["All grades welcome", "Crash pads provided", "Sunset sessions"],
        included: ["Crash pads & chalk", "Certified guide", "Transport to boulders"],
      },
    ],
  },
  {
    email: "fly@pepvoga.com",
    password: "owner1234",
    contactName: "Tenzin Norbu",
    businessName: "Sky Tribe Paragliding",
    category: "Adventure Operator",
    description: "Tandem flights and P2 courses from Bir Billing, India's paragliding capital.",
    city: "Bir Billing",
    country: "India",
    instagram: "@skytribe",
    certifications: "APPI Certified",
    languages: "English, Hindi",
    services: ["Tandem Paragliding", "Solo P2 Courses", "Thermal Flights"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "Tandem Paragliding Flight — Bir Billing",
        summary: "Launch at 2,400m and soar over the Dhauladhar range with a certified pilot.",
        description:
          "The classic Bir Billing tandem: a short hike to launch, then 20–30 minutes airborne over terraced valleys and monasteries with the Himalaya as your backdrop. GoPro footage available. No experience needed.",
        space: "WILDERNESS",
        sport: "Paragliding",
        city: "Bir Billing",
        country: "India",
        region: "Himachal Pradesh",
        priceCents: 250000,
        currency: "INR",
        priceUnit: "PER_PERSON",
        durationMinutes: 30,
        maxGroupSize: 6,
        level: "ALL",
        images: [IMG.para],
        highlights: ["2,400m launch", "Certified APPI pilots", "Himalayan panorama"],
        included: ["Certified pilot", "All safety gear", "Launch transfer"],
      },
    ],
  },
  {
    email: "camp@pepvoga.com",
    password: "owner1234",
    contactName: "Aisha Khan",
    businessName: "Himalaya Basecamp",
    category: "Adventure Camp",
    description: "A high-altitude basecamp and expedition outfit in the Kullu valley.",
    city: "Manali",
    country: "India",
    instagram: "@himalayabasecamp",
    certifications: "AMC Registered",
    languages: "English, Hindi",
    services: ["Multi-day Treks", "Basecamp Runs", "Bikepacking Nights"],
    listings: [
      {
        type: "STAY",
        title: "Alpine Basecamp Tents — Manali",
        summary: "Insulated geo-domes at 2,600m with valley views and a wood-fired mess tent.",
        description:
          "Sleep under the stars without giving up warmth. Our insulated dome tents come with real beds, hot-water bottles, and a shared mess tent serving hearty mountain food. The perfect launchpad for treks and rides.",
        space: "WILDERNESS",
        city: "Manali",
        country: "India",
        region: "Himachal Pradesh",
        priceCents: 180000,
        currency: "INR",
        priceUnit: "PER_NIGHT",
        maxGuests: 3,
        minNights: 1,
        images: [IMG.camp],
        amenities: ["Mountain views", "Wood-fired meals", "Hot water", "Bonfire", "Parking"],
      },
      {
        type: "EXPERIENCE",
        title: "Manali–Leh Bikepacking Expedition (9 Days)",
        summary: "479 km and five high passes across the Himalaya, fully supported.",
        description:
          "One of the world's great rides. Nine days from Manali to Leh over passes above 5,000m, with a support vehicle, mechanic, and chef. For fit, experienced riders ready for the adventure of a lifetime.",
        space: "WILDERNESS",
        sport: "Expedition Cycling",
        city: "Manali",
        country: "India",
        region: "Himachal Pradesh",
        priceCents: 4500000,
        currency: "INR",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 10,
        level: "ADVANCED",
        images: [IMG.cycle],
        highlights: ["5 high passes", "Full support vehicle", "Mechanic & chef"],
        included: ["Support vehicle", "All meals & camping", "Mechanic", "Permits"],
        featured: true,
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding pepvoga…");

  // Clean slate (respect FK order)
  await db.payment.deleteMany();
  await db.review.deleteMany();
  await db.booking.deleteMany();
  await db.availability.deleteMany();
  await db.savedListing.deleteMany();
  await db.listing.deleteMany();
  await db.owner.deleteMany();
  await db.newsletterSignup.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  const admin = await db.user.create({
    data: { email: "admin@pepvoga.com", name: "pepvoga Admin", role: "ADMIN", hashedPassword: pw("admin1234") },
  });
  const traveler = await db.user.create({
    data: { email: "traveler@pepvoga.com", name: "Alex Rivera", role: "USER", hashedPassword: pw("traveler1234") },
  });
  console.log(`   • admin: ${admin.email} / admin1234`);
  console.log(`   • traveler: ${traveler.email} / traveler1234`);

  const today = dateOnly(new Date());
  let listingCount = 0;
  const reviewable: { listingId: string; rating: number }[] = [];

  for (const o of OWNERS) {
    const ownerUser = await db.user.create({
      data: { email: o.email, name: o.contactName, role: "OWNER", hashedPassword: pw(o.password) },
    });
    const owner = await db.owner.create({
      data: {
        userId: ownerUser.id,
        businessName: o.businessName,
        slug: slugify(o.businessName),
        category: o.category,
        description: o.description,
        city: o.city,
        country: o.country,
        website: o.website,
        instagram: o.instagram,
        certifications: o.certifications,
        languages: o.languages,
        services: o.services,
        contactEmail: o.email,
        status: "APPROVED",
        reviewedAt: new Date(),
      },
    });

    for (const l of o.listings) {
      const listing = await db.listing.create({
        data: {
          ownerId: owner.id,
          type: l.type,
          status: "PUBLISHED",
          title: l.title,
          slug: slugify(l.title),
          summary: l.summary,
          description: l.description,
          space: l.space,
          sport: l.sport,
          city: l.city,
          country: l.country,
          region: l.region,
          priceCents: l.priceCents,
          currency: l.currency,
          priceUnit: l.priceUnit,
          maxGuests: l.maxGuests,
          minNights: l.minNights ?? (l.type === "STAY" ? 1 : null),
          maxGroupSize: l.maxGroupSize,
          durationMinutes: l.durationMinutes,
          level: l.level ?? "ALL",
          images: l.images,
          amenities: l.amenities ?? [],
          highlights: l.highlights ?? [],
          included: l.included ?? [],
          featured: l.featured ?? false,
          ratingAvg: l.rating?.avg ?? 0,
          ratingCount: l.rating?.count ?? 0,
        },
      });
      listingCount++;
      if (l.rating) reviewable.push({ listingId: listing.id, rating: Math.round(l.rating.avg) });

      // Availability for the next 45 days
      const rows = [];
      for (let i = 1; i <= 45; i++) {
        const date = addDays(today, i);
        if (l.type === "STAY") {
          rows.push({ listingId: listing.id, date, startTime: null, capacity: l.maxGuests ?? 4, booked: 0 });
        } else {
          rows.push({ listingId: listing.id, date, startTime: "09:00", capacity: l.maxGroupSize ?? 8, booked: 0 });
        }
      }
      await db.availability.createMany({ data: rows });
    }
  }

  // A couple of completed bookings + reviews so ratings render
  let r = 0;
  for (const rv of reviewable) {
    const listing = await db.listing.findUnique({ where: { id: rv.listingId } });
    if (!listing) continue;
    const start = addDays(today, -14 - r);
    const booking = await db.booking.create({
      data: {
        code: `PV-SEED${r}`,
        listingId: listing.id,
        userId: traveler.id,
        ownerId: listing.ownerId,
        startDate: start,
        endDate: listing.type === "STAY" ? addDays(start, 2) : null,
        startTime: listing.type === "EXPERIENCE" ? "09:00" : null,
        guests: 1,
        unitPriceCents: listing.priceCents,
        totalCents: listing.priceCents,
        currency: listing.currency,
        status: "COMPLETED",
        paymentStatus: "PAID",
        confirmedAt: addDays(start, -1),
      },
    });
    await db.review.create({
      data: {
        listingId: listing.id,
        userId: traveler.id,
        bookingId: booking.id,
        rating: rv.rating,
        title: rv.rating >= 5 ? "Unforgettable" : "Really great",
        body: "Exactly what I hoped for — professional crew, beautiful location, and zero hassle booking through pepvoga.",
      },
    });
    r++;
  }

  await db.newsletterSignup.createMany({
    data: [
      { email: "early1@example.com", source: "seed" },
      { email: "early2@example.com", source: "seed" },
    ],
  });

  console.log(`✅ Seeded ${OWNERS.length} owners, ${listingCount} listings, ${reviewable.length} reviews.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await db.$disconnect();
    process.exit(1);
  });
