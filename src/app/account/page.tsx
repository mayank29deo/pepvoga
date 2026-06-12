import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getUserBookings } from "@/lib/data/bookings";
import { getOwner } from "@/lib/data/owner";
import { buttonClasses } from "@/components/ui/button";

export const metadata = { title: "Your account" };

export default async function AccountHome() {
  const user = await requireUser("/account");
  const [bookings, owner] = await Promise.all([getUserBookings(user.id), getOwner(user.id)]);
  const upcoming = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Hi, {user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mt-1 text-sm text-mid">{user.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { n: bookings.length, l: "Bookings" },
          { n: upcoming, l: "Upcoming" },
          { n: completed, l: "Completed" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-line2 bg-white px-5 py-5">
            <div className="font-display text-2xl font-extrabold text-ink">{s.n}</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-light">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/account/bookings" className={buttonClasses("dark", "md")}>View bookings</Link>
        <Link href="/stays" className={buttonClasses("outline", "md")}>Explore stays</Link>
        <Link href="/experiences" className={buttonClasses("outline", "md")}>Browse experiences</Link>
      </div>

      {owner ? (
        <Link
          href="/owner"
          className="block rounded-xl border border-line2 bg-white p-5 transition-colors hover:border-line"
        >
          <div className="font-display text-sm font-bold text-ink">Partner portal</div>
          <p className="mt-1 text-xs text-mid">Manage {owner.businessName} — listings, availability, and bookings →</p>
        </Link>
      ) : (
        <div className="rounded-xl border border-line2 bg-white p-5">
          <div className="font-display text-sm font-bold text-ink">Run an operation?</div>
          <p className="mt-1 text-xs text-mid">List your stays and experiences on pepvoga — zero commission.</p>
          <Link href="/partners/apply" className={buttonClasses("dark", "sm", "mt-3")}>Become a partner</Link>
        </div>
      )}
    </div>
  );
}
