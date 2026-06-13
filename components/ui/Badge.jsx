import { cn } from "@/lib/cn";

/** Soft status pill. */
const PILL_TONE = {
  indigo: "bg-brand-soft text-brand",
  blue: "bg-[#EAF1FF] text-[#3B82F6]",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-500",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-500",
};
export function Pill({ tone = "slate", children, className }) {
  return (
    <span className={cn("inline-flex items-center text-[11px] font-semibold rounded-[7px] px-2.5 py-[3px] whitespace-nowrap", PILL_TONE[tone] || PILL_TONE.slate, className)}>
      {children}
    </span>
  );
}

/** Priority indicator: coloured dot + label. */
const PRIORITY = {
  high: { tone: "text-red-500", dot: "bg-red-500", label: "High" },
  medium: { tone: "text-amber-500", dot: "bg-amber-500", label: "Medium" },
  low: { tone: "text-emerald-500", dot: "bg-emerald-500", label: "Low" },
};
export function Priority({ level = "medium", className }) {
  const p = PRIORITY[level] || PRIORITY.medium;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", p.tone, className)}>
      <span className={cn("w-[7px] h-[7px] rounded-full", p.dot)} />
      {p.label}
    </span>
  );
}

/** Up/down delta chip (e.g. ▲ 12%). */
export function Delta({ value, direction = "up", className }) {
  const down = direction === "down";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", down ? "text-red-500" : "text-emerald-500", className)}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={cn(down && "rotate-180")}>
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
      {value}
    </span>
  );
}
