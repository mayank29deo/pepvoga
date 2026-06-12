import Link from "next/link";
import { getListingsForAdmin } from "@/lib/data/admin";
import { StatusPill } from "@/components/dash/status-pill";
import { setListingModeration } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Listings · Admin" };

export default async function AdminListingsPage() {
  const listings = await getListingsForAdmin();

  return (
    <div>
      <h1 className="mb-5 font-display text-xl font-extrabold tracking-tight text-ink">Listings</h1>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center text-sm text-mid">
          No listings yet.
        </div>
      ) : (
        <div className="divide-y divide-line2 overflow-hidden rounded-xl border border-line2 bg-white">
          {listings.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.58rem] font-bold uppercase tracking-wide text-light">
                    {l.type === "STAY" ? "Stay" : "Experience"}
                  </span>
                  <StatusPill status={l.status} />
                </div>
                <Link href={`/listings/${l.slug}`} className="mt-1 block truncate font-display text-sm font-bold text-ink hover:underline">
                  {l.title}
                </Link>
                <div className="text-xs text-mid">
                  {l.owner.businessName} <span className="text-light">({l.owner.status})</span> · {l.city}, {l.country} · {formatPrice(l.priceCents, l.currency)}
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                {l.status === "PUBLISHED" ? (
                  <form action={setListingModeration.bind(null, l.id, "SUSPENDED")}>
                    <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                      Suspend
                    </button>
                  </form>
                ) : (
                  <form action={setListingModeration.bind(null, l.id, "PUBLISHED")}>
                    <button className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2">
                      Publish
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
