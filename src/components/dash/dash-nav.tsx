"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashNav({ items }: { items: { label: string; href: string }[] }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4">
      {items.map((n) => {
        const isRoot = n.href.split("/").length <= 2;
        const active = pathname === n.href || (!isRoot && pathname.startsWith(n.href + "/"));
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
              active ? "border-ink text-ink" : "border-transparent text-mid hover:text-ink",
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}
