import { db } from "@/lib/db";
import type { OwnerStatus } from "@/generated/prisma/enums";

const OWNER_STATUSES = ["PENDING", "REVIEW", "APPROVED", "REJECTED", "SUSPENDED"];

export async function getAdminStats() {
  try {
    const [owners, pending, review, approved, listings, bookings] = await Promise.all([
      db.owner.count(),
      db.owner.count({ where: { status: "PENDING" } }),
      db.owner.count({ where: { status: "REVIEW" } }),
      db.owner.count({ where: { status: "APPROVED" } }),
      db.listing.count(),
      db.booking.count(),
    ]);
    return { owners, pending, review, approved, listings, bookings };
  } catch {
    return { owners: 0, pending: 0, review: 0, approved: 0, listings: 0, bookings: 0 };
  }
}

export function getOwnersForAdmin(status?: string) {
  const filter =
    status && status !== "all" && OWNER_STATUSES.includes(status.toUpperCase())
      ? { status: status.toUpperCase() as OwnerStatus }
      : {};
  return db.owner
    .findMany({
      where: filter,
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        _count: { select: { listings: true } },
      },
    })
    .catch(() => []);
}

export function getListingsForAdmin() {
  return db.listing
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { owner: { select: { businessName: true, status: true } } },
    })
    .catch(() => []);
}
