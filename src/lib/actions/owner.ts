"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/utils";

export type ApplyState = { error?: string } | null;

const schema = z.object({
  category: z.string().min(1, "Choose a provider type."),
  businessName: z.string().min(2, "Business name is required."),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  description: z.string().min(10, "Tell us a bit more about your business."),
  contactEmail: z.email("Enter a valid contact email."),
  website: z.string().optional(),
  instagram: z.string().optional(),
  yearEstablished: z.string().optional(),
  staffCount: z.string().optional(),
  certifications: z.string().optional(),
  languages: z.string().optional(),
  targetLevel: z.string().optional(),
  maxGroupSize: z.string().optional(),
  priceRange: z.string().optional(),
  seasons: z.string().optional(),
  leadTime: z.string().optional(),
  contactPhone: z.string().optional(),
  extraNotes: z.string().optional(),
});

const toInt = (v?: string) => {
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

export async function submitPartnerApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to submit an application." };

  const services = formData.getAll("services").map(String).filter(Boolean);
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please complete the required fields." };
  }
  const d = parsed.data;

  try {
    if (await db.owner.findUnique({ where: { userId: user.id } })) {
      return { error: "You already have a partner profile." };
    }
    // Ensure a unique slug.
    const base = slugify(d.businessName) || "operator";
    let slug = base;
    let n = 1;
    while (await db.owner.findUnique({ where: { slug } })) slug = `${base}-${n++}`;

    await db.owner.create({
      data: {
        userId: user.id,
        businessName: d.businessName,
        slug,
        category: d.category,
        description: d.description,
        city: d.city,
        country: d.country,
        website: d.website || null,
        instagram: d.instagram || null,
        yearEstablished: toInt(d.yearEstablished),
        staffCount: toInt(d.staffCount),
        services,
        certifications: d.certifications || null,
        languages: d.languages || null,
        targetLevel: d.targetLevel || null,
        maxGroupSize: d.maxGroupSize || null,
        priceRange: d.priceRange || null,
        seasons: d.seasons || null,
        leadTime: d.leadTime || null,
        contactEmail: d.contactEmail,
        contactPhone: d.contactPhone || null,
        extraNotes: d.extraNotes || null,
        status: "PENDING",
      },
    });
    await db.user.update({ where: { id: user.id }, data: { role: "OWNER" } });
  } catch {
    return { error: "Could not submit your application. Is the database connected?" };
  }

  redirect("/owner?applied=1");
}
