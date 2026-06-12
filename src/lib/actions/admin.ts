"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export async function setOwnerStatus(
  ownerId: string,
  status: "PENDING" | "REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED",
) {
  await requireRole("ADMIN");
  await db.owner.update({
    where: { id: ownerId },
    data: { status, reviewedAt: new Date() },
  });
  // If a business is rejected/suspended, also promote/keep the owner's user role.
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export async function setListingModeration(
  listingId: string,
  status: "PUBLISHED" | "SUSPENDED" | "DRAFT",
) {
  await requireRole("ADMIN");
  await db.listing.update({ where: { id: listingId }, data: { status } });
  revalidatePath("/admin/listings");
}
