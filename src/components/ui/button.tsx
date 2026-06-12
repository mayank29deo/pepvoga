import { cn } from "@/lib/utils";

type Variant = "dark" | "outline" | "white" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:translate-y-px disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-[0.8rem]",
  lg: "px-7 py-3.5 text-sm",
};

const variants: Record<Variant, string> = {
  dark: "bg-ink text-white hover:bg-ink2 font-semibold",
  outline: "border border-line text-ink2 hover:border-ink hover:text-ink",
  white: "bg-white text-ink hover:bg-bg font-semibold shadow-card",
  ghost: "text-ink2 hover:bg-bg2",
  accent: "bg-accent text-white font-semibold hover:bg-[#c64d22]",
};

export function buttonClasses(
  variant: Variant = "dark",
  size: Size = "md",
  className?: string,
) {
  return cn(base, sizes[size], variants[variant], className);
}

export function Button({
  variant = "dark",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
