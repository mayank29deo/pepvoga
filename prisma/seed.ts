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
  {
    email: "alps@pepvoga.com",
    password: "owner1234",
    contactName: "Élise Laurent",
    businessName: "Chamonix Alpine Guides",
    category: "Climbing Gym / Guide",
    description: "IFMGA-certified mountain guides for alpine climbs, ice routes and ski touring around Mont Blanc.",
    city: "Chamonix",
    country: "France",
    instagram: "@chamonixguides",
    certifications: "IFMGA Guides",
    languages: "English, French",
    services: ["Alpine Routes", "Ice Climbing", "Ski Touring", "Mountaineering"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "Ice Climbing Day — Chamonix",
        summary: "Swing tools into blue alpine ice beneath Mont Blanc with an IFMGA guide.",
        description:
          "A full day on frozen waterfalls and couloirs above Chamonix. Your guide handles ropes, screws and route choice; you bring the stoke. Boots, crampons, axes and helmet included — suitable for fit beginners and improvers.",
        space: "WILDERNESS",
        sport: "Ice Climbing",
        city: "Chamonix",
        country: "France",
        region: "French Alps",
        priceCents: 18000,
        currency: "EUR",
        priceUnit: "PER_PERSON",
        durationMinutes: 480,
        maxGroupSize: 4,
        level: "INTERMEDIATE",
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85"],
        highlights: ["IFMGA guide", "All technical gear", "Mont Blanc views"],
        included: ["Crampons & axes", "Helmet & harness", "Certified guide"],
      },
      {
        type: "STAY",
        title: "Timber Alpine Chalet — Chamonix",
        summary: "A warm wood chalet with Mont Blanc from the balcony and a sauna for tired legs.",
        description:
          "Sleeps six in a classic Savoyard chalet — exposed beams, a crackling stove, ski-locker by the door, and a wood-fired sauna. Ten minutes from the Aiguille du Midi lift; the perfect basecamp for a climbing or ski week.",
        space: "WILDERNESS",
        city: "Chamonix",
        country: "France",
        region: "French Alps",
        priceCents: 12000,
        currency: "EUR",
        priceUnit: "PER_NIGHT",
        maxGuests: 6,
        minNights: 2,
        images: ["https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=85"],
        amenities: ["Sauna", "Wood stove", "Ski locker", "Mountain views", "Kitchen", "Parking"],
      },
    ],
  },
  {
    email: "kite@pepvoga.com",
    password: "owner1234",
    contactName: "Diego Morales",
    businessName: "Tarifa Kite Co.",
    category: "Surf School",
    description: "Kitesurfing lessons and downwinders on the wind-blessed beaches of Tarifa.",
    city: "Tarifa",
    country: "Spain",
    instagram: "@tarifakite",
    certifications: "IKO Certified",
    languages: "English, Spanish",
    services: ["Kitesurfing Lessons", "Board Rental", "Downwinders"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "Kitesurfing Starter Course — Tarifa",
        summary: "Three hours on Europe's windiest beach — from zero to riding the bar.",
        description:
          "Tarifa's steady Levante wind makes it the best place in Europe to learn. IKO-certified instructors, radio helmets and the latest gear get you controlling the kite and water-starting fast. Small groups, big grins.",
        space: "OCEAN",
        sport: "Kitesurfing",
        city: "Tarifa",
        country: "Spain",
        region: "Costa de la Luz",
        priceCents: 9000,
        currency: "EUR",
        priceUnit: "PER_PERSON",
        durationMinutes: 180,
        maxGroupSize: 6,
        level: "BEGINNER",
        images: ["https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85"],
        highlights: ["IKO instructors", "Radio helmets", "All gear included"],
        included: ["Kite & board", "Wetsuit", "Insurance"],
        rating: { avg: 4.8, count: 1 },
      },
    ],
  },
  {
    email: "tokyo@pepvoga.com",
    password: "owner1234",
    contactName: "Yuki Tanaka",
    businessName: "Tokyo Vertical",
    category: "Independent Guide / Trainer",
    description: "Urban adventures across Tokyo — rooftop lines, night bouldering and hidden-city exploration.",
    city: "Tokyo",
    country: "Japan",
    instagram: "@tokyovertical",
    languages: "English, Japanese",
    services: ["Urban Exploration", "Bouldering", "Night Tours"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "After-Dark Tokyo Rooftop Walk",
        summary: "See the city from the in-between places — rooftops, alleys and neon backstreets.",
        description:
          "A small-group night walk through the Tokyo most visitors never see: service rooftops, lantern-lit alleys, and viewpoints stacked above the neon. Led by local explorers who know exactly where, and how, to look.",
        space: "URBAN",
        sport: "Urban Exploration",
        city: "Tokyo",
        country: "Japan",
        region: "Kanto",
        priceCents: 6500,
        currency: "USD",
        priceUnit: "PER_PERSON",
        durationMinutes: 180,
        maxGroupSize: 8,
        level: "ALL",
        images: ["https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=85"],
        highlights: ["Local explorer guide", "Hidden viewpoints", "Small group"],
        included: ["Guide", "Transit between spots"],
      },
      {
        type: "STAY",
        title: "Neon-View Loft — Shibuya",
        summary: "A compact designer loft above the Shibuya buzz, floor-to-ceiling city lights.",
        description:
          "Minimalist concrete-and-timber loft a few minutes from the Scramble. Big windows, fast Wi-Fi, a proper coffee setup, and the whole electric city laid out below you. Ideal for an urban-adventure weekend.",
        space: "URBAN",
        city: "Tokyo",
        country: "Japan",
        region: "Kanto",
        priceCents: 9000,
        currency: "USD",
        priceUnit: "PER_NIGHT",
        maxGuests: 2,
        minNights: 1,
        images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=85"],
        amenities: ["Wi-Fi", "City view", "Coffee bar", "Self check-in", "Air conditioning"],
      },
    ],
  },
  {
    email: "raja@pepvoga.com",
    password: "owner1234",
    contactName: "Sari Wijaya",
    businessName: "Raja Ampat Liveaboards",
    category: "Dive Operator",
    description: "Small-group liveaboard safaris through the richest reefs on Earth.",
    city: "Raja Ampat",
    country: "Indonesia",
    instagram: "@rajaliveaboard",
    certifications: "PADI / SSI",
    languages: "English, Indonesian",
    services: ["Liveaboard", "Reef Dives", "Snorkeling", "Wreck Diving"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "7-Night Liveaboard Safari — Raja Ampat",
        summary: "Up to four dives a day across the most biodiverse reefs on the planet.",
        description:
          "A week aboard a traditional phinisi, chasing mantas, wobbegongs and walls of fish through Raja Ampat. Nitrox, expert dive guides, en-suite cabins and a chef who somehow tops every meal. The trip of a diving lifetime.",
        space: "OCEAN",
        sport: "Scuba Diving",
        city: "Raja Ampat",
        country: "Indonesia",
        region: "West Papua",
        priceCents: 240000,
        currency: "USD",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 12,
        level: "ADVANCED",
        images: ["https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1400&q=85"],
        highlights: ["Up to 4 dives/day", "Nitrox included", "En-suite cabins"],
        included: ["All dives & gear", "Full board", "Airport transfers"],
        featured: true,
        rating: { avg: 5.0, count: 1 },
      },
    ],
  },
  {
    email: "patagonia@pepvoga.com",
    password: "owner1234",
    contactName: "Mateo Fuentes",
    businessName: "Patagonia Trails",
    category: "Adventure Camp",
    description: "Guided treks and trail-running camps through Torres del Paine and the Patagonian wild.",
    city: "Torres del Paine",
    country: "Chile",
    instagram: "@patagoniatrails",
    certifications: "AEGM Guides",
    languages: "English, Spanish",
    services: ["Trekking", "Trail Running", "Camping", "Navigation"],
    listings: [
      {
        type: "EXPERIENCE",
        title: "W-Trek Trail Camp — Torres del Paine",
        summary: "Five days running and hiking the iconic W through Patagonia's granite towers.",
        description:
          "Cover the classic W route light and fast, with a guide, hut-to-hut logistics and dinners handled. Granite spires, glacial lakes, and Patagonian wind that makes every summit earned. For fit hikers and trail runners.",
        space: "WILDERNESS",
        sport: "Trail Running",
        city: "Torres del Paine",
        country: "Chile",
        region: "Magallanes",
        priceCents: 4500,
        currency: "USD",
        priceUnit: "PER_PERSON",
        durationMinutes: 1440,
        maxGroupSize: 10,
        level: "INTERMEDIATE",
        images: ["https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=85"],
        highlights: ["Guided W route", "Hut logistics", "All dinners"],
        included: ["Mountain guide", "Refugio nights", "Park permits"],
        featured: true,
      },
      {
        type: "STAY",
        title: "Mountain Refugio Bunk — Paine",
        summary: "A cozy bunk and hot meal inside the national park, steps from the trailhead.",
        description:
          "Simple, warm and perfectly placed — a bunk in a classic Patagonian refugio with hearty dinners, hot showers and a drying room for wet gear. Wake up already inside the park, trail at your door.",
        space: "WILDERNESS",
        city: "Torres del Paine",
        country: "Chile",
        region: "Magallanes",
        priceCents: 8000,
        currency: "USD",
        priceUnit: "PER_NIGHT",
        maxGuests: 4,
        minNights: 1,
        images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["Hot meals", "Hot showers", "Drying room", "In-park location"],
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
