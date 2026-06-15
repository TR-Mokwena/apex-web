"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

/**
 * Click-to-open popover menu. `trigger` is a render-prop receiving { open, toggle }.
 * Closes on outside-click and Escape. `placement` flips it above the trigger.
 */
export function Dropdown({ trigger, children, align = "left", placement = "bottom", width = 224, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 bg-card border border-line rounded-[12px] shadow-pop p-1.5",
            placement === "top" ? "bottom-full mb-2" : "mt-2",
            align === "right" ? "right-0" : "left-0",
          )}
          style={{ width, minWidth: width }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ icon, href, onClick, children, danger, trailing }) {
  const cls = cn(
    "flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-[9px] text-[13px] font-medium transition-colors",
    danger ? "text-red-500 hover:bg-red-50" : "text-ink hover:bg-bg",
  );
  const inner = (
    <>
      {icon && <Icon name={icon} size={16} className={danger ? "text-red-500" : "text-ink-3"} />}
      <span className="flex-1">{children}</span>
      {trailing}
    </>
  );
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

export function MenuLabel({ children }) {
  return <div className="px-2.5 pt-2 pb-1 text-[10.5px] font-bold uppercase tracking-wide text-ink-3">{children}</div>;
}
export function MenuSep() {
  return <div className="my-1 h-px bg-line" />;
}
