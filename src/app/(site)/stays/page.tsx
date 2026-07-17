import { PageHero } from "@/components/site/page-hero";
import { ListingFilters } from "@/components/site/listing-filters";
import { ResultsGrid } from "@/components/site/results-grid";
import { getListings, type ListingFilters as Filters, type ListingSort } from "@/lib/data/listings";

// Looping crossfade montage behind the header — wild places to sleep.
const HERO_REEL = [
  "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?auto=format&fit=crop&w=1600&q=75", // tent under the Milky Way
  "https://images.unsplash.com/photo-1515950878003-6d8db4e1042f?auto=format&fit=crop&w=1600&q=75", // alpine snow hut
  "https://images.unsplash.com/photo-1583878594798-c31409c8ab4a?auto=format&fit=crop&w=1600&q=75", // lakeside lodge
  "https://images.unsplash.com/photo-1619047459149-05ce77e795ba?auto=format&fit=crop&w=1600&q=75", // jungle treehouse
  "https://images.unsplash.com/photo-1527419105721-af1f23c86dec?auto=format&fit=crop&w=1600&q=75", // desert camp
  "https://images.unsplash.com/photo-1637687222430-ca092fb9062a?auto=format&fit=crop&w=1600&q=75", // forest cabin
];

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
        reel={HERO_REEL}
      />
      <ListingFilters
        basePath="/stays"
        current={{ q: filters.q, space: filters.space, sort: filters.sort }}
      />
      <ResultsGrid listings={listings} noun="stay" />
    </>
  );
}
