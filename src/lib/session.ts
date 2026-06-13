import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DEMO_MODE, DEMO_EMAILS } from "@/lib/demo";
import type { Role } from "@/generated/prisma/enums";

export type SessionUser = {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

async function demoUser(role: "USER" | "OWNER" | "ADMIN"): Promise<SessionUser | null> {
  const u = await db.user.findUnique({ where: { email: DEMO_EMAILS[role] } }).catch(() => null);
  return u ? { id: u.id, role: u.role, name: u.name, email: u.email, image: u.image } : null;
}

function roleForPath(next?: string): "USER" | "OWNER" | "ADMIN" {
  if (next?.startsWith("/owner")) return "OWNER";
  if (next?.startsWith("/admin")) return "ADMIN";
  return "USER";
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (session?.user) return session.user as SessionUser;
  if (DEMO_MODE) return demoUser("USER");
  return null;
}

/** Redirect to /login if not signed in — but in demo mode resolve a demo user. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const session = await auth();
  if (session?.user) return session.user as SessionUser;
  if (DEMO_MODE) {
    const u = await demoUser(roleForPath(next));
    if (u) return u;
  }
  redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
}

export async function requireRole(role: Role | Role[], next?: string): Promise<SessionUser> {
  const roles = Array.isArray(role) ? role : [role];
  if (DEMO_MODE) {
    const u = await demoUser(roles[0] as "USER" | "OWNER" | "ADMIN");
    if (u) return u;
  }
  const user = await requireUser(next);
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

/** The owner acting in this request — the signed-in owner, or the demo owner. */
export async function getActingOwner() {
  const session = await auth();
  if (session?.user) {
    return db.owner.findUnique({ where: { userId: session.user.id } }).catch(() => null);
  }
  if (DEMO_MODE) {
    const du = await demoUser("OWNER");
    if (du) return db.owner.findUnique({ where: { userId: du.id } }).catch(() => null);
  }
  return null;
}
