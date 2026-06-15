"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const CAT = {
  members: { label: "Members", tone: "bg-brand-soft text-brand" },
  roles: { label: "Roles", tone: "bg-[#F3EEFE] text-[#7C3AED]" },
  auth: { label: "Auth", tone: "bg-[#EAF1FF] text-[#3B82F6]" },
  projects: { label: "Projects", tone: "bg-emerald-50 text-emerald-600" },
  settings: { label: "Settings", tone: "bg-amber-50 text-amber-500" },
  billing: { label: "Billing", tone: "bg-red-50 text-red-500" },
};

const EVENTS = [
  { actor: "TR Mokwena", av: "TM", pi: 0, cat: "members", icon: "UserPlus", action: "invited a member", detail: "priya@eclipsesoftworks.com · as Lead", time: "2m ago", ip: "102.65.21.4" },
  { actor: "Sipho Dlamini", av: "SD", pi: 1, cat: "roles", icon: "Shield", action: "changed a role", detail: "Naledi Kgosana · Member → Lead", time: "18m ago", ip: "102.65.18.9" },
  { actor: "Apex System", av: "AP", pi: 0, cat: "auth", icon: "LogIn", action: "new sign-in", detail: "TR Mokwena · Chrome on macOS", time: "1h ago", ip: "102.65.21.4" },
  { actor: "Priya Singh", av: "PS", pi: 4, cat: "projects", icon: "Archive", action: "archived a project", detail: "Marketing Site", time: "3h ago", ip: "41.13.9.22" },
  { actor: "TR Mokwena", av: "TM", pi: 0, cat: "settings", icon: "Settings", action: "updated workspace settings", detail: "default timezone changed", time: "5h ago", ip: "102.65.21.4" },
  { actor: "Thabo Nkosi", av: "TN", pi: 3, cat: "billing", icon: "CreditCard", action: "updated billing plan", detail: "Pro → Enterprise", time: "1d ago", ip: "196.25.1.7" },
  { actor: "Sipho Dlamini", av: "SD", pi: 1, cat: "members", icon: "UserMinus", action: "removed a member", detail: "contractor@external.com", time: "1d ago", ip: "102.65.18.9" },
  { actor: "Apex System", av: "AP", pi: 0, cat: "auth", icon: "KeyRound", action: "API key generated", detail: "ci-deploy-key", time: "2d ago", ip: "—" },
  { actor: "Naledi Kgosana", av: "NK", pi: 2, cat: "projects", icon: "FolderPlus", action: "created a project", detail: "Billing Service", time: "3d ago", ip: "41.13.9.30" },
  { actor: "Priya Singh", av: "PS", pi: 4, cat: "settings", icon: "Palette", action: "changed appearance", detail: "accent color updated", time: "4d ago", ip: "41.13.9.22" },
  { actor: "TR Mokwena", av: "TM", pi: 0, cat: "roles", icon: "ShieldCheck", action: "edited Lead permissions", detail: "granted “Delete tasks”", time: "5d ago", ip: "102.65.21.4" },
];

const FILTERS = ["All", ...Object.keys(CAT)];

export default function AuditLogsSettings() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");

  const list = EVENTS.filter((e) =>
    (cat === "All" || e.cat === cat) &&
    (e.actor.toLowerCase().includes(query.trim().toLowerCase()) || e.action.toLowerCase().includes(query.trim().toLowerCase()) || e.detail.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="flex-1 min-w-0 card !shadow-card">
      <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
        <div>
          <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Audit Logs</h2>
          <div className="text-[12.5px] text-ink-3 mt-0.5">Every action taken across the organization.</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-3 py-2 w-[200px]">
            <Icon name="Search" size={15} className="text-ink-3" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
          </div>
          <button className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-[10px] border border-line bg-card text-[12.5px] font-medium text-ink-2 hover:border-[#C7D2FE]"><Icon name="Download" size={14} className="text-ink-3" />Export</button>
        </div>
      </div>

      {/* filter chips */}
      <div className="flex items-center gap-1.5 p-[12px_20px] border-b border-line overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setCat(f)} className={cn("px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-colors", cat === f ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg-soft")}>{f === "All" ? "All" : CAT[f].label}</button>
        ))}
      </div>

      {/* list */}
      <div>
        {list.map((e, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
            <span className={cn("grid place-items-center w-9 h-9 rounded-[10px] flex-none", CAT[e.cat].tone)}><Icon name={e.icon} size={17} /></span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] leading-snug">
                <span className="inline-flex items-center gap-1.5 align-middle mr-1.5">
                  <span className="grid place-items-center w-5 h-5 rounded-full text-white text-[8.5px] font-semibold" style={{ background: PAL[e.pi % PAL.length] }}>{e.av}</span>
                  <b className="font-semibold">{e.actor}</b>
                </span>
                <span className="text-ink-2">{e.action}</span>
              </div>
              <div className="text-[11.5px] text-ink-3 mt-0.5 truncate">{e.detail}</div>
            </div>
            <div className="text-right flex-none flex flex-col items-end gap-1">
              <span className={cn("inline-flex text-[10.5px] font-semibold px-2 py-0.5 rounded-full", CAT[e.cat].tone)}>{CAT[e.cat].label}</span>
              <span className="text-[11.5px] text-ink-3 whitespace-nowrap">{e.time}</span>
              <span className="hidden sm:block text-[10.5px] text-ink-3 font-mono">{e.ip}</span>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="px-5 py-12 text-center text-[13.5px] text-ink-2">No log entries match your search.</div>}
      </div>

      <div className="p-[13px_20px] text-center border-t border-line">
        <button className="text-[12.5px] font-medium text-brand hover:text-brand-600">Load earlier activity</button>
      </div>
    </div>
  );
}
