import { PageHero } from "@/components/site/page-hero";
import { ListingFilters } from "@/components/site/listing-filters";
import { ResultsGrid } from "@/components/site/results-grid";
import { getListings, type ListingFilters as Filters, type ListingSort } from "@/lib/data/listings";

export const metadata = {
  title: "Stays — sleep wild",
  description: "Camps, homestays, lodges and basecamps in the places worth waking up to.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function StaysPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const filters: Filters = {
    type: "STAY",
    space: str(sp.space) as Filters["space"],
    q: str(sp.q),
    sort: (str(sp.sort) as ListingSort) ?? "featured",
  };
  const listings = await getListings(filters);

  return (
    <>
      <PageHero
        label="Stays"
        title={
          <>
            SLEEP
            <br />
            WILD
          </>
        }
        sub="Camps, homestays, lodges and basecamps in the places worth waking up to."
      />
      <ListingFilters
        basePath="/stays"
        current={{ q: filters.q, space: filters.space, sort: filters.sort }}
      />
      <ResultsGrid listings={listings} noun="stay" />
    </>
  );
}
