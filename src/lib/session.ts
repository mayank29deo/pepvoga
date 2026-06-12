import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/generated/prisma/enums";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Redirect to /login (preserving destination) if not signed in. */
export async function requireUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

/** Require one of the given roles, else bounce home. */
export async function requireRole(role: Role | Role[], next?: string) {
  const user = await requireUser(next);
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
