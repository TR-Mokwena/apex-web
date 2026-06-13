import { cn } from "@/lib/cn";
import Icon from "@/components/Icon";

const ICON_TONE = {
  indigo: "bg-brand-soft text-brand",
  red: "bg-red-50 text-red-500",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

const DELTA_TONE = {
  up: "text-emerald-500",
  warn: "text-red-500",
  ok: "text-emerald-500",
};

/**
 * KPI card. Provide either `icon` (lucide name + tone) or a custom `visual`
 * node (chart/gauge) rendered top-right.
 */
export function Kpi({ label, value, valueClass, delta, deltaTone = "up", deltaArrow, icon, iconTone = "indigo", visual, className }) {
  return (
    <section className={cn("card p-[17px_18px] min-h-[118px] relative flex flex-col gap-[3px] cursor-pointer transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(16,24,40,0.28)]", className)}>
      <span className="text-[12.5px] text-ink-2 font-medium">{label}</span>
      <span className={cn("text-[30px] font-bold text-heading leading-[1.1] mt-[5px]", valueClass)}>{value}</span>
      {delta && (
        <span className={cn("text-xs font-medium mt-[3px] flex items-center gap-1", DELTA_TONE[deltaTone] || "text-ink-2")}>
          {deltaArrow && <Icon name={deltaArrow === "down" ? "ArrowDown" : "ArrowUp"} size={13} />}
          {delta}
        </span>
      )}
      {visual
        ? <span className="absolute top-3.5 right-4">{visual}</span>
        : icon && (
            <span className={cn("absolute top-4 right-4 w-[46px] h-[46px] rounded-[13px] grid place-items-center", ICON_TONE[iconTone] || ICON_TONE.indigo)}>
              <Icon name={icon} size={22} />
            </span>
          )}
    </section>
  );
}
