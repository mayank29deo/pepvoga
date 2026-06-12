"use client";

import { useActionState, useState } from "react";
import { Star, Check } from "lucide-react";
import { createReview, type ReviewState } from "@/lib/actions/review";

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const action = createReview.bind(null, bookingId);
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(action, null);
  const [rating, setRating] = useState(5);

  if (state?.ok) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-xs text-[#166534]">
        <Check size={13} /> Thanks for your review!
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-2 rounded-lg border border-line2 bg-bg p-3">
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star size={17} className={n <= rating ? "fill-ink text-ink" : "text-light"} />
          </button>
        ))}
      </div>
      <input
        name="title"
        placeholder="Title (optional)"
        className="w-full rounded-md border border-line2 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-ink"
      />
      <textarea
        name="body"
        rows={2}
        placeholder="How was it?"
        className="w-full resize-y rounded-md border border-line2 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-ink"
      />
      {state?.error && <p className="text-xs text-[#dc2626]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ink2 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
