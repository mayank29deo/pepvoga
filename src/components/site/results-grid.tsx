import { Compass } from "lucide-react";
import { ListingCard } from "@/components/site/listing-card";
import type { ListingCardData } from "@/lib/data/listings";

export function ResultsGrid({
  listings,
  noun,
}: {
  listings: ListingCardData[];
  noun: string;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-12">
      <div className="mb-6 text-xs font-medium uppercase tracking-wide text-light">
        {listings.length} {noun}
        {listings.length === 1 ? "" : "s"}
      </div>
      {listings.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-20 text-center">
          <Compass size={28} className="text-light" />
          <h3 className="mt-4 font-display text-lg font-bold text-ink">Nothing here yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-mid">
            No {noun}s match this search. Once operators start listing, this is
            where the good stuff shows up — try widening your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </section>
  );
}
