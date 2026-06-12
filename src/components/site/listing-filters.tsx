import { Search } from "lucide-react";
import { SPACES, SPORTS } from "@/lib/content";
import { slugify } from "@/lib/utils";

const SELECT =
  "rounded-lg border border-line bg-white px-3 py-2.5 text-xs text-ink2 outline-none focus:border-ink";

export function ListingFilters({
  basePath,
  showSport = false,
  current,
}: {
  basePath: string;
  showSport?: boolean;
  current: { q?: string; space?: string; sport?: string; sort?: string };
}) {
  return (
    <form
      action={basePath}
      method="GET"
      className="flex flex-wrap items-center gap-2 border-b border-line2 bg-white px-6 py-4 sm:px-12"
    >
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 has-[:focus]:border-ink">
        <Search size={15} className="text-light" />
        <input
          name="q"
          defaultValue={current.q ?? ""}
          placeholder="Search destinations, sports, places…"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-light"
        />
      </div>

      <select name="space" defaultValue={current.space ?? ""} className={SELECT}>
        <option value="">All spaces</option>
        {SPACES.map((s) => (
          <option key={s.key} value={s.key}>
            {s.name}
          </option>
        ))}
      </select>

      {showSport && (
        <select name="sport" defaultValue={current.sport ?? ""} className={SELECT}>
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s.slug} value={slugify(s.name)}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      <select name="sort" defaultValue={current.sort ?? "featured"} className={SELECT}>
        <option value="featured">Featured</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="rating">Top rated</option>
      </select>

      <button
        type="submit"
        className="rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink2"
      >
        Search
      </button>
    </form>
  );
}
