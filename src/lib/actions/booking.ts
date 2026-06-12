"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { shortCode, dateOnlyUTC, addDaysUTC } from "@/lib/utils";
import type { Booking } from "@/generated/prisma/client";

export type BookingState = { error?: string } | null;

export async function createBooking(
  listingId: string,
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to book." };

  const listing = await db.listing.findFirst({
    where: { id: listingId, status: "PUBLISHED", owner: { is: { status: "APPROVED" } } },
  });
  if (!listing) return { error: "This listing isn't available for booking." };

  const guests = Math.max(parseInt(String(formData.get("guests") || "1"), 10) || 1, 1);
  const note = String(formData.get("note") || "").trim() || null;
  const code = shortCode();

  try {
    if (listing.type === "EXPERIENCE") {
      const availabilityId = String(formData.get("availabilityId") || "");
      const slot = await db.availability.findFirst({ where: { id: availabilityId, listingId } });
      if (!slot || slot.isBlocked) return { error: "That slot isn't available." };
      if (slot.capacity - slot.booked < guests) return { error: "Not enough seats left in that slot." };

      await db.$transaction([
        db.availability.update({ where: { id: slot.id }, data: { booked: { increment: guests } } }),
        db.booking.create({
          data: {
            code, listingId, userId: user.id, ownerId: listing.ownerId,
            startDate: slot.date, startTime: slot.startTime, guests,
            unitPriceCents: listing.priceCents, totalCents: listing.priceCents * guests,
            currency: listing.currency, status: "PENDING", guestNote: note,
          },
        }),
      ]);
    } else {
      const startStr = String(formData.get("startDate") || "");
      const nights = Math.max(parseInt(String(formData.get("nights") || "1"), 10) || 1, 1);
      const start = startStr ? new Date(startStr) : null;
      if (!start || Number.isNaN(start.getTime())) return { error: "Choose a check-in date." };
      if (listing.minNights && nights < listing.minNights)
        return { error: `Minimum stay is ${listing.minNights} night(s).` };

      const base = dateOnlyUTC(start);
      const dates = Array.from({ length: nights }, (_, i) => addDaysUTC(base, i));
      const rows = await db.availability.findMany({
        where: { listingId, startTime: null, isBlocked: false, date: { in: dates } },
      });
      if (rows.length < nights) return { error: "Those dates aren't all available." };
      if (rows.some((r) => r.capacity - r.booked < 1)) return { error: "Those dates are sold out." };

      await db.$transaction([
        ...rows.map((r) =>
          db.availability.update({ where: { id: r.id }, data: { booked: { increment: 1 } } }),
        ),
        db.booking.create({
          data: {
            code, listingId, userId: user.id, ownerId: listing.ownerId,
            startDate: base, endDate: addDaysUTC(base, nights), guests,
            unitPriceCents: listing.priceCents, totalCents: listing.priceCents * nights,
            currency: listing.currency, status: "PENDING", guestNote: note,
          },
        }),
      ]);
    }
  } catch {
    return { error: "Could not complete your booking. Please try again." };
  }

  revalidatePath("/account/bookings");
  redirect("/account/bookings?booked=1");
}

/** Build availability-restore operations for a cancelled/declined booking. */
async function restoreOps(b: Booking) {
  if (b.endDate) {
    const rows = await db.availability.findMany({
      where: { listingId: b.listingId, startTime: null, date: { gte: b.startDate, lt: b.endDate } },
    });
    return rows.map((r) =>
      db.availability.update({ where: { id: r.id }, data: { booked: { decrement: 1 } } }),
    );
  }
  const slot = await db.availability.findFirst({
    where: { listingId: b.listingId, date: b.startDate, startTime: b.startTime },
  });
  return slot
    ? [db.availability.update({ where: { id: slot.id }, data: { booked: { decrement: b.guests } } })]
    : [];
}

export async function confirmBooking(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const b = await db.booking.findFirst({
    where: { id: bookingId, listing: { owner: { userId: user.id } }, status: "PENDING" },
  });
  if (!b) return;
  await db.booking.update({ where: { id: b.id }, data: { status: "CONFIRMED", confirmedAt: new Date() } });
  revalidatePath("/owner/bookings");
  revalidatePath("/account/bookings");
}

export async function declineBooking(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const b = await db.booking.findFirst({
    where: { id: bookingId, listing: { owner: { userId: user.id } }, status: "PENDING" },
  });
  if (!b) return;
  const ops = await restoreOps(b);
  await db.$transaction([
    db.booking.update({ where: { id: b.id }, data: { status: "DECLINED", cancelledAt: new Date() } }),
    ...ops,
  ]);
  revalidatePath("/owner/bookings");
  revalidatePath("/account/bookings");
}

export async function completeBooking(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const b = await db.booking.findFirst({
    where: { id: bookingId, listing: { owner: { userId: user.id } }, status: "CONFIRMED" },
  });
  if (!b) return;
  await db.booking.update({ where: { id: b.id }, data: { status: "COMPLETED" } });
  revalidatePath("/owner/bookings");
  revalidatePath("/account/bookings");
}

export async function cancelBooking(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const b = await db.booking.findFirst({
    where: { id: bookingId, userId: user.id, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  if (!b) return;
  const ops = await restoreOps(b);
  await db.$transaction([
    db.booking.update({ where: { id: b.id }, data: { status: "CANCELLED", cancelledAt: new Date() } }),
    ...ops,
  ]);
  revalidatePath("/account/bookings");
  revalidatePath("/owner/bookings");
}
