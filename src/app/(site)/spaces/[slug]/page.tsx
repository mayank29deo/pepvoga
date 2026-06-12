import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { buttonClasses } from "@/components/ui/button";
import { SPACES } from "@/lib/content";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = SPACES.find((s) => s.slug === slug);
  return { title: space ? space.name : "Space" };
}

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = SPACES.find((s) => s.slug === slug);
  if (!space) notFound();
  const index = SPACES.indexOf(space) + 1;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[520px] items-end overflow-hidden border-b border-line2">
        <Photo src={space.image} alt={space.name} priority />
        <div className="ov-left" />
        <div className="relative z-10 grid w-full max-w-[1400px] gap-12 px-6 py-16 sm:px-12 md:mx-auto md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/45">
              <span className="h-px w-4 bg-white/30" /> Space 0{index}
            </div>
            <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.05em] text-white">
              {space.short}
            </h1>
            <p className="mt-4 text-base italic leading-relaxed text-white/65">{space.tagline}</p>
          </div>
          <div>
            <p className="mb-5 text-[0.82rem] leading-relaxed text-white/55">{space.blurb}</p>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10">
              {space.attrs.map((a) => (
                <div key={a.k} className="bg-ink/50 px-5 py-4 backdrop-blur-sm">
                  <div className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/40">{a.k}</div>
                  <div className="text-[0.78rem] text-white/75">{a.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sports in this space */}
      <div className="border-b border-line2 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-line2 px-6 py-7 sm:px-12">
          <span className="font-display text-[0.95rem] font-bold text-ink">Sports in this space</span>
          <Link href="/experiences" className={buttonClasses("outline", "sm")}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {space.sports.map((sport) => (
            <Link
              key={sport}
              href={`/experiences?sport=${slugify(sport)}`}
              className="border-b border-r border-line2 px-7 py-8 transition-colors hover:bg-bg"
            >
              <div className="font-display text-[0.92rem] font-bold tracking-tight text-ink">{sport}</div>
              <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-mid">
                Browse <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
