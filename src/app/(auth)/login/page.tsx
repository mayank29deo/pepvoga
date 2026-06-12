import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/account";

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-mid">Sign in to book, save, and manage your adventures.</p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
      <p className="mt-5 text-center text-sm text-mid">
        New here?{" "}
        <Link href="/register" className="font-semibold text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
