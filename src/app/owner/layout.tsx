import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getOwner } from "@/lib/data/owner";
import { DashShell } from "@/components/dash/shell";

const NAV = [
  { label: "Overview", href: "/owner" },
  { label: "Listings", href: "/owner/listings" },
  { label: "Bookings", href: "/owner/bookings" },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/owner");
  const owner = await getOwner(user.id);
  if (!owner) redirect("/partners/apply");

  return (
    <DashShell title="Partner portal" nav={NAV}>
      {children}
    </DashShell>
  );
}
