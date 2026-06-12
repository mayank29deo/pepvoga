import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = true,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wide text-mid">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className={cn(
          "w-full rounded-lg border border-line2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink placeholder:text-light",
          className,
        )}
        {...rest}
      />
    </label>
  );
}
