import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { buttonClasses } from "@/components/ui/button";
import { VALUES } from "@/lib/content";

export const metadata = {
  title: "About — we don't do ordinary",
  description: "pepvoga is a community-built marketplace for the outdoors. Our story, values, and team.",
};

const TEAM = [
  { emoji: "🧗", name: "Aryan S.", role: "Founder" },
  { emoji: "🏄", name: "Maya R.", role: "Community" },
  { emoji: "🤿", name: "Kai T.", role: "Experiences" },
  { emoji: "🚵", name: "Priya K.", role: "Partnerships" },
];

const STORY = [
  "pepvoga was born from a simple frustration — there was no single place where people who live for the outdoors could discover trips, book them, and push each other further.",
  "We are not a travel agency. We are not a fitness app. We are a community-built marketplace — raw, spirited, and utterly obsessed with the world beyond the four walls of convention.",
  "From rooftop slacklining in Tokyo to whitewater kayaking in Patagonia — if it raises your pulse and feeds your soul, it belongs here.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our story"
        title={
          <>
            WE DON&apos;T DO
            <br />
            ORDINARY.
          </>
        }
        image="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="border-b border-line2 bg-white px-6 py-20 sm:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,2.5vw,2.4rem)] font-light leading-snug text-ink2">
              “We built this for the ones who open{" "}
              <strong className="font-bold text-ink">Google Maps</strong> and zoom
              into blank terrain — just to wonder what&apos;s there.”
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div>
              {STORY.map((p) => (
                <p key={p} className="mb-4 text-sm leading-relaxed text-mid">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1400px] gap-px overflow-hidden rounded-2xl bg-line2 md:grid-cols-2">
          {VALUES.map((v) => (
            <Reveal key={v.title} className="bg-bg p-9">
              <div className="font-display text-base font-bold tracking-tight text-ink">{v.title}</div>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-mid">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="label-tag mb-3">The team</div>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight text-ink">
            Built by obsessives.
          </h2>
          <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-2xl bg-white p-7 text-center shadow-card">
                <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-bg2 text-2xl">
                  {m.emoji}
                </div>
                <div className="font-display text-[0.8rem] font-bold tracking-tight text-ink">{m.name}</div>
                <div className="text-[0.68rem] text-light">{m.role}</div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/partners" className={buttonClasses("dark", "md")}>
              Partner with us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
