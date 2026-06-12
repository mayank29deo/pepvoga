import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getCurrentUser } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
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
