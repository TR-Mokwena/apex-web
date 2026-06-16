"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { NAV } from "@/lib/nav";

export default function CommandPalette() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = NAV.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { router.back(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); const r = results[active]; if (r) router.push(r.href); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, results, active]);

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,11,20,0.45)] backdrop-blur-sm grid place-items-start justify-center pt-[12vh] px-4" onClick={() => router.back()}>
      <div className="w-full max-w-[560px] card !rounded-2xl overflow-hidden shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <Icon name="Search" size={18} className="text-ink-3" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, tasks, people…" className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-3" />
          <button onClick={() => router.back()} className="text-[11px] text-ink-3 border border-line rounded-[5px] px-1.5 py-0.5">esc</button>
        </div>
        <div className="p-2 max-h-[50vh] overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">Go to</div>
              {results.map((item, i) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setActive(i)}
                  className={cn("w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] transition-colors", i === active ? "bg-brand-soft text-brand" : "text-ink")}
                >
                  <Icon name={item.icon} size={17} />
                  <span className="flex-1">{item.label}</span>
                  {i === active && <Icon name="CornerDownLeft" size={14} className="text-brand/60" />}
                </button>
              ))}
            </>
          ) : (
            <div className="grid place-items-center py-12 text-center">
              <div className="flex flex-col items-center gap-2"><Icon name="SearchX" size={26} className="text-ink-3" /><div className="text-[13px] text-ink-2">No results for “{query}”.</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
