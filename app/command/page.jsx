"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Icon from "@/components/Icon";
import { NAV } from "@/lib/nav";

export default function CommandPalette() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,11,20,0.45)] backdrop-blur-sm grid place-items-start justify-center pt-[12vh] px-4" onClick={() => router.back()}>
      <div className="w-full max-w-[560px] card !rounded-2xl overflow-hidden shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <Icon name="Search" size={18} className="text-ink-3" />
          <input autoFocus placeholder="Search projects, tasks, people…" className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-3" />
          <button onClick={() => router.back()} className="text-[11px] text-ink-3 border border-line rounded-[5px] px-1.5 py-0.5">esc</button>
        </div>
        <div className="p-2 max-h-[50vh] overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">Go to</div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] text-slate-700 hover:bg-brand-soft hover:text-brand transition-colors">
              <Icon name={item.icon} size={17} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
