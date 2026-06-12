import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  PENDING: "bg-[#fff8e1] text-[#b45309]",
  REVIEW: "bg-[#fff7ed] text-[#9a3412]",
  APPROVED: "bg-[#f0fdf4] text-[#166534]",
  PUBLISHED: "bg-[#f0fdf4] text-[#166534]",
  REJECTED: "bg-[#fef2f2] text-[#dc2626]",
  SUSPENDED: "bg-[#f4f4f5] text-[#52525b]",
  DRAFT: "bg-bg2 text-mid",
  CONFIRMED: "bg-[#f0fdf4] text-[#166534]",
  DECLINED: "bg-[#fef2f2] text-[#dc2626]",
  CANCELLED: "bg-[#f4f4f5] text-[#52525b]",
  COMPLETED: "bg-[#eff6ff] text-[#1d4ed8]",
  EXPIRED: "bg-bg2 text-light",
  UNPAID: "bg-bg2 text-mid",
  PAID: "bg-[#f0fdf4] text-[#166534]",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide",
        MAP[status] ?? "bg-bg2 text-mid",
      )}
    >
      {status}
    </span>
  );
}
