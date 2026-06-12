import { requireRole } from "@/lib/session";
import { DashShell } from "@/components/dash/shell";

const NAV = [
  { label: "Overview", href: "/admin" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Listings", href: "/admin/listings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN", "/admin");
  return (
    <DashShell title="Admin" nav={NAV}>
      {children}
    </DashShell>
  );
}
