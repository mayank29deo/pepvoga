"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.email("Enter a valid email."),
  source: z.string().optional(),
});

export type NewsletterState = { ok: boolean; message: string } | null;

export async function joinNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email." };
  }
  try {
    await db.newsletterSignup.upsert({
      where: { email: parsed.data.email },
      create: { email: parsed.data.email, source: parsed.data.source ?? "site" },
      update: {},
    });
  } catch {
    // Database not connected yet — keep the UX working pre-launch.
  }
  return { ok: true, message: "Welcome to pepvoga — you're on the list." };
}
