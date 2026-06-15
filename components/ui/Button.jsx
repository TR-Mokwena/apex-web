import { cn } from "@/lib/cn";

const VARIANT = {
  primary: "bg-brand text-white border-transparent hover:bg-brand-600 shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_90%,transparent)]",
  secondary: "bg-card text-ink border-line hover:border-[#C7D2FE] shadow-card",
  ghost: "bg-transparent text-ink-2 border-transparent hover:bg-bg-soft",
};
const SIZE = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-10 px-4 text-[13px]",
};

export function Button({ variant = "secondary", size = "md", icon, children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-field border font-semibold cursor-pointer transition-[transform,background,border-color] hover:-translate-y-px whitespace-nowrap",
        VARIANT[variant] || VARIANT.secondary,
        SIZE[size] || SIZE.md,
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
