import Link from "next/link";
import { Plus, Clock } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOwnerDashboard } from "@/lib/data/owner";
import { StatusPill } from "@/components/dash/status-pill";
import { buttonClasses } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function OwnerOverview({ searchParams }: { searchParams: SP }) {
  const user = await requireUser("/owner");
  const owner = await getOwnerDashboard(user.id);
  if (!owner) return null;
  const sp = await searchParams;
  const applied = sp.applied === "1";

  const listings = owner.listings;
  const published = listings.filter((l) => l.status === "PUBLISHED").length;
  const bookings = listings.reduce((a, l) => a + l._count.bookings, 0);

  return (
    <div className="space-y-7">
      {applied && (
        <div className="flex items-start gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3.5 text-sm text-[#92400e]">
          <Clock size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            Application submitted — our team reviews within 48 hours. You can build your listings now;
            they go live once you&apos;re approved.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{owner.businessName}</h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-mid">
            {owner.category} · {owner.city}, {owner.country} <StatusPill status={owner.status} />
          </p>
        </div>
        <Link href="/owner/listings/new" className={buttonClasses("dark", "md")}>
          <Plus size={15} /> New listing
        </Link>
      </div>

      {owner.status !== "APPROVED" && (
        <div className="rounded-xl border border-line bg-white px-5 py-4 text-sm text-mid">
          {owner.status === "PENDING" || owner.status === "REVIEW"
            ? "Your partner profile is awaiting approval. Listings you create stay hidden from travellers until an admin approves your business."
            : "Your partner profile isn't active. Contact support if you think this is a mistake."}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { n: listings.length, l: "Listings" },
          { n: published, l: "Published" },
          { n: bookings, l: "Bookings" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-line2 bg-white px-5 py-5">
            <div className="font-display text-2xl font-extrabold text-ink">{s.n}</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-light">{s.l}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Your listings</h2>
          {listings.length > 0 && (
            <Link href="/owner/listings" className="text-xs font-semibold text-mid hover:text-ink">
              Manage all →
            </Link>
          )}
        </div>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
            <p className="text-sm text-mid">No listings yet. Create your first stay or experience.</p>
            <Link href="/owner/listings/new" className={buttonClasses("dark", "sm", "mt-4")}>
              <Plus size={14} /> New listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 6).map((l) => (
              <Link
                key={l.id}
                href={`/owner/listings/${l.id}`}
                className="rounded-xl border border-line2 bg-white p-4 transition-colors hover:border-line"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6rem] font-bold uppercase tracking-wide text-light">
                    {l.type === "STAY" ? "Stay" : "Experience"}
                  </span>
                  <StatusPill status={l.status} />
                </div>
                <div className="mt-2 font-display text-sm font-bold leading-snug text-ink">{l.title}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-mid">
                  <span>{formatPrice(l.priceCents, l.currency)}</span>
                  <span>{l._count.bookings} bookings</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
