import Link from "next/link";
import { getAdminStats, getOwnersForAdmin } from "@/lib/data/admin";
import { StatusPill } from "@/components/dash/status-pill";
import { setOwnerStatus } from "@/lib/actions/admin";
import { fmtDate } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminOverview() {
  const [stats, pending] = await Promise.all([getAdminStats(), getOwnersForAdmin("pending")]);

  const cards = [
    { n: stats.owners, l: "Partners" },
    { n: stats.pending, l: "Pending" },
    { n: stats.approved, l: "Approved" },
    { n: stats.listings, l: "Listings" },
    { n: stats.bookings, l: "Bookings" },
  ];

  return (
    <div className="space-y-7">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Admin dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.l} className="rounded-xl border border-line2 bg-white px-5 py-5">
            <div className="font-display text-2xl font-extrabold text-ink">{c.n}</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-light">{c.l}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Pending applications</h2>
          <Link href="/admin/applications" className="text-xs font-semibold text-mid hover:text-ink">
            All applications →
          </Link>
        </div>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-mid">
            Nothing waiting for review. 🎉
          </div>
        ) : (
          <div className="divide-y divide-line2 overflow-hidden rounded-xl border border-line2 bg-white">
            {pending.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <div className="font-display text-sm font-bold text-ink">{o.businessName}</div>
                  <div className="text-xs text-mid">
                    {o.category} · {o.city}, {o.country} · {o.user.email}
                  </div>
                  <div className="text-[0.65rem] text-light">Submitted {fmtDate(o.submittedAt)}</div>
                </div>
                <div className="flex gap-2">
                  <form action={setOwnerStatus.bind(null, o.id, "APPROVED")}>
                    <button className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2">
                      Approve
                    </button>
                  </form>
                  <form action={setOwnerStatus.bind(null, o.id, "REVIEW")}>
                    <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                      Review
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
