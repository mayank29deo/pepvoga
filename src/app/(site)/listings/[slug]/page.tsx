import { notFound } from "next/navigation";
import { Star, MapPin, Users, Clock, ShieldCheck } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { BookingWidget } from "@/components/site/booking-widget";
import { getListingBySlug } from "@/lib/data/listings";
import { getCurrentUser } from "@/lib/session";
import { fmtDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  return { title: listing?.title ?? "Listing", description: listing?.summary };
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [listing, user] = await Promise.all([getListingBySlug(slug), getCurrentUser()]);
  if (!listing) notFound();

  const images = listing.images;
  const slots = listing.availability
    .map((a) => ({
      id: a.id,
      date: a.date.toISOString(),
      startTime: a.startTime,
      remaining: a.capacity - a.booked,
    }))
    .filter((s) => s.remaining > 0);

  return (
    <>
      {/* Gallery */}
      <section className="mx-auto max-w-[1400px] px-6 pt-8 sm:px-12">
        <div className="grid h-[300px] gap-2 md:h-[440px] md:grid-cols-[2fr_1fr] md:grid-rows-2">
          <div className="relative overflow-hidden rounded-2xl md:row-span-2">
            <Photo src={images[0] ?? ""} alt={listing.title} priority sizes="(max-width:768px) 100vw, 66vw" />
          </div>
          {[images[1], images[2]].map((img, i) =>
            img ? (
              <div key={i} className="relative hidden overflow-hidden rounded-2xl md:block">
                <Photo src={img} alt={`${listing.title} ${i + 2}`} sizes="33vw" />
              </div>
            ) : (
              <div key={i} className="hidden rounded-2xl bg-bg2 md:block" />
            ),
          )}
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 py-10 sm:px-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-white">
              {listing.type === "STAY" ? "Stay" : "Experience"}
            </span>
            {listing.sport && (
              <span className="rounded-full border border-line px-2.5 py-1 text-[0.62rem] text-mid">{listing.sport}</span>
            )}
            {listing.ratingCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-ink">
                <Star size={13} className="fill-ink" /> {listing.ratingAvg.toFixed(1)}
                <span className="font-normal text-light">({listing.ratingCount})</span>
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight tracking-tight text-ink">
            {listing.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-mid">
            <MapPin size={14} /> {listing.city}, {listing.country}
          </p>

          <div className="mt-5 flex flex-wrap gap-5 border-y border-line2 py-4 text-sm text-ink2">
            {listing.maxGroupSize && (
              <span className="flex items-center gap-2"><Users size={15} className="text-mid" /> Up to {listing.maxGroupSize}</span>
            )}
            {listing.maxGuests && (
              <span className="flex items-center gap-2"><Users size={15} className="text-mid" /> Sleeps {listing.maxGuests}</span>
            )}
            {listing.durationMinutes && (
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-mid" />
                {listing.durationMinutes >= 1440
                  ? `${Math.round(listing.durationMinutes / 1440)} day(s)`
                  : `${listing.durationMinutes} min`}
              </span>
            )}
            <span className="flex items-center gap-2 capitalize">
              <ShieldCheck size={15} className="text-mid" /> {listing.level.toLowerCase()} level
            </span>
          </div>

          <p className="mt-6 whitespace-pre-line text-[0.92rem] leading-relaxed text-ink2">{listing.description}</p>

          {listing.highlights.length > 0 && (
            <Section title="Highlights">
              <ul className="grid gap-2 sm:grid-cols-2">
                {listing.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink" /> {h}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {listing.included.length > 0 && (
            <Section title="What's included">
              <div className="flex flex-wrap gap-2">
                {listing.included.map((i) => (
                  <span key={i} className="rounded-full bg-bg2 px-3 py-1.5 text-xs text-ink2">{i}</span>
                ))}
              </div>
            </Section>
          )}

          {listing.amenities.length > 0 && (
            <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink2">{a}</span>
                ))}
              </div>
            </Section>
          )}

          <Section title="Hosted by">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="font-display text-base font-bold text-ink">{listing.owner.businessName}</div>
              <div className="text-xs text-mid">
                {listing.owner.category} · {listing.owner.city}, {listing.owner.country}
              </div>
              {listing.owner.description && (
                <p className="mt-2 text-sm leading-relaxed text-mid">{listing.owner.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-light">
                {listing.owner.certifications && <span>✓ {listing.owner.certifications}</span>}
                {listing.owner.languages && <span>Speaks {listing.owner.languages}</span>}
              </div>
            </div>
          </Section>

          {listing.reviews.length > 0 && (
            <Section title={`Reviews (${listing.ratingCount})`}>
              <div className="grid gap-4 sm:grid-cols-2">
                {listing.reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-line2 bg-white p-5">
                    <div className="flex items-center gap-1 text-ink">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-ink" : "text-light"} />
                      ))}
                    </div>
                    {r.title && <div className="mt-2 text-sm font-semibold text-ink">{r.title}</div>}
                    <p className="mt-1 text-sm leading-relaxed text-mid">{r.body}</p>
                    <div className="mt-3 text-xs text-light">
                      {r.user.name ?? "A traveller"} · {fmtDate(r.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Booking */}
        <aside className="h-fit lg:sticky lg:top-20">
          <BookingWidget
            listingId={listing.id}
            slug={listing.slug}
            type={listing.type}
            priceCents={listing.priceCents}
            currency={listing.currency}
            priceUnit={listing.priceUnit}
            minNights={listing.minNights}
            isLoggedIn={!!user}
            slots={slots}
          />
        </aside>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 font-display text-lg font-bold tracking-tight text-ink">{title}</h2>
      {children}
    </div>
  );
}
