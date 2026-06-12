import Link from "next/link";
import { getOwnersForAdmin } from "@/lib/data/admin";
import { StatusPill } from "@/components/dash/status-pill";
import { setOwnerStatus } from "@/lib/actions/admin";
import { fmtDate, cn } from "@/lib/utils";

export const metadata = { title: "Applications · Admin" };

const FILTERS: [string, string][] = [
  ["all", "All"],
  ["pending", "Pending"],
  ["review", "Review"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
];

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminApplicationsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "all";
  const owners = await getOwnersForAdmin(status);

  return (
    <div>
      <h1 className="mb-4 font-display text-xl font-extrabold tracking-tight text-ink">Applications</h1>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/applications${key === "all" ? "" : `?status=${key}`}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              status === key ? "border-ink bg-ink text-white" : "border-line2 text-mid hover:border-ink",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {owners.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center text-sm text-mid">
          No applications match this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {owners.map((o) => (
            <div key={o.id} className="rounded-xl border border-line2 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-ink">{o.businessName}</span>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="mt-1 text-xs text-mid">{o.category} · {o.city}, {o.country}</div>
                  <div className="text-xs text-mid">{o.user.name} · {o.user.email}</div>
                  <div className="mt-1 text-[0.65rem] text-light">
                    {o._count.listings} listings · submitted {fmtDate(o.submittedAt)}
                  </div>
                  {o.description && <p className="mt-2 max-w-xl text-xs leading-relaxed text-ink2">{o.description}</p>}
                  {o.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {o.services.slice(0, 6).map((s) => (
                        <span key={s} className="rounded-full border border-line px-2 py-0.5 text-[0.6rem] text-mid">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-shrink-0 flex-wrap gap-2">
                  {o.status !== "APPROVED" && (
                    <form action={setOwnerStatus.bind(null, o.id, "APPROVED")}>
                      <button className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2">
                        Approve
                      </button>
                    </form>
                  )}
                  {o.status === "PENDING" && (
                    <form action={setOwnerStatus.bind(null, o.id, "REVIEW")}>
                      <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                        Review
                      </button>
                    </form>
                  )}
                  {o.status === "APPROVED" ? (
                    <form action={setOwnerStatus.bind(null, o.id, "SUSPENDED")}>
                      <button className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink2 transition-colors hover:border-ink">
                        Suspend
                      </button>
                    </form>
                  ) : (
                    o.status !== "REJECTED" && (
                      <form action={setOwnerStatus.bind(null, o.id, "REJECTED")}>
                        <button className="rounded-lg border border-[#fca5a5] px-3 py-2 text-xs font-medium text-[#b91c1c] transition-colors hover:bg-[#fee2e2]">
                          Reject
                        </button>
                      </form>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
