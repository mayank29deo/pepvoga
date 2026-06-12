import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Join pepvoga" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Step outside.</h1>
      <p className="mt-1 text-sm text-mid">
        Create your account to book stays and experiences worldwide.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-5 text-center text-sm text-mid">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign in
        </Link>
      </p>
      <p className="mt-6 text-center text-xs text-light">
        Run an operation?{" "}
        <Link href="/partners" className="underline hover:text-ink">
          Partner with us
        </Link>
      </p>
    </div>
  );
}
