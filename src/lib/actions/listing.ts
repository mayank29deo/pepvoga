"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { slugify, dateOnlyUTC, addDaysUTC } from "@/lib/utils";

async function ownerForUser(userId: string) {
  return db.owner.findUnique({ where: { userId } });
}

const lines = (s?: string) =>
  s ? s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean) : [];
const toIntOrNull = (s?: string) => {
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
};

const listingSchema = z.object({
  type: z.enum(["STAY", "EXPERIENCE"]),
  title: z.string().min(3, "Title is too short."),
  summary: z.string().min(10, "Add a short summary (10+ characters)."),
  description: z.string().min(20, "Add a fuller description (20+ characters)."),
  space: z.enum(["WILDERNESS", "OCEAN", "URBAN"]),
  sport: z.string().optional(),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  region: z.string().optional(),
  price: z.string().min(1, "Price is required."),
  currency: z.string().default("INR"),
  priceUnit: z.enum(["PER_NIGHT", "PER_PERSON", "PER_SESSION", "PER_DAY", "PER_GROUP"]),
  maxGuests: z.string().optional(),
  minNights: z.string().optional(),
  maxGroupSize: z.string().optional(),
  durationMinutes: z.string().optional(),
  level: z.enum(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("ALL"),
  images: z.string().optional(),
  highlights: z.string().optional(),
  included: z.string().optional(),
  amenities: z.string().optional(),
});

export type ListingFormState = { error?: string } | null;

export async function saveListing(
  listingId: string | null,
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };
  const owner = await ownerForUser(user.id);
  if (!owner) return { error: "No partner profile found." };

  const parsed = listingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please complete required fields." };
  }
  const d = parsed.data;
  const priceCents = Math.round(parseFloat(d.price) * 100);
  if (!Number.isFinite(priceCents) || priceCents <= 0) return { error: "Enter a valid price." };

  const data = {
    type: d.type,
    title: d.title,
    summary: d.summary,
    description: d.description,
    space: d.space,
    sport: d.sport || null,
    city: d.city,
    country: d.country,
    region: d.region || null,
    priceCents,
    currency: d.currency || "INR",
    priceUnit: d.priceUnit,
    maxGuests: toIntOrNull(d.maxGuests),
    minNights: toIntOrNull(d.minNights),
    maxGroupSize: toIntOrNull(d.maxGroupSize),
    durationMinutes: toIntOrNull(d.durationMinutes),
    level: d.level,
    images: lines(d.images),
    highlights: lines(d.highlights),
    included: lines(d.included),
    amenities: lines(d.amenities),
  };

  let id = listingId;
  try {
    if (listingId) {
      const existing = await db.listing.findFirst({ where: { id: listingId, ownerId: owner.id } });
      if (!existing) return { error: "Listing not found." };
      await db.listing.update({ where: { id: listingId }, data });
    } else {
      const base = slugify(d.title) || "listing";
      let slug = base;
      let n = 1;
      while (await db.listing.findUnique({ where: { slug } })) slug = `${base}-${n++}`;
      const created = await db.listing.create({
        data: { ...data, ownerId: owner.id, slug, status: "DRAFT" },
      });
      id = created.id;
    }
  } catch {
    return { error: "Could not save the listing." };
  }
  revalidatePath("/owner/listings");
  redirect(`/owner/listings/${id}?saved=1`);
}

export async function setListingStatus(listingId: string, status: "DRAFT" | "PUBLISHED") {
  const user = await getCurrentUser();
  if (!user) return;
  const owner = await ownerForUser(user.id);
  if (!owner) return;
  await db.listing.updateMany({ where: { id: listingId, ownerId: owner.id }, data: { status } });
  revalidatePath("/owner/listings");
  revalidatePath(`/owner/listings/${listingId}`);
}

export async function deleteListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const owner = await ownerForUser(user.id);
  if (!owner) return;
  // Listings with bookings can't be hard-deleted (records are preserved) — archive instead.
  const bookingCount = await db.booking.count({ where: { listingId } });
  if (bookingCount > 0) {
    await db.listing.updateMany({
      where: { id: listingId, ownerId: owner.id },
      data: { status: "SUSPENDED" },
    });
    revalidatePath("/owner/listings");
    redirect("/owner/listings?archived=1");
  }
  await db.listing.deleteMany({ where: { id: listingId, ownerId: owner.id } });
  revalidatePath("/owner/listings");
  redirect("/owner/listings?deleted=1");
}

export type AvailabilityState = { error?: string; ok?: boolean } | null;

export async function generateAvailability(
  listingId: string,
  _prev: AvailabilityState,
  formData: FormData,
): Promise<AvailabilityState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };
  const owner = await ownerForUser(user.id);
  if (!owner) return { error: "No partner profile found." };
  const listing = await db.listing.findFirst({ where: { id: listingId, ownerId: owner.id } });
  if (!listing) return { error: "Listing not found." };

  const startStr = String(formData.get("startDate") || "");
  const days = Math.min(parseInt(String(formData.get("days") || "30"), 10) || 30, 180);
  const capacity = Math.max(parseInt(String(formData.get("capacity") || "1"), 10) || 1, 1);
  const time = String(formData.get("startTime") || "").trim();

  const start = startStr ? new Date(startStr) : new Date();
  if (Number.isNaN(start.getTime())) return { error: "Enter a valid start date." };
  const base = dateOnlyUTC(start);

  const rows = [];
  for (let i = 0; i < days; i++) {
    const date = addDaysUTC(base, i);
    rows.push({
      listingId,
      date,
      startTime: listing.type === "EXPERIENCE" ? time || "09:00" : null,
      capacity,
      booked: 0,
    });
  }
  try {
    await db.availability.createMany({ data: rows, skipDuplicates: true });
  } catch {
    return { error: "Could not add availability." };
  }
  revalidatePath(`/owner/listings/${listingId}`);
  return { ok: true };
}
