import { Photo } from "@/components/site/photo";

export function PageHero({
  label,
  title,
  sub,
  image,
}: {
  label: string;
  title: React.ReactNode;
  sub?: string;
  image?: string;
}) {
  if (image) {
    return (
      <section className="relative flex min-h-[360px] items-end overflow-hidden border-b border-line2">
        <Photo src={image} alt={typeof title === "string" ? title : label} priority />
        <div className="ov-soft" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-between gap-6 px-6 py-14 sm:px-12 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/45">
              <span className="h-px w-4 bg-white/30" /> {label}
            </div>
            <h1 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white">
              {title}
            </h1>
          </div>
          {sub && <p className="max-w-xs text-sm italic leading-relaxed text-white/65">{sub}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-line2 bg-white px-6 py-16 sm:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="label-tag mb-3">{label}</div>
          <h1 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-ink">
            {title}
          </h1>
        </div>
        {sub && <p className="max-w-xs text-sm italic leading-relaxed text-mid">{sub}</p>}
      </div>
    </section>
  );
}
