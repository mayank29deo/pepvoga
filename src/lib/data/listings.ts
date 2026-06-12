import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export type ListingSort = "featured" | "price_asc" | "price_desc" | "rating";

export interface ListingFilters {
  type?: "STAY" | "EXPERIENCE";
  space?: "WILDERNESS" | "OCEAN" | "URBAN";
  sport?: string; // slug, e.g. "scuba-diving"
  q?: string;
  sort?: ListingSort;
}

/** Run a query but degrade to a fallback if the DB is unreachable (pre-launch). */
async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(
      `[data:${label}] query failed (is the database connected?):`,
      (err as Error)?.message?.slice(0, 160),
    );
    return fallback;
  }
}

const orderByMap: Record<ListingSort, Prisma.ListingOrderByWithRelationInput[]> = {
  featured: [{ featured: "desc" }, { ratingAvg: "desc" }, { createdAt: "desc" }],
  price_asc: [{ priceCents: "asc" }],
  price_desc: [{ priceCents: "desc" }],
  rating: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
};

export const listingCardSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  type: true,
  images: true,
  city: true,
  country: true,
  priceCents: true,
  currency: true,
  priceUnit: true,
  sport: true,
  space: true,
  ratingAvg: true,
  ratingCount: true,
  featured: true,
} satisfies Prisma.ListingSelect;

export type ListingCardData = Prisma.ListingGetPayload<{ select: typeof listingCardSelect }>;

export function getListings(filters: ListingFilters = {}) {
  const where: Prisma.ListingWhereInput = {
    status: "PUBLISHED",
    owner: { is: { status: "APPROVED" } },
  };
  if (filters.type) where.type = filters.type;
  if (filters.space) where.space = filters.space;
  if (filters.sport) {
    where.sport = { contains: filters.sport.replace(/-/g, " "), mode: "insensitive" };
  }
  if (filters.q) {
    const q = filters.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
      { region: { contains: q, mode: "insensitive" } },
      { sport: { contains: q, mode: "insensitive" } },
    ];
  }
  return safe(
    () =>
      db.listing.findMany({
        where,
        orderBy: orderByMap[filters.sort ?? "featured"],
        select: listingCardSelect,
        take: 60,
      }),
    [] as ListingCardData[],
    "getListings",
  );
}

export function getFeaturedListings(take = 6) {
  return safe(
    () =>
      db.listing.findMany({
        where: { status: "PUBLISHED", featured: true, owner: { is: { status: "APPROVED" } } },
        select: listingCardSelect,
        take,
      }),
    [] as ListingCardData[],
    "getFeatured",
  );
}

export function getListingBySlug(slug: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return safe(
    () =>
      db.listing.findFirst({
        where: { slug, status: "PUBLISHED", owner: { is: { status: "APPROVED" } } },
        include: {
          owner: {
            select: {
              id: true,
              businessName: true,
              slug: true,
              city: true,
              country: true,
              category: true,
              languages: true,
              certifications: true,
              description: true,
            },
          },
          reviews: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 12,
          },
          availability: {
            where: { date: { gte: today }, isBlocked: false },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
            take: 180,
          },
        },
      }),
    null,
    "getListingBySlug",
  );
}

export type ListingDetail = NonNullable<Awaited<ReturnType<typeof getListingBySlug>>>;
