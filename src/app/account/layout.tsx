import { requireUser } from "@/lib/session";
import { DashShell } from "@/components/dash/shell";

const NAV = [
  { label: "Account", href: "/account" },
  { label: "Bookings", href: "/account/bookings" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/account");
  return (
    <DashShell title="Your account" nav={NAV}>
      {children}
    </DashShell>
  );
}
