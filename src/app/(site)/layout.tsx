import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getCurrentUser } from "@/lib/session";
import { DEMO_MODE } from "@/lib/demo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // In demo mode the navbar shows the view-switcher and ignores the user, so we
  // skip the auth/DB lookup — keeps marketing pages static and cuts a round-trip.
  const user = DEMO_MODE ? null : await getCurrentUser();
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar
        user={user ? { name: user.name ?? null, role: user.role } : null}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
