"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { generateAvailability, type AvailabilityState } from "@/lib/actions/listing";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-line2 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink";

export function AvailabilityForm({
  listingId,
  isExperience,
}: {
  listingId: string;
  isExperience: boolean;
}) {
  const action = generateAvailability.bind(null, listingId);
  const [state, formAction, pending] = useActionState<AvailabilityState, FormData>(action, null);

  return (
    <form action={formAction} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block">
        <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid">From date</span>
        <input type="date" name="startDate" className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid">Days</span>
        <input type="number" name="days" defaultValue={30} min={1} max={180} className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid">
          {isExperience ? "Seats / slot" : "Units / night"}
        </span>
        <input type="number" name="capacity" defaultValue={isExperience ? 8 : 4} min={1} className={inputCls} />
      </label>
      {isExperience ? (
        <label className="block">
          <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid">Start time</span>
          <input type="time" name="startTime" defaultValue="09:00" className={inputCls} />
        </label>
      ) : (
        <input type="hidden" name="startTime" value="" />
      )}
      <div className="sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add availability"}
        </button>
        {state?.ok && (
          <span className="ml-3 inline-flex items-center gap-1 text-xs text-[#166534]">
            <Check size={13} /> Availability added
          </span>
        )}
        {state?.error && <span className="ml-3 text-xs text-[#dc2626]">{state.error}</span>}
      </div>
    </form>
  );
}
