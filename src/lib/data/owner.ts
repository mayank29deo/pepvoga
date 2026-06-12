import { db } from "@/lib/db";

export function getOwner(userId: string) {
  return db.owner.findUnique({ where: { userId } }).catch(() => null);
}

export function getOwnerDashboard(userId: string) {
  return db.owner
    .findUnique({
      where: { userId },
      include: {
        listings: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { bookings: true, reviews: true } } },
        },
      },
    })
    .catch(() => null);
}

export function getOwnerListing(userId: string, listingId: string) {
  return db.listing
    .findFirst({
      where: { id: listingId, owner: { userId } },
      include: {
        availability: { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
        _count: { select: { bookings: true } },
      },
    })
    .catch(() => null);
}

export function getOwnerBookings(userId: string) {
  return db.booking
    .findMany({
      where: { listing: { owner: { userId } } },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { title: true, slug: true, type: true } },
        user: { select: { name: true, email: true } },
      },
    })
    .catch(() => []);
}
