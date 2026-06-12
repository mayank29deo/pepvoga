"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { createBooking, type BookingState } from "@/lib/actions/booking";
import { formatPrice, fmtDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Slot = { id: string; date: string; startTime: string | null; remaining: number };

const UNIT_LABEL: Record<string, string> = {
  PER_NIGHT: "night", PER_PERSON: "person", PER_SESSION: "session", PER_DAY: "day", PER_GROUP: "group",
};
const inputCls =
  "w-full rounded-lg border border-line2 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";
const lblCls = "mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid";

export function BookingWidget(props: {
  listingId: string;
  slug: string;
  type: "STAY" | "EXPERIENCE";
  priceCents: number;
  currency: string;
  priceUnit: string;
  minNights: number | null;
  isLoggedIn: boolean;
  slots: Slot[];
}) {
  const { listingId, slug, type, priceCents, currency, priceUnit, minNights, isLoggedIn, slots } = props;
  const action = createBooking.bind(null, listingId);
  const [state, formAction, pending] = useActionState<BookingState, FormData>(action, null);
  const unit = UNIT_LABEL[priceUnit] ?? "booking";

  const Price = (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-2xl font-extrabold text-ink">{formatPrice(priceCents, currency)}</span>
      <span className="text-sm text-mid">/ {unit}</span>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        {Price}
        <Link
          href={`/login?next=/listings/${slug}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c64d22]"
        >
          Sign in to book <ArrowRight size={15} />
        </Link>
        <p className="mt-2 text-center text-[0.7rem] text-light">
          Create a free account to request this booking.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-white p-6 shadow-card">
      {Price}

      {slots.length === 0 ? (
        <p className="mt-4 rounded-lg bg-bg2 px-3 py-3 text-xs text-mid">
          No dates open yet — check back soon.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {type === "EXPERIENCE" ? (
            <label className="block">
              <span className={lblCls}>Choose a date</span>
              <select name="availabilityId" className={cn(inputCls, "appearance-none")}>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {fmtDate(s.date)}
                    {s.startTime ? ` · ${s.startTime}` : ""} ({s.remaining} left)
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={lblCls}>Check-in</span>
                <select name="startDate" className={cn(inputCls, "appearance-none")}>
                  {slots.map((s) => (
                    <option key={s.id} value={s.date}>
                      {fmtDate(s.date)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={lblCls}>Nights</span>
                <input type="number" name="nights" defaultValue={minNights ?? 1} min={minNights ?? 1} className={inputCls} />
              </label>
            </div>
          )}

          <label className="block">
            <span className={lblCls}>Guests</span>
            <input type="number" name="guests" defaultValue={1} min={1} className={inputCls} />
          </label>
          <label className="block">
            <span className={lblCls}>Note to host (optional)</span>
            <textarea name="note" rows={2} placeholder="Anything they should know?" className={cn(inputCls, "resize-y")} />
          </label>
        </div>
      )}

      {state?.error && <p className="mt-3 text-xs text-[#dc2626]">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || slots.length === 0}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c64d22] disabled:opacity-50"
      >
        {pending ? "Requesting…" : "Request to book"} <ArrowRight size={15} />
      </button>
      <p className="mt-2 text-center text-[0.7rem] text-light">
        You won&apos;t be charged yet — every booking is request-to-confirm.
      </p>
    </form>
  );
}
