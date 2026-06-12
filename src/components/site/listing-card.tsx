import Link from "next/link";
import { Star } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { formatPrice } from "@/lib/utils";
import type { ListingCardData } from "@/lib/data/listings";

const UNIT_LABEL: Record<string, string> = {
  PER_NIGHT: "night",
  PER_PERSON: "person",
  PER_SESSION: "session",
  PER_DAY: "day",
  PER_GROUP: "group",
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=80";

export function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link href={`/listings/${listing.slug}`} className="group block">
      <div className="relative h-60 overflow-hidden rounded-2xl">
        <Photo
          src={listing.images[0] ?? FALLBACK_IMG}
          alt={listing.title}
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <div className="ov-bottom" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-ink">
          {listing.type === "STAY" ? "Stay" : "Experience"}
        </span>
        {listing.ratingCount > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
            <Star size={11} className="fill-white" /> {listing.ratingAvg.toFixed(1)}
          </span>
        )}
        <span className="absolute bottom-3 left-3 z-10 text-[0.7rem] text-white/80">
          {listing.city}, {listing.country}
        </span>
      </div>
      <div className="mt-3">
        <h3 className="font-display text-[0.95rem] font-bold leading-tight text-ink group-hover:underline">
          {listing.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-mid">{listing.summary}</p>
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className="font-display font-bold text-ink">
            {formatPrice(listing.priceCents, listing.currency)}
          </span>
          <span className="text-light">/ {UNIT_LABEL[listing.priceUnit] ?? "booking"}</span>
          {listing.sport && (
            <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-[0.62rem] text-mid">
              {listing.sport}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
