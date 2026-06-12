"use client";

import { useActionState, useState } from "react";
import { saveListing, type ListingFormState } from "@/lib/actions/listing";
import { SPACES } from "@/lib/content";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-line2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink placeholder:text-light";
const lblCls = "mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wide text-mid";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "THB", "AUD"];
const PRICE_UNITS = [
  ["PER_NIGHT", "Per night"],
  ["PER_PERSON", "Per person"],
  ["PER_SESSION", "Per session"],
  ["PER_DAY", "Per day"],
  ["PER_GROUP", "Per group"],
];
const LEVELS = [
  ["ALL", "All levels"],
  ["BEGINNER", "Beginner"],
  ["INTERMEDIATE", "Intermediate"],
  ["ADVANCED", "Advanced"],
  ["EXPERT", "Expert"],
];

export type ListingInitial = {
  type?: "STAY" | "EXPERIENCE";
  title?: string; summary?: string; description?: string;
  space?: string; sport?: string; city?: string; country?: string; region?: string;
  price?: string; currency?: string; priceUnit?: string;
  maxGuests?: string; minNights?: string; maxGroupSize?: string; durationMinutes?: string;
  level?: string; images?: string; highlights?: string; included?: string; amenities?: string;
};

export function ListingForm({
  listingId,
  initial,
}: {
  listingId: string | null;
  initial?: ListingInitial;
}) {
  const action = saveListing.bind(null, listingId);
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(action, null);
  const [type, setType] = useState<"STAY" | "EXPERIENCE">(initial?.type ?? "EXPERIENCE");
  const v = initial ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <div>
        <span className={lblCls}>Listing type</span>
        <div className="grid grid-cols-2 gap-2.5">
          {(["EXPERIENCE", "STAY"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-left transition-colors",
                type === t ? "border-ink bg-bg" : "border-line2 hover:border-line",
              )}
            >
              <span className="block font-display text-sm font-bold text-ink">
                {t === "STAY" ? "Stay" : "Experience"}
              </span>
              <span className="text-[0.68rem] text-mid">
                {t === "STAY" ? "Per-night accommodation" : "Date/slot-based activity"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Labeled label="Title *"><input name="title" defaultValue={v.title} placeholder="e.g. PADI Open Water Course — Koh Tao" className={inputCls} /></Labeled>
      <Labeled label="Summary *"><input name="summary" defaultValue={v.summary} placeholder="One-line hook shown on cards" className={inputCls} /></Labeled>
      <Labeled label="Description *"><textarea name="description" defaultValue={v.description} rows={5} placeholder="The full pitch — what it is, who it's for, what makes it special…" className={cn(inputCls, "resize-y")} /></Labeled>

      <div className="grid gap-3 sm:grid-cols-2">
        <Labeled label="Space *">
          <select name="space" defaultValue={v.space ?? "OCEAN"} className={cn(inputCls, "appearance-none")}>
            {SPACES.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </select>
        </Labeled>
        <Labeled label="Sport / activity"><input name="sport" defaultValue={v.sport} placeholder="e.g. Scuba Diving" className={inputCls} /></Labeled>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Labeled label="City *"><input name="city" defaultValue={v.city} placeholder="Koh Tao" className={inputCls} /></Labeled>
        <Labeled label="Country *"><input name="country" defaultValue={v.country} placeholder="Thailand" className={inputCls} /></Labeled>
        <Labeled label="Region"><input name="region" defaultValue={v.region} placeholder="Gulf of Thailand" className={inputCls} /></Labeled>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Labeled label="Price *"><input name="price" defaultValue={v.price} inputMode="decimal" placeholder="299" className={inputCls} /></Labeled>
        <Labeled label="Currency">
          <select name="currency" defaultValue={v.currency ?? "INR"} className={cn(inputCls, "appearance-none")}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Labeled>
        <Labeled label="Price unit">
          <select name="priceUnit" defaultValue={v.priceUnit ?? (type === "STAY" ? "PER_NIGHT" : "PER_PERSON")} className={cn(inputCls, "appearance-none")}>
            {PRICE_UNITS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </Labeled>
      </div>

      {/* Stay-specific */}
      <div className={cn("grid gap-3 sm:grid-cols-2", type === "STAY" ? "" : "hidden")}>
        <Labeled label="Max guests"><input name="maxGuests" defaultValue={v.maxGuests} inputMode="numeric" placeholder="2" className={inputCls} /></Labeled>
        <Labeled label="Minimum nights"><input name="minNights" defaultValue={v.minNights} inputMode="numeric" placeholder="1" className={inputCls} /></Labeled>
      </div>

      {/* Experience-specific */}
      <div className={cn("grid gap-3 sm:grid-cols-3", type === "EXPERIENCE" ? "" : "hidden")}>
        <Labeled label="Max group size"><input name="maxGroupSize" defaultValue={v.maxGroupSize} inputMode="numeric" placeholder="8" className={inputCls} /></Labeled>
        <Labeled label="Duration (minutes)"><input name="durationMinutes" defaultValue={v.durationMinutes} inputMode="numeric" placeholder="1440 = 1 day" className={inputCls} /></Labeled>
        <Labeled label="Level">
          <select name="level" defaultValue={v.level ?? "ALL"} className={cn(inputCls, "appearance-none")}>
            {LEVELS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </Labeled>
      </div>

      <Labeled label="Image URLs (one per line)"><textarea name="images" defaultValue={v.images} rows={3} placeholder="https://…&#10;https://…" className={cn(inputCls, "resize-y")} /></Labeled>
      <div className="grid gap-3 sm:grid-cols-3">
        <Labeled label="Highlights (one per line)"><textarea name="highlights" defaultValue={v.highlights} rows={3} className={cn(inputCls, "resize-y")} /></Labeled>
        <Labeled label="Included (one per line)"><textarea name="included" defaultValue={v.included} rows={3} className={cn(inputCls, "resize-y")} /></Labeled>
        <Labeled label="Amenities (one per line)"><textarea name="amenities" defaultValue={v.amenities} rows={3} className={cn(inputCls, "resize-y")} /></Labeled>
      </div>

      {state?.error && <p className="rounded-lg bg-[#fff1f1] px-3 py-2 text-xs text-[#dc2626]">{state.error}</p>}

      <div className="flex justify-end border-t border-line2 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-ink px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save listing"}
        </button>
      </div>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={lblCls}>{label}</span>
      {children}
    </label>
  );
}
