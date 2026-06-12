"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { joinNewsletter, type NewsletterState } from "@/lib/actions/newsletter";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source = "site",
  variant = "light",
}: {
  source?: string;
  variant?: "light" | "dark";
}) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    joinNewsletter,
    null,
  );

  if (state?.ok) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-4 py-3.5 text-sm",
          variant === "dark"
            ? "border-white/15 bg-white/10 text-white"
            : "border-line bg-bg2 text-ink",
        )}
      >
        <Check size={16} /> {state.message}
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="source" value={source} />
      <div
        className={cn(
          "flex overflow-hidden rounded-xl border",
          variant === "dark" ? "border-white/20 bg-white/5" : "border-line bg-white",
        )}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className={cn(
            "flex-1 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-light",
            variant === "dark" ? "text-white placeholder:text-white/40" : "text-ink",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 bg-ink px-5 text-xs font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
        >
          {pending ? "…" : "Join"} <ArrowRight size={14} />
        </button>
      </div>
      {state && !state.ok && (
        <p className="mt-2 text-xs text-[#dc2626]">{state.message}</p>
      )}
    </form>
  );
}
