"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildBookingWhatsappLink } from "@/lib/whatsapp";
import { formatPrice, fmtDate, cn } from "@/lib/utils";

type Slot = { id: string; date: string; startTime: string | null; remaining: number };

const UNIT_LABEL: Record<string, string> = {
  PER_NIGHT: "night", PER_PERSON: "person", PER_SESSION: "session", PER_DAY: "day", PER_GROUP: "group",
};
const inputCls =
  "w-full rounded-lg border border-line2 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";
const lblCls = "mb-1.5 block text-[0.65rem] font-bold uppercase tracking-wide text-mid";

export function BookingWidget({
  title,
  type,
  city,
  country,
  host,
  priceCents,
  currency,
  priceUnit,
  minNights,
  slots,
}: {
  title: string;
  type: "STAY" | "EXPERIENCE";
  city: string;
  country: string;
  host?: string | null;
  priceCents: number;
  currency: string;
  priceUnit: string;
  minNights: number | null;
  slots: Slot[];
}) {
  const unit = UNIT_LABEL[priceUnit] ?? "booking";
  const [slotId, setSlotId] = useState(slots[0]?.id ?? "");
  const [startDate, setStartDate] = useState(slots[0]?.date ?? "");
  const [nights, setNights] = useState(minNights ?? 1);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const total = priceCents * (type === "STAY" ? Math.max(nights, 1) : Math.max(guests, 1));

  function requestQuote() {
    const slot = slots.find((s) => s.id === slotId);
    const date = type === "STAY" ? startDate : slot?.date ?? null;
    const link = buildBookingWhatsappLink({
      title, type, city, country, host,
      date: date ? fmtDate(date) : null,
      time: type === "EXPERIENCE" ? slot?.startTime ?? null : null,
      nights: type === "STAY" ? Math.max(nights, 1) : null,
      guests: Math.max(guests, 1),
      priceLabel: formatPrice(priceCents, currency),
      unit,
      totalLabel: formatPrice(total, currency),
      name: name.trim() || undefined,
      note: note.trim() || undefined,
    });
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-2xl font-extrabold text-ink">{formatPrice(priceCents, currency)}</span>
        <span className="text-sm text-mid">/ {unit}</span>
      </div>

      {slots.length === 0 ? (
        <p className="mt-4 rounded-lg bg-bg2 px-3 py-3 text-xs text-mid">No dates open yet — check back soon.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {type === "EXPERIENCE" ? (
            <label className="block">
              <span className={lblCls}>Choose a date</span>
              <select value={slotId} onChange={(e) => setSlotId(e.target.value)} className={cn(inputCls, "appearance-none")}>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {fmtDate(s.date)}{s.startTime ? ` · ${s.startTime}` : ""} ({s.remaining} left)
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={lblCls}>Check-in</span>
                <select value={startDate} onChange={(e) => setStartDate(e.target.value)} className={cn(inputCls, "appearance-none")}>
                  {slots.map((s) => <option key={s.id} value={s.date}>{fmtDate(s.date)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className={lblCls}>Nights</span>
                <input type="number" min={minNights ?? 1} value={nights} onChange={(e) => setNights(parseInt(e.target.value) || 1)} className={inputCls} />
              </label>
            </div>
          )}
          <label className="block">
            <span className={lblCls}>Guests</span>
            <input type="number" min={1} value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} className={inputCls} />
          </label>
          <label className="block">
            <span className={lblCls}>Your name (optional)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="So the host knows who's asking" className={inputCls} />
          </label>
          <label className="block">
            <span className={lblCls}>Note (optional)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything the host should know?" className={cn(inputCls, "resize-y")} />
          </label>
          <div className="rounded-lg bg-bg2 px-3 py-2 text-xs text-mid">
            Estimated total <span className="font-semibold text-ink">{formatPrice(total, currency)}</span> · final quote confirmed by the host.
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={requestQuote}
        disabled={slots.length === 0}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed",
          slots.length ? "bg-[#25D366] hover:bg-[#1ebe5d]" : "bg-light",
        )}
      >
        <MessageCircle size={17} /> Request quote on WhatsApp
      </button>
      <p className="mt-2 text-center text-[0.7rem] text-light">
        Opens WhatsApp with your request ready to send to the host. No charge.
      </p>
    </div>
  );
}
