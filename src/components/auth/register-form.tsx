"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/field";
import { registerUser, type AuthActionState } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthActionState, FormData>(
    registerUser,
    null,
  );

  return (
    <form action={action} className="space-y-3">
      <Field label="Name" name="name" placeholder="Alex Rivera" autoComplete="name" />
      <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
      <Field label="Password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" />
      {state?.error && <p className="text-xs text-[#dc2626]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
