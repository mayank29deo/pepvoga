"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";

export type AuthActionState = { error?: string } | null;

const registerSchema = z.object({
  name: z.string().min(1, "Name is required.").max(80),
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function registerUser(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }
  const { name, email, password } = parsed.data;
  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with this email already exists." };
    await db.user.create({
      data: { name, email, hashedPassword: bcrypt.hashSync(password, 10), role: "USER" },
    });
  } catch {
    return { error: "Could not create your account. Is the database connected?" };
  }
  // Establish a session (throws a redirect on success).
  await signIn("credentials", { email, password, redirectTo: "/account" });
  return null;
}

export async function authenticate(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const next = (formData.get("next") as string) || "/account";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: next,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // re-throw the success redirect
  }
  return null;
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
