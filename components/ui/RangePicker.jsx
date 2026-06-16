"use client";

import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { Dropdown, MenuItem } from "./Dropdown";

/** Shared reporting windows. Pages key their demo data off the `key`. */
export const RANGE_OPTIONS = [
  { key: "This Week", label: "June 12 – June 18, 2026" },
  { key: "Last Week", label: "June 5 – June 11, 2026" },
  { key: "Last 2 Weeks", label: "June 4 – June 18, 2026" },
  { key: "This Month", label: "June 1 – June 30, 2026" },
  { key: "Last 30 Days", label: "May 19 – June 18, 2026" },
  { key: "This Quarter", label: "Apr 1 – June 30, 2026" },
];

/** Card-pill date-range selector. `value` is a range key; `onChange(key)`. */
export function RangePicker({ value, onChange, options = RANGE_OPTIONS, className }) {
  const current = options.find((o) => o.key === value) || options[0];
  return (
    <Dropdown align="right" width={210} trigger={({ toggle, open }) => (
      <button onClick={toggle} className={cn("flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium text-ink-2 hover:text-ink", className)}>
        <Icon name="Calendar" size={15} className="text-ink-3" />{current.label}
        <Icon name="ChevronDown" size={15} className={cn("text-ink-3 transition-transform", open && "rotate-180")} />
      </button>
    )}>
      {options.map((o) => (
        <MenuItem key={o.key} onClick={() => onChange(o.key)} trailing={o.key === value ? <Icon name="Check" size={14} className="text-brand" /> : null}>
          <span className="flex flex-col"><span className="font-medium">{o.key}</span><span className="text-[11px] text-ink-3">{o.label}</span></span>
        </MenuItem>
      ))}
    </Dropdown>
  );
}
