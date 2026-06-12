import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOwnerDashboard } from "@/lib/data/owner";
import { StatusPill } from "@/components/dash/status-pill";
import { buttonClasses } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Listings" };

export default async function OwnerListingsPage() {
  const user = await requireUser("/owner/listings");
  const owner = await getOwnerDashboard(user.id);
  const listings = owner?.listings ?? [];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">Listings</h1>
        <Link href="/owner/listings/new" className={buttonClasses("dark", "sm")}>
          <Plus size={14} /> New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-sm text-mid">No listings yet.</p>
          <Link href="/owner/listings/new" className={buttonClasses("dark", "sm", "mt-4")}>
            <Plus size={14} /> Create your first
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line2 overflow-hidden rounded-xl border border-line2 bg-white">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/owner/listings/${l.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-bg"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[0.58rem] font-bold uppercase tracking-wide text-light">
                    {l.type === "STAY" ? "Stay" : "Experience"}
                  </span>
                  <StatusPill status={l.status} />
                </div>
                <div className="mt-1 truncate font-display text-sm font-bold text-ink">{l.title}</div>
                <div className="text-xs text-mid">{l.city}, {l.country}</div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-ink">{formatPrice(l.priceCents, l.currency)}</div>
                <div className="text-xs text-light">{l._count.bookings} bookings</div>
              </div>
              <ChevronRight size={16} className="text-light" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
