import { db } from "@/lib/db";

export function getUserBookings(userId: string) {
  return db.booking
    .findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { title: true, slug: true, type: true, images: true, city: true, country: true } },
        review: { select: { id: true } },
      },
    })
    .catch(() => []);
}
