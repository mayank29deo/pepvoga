"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export type ReviewState = { error?: string; ok?: boolean } | null;

const schema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(5, "Add a few words about your experience."),
});

export async function createReview(
  bookingId: string,
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };

  const booking = await db.booking.findFirst({
    where: { id: bookingId, userId: user.id, status: "COMPLETED" },
    include: { review: { select: { id: true } } },
  });
  if (!booking) return { error: "You can only review completed bookings." };
  if (booking.review) return { error: "You've already reviewed this booking." };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid review." };
  const { rating, title, body } = parsed.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.review.create({
        data: { listingId: booking.listingId, userId: user.id, bookingId, rating, title: title || null, body },
      });
      const agg = await tx.review.aggregate({
        where: { listingId: booking.listingId },
        _avg: { rating: true },
        _count: true,
      });
      await tx.listing.update({
        where: { id: booking.listingId },
        data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
      });
    });
  } catch {
    return { error: "Could not save your review." };
  }

  revalidatePath("/account/bookings");
  return { ok: true };
}
