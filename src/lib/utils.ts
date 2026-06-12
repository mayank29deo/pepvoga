import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional + conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format minor-unit money (paise/cents) into a localized currency string. */
export function formatPrice(cents: number, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Short human booking/application code, e.g. PV-7Q2KX9. */
export function shortCode(prefix = "PV") {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${s}`;
}

/** Title-case a lower/SCREAMING enum value: PER_NIGHT -> Per night. */
export function humanizeEnum(value: string) {
  const lower = value.replace(/_/g, " ").toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Normalize any date to UTC midnight (matches Prisma @db.Date storage). */
export function dateOnlyUTC(d: Date = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Add days in UTC, returning a new Date at UTC midnight. */
export function addDaysUTC(d: Date, n: number) {
  const x = dateOnlyUTC(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

/** Format a date-only value (UTC) as e.g. "20 Jun 2026". */
export function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
