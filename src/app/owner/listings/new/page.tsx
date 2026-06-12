import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ListingForm } from "@/components/owner/listing-form";

export const metadata = { title: "New listing" };

export default function NewListingPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/owner/listings" className="inline-flex items-center gap-1 text-xs text-mid transition-colors hover:text-ink">
        <ArrowLeft size={13} /> Back to listings
      </Link>
      <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">New listing</h1>
      <p className="mb-6 mt-1 text-sm text-mid">
        Create a stay or experience. It starts as a draft — add availability and publish when ready.
      </p>
      <ListingForm listingId={null} />
    </div>
  );
}
