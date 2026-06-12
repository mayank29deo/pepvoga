import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getOwner, getOwnerListing } from "@/lib/data/owner";
import { setListingStatus, deleteListing } from "@/lib/actions/listing";
import { ListingForm, type ListingInitial } from "@/components/owner/listing-form";
import { AvailabilityForm } from "@/components/owner/availability-form";
import { StatusPill } from "@/components/dash/status-pill";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SP;
}) {
  const { id } = await params;
  const user = await requireUser(`/owner/listings/${id}`);
  const [listing, owner, sp] = await Promise.all([
    getOwnerListing(user.id, id),
    getOwner(user.id),
    searchParams,
  ]);
  if (!listing) notFound();
  const saved = sp.saved === "1";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureAvail = listing.availability.filter((a) => new Date(a.date) >= today);

  const initial: ListingInitial = {
    type: listing.type,
    title: listing.title,
    summary: listing.summary,
    description: listing.description,
    space: listing.space,
    sport: listing.sport ?? "",
    city: listing.city,
    country: listing.country,
    region: listing.region ?? "",
    price: (listing.priceCents / 100).toString(),
    currency: listing.currency,
    priceUnit: listing.priceUnit,
    maxGuests: listing.maxGuests?.toString() ?? "",
    minNights: listing.minNights?.toString() ?? "",
    maxGroupSize: listing.maxGroupSize?.toString() ?? "",
    durationMinutes: listing.durationMinutes?.toString() ?? "",
    level: listing.level,
    images: listing.images.join("\n"),
    highlights: listing.highlights.join("\n"),
    included: listing.included.join("\n"),
    amenities: listing.amenities.join("\n"),
  };

  return (
    <div className="max-w-2xl">
      <Link href="/owner/listings" className="inline-flex items-center gap-1 text-xs text-mid transition-colors hover:text-ink">
        <ArrowLeft size={13} /> Back to listings
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{listing.title}</h1>
            <StatusPill status={listing.status} />
          </div>
          <p className="mt-1 text-sm text-mid">{listing.city}, {listing.country} · {listing._count.bookings} bookings</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {listing.status === "PUBLISHED" && owner?.status === "APPROVED" && (
            <Link
              href={`/listings/${listing.slug}`}
              className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink"
            >
              View public <ExternalLink size={12} />
            </Link>
          )}
          {listing.status === "PUBLISHED" ? (
            <form action={setListingStatus.bind(null, listing.id, "DRAFT")}>
              <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                Unpublish
              </button>
            </form>
          ) : (
            <form action={setListingStatus.bind(null, listing.id, "PUBLISHED")}>
              <button className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2">
                Publish
              </button>
            </form>
          )}
        </div>
      </div>

      {saved && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#f0fdf4] px-3 py-2 text-xs text-[#166534]">
          <Check size={13} /> Listing saved.
        </p>
      )}

      {owner?.status !== "APPROVED" && listing.status === "PUBLISHED" && (
        <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-xs text-mid">
          This listing is published but stays hidden from travellers until your business is approved by an admin.
        </p>
      )}

      {/* Availability */}
      <section className="mt-7 rounded-2xl border border-line2 bg-white p-5">
        <div className="mb-1 font-display text-base font-bold text-ink">Availability</div>
        <p className="mb-4 text-xs text-mid">
          {futureAvail.length > 0
            ? `${futureAvail.length} open ${listing.type === "STAY" ? "nights" : "slots"} upcoming. Add more below.`
            : "No upcoming availability yet — generate some so travellers can book."}
        </p>
        <AvailabilityForm listingId={listing.id} isExperience={listing.type === "EXPERIENCE"} />
      </section>

      {/* Edit form */}
      <section className="mt-7">
        <h2 className="mb-4 font-display text-base font-bold text-ink">Listing details</h2>
        <ListingForm listingId={listing.id} initial={initial} />
      </section>

      {/* Danger zone */}
      <section className="mt-8 rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-5">
        <div className="font-display text-sm font-bold text-[#b91c1c]">Delete listing</div>
        <p className="mb-3 mt-1 text-xs text-mid">This permanently removes the listing and its availability. Bookings are kept for records.</p>
        <form action={deleteListing.bind(null, listing.id)}>
          <button className="rounded-lg border border-[#fca5a5] px-3 py-2 text-xs font-semibold text-[#b91c1c] transition-colors hover:bg-[#fee2e2]">
            Delete permanently
          </button>
        </form>
      </section>
    </div>
  );
}
