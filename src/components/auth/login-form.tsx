"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/field";
import { authenticate, type AuthActionState } from "@/lib/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthActionState, FormData>(
    authenticate,
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
      <Field label="Password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
      {state?.error && <p className="text-xs text-[#dc2626]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
