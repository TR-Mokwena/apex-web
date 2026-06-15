"use client";

import { useEffect } from "react";
import Icon from "@/components/Icon";

/** Centered modal dialog. Closes on backdrop click + Escape. */
export function Modal({ open, onClose, title, children, footer, width = 460 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-start justify-center pt-[10vh] px-4 bg-[rgba(8,11,20,0.55)] backdrop-blur-sm" onClick={onClose}>
      <div className="w-full bg-card border border-line rounded-2xl shadow-pop overflow-hidden" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="m-0 text-[15px] font-semibold">{title}</h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-lg text-ink-3 hover:bg-bg-soft"><Icon name="X" size={17} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-line">{footer}</div>}
      </div>
    </div>
  );
}

const FIELD = "h-10 border border-line rounded-[10px] px-3 text-sm outline-none bg-card focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]";

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-2">{label}</span>
      {children}
    </label>
  );
}
export function TextInput(props) {
  return <input {...props} className={FIELD} />;
}
export function Select({ children, ...props }) {
  return <select {...props} className={`${FIELD} cursor-pointer`}>{children}</select>;
}
export function Textarea(props) {
  return <textarea {...props} className={`${FIELD} h-auto py-2.5 resize-none`} />;
}
