"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** iOS-style toggle. Uncontrolled by default; pass checked/onChange to control. */
export function Switch({ checked, defaultChecked = false, onChange, className }) {
  const [on, setOn] = useState(defaultChecked);
  const value = checked ?? on;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => { setOn((v) => !v); onChange?.(!value); }}
      className={cn("relative w-10 h-[23px] rounded-full flex-none transition-colors", value ? "bg-brand" : "bg-slate-200", className)}
    >
      <span className={cn("absolute top-[2.5px] w-[18px] h-[18px] rounded-full bg-card shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left]", value ? "left-[19.5px]" : "left-[2.5px]")} />
    </button>
  );
}
