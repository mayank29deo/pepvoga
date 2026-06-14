// WhatsApp "click-to-chat" quote — same no-backend pattern as kailash_bhojnalya.
// Builds a wa.me deep link with a formatted booking request as the prefilled
// message to the admin's number. The customer taps → WhatsApp opens addressed
// to the admin with the quote ready to send. No API key, no infrastructure.

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+918586013386";

export type BookingQuote = {
  title: string;
  type: "STAY" | "EXPERIENCE";
  city: string;
  country: string;
  host?: string | null;
  date?: string | null; // human-readable
  time?: string | null; // experiences
  nights?: number | null; // stays
  guests: number;
  priceLabel: string; // e.g. "$299"
  unit: string; // e.g. "person" / "night"
  totalLabel: string; // e.g. "$598"
  name?: string;
  note?: string;
};

function fmtTimestamp(d = new Date()) {
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBookingMessage(q: BookingQuote): string {
  const L: string[] = [];
  L.push("*NEW BOOKING REQUEST — pepvoga*");
  L.push("━━━━━━━━━━━━━━━━━━━━");
  L.push("");
  L.push(`*${q.title}*`);
  L.push(`${q.type === "STAY" ? "Stay" : "Experience"} · ${q.city}, ${q.country}`);
  if (q.host) L.push(`Host: ${q.host}`);
  L.push("");
  L.push("*Requested*");
  if (q.date) L.push(`Date: ${q.date}${q.time ? ` · ${q.time}` : ""}`);
  if (q.nights) L.push(`Nights: ${q.nights}`);
  L.push(`Guests: ${q.guests}`);
  L.push("");
  L.push("*Estimate*");
  L.push(`${q.priceLabel} / ${q.unit}`);
  L.push(`Total: ${q.totalLabel}`);
  if (q.name || q.note) {
    L.push("");
    L.push("*From*");
    if (q.name) L.push(q.name);
    if (q.note) L.push(q.note);
  }
  L.push("");
  L.push(`Sent ${fmtTimestamp()} · via pepvoga`);
  return L.join("\n");
}

export function buildBookingWhatsappLink(q: BookingQuote): string {
  const number = ADMIN_WHATSAPP.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(formatBookingMessage(q))}`;
}
