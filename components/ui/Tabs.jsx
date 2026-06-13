"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Underline tab bar. Uncontrolled by default; pass value/onChange to control. */
export function Tabs({ items = [], value, onChange, className }) {
  const [cur, setCur] = useState(value ?? items[0]);
  const active = value ?? cur;
  const set = (v) => { setCur(v); onChange?.(v); };
  return (
    <div className={cn("flex items-center gap-0.5 border-b border-line overflow-x-auto", className)}>
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const a = active === label;
        return (
          <button
            key={label}
            type="button"
            onClick={() => set(label)}
            className={cn(
              "px-3.5 py-2.5 text-[13.5px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              a ? "text-brand border-brand font-semibold" : "text-ink-2 border-transparent hover:text-ink",
            )}
          >
            {label}
            {typeof item !== "string" && item.count != null && <span className="ml-1.5 text-[11px] text-ink-3">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
