// Verifies the core booking transaction against the real DB, then cleans up.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

function code() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return "PV-TEST" + s;
}

async function main() {
  const user = await db.user.findUnique({ where: { email: "traveler@pepvoga.com" } });
  const listing = await db.listing.findFirst({
    where: { type: "EXPERIENCE", status: "PUBLISHED" },
    include: { availability: { where: { startTime: { not: null } }, take: 1 } },
  });
  const slot = listing?.availability[0];
  if (!user || !listing || !slot) throw new Error("missing seed data");

  const before = slot.booked;
  const guests = 2;

  const [, booking] = await db.$transaction([
    db.availability.update({ where: { id: slot.id }, data: { booked: { increment: guests } } }),
    db.booking.create({
      data: {
        code: code(), listingId: listing.id, userId: user.id, ownerId: listing.ownerId,
        startDate: slot.date, startTime: slot.startTime, guests,
        unitPriceCents: listing.priceCents, totalCents: listing.priceCents * guests,
        currency: listing.currency, status: "PENDING",
      },
    }),
  ]);

  const after = await db.availability.findUnique({ where: { id: slot.id } });
  const ok = !!after && after.booked === before + guests && booking.status === "PENDING";
  console.log(
    ok
      ? `✅ BOOKING WRITE OK — slot booked ${before} → ${after!.booked}, created ${booking.code} (₵${booking.totalCents})`
      : "❌ BOOKING WRITE FAILED",
  );

  // cleanup
  await db.$transaction([
    db.booking.delete({ where: { id: booking.id } }),
    db.availability.update({ where: { id: slot.id }, data: { booked: { decrement: guests } } }),
  ]);
  console.log("🧹 cleaned up test booking");
  if (!ok) process.exit(1);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error("❌", e);
    await db.$disconnect();
    process.exit(1);
  });
