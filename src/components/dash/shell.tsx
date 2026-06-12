import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { DashNav } from "./dash-nav";

export function DashShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-line2 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-base font-extrabold tracking-tight text-ink">
            pepvoga
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-[0.65rem] font-semibold uppercase tracking-wide text-light sm:block">
              {title}
            </span>
            <Link href="/" className="text-xs text-mid transition-colors hover:text-ink">
              View site
            </Link>
            <form action={logout}>
              <button className="text-xs font-medium text-mid transition-colors hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <DashNav items={nav} />
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
