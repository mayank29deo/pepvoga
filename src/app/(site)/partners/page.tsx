import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { buttonClasses } from "@/components/ui/button";
import { PROVIDER_CATEGORIES, PARTNER_BENEFITS, PARTNER_STEPS } from "@/lib/content";

export const metadata = {
  title: "Partner with us",
  description: "List your stays and experiences on pepvoga. Reach 12,000 active adventurers. Zero commission.",
};

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line2 bg-white px-6 py-16 sm:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <div className="label-tag mb-3">For service providers</div>
            <h1 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-ink">
              PARTNER
              <br />
              WITH US.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mid">
              Reach 12,000 active adventure seekers already looking for exactly
              what you offer. No cold leads — just warm community.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/partners/apply" className={buttonClasses("dark", "md")}>
                Apply to partner <ArrowRight size={15} />
              </Link>
              <Link href="/login" className={buttonClasses("outline", "md")}>
                Partner login
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[0.85rem] leading-relaxed text-mid">
              Our members are obsessed. They travel specifically for sport, spend
              significantly on gear and experiences, and trust community
              recommendations over ads.
            </p>
            <p className="text-[0.85rem] leading-relaxed text-mid">
              When you list on pepvoga, you&apos;re not buying a banner — your camps,
              courses, and stays become part of how the community explores the world.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="bg-bg">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 border-b border-line2 px-6 py-12 sm:px-12 md:flex-row md:items-end">
          <div>
            <div className="label-tag mb-3">Who can partner</div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight text-ink">
              Your category
            </h2>
          </div>
          <p className="max-w-xs text-sm italic leading-relaxed text-mid">
            If you serve adventurers, you belong here.
          </p>
        </div>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 bg-white md:grid-cols-3">
          {PROVIDER_CATEGORIES.map((c) => (
            <Link
              key={c.type}
              href="/partners/apply"
              className="group border-b border-r border-line2 p-9 transition-colors hover:bg-bg"
            >
              <div className="text-3xl grayscale transition-all group-hover:grayscale-0">{c.icon}</div>
              <div className="mt-4 font-display text-[0.95rem] font-bold tracking-tight text-ink">{c.type}</div>
              <p className="mt-2 text-[0.76rem] leading-relaxed text-mid">{c.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-light transition-colors group-hover:text-ink">
                Apply <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why + How */}
      <section className="mx-auto grid max-w-[1400px] gap-16 px-6 py-16 sm:px-12 md:grid-cols-2">
        <Reveal>
          <div className="label-tag mb-3">Why partner</div>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight text-ink">
            What you get
          </h2>
          <ul className="mt-5">
            {PARTNER_BENEFITS.map((b, i) => (
              <li key={b.title} className="grid grid-cols-[30px_1fr] gap-3.5 border-b border-line2 py-4">
                <span className="font-display text-xs font-extrabold text-light">0{i + 1}</span>
                <div>
                  <strong className="block text-[0.82rem] font-bold text-ink">{b.title}</strong>
                  <span className="text-[0.8rem] leading-relaxed text-mid">{b.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="label-tag mb-3">Onboarding process</div>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight text-ink">
            How it works
          </h2>
          <div className="mt-5">
            {PARTNER_STEPS.map((s, i) => (
              <div key={s.title} className="grid grid-cols-[28px_1fr] gap-3.5 border-b border-line2 py-4">
                <span className="font-display text-lg font-extrabold text-line">0{i + 1}</span>
                <div>
                  <strong className="block text-[0.82rem] font-bold text-ink">{s.title}</strong>
                  <span className="text-[0.8rem] leading-relaxed text-mid">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/partners/apply" className={buttonClasses("dark", "md", "mt-6")}>
            Start application <ArrowRight size={15} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
