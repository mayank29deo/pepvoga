import { requireUser } from "@/lib/session";
import { getOwnerBookings } from "@/lib/data/owner";
import { StatusPill } from "@/components/dash/status-pill";
import { confirmBooking, declineBooking, completeBooking } from "@/lib/actions/booking";
import { formatPrice, fmtDate } from "@/lib/utils";

export const metadata = { title: "Bookings" };

function dateLabel(b: { startDate: Date; endDate: Date | null; startTime: string | null }) {
  if (b.endDate) return `${fmtDate(b.startDate)} → ${fmtDate(b.endDate)}`;
  return `${fmtDate(b.startDate)}${b.startTime ? ` · ${b.startTime}` : ""}`;
}

export default async function OwnerBookingsPage() {
  const user = await requireUser("/owner/bookings");
  const bookings = await getOwnerBookings(user.id);
  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">Bookings</h1>
        {pending > 0 && (
          <span className="rounded-full bg-[#fff8e1] px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#b45309]">
            {pending} pending
          </span>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center text-sm text-mid">
          No bookings yet. They&apos;ll appear here as travellers request your listings.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-line2 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={b.status} />
                    <span className="text-[0.65rem] text-light">Ref {b.code}</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-ink">{b.listing.title}</div>
                  <div className="mt-1 text-xs text-ink2">
                    {dateLabel(b)} · {b.guests} guest{b.guests === 1 ? "" : "s"} · {formatPrice(b.totalCents, b.currency)}
                  </div>
                  <div className="mt-1 text-xs text-mid">
                    {b.user.name ?? "Traveller"} · {b.user.email}
                  </div>
                  {b.guestNote && <div className="mt-2 rounded-lg bg-bg px-3 py-2 text-xs text-ink2">“{b.guestNote}”</div>}
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {b.status === "PENDING" && (
                    <>
                      <form action={confirmBooking.bind(null, b.id)}>
                        <button className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2">
                          Confirm
                        </button>
                      </form>
                      <form action={declineBooking.bind(null, b.id)}>
                        <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                          Decline
                        </button>
                      </form>
                    </>
                  )}
                  {b.status === "CONFIRMED" && (
                    <form action={completeBooking.bind(null, b.id)}>
                      <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                        Mark completed
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
