import { cn } from "@/lib/cn";

/** Page title block. `title` may include emoji; `subtitle` is the muted line. */
export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-6 mb-[22px] flex-wrap", className)}>
      <div>
        <h1 className="text-[24px] font-bold text-heading leading-[1.15] m-0">{title}</h1>
        {subtitle && <p className="text-[13.5px] text-ink-2 mt-1.5 m-0">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}
