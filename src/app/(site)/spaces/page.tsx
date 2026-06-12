import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { PageHero } from "@/components/site/page-hero";
import { SPACES } from "@/lib/content";

export const metadata = {
  title: "Spaces — where you go",
  description: "Three arenas, infinite terrain: Wilderness & Mountains, Ocean & Open Water, Crazy & Urban Edges.",
};

export default function SpacesPage() {
  return (
    <>
      <PageHero
        label="01 — Spaces"
        title={
          <>
            WHERE
            <br />
            YOU GO
          </>
        }
        sub="The arenas. The backdrops. The places that become part of you long after you leave."
      />
      <div className="grid border-b border-line2 md:grid-cols-3">
        {SPACES.map((s, i) => (
          <Link
            key={s.key}
            href={`/spaces/${s.slug}`}
            className="group relative flex min-h-[480px] flex-col justify-end overflow-hidden border-b border-r border-line2 p-9 last:border-r-0 md:border-b-0"
          >
            <Photo src={s.image} alt={s.name} sizes="(max-width:768px) 100vw, 33vw" />
            <div className="ov-bottom" />
            <div className="relative z-10">
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                Space 0{i + 1} · {s.coords}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-white">{s.name}</h2>
              <p className="mt-2 max-w-xs text-[0.8rem] leading-relaxed text-white/60">{s.tagline}</p>
              <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 transition-colors group-hover:text-white">
                Enter space <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
