import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PartnerApplyForm } from "@/components/partner/apply-form";

export const metadata = { title: "Partner application" };

export default async function PartnerApplyPage() {
  const user = await requireUser("/partners/apply");

  const existing = await db.owner
    .findUnique({ where: { userId: user.id }, select: { id: true } })
    .catch(() => null);
  if (existing) redirect("/owner");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
      <div className="mb-8 border-b border-line2 pb-7">
        <div className="label-tag mb-3">Partner application</div>
        <h1 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold tracking-tight text-ink">
          Let&apos;s get you listed.
        </h1>
        <p className="mt-2 text-sm text-mid">
          Tell us about your business. Takes about 8 minutes. Our team reviews within 48 hours.
        </p>
      </div>
      <PartnerApplyForm defaultEmail={user.email ?? ""} />
    </div>
  );
}
