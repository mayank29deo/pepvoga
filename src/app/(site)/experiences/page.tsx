import { PageHero } from "@/components/site/page-hero";
import { ListingFilters } from "@/components/site/listing-filters";
import { ResultsGrid } from "@/components/site/results-grid";
import { getListings, type ListingFilters as Filters, type ListingSort } from "@/lib/data/listings";

// Looping crossfade montage behind the header — surf, dive, climb, fly, ride, trek.
const HERO_REEL = [
  "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?auto=format&fit=crop&w=1600&q=75",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=75",
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=75",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1600&q=75",
  "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=75",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=75",
];

export const metadata = {
  title: "Experiences — what you do",
  description: "Scuba, surf, climb, fly, ride — 80+ disciplines run by vetted local operators.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function ExperiencesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const filters: Filters = {
    type: "EXPERIENCE",
    space: str(sp.space) as Filters["space"],
    sport: str(sp.sport),
    q: str(sp.q),
    sort: (str(sp.sort) as ListingSort) ?? "featured",
  };
  const listings = await getListings(filters);

  return (
    <>
      <PageHero
        label="Experiences"
        title={
          <>
            WHAT
            <br />
            YOU DO
          </>
        }
        sub="Scuba, surf, climb, fly, ride — choose your obsession, or collect them all."
        reel={HERO_REEL}
      />
      <ListingFilters
        basePath="/experiences"
        showSport
        current={{ q: filters.q, space: filters.space, sport: filters.sport, sort: filters.sort }}
      />
      <ResultsGrid listings={listings} noun="experience" />
    </>
  );
}
