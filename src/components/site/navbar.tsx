"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { buttonClasses } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type NavUser = { name: string | null; role: string } | null;

function dashFor(role: string) {
  return role === "ADMIN" ? "/admin" : role === "OWNER" ? "/owner" : "/account";
}

export function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dash = user ? dashFor(user.role) : "/account";
  const firstName = user?.name?.split(" ")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-line2 bg-bg/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[62px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-[0.95rem] font-extrabold tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          pepvoga
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "text-xs font-medium transition-colors hover:text-ink",
                    active ? "text-ink" : "text-mid",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                href={dash}
                className="flex items-center gap-1.5 rounded-md bg-bg3 px-3.5 py-1.5 text-xs font-medium text-ink2 transition-colors hover:bg-bg2"
              >
                <LayoutDashboard size={13} /> {firstName}
              </Link>
              <form action={logout}>
                <button className="px-2 text-xs font-medium text-mid transition-colors hover:text-ink">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/partners"
                className="px-2 text-xs font-medium text-mid transition-colors hover:text-ink"
              >
                For Partners
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-bg3 px-3.5 py-1.5 text-xs font-medium text-mid transition-colors hover:bg-bg2 hover:text-ink"
              >
                Sign in
              </Link>
              <Link href="/register" className={buttonClasses("dark", "sm")}>
                Join
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line2 bg-bg px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink2 hover:bg-bg2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/partners"
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink2 hover:bg-bg2"
              >
                For Partners
              </Link>
            </li>
          </ul>
          {user ? (
            <div className="mt-3 flex gap-2">
              <Link
                href={dash}
                onClick={() => setOpen(false)}
                className={buttonClasses("outline", "sm", "flex-1")}
              >
                {firstName}
              </Link>
              <form action={logout} className="flex-1">
                <button className={buttonClasses("dark", "sm", "w-full")}>Sign out</button>
              </form>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={buttonClasses("outline", "sm", "flex-1")}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={buttonClasses("dark", "sm", "flex-1")}
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
