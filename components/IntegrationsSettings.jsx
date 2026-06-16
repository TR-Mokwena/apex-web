"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import BrandLogo from "@/components/BrandLogo";
import { cn } from "@/lib/cn";
import { INTEGRATIONS } from "@/lib/integrations";

export default function IntegrationsSettings() {
  const [connected, setConnected] = useState(() => new Set(INTEGRATIONS.filter((i) => i.connected).map((i) => i.name)));
  const [toast, setToast] = useState("");

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2400); };
  const disconnect = (name) => { setConnected((c) => { const n = new Set(c); n.delete(name); return n; }); flash(`${name} disconnected`); };
  const reconnect = (name) => { setConnected((c) => new Set(c).add(name)); flash(`${name} reconnected`); };

  const rows = INTEGRATIONS.filter((i) => connected.has(i.name) || i.connected);

  return (
    <div className="flex-1 min-w-0 card !shadow-card">
      <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
        <div>
          <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Integrations</h2>
          <div className="text-[12.5px] text-ink-3 mt-0.5">{connected.size} connected · {INTEGRATIONS.length} available in the directory</div>
        </div>
        <Link href="/integrations" className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}>
          <Icon name="Blocks" size={15} />Browse directory
        </Link>
      </div>

      {toast && (
        <div className="flex items-center gap-2.5 mx-5 mt-4 px-4 py-2.5 rounded-field bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-medium">
          <Icon name="CircleCheckBig" size={16} className="text-emerald-600 flex-none" />{toast}
        </div>
      )}

      <div className="p-2">
        {rows.map((it) => {
          const on = connected.has(it.name);
          return (
            <div key={it.name} className="flex items-center gap-3.5 p-[12px_12px] rounded-xl hover:bg-bg transition-colors">
              <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none" style={{ background: it.color }}><BrandLogo slug={it.slug} icon={it.icon} /></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <b className="text-[14px] font-semibold">{it.name}</b>
                  <span className={cn("inline-flex items-center gap-1 text-[10.5px] font-semibold rounded-full px-2 py-0.5", on ? "text-emerald-600 bg-emerald-50" : "text-ink-3 bg-bg")}><span className={cn("w-1.5 h-1.5 rounded-full", on ? "bg-emerald-500" : "bg-slate-300")} />{on ? "Active" : "Disconnected"}</span>
                </div>
                <div className="text-[11.5px] text-ink-3 mt-0.5 truncate">{it.cat} · {it.desc}</div>
              </div>
              <Link href="/integrations" className="hidden sm:grid place-items-center w-9 h-9 rounded-field border border-line bg-card text-ink-2 hover:border-[#C7D2FE]" title="Manage"><Icon name="Settings" size={15} /></Link>
              {on ? (
                <button onClick={() => disconnect(it.name)} className="h-9 px-3.5 rounded-field text-[13px] font-semibold border border-line bg-card text-ink-2 hover:border-red-200 hover:text-red-500 transition-colors">Disconnect</button>
              ) : (
                <button onClick={() => reconnect(it.name)} className="h-9 px-3.5 rounded-field text-[13px] font-semibold bg-brand text-white hover:bg-brand-600 transition-colors">Reconnect</button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 p-[14px_20px] border-t border-line text-[12.5px] text-ink-3">
        <Icon name="Info" size={15} className="flex-none" />
        Add or configure more tools in the full <Link href="/integrations" className="text-brand font-medium">integration directory</Link>.
      </div>
    </div>
  );
}
