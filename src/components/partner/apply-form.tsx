"use client";

import { useActionState, useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { submitPartnerApplication, type ApplyState } from "@/lib/actions/owner";
import {
  PROVIDER_CATEGORIES,
  SERVICES_BY_CATEGORY,
  SERVICES_DEFAULT,
  EXPERIENCE_LEVELS,
  PRICE_RANGES,
} from "@/lib/content";
import { cn } from "@/lib/utils";

const STEPS = ["Type", "Business", "Services", "Capacity", "Review"];
const SEASONS = ["Year-round", "Seasonal (Summer)", "Seasonal (Winter)", "Monsoon dependent"];
const LEAD = ["Same-day / Walk-in welcome", "24–48 hours notice", "1 week advance booking", "2+ weeks advance booking"];

const inputCls =
  "w-full rounded-lg border border-line2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink placeholder:text-light";
const lblCls = "mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wide text-mid";

type Data = {
  category: string; businessName: string; city: string; country: string;
  website: string; instagram: string; description: string; yearEstablished: string;
  staffCount: string; services: string[]; certifications: string; languages: string;
  targetLevel: string; maxGroupSize: string; priceRange: string; seasons: string;
  leadTime: string; contactEmail: string; contactPhone: string; extraNotes: string;
};

export function PartnerApplyForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, pending] = useActionState<ApplyState, FormData>(
    submitPartnerApplication,
    null,
  );
  const [step, setStep] = useState(1);
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState("");
  const [d, setD] = useState<Data>({
    category: "", businessName: "", city: "", country: "", website: "", instagram: "",
    description: "", yearEstablished: "", staffCount: "", services: [], certifications: "",
    languages: "", targetLevel: "", maxGroupSize: "", priceRange: "", seasons: "",
    leadTime: "", contactEmail: defaultEmail, contactPhone: "", extraNotes: "",
  });
  const set = (k: keyof Data, v: string) => setD((s) => ({ ...s, [k]: v }));
  const toggleSvc = (svc: string) =>
    setD((p) => ({
      ...p,
      services: p.services.includes(svc) ? p.services.filter((x) => x !== svc) : [...p.services, svc],
    }));

  const validate = () => {
    setErr("");
    if (step === 1 && !d.category) return setErr("Please select a provider type."), false;
    if (step === 2) {
      if (!d.businessName.trim()) return setErr("Business name is required."), false;
      if (!d.city.trim() || !d.country.trim()) return setErr("City and country are required."), false;
      if (d.description.trim().length < 10) return setErr("Add a short description (10+ characters)."), false;
    }
    if (step === 4 && !/^\S+@\S+\.\S+$/.test(d.contactEmail))
      return setErr("Enter a valid contact email."), false;
    return true;
  };
  const next = () => validate() && setStep((s) => Math.min(5, s + 1));
  const back = () => (setErr(""), setStep((s) => Math.max(1, s - 1)));

  const serviceOptions = [...(SERVICES_BY_CATEGORY[d.category] ?? []), ...SERVICES_DEFAULT];

  return (
    <>
      {/* Progress */}
      <div className="mb-8 flex">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const status = n < step ? "done" : n === step ? "cur" : "todo";
          return (
            <div key={label} className="relative flex-1 pb-4 text-center">
              <div
                className={cn(
                  "mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 text-[0.58rem] font-bold",
                  status === "done" && "border-accent bg-accent text-white",
                  status === "cur" && "border-accent text-accent",
                  status === "todo" && "border-line text-light",
                )}
              >
                {status === "done" ? <Check size={12} /> : n}
              </div>
              <span className={cn("mt-1.5 block text-[0.6rem] font-semibold uppercase tracking-wide", status === "todo" ? "text-light" : "text-ink")}>
                {label}
              </span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded",
                  n <= step ? "bg-accent" : "bg-line2",
                )}
              />
            </div>
          );
        })}
      </div>

      <form
        action={formAction}
        onSubmit={(e) => {
          if (step !== 5 || !terms) e.preventDefault();
        }}
      >
        {/* Step 1 — Type */}
        <fieldset className={step === 1 ? "" : "hidden"}>
          <StepHead title="What type of provider are you?" sub="Select the category that best describes your business." />
          <input type="hidden" name="category" value={d.category} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PROVIDER_CATEGORIES.map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => set("category", c.type)}
                className={cn(
                  "flex items-start gap-3.5 rounded-xl border-2 p-4 text-left transition-colors",
                  d.category === c.type ? "border-accent bg-accent-soft" : "border-line2 hover:border-line",
                )}
              >
                <span className="text-2xl">{c.icon}</span>
                <span>
                  <span className="block font-display text-[0.8rem] font-bold text-ink">{c.type}</span>
                  <span className="mt-0.5 block text-[0.68rem] leading-snug text-mid">{c.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Step 2 — Business */}
        <fieldset className={cn("space-y-4", step === 2 ? "" : "hidden")}>
          <StepHead title="Tell us about your business" sub="Basic information that forms the core of your public listing." />
          <Labeled label="Business name *"><input name="businessName" value={d.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="e.g. Blue Horizon Diving" className={inputCls} /></Labeled>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="City *"><input name="city" value={d.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Koh Tao" className={inputCls} /></Labeled>
            <Labeled label="Country *"><input name="country" value={d.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. Thailand" className={inputCls} /></Labeled>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Website"><input name="website" value={d.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className={inputCls} /></Labeled>
            <Labeled label="Instagram"><input name="instagram" value={d.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourhandle" className={inputCls} /></Labeled>
          </div>
          <Labeled label="Business description *"><textarea name="description" value={d.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Tell us about your business, team, and why you'd be a great fit…" className={cn(inputCls, "resize-y")} /></Labeled>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Year established"><input name="yearEstablished" value={d.yearEstablished} onChange={(e) => set("yearEstablished", e.target.value)} placeholder="e.g. 2018" inputMode="numeric" className={inputCls} /></Labeled>
            <Labeled label="No. of staff"><input name="staffCount" value={d.staffCount} onChange={(e) => set("staffCount", e.target.value)} placeholder="e.g. 8" inputMode="numeric" className={inputCls} /></Labeled>
          </div>
        </fieldset>

        {/* Step 3 — Services */}
        <fieldset className={cn("space-y-4", step === 3 ? "" : "hidden")}>
          <StepHead title="What do you offer?" sub="Select all services you provide." />
          <div>
            <span className={lblCls}>Services offered</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceOptions.map((svc) => (
                <label
                  key={svc}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors",
                    d.services.includes(svc) ? "border-accent bg-accent-soft" : "border-line2 hover:border-line",
                  )}
                >
                  <input type="checkbox" name="services" value={svc} checked={d.services.includes(svc)} onChange={() => toggleSvc(svc)} className="sr-only" />
                  <span className={cn("flex h-4 w-4 items-center justify-center rounded border", d.services.includes(svc) ? "border-accent bg-accent text-white" : "border-line")}>
                    {d.services.includes(svc) && <Check size={11} />}
                  </span>
                  <span className="text-ink2">{svc}</span>
                </label>
              ))}
            </div>
          </div>
          <Labeled label="Certifications & accreditations"><input name="certifications" value={d.certifications} onChange={(e) => set("certifications", e.target.value)} placeholder="e.g. PADI 5-Star CDC, ISO 9001…" className={inputCls} /></Labeled>
          <Labeled label="Languages spoken"><input name="languages" value={d.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g. English, Hindi, French" className={inputCls} /></Labeled>
          <Labeled label="Target experience level"><SelectEl name="targetLevel" value={d.targetLevel} onChange={(v) => set("targetLevel", v)} options={EXPERIENCE_LEVELS} /></Labeled>
        </fieldset>

        {/* Step 4 — Capacity */}
        <fieldset className={cn("space-y-4", step === 4 ? "" : "hidden")}>
          <StepHead title="Capacity & contact" sub="Help members understand what to expect when booking with you." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Max group size"><input name="maxGroupSize" value={d.maxGroupSize} onChange={(e) => set("maxGroupSize", e.target.value)} placeholder="e.g. 8 per session" className={inputCls} /></Labeled>
            <Labeled label="Price range"><SelectEl name="priceRange" value={d.priceRange} onChange={(v) => set("priceRange", v)} options={PRICE_RANGES} /></Labeled>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Operating seasons"><SelectEl name="seasons" value={d.seasons} onChange={(v) => set("seasons", v)} options={SEASONS} /></Labeled>
            <Labeled label="Booking lead time"><SelectEl name="leadTime" value={d.leadTime} onChange={(v) => set("leadTime", v)} options={LEAD} /></Labeled>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Contact email *"><input name="contactEmail" type="email" value={d.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="bookings@business.com" className={inputCls} /></Labeled>
            <Labeled label="Contact phone"><input name="contactPhone" value={d.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+XX XXXXX XXXXX" className={inputCls} /></Labeled>
          </div>
          <Labeled label="Anything else we should know?"><textarea name="extraNotes" value={d.extraNotes} onChange={(e) => set("extraNotes", e.target.value)} rows={3} placeholder="Seasonal notes, referral source…" className={cn(inputCls, "resize-y")} /></Labeled>
        </fieldset>

        {/* Step 5 — Review */}
        <fieldset className={step === 5 ? "" : "hidden"}>
          <StepHead title="Review & submit" sub="Check everything before we send your application to the team." />
          <div className="space-y-2.5">
            <ReviewBlock title="Business type" rows={[["Category", d.category || "—"]]} />
            <ReviewBlock title="Business" rows={[["Name", d.businessName || "—"], ["Location", `${d.city || "—"}, ${d.country}`], ["Website", d.website || "—"]]} />
            <ReviewBlock title="Services" rows={[["Offerings", d.services.length ? d.services.join(", ") : "None selected"], ["Level", d.targetLevel || "—"]]} />
            <ReviewBlock title="Contact" rows={[["Email", d.contactEmail || "—"], ["Price range", d.priceRange || "—"]]} />
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-line2 p-4">
            <span className={cn("mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border", terms ? "border-accent bg-accent text-white" : "border-line")}>
              {terms && <Check size={11} />}
            </span>
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="sr-only" />
            <span className="text-[0.75rem] leading-relaxed text-mid">
              I confirm all information is accurate and agree to pepvoga&apos;s Partner Terms &amp; Community Guidelines. Applications are reviewed within 48 hours.
            </span>
          </label>
        </fieldset>

        {(err || state?.error) && (
          <p className="mt-4 rounded-lg bg-[#fff1f1] px-3 py-2 text-xs text-[#dc2626]">{err || state?.error}</p>
        )}

        {/* Nav */}
        <div className="mt-7 flex items-center justify-between border-t border-line2 pt-5">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-xs font-medium text-ink2 transition-colors hover:border-ink disabled:opacity-40"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {step < 5 ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink2">
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button type="submit" disabled={!terms || pending} className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-50">
              {pending ? "Submitting…" : "Submit application"} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </form>
    </>
  );
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="font-display text-lg font-bold tracking-tight text-ink">{title}</div>
      <div className="mt-0.5 text-[0.78rem] text-mid">{sub}</div>
    </div>
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

function SelectEl({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "appearance-none")}>
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function ReviewBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl bg-bg p-5">
      <div className="mb-2.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-mid">{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-line2 py-1.5 last:border-b-0">
          <span className="text-[0.72rem] text-mid">{k}</span>
          <span className="max-w-[55%] text-right text-[0.72rem] text-ink">{v}</span>
        </div>
      ))}
    </div>
  );
}
