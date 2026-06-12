import Link from "next/link";
import { Check } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getUserBookings } from "@/lib/data/bookings";
import { StatusPill } from "@/components/dash/status-pill";
import { ReviewForm } from "@/components/account/review-form";
import { cancelBooking } from "@/lib/actions/booking";
import { buttonClasses } from "@/components/ui/button";
import { formatPrice, fmtDate } from "@/lib/utils";

export const metadata = { title: "Your bookings" };

type SP = Promise<Record<string, string | string[] | undefined>>;

function dateLabel(b: { startDate: Date; endDate: Date | null; startTime: string | null }) {
  if (b.endDate) return `${fmtDate(b.startDate)} → ${fmtDate(b.endDate)}`;
  return `${fmtDate(b.startDate)}${b.startTime ? ` · ${b.startTime}` : ""}`;
}

export default async function AccountBookingsPage({ searchParams }: { searchParams: SP }) {
  const user = await requireUser("/account/bookings");
  const [bookings, sp] = await Promise.all([getUserBookings(user.id), searchParams]);
  const justBooked = sp.booked === "1";

  return (
    <div>
      {justBooked && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
          <Check size={16} /> Booking requested — the host will confirm shortly.
        </div>
      )}

      <h1 className="mb-5 font-display text-xl font-extrabold tracking-tight text-ink">Your bookings</h1>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-sm text-mid">No bookings yet.</p>
          <Link href="/experiences" className={buttonClasses("dark", "sm", "mt-4")}>Find something to do</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const canCancel = b.status === "PENDING" || b.status === "CONFIRMED";
            const canReview = b.status === "COMPLETED" && !b.review;
            return (
              <div key={b.id} className="rounded-xl border border-line2 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.58rem] font-bold uppercase tracking-wide text-light">
                        {b.listing.type === "STAY" ? "Stay" : "Experience"}
                      </span>
                      <StatusPill status={b.status} />
                    </div>
                    <Link href={`/listings/${b.listing.slug}`} className="mt-1 block font-display text-sm font-bold text-ink hover:underline">
                      {b.listing.title}
                    </Link>
                    <div className="text-xs text-mid">{b.listing.city}, {b.listing.country}</div>
                    <div className="mt-2 text-xs text-ink2">
                      {dateLabel(b)} · {b.guests} guest{b.guests === 1 ? "" : "s"} · {formatPrice(b.totalCents, b.currency)}
                    </div>
                    <div className="mt-1 text-[0.65rem] text-light">Ref {b.code}</div>
                  </div>
                  {canCancel && (
                    <form action={cancelBooking.bind(null, b.id)}>
                      <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
                {canReview && <ReviewForm bookingId={b.id} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
