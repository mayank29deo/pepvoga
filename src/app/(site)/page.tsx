import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { LandingIntro } from "@/components/site/landing-intro";
import { buttonClasses } from "@/components/ui/button";
import { STATS, TICKER, DESTINATIONS, SITE } from "@/lib/content";

const HERO =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85";

const MOSAIC = [
  { img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1000&q=80", label: "Rock Climbing", span: true },
  { img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80", label: "Scuba Diving" },
  { img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80", label: "Paragliding" },
  { img: "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?auto=format&fit=crop&w=800&q=80", label: "Surfing" },
  { img: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80", label: "Expedition Cycling" },
];

const PERKS = [
  "Book vetted stays & experiences in 80+ countries",
  "Members-only secret spots map worldwide",
  "Gear library — borrow before you buy",
  "Monthly challenges with real stakes",
];

const PARTNER_TAGS = ["Dive Operators", "Surf Schools", "Climbing Gyms", "Adventure Camps", "Homestays", "Gear Rental"];

export default function HomePage() {
  return (
    <>
      <LandingIntro />

      {/* ───────── Hero ───────── */}
      <section className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden px-6 pb-16 pt-28 sm:px-12">
        <Photo src={HERO} alt="Mountain landscape at altitude" priority />
        <div className="ov-soft" />
        <div className="absolute left-6 top-24 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.7rem] font-medium tracking-wide text-white/80 backdrop-blur-md sm:left-12">
          <span className="text-accent">★</span> A marketplace for the untamed
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <Reveal>
            <h1 className="font-display text-[clamp(4rem,12vw,11rem)] font-extrabold leading-[0.88] tracking-[-0.05em] text-white">
              PEPVOGA
            </h1>
          </Reveal>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal delay={120}>
              <p className="max-w-md font-display text-lg font-light leading-relaxed text-white/80">
                Book stays and experiences for people who measure weekends in
                altitude gained, waves caught, and places nobody else has been.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="flex flex-col items-start gap-2.5 sm:items-end">
                <Link href="/stays" className={buttonClasses("accent", "md")}>
                  Explore Stays <ArrowRight size={15} />
                </Link>
                <Link
                  href="/experiences"
                  className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-[0.8rem] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  View Experiences
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-16 right-8 z-10 hidden text-right sm:block">
          <span className="block text-[0.58rem] tracking-[0.16em] text-white/40">{SITE.coords}</span>
          <span className="block text-[0.58rem] tracking-[0.16em] text-white/40">ALT 216 M</span>
        </div>
      </section>

      {/* ───────── Destination pins ───────── */}
      <div className="border-b border-line2 bg-white">
        <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.name}
              href={`/stays?q=${encodeURIComponent(d.name)}`}
              className="flex flex-shrink-0 items-center gap-2.5 border-r border-line2 px-7 py-3.5 transition-colors hover:bg-bg"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
              <span>
                <span className="block text-xs font-semibold text-ink2">{d.name}</span>
                <span className="block text-[0.65rem] text-light">{d.region}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ───────── Ticker ───────── */}
      <div className="overflow-hidden border-b border-line2 bg-white py-3.5">
        <div className="animate-tick">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-6 text-[0.7rem] font-medium tracking-wide text-mid">
              {t}
              <span className="pl-6 text-light">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────── Split: Stays / Experiences ───────── */}
      <div className="grid md:grid-cols-2">
        <SplitCard
          href="/stays"
          num="01"
          title="Stays"
          desc="Camps, homestays, lodges and basecamps in wild places — vetted, characterful, and close to the action."
          img="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"
          cta="Explore Stays"
        />
        <SplitCard
          href="/experiences"
          num="02"
          title="Experiences"
          desc="Scuba, surf, climb, fly, ride — 80+ disciplines run by local operators who live and breathe them."
          img="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80"
          cta="View Experiences"
        />
      </div>

      {/* ───────── Stats ───────── */}
      <div className="grid grid-cols-2 border-b border-line2 bg-white md:grid-cols-4">
        {STATS.map((s) => (
          <Reveal key={s.label} className="border-b border-r border-line2 px-8 py-9 last:border-r-0 md:border-b-0">
            <span className="block font-display text-4xl font-extrabold tracking-tight text-ink">{s.value}</span>
            <span className="text-[0.7rem] uppercase tracking-wide text-light">{s.label}</span>
          </Reveal>
        ))}
      </div>

      {/* ───────── Manifesto ───────── */}
      <section className="grid gap-12 bg-white px-6 py-20 sm:px-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="label-tag mb-4">Our manifesto</div>
          <p className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] font-light leading-snug text-ink2">
            “The best stories are never told from a desk.{" "}
            <em className="italic text-accent">Go find yours.</em>”
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="max-w-md">
            <p className="mb-4 text-sm leading-relaxed text-mid">
              pepvoga was built for the people who open Google Maps and zoom into
              blank terrain — just to wonder what&apos;s there.
            </p>
            <p className="mb-6 text-sm leading-relaxed text-mid">
              From rooftop slacklining in Tokyo to whitewater kayaking in
              Patagonia — if it raises your pulse and feeds your soul, you can
              book it here.
            </p>
            <Link href="/about" className={buttonClasses("dark", "md")}>
              Our story <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ───────── Mosaic ───────── */}
      <div className="grid grid-cols-2 gap-0.5 bg-bg md:grid-cols-3 md:[grid-template-rows:280px_280px]">
        {MOSAIC.map((m) => (
          <div
            key={m.label}
            className={`group relative h-60 overflow-hidden md:h-auto ${m.span ? "md:row-span-2" : ""}`}
          >
            <Photo src={m.img} alt={m.label} sizes="(max-width:768px) 50vw, 33vw" />
            <div className="ov-bottom" />
            <span className="absolute bottom-3.5 left-3.5 z-10 rounded-full bg-ink/35 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-white/80 backdrop-blur-sm">
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* ───────── Partner band ───────── */}
      <section className="bg-ink px-6 py-14 sm:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="font-display text-xl font-bold text-white">
              Run a camp, school, or dive centre?
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              List your stays and experiences on pepvoga — get discovered by
              12,000 adventurers actively looking for what you offer. Zero
              commission, you own every booking.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PARTNER_TAGS.map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] text-white/50">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Link href="/partners" className={buttonClasses("white", "md")}>
            Partner with us <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ───────── Join ───────── */}
      <div className="grid md:grid-cols-2">
        <div className="bg-ink px-6 py-20 sm:px-12">
          <div className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/40">
            <span className="h-px w-4 bg-white/25" /> Join the community
          </div>
          <h2 className="font-display text-[clamp(2.4rem,4vw,3.6rem)] font-extrabold leading-[0.9] tracking-tight text-white">
            STEP
            <br />
            OUTSIDE.
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            12,000 people already chose this. Your next adventure — and the
            people to share it with — are already in here.
          </p>
        </div>
        <div className="bg-white px-6 py-20 sm:px-12">
          <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-wide text-mid">
            Get early access
          </div>
          <NewsletterForm source="home" />
          <p className="mt-2.5 text-xs text-light">
            No spam. No sponsored posts. Just the wild stuff.
          </p>
          <ul className="mt-8 border-t border-line2 pt-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 border-b border-line2 py-3 text-sm text-ink2">
                <span className="text-light">→</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function SplitCard({
  href,
  num,
  title,
  desc,
  img,
  cta,
}: {
  href: string;
  num: string;
  title: string;
  desc: string;
  img: string;
  cta: string;
}) {
  return (
    <Link href={href} className="group relative flex min-h-[500px] flex-col justify-end overflow-hidden p-11">
      <Photo src={img} alt={title} sizes="(max-width:768px) 100vw, 50vw" />
      <div className="ov-bottom" />
      <div className="relative z-10">
        <div className="mb-auto font-display text-7xl font-extrabold leading-none text-white/10">{num}</div>
        <div className="mt-40 font-display text-3xl font-bold tracking-tight text-white">{title}</div>
        <p className="mt-2.5 max-w-sm text-[0.82rem] leading-relaxed text-white/65">{desc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 border-b border-white/30 pb-1 text-xs font-semibold text-white transition-colors group-hover:border-white/70">
          {cta} <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
