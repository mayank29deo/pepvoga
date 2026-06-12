import Link from "next/link";

const COLS = [
  {
    title: "Explore",
    links: [
      { label: "Stays", href: "/stays" },
      { label: "Experiences", href: "/experiences" },
      { label: "Spaces", href: "/spaces" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "For Partners",
    links: [
      { label: "Why partner", href: "/partners" },
      { label: "List your space", href: "/partners/apply" },
      { label: "Partner login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Join the community", href: "/register" },
      { label: "Admin", href: "/admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line2 bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-12">
        <div>
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-ink">
            pepvoga
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mid">
            A marketplace for the untamed. Adventure stays and experiences with
            vetted local operators worldwide.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-light">
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-mid transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line2">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-light sm:flex-row sm:px-8 lg:px-12">
          <span>© 2026 pepvoga</span>
          <span className="font-display tracking-wide">{`28°36'N 77°12'E · ALT 216M`}</span>
        </div>
      </div>
    </footer>
  );
}
