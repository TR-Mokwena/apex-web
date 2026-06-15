"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import ThemePicker from "@/components/ThemePicker";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const ADMIN_NAV = [
  { label: "General", icon: "SlidersHorizontal" },
  { label: "Appearance", icon: "Palette" },
  { label: "Teams", icon: "UsersRound" },
  { label: "Users", icon: "User" },
  { label: "Roles & Permissions", icon: "Shield" },
  { label: "Audit Logs", icon: "ScrollText" },
  { label: "Feature Flags", icon: "Flag" },
  { label: "Integrations", icon: "Blocks" },
  { label: "API Keys", icon: "KeyRound" },
  { label: "Billing", icon: "CreditCard" },
];
const TEAMS = [
  { name: "Engineering", ic: "CodeXml", ib: "linear-gradient(135deg,#6366F1,#818CF8)", mem: 18, proj: 8, lead: "Sipho Dlamini", li: "SD", pi: 0, st: "active" },
  { name: "Product", ic: "Box", ib: "linear-gradient(135deg,#0EA5E9,#38BDF8)", mem: 9, proj: 4, lead: "TR Mokwena", li: "TM", pi: 1, st: "active" },
  { name: "Design", ic: "Palette", ib: "linear-gradient(135deg,#8B5CF6,#A78BFA)", mem: 6, proj: 3, lead: "Priya Singh", li: "PS", pi: 4, st: "active" },
  { name: "DevOps", ic: "Server", ib: "linear-gradient(135deg,#10B981,#34D399)", mem: 5, proj: 2, lead: "Neo Kgosana", li: "NK", pi: 2, st: "active" },
  { name: "QA", ic: "Bug", ib: "linear-gradient(135deg,#F59E0B,#FBBF24)", mem: 4, proj: 2, lead: "Thabo Nkosi", li: "TN", pi: 3, st: "paused" },
  { name: "Data", ic: "Database", ib: "linear-gradient(135deg,#EC4899,#F472B6)", mem: 9, proj: 5, lead: "Anke Visser", li: "AV", pi: 1, st: "active" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("Teams");
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="ShieldCheck" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Organization Settings</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Manage teams, members, roles, and workspace configuration.</div>
          </div>
        </div>
        <button className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium"><Icon name="Building2" size={16} className="text-brand" />Eclipse Softworks<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* admin sub-nav */}
        <div className="w-full lg:w-[212px] flex-none card !shadow-card p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 px-2.5 pt-1 pb-3">Admin</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-[3px]">
            {ADMIN_NAV.map((a) => (
              <button key={a.label} onClick={() => setActive(a.label)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-[13px] font-medium text-left transition-colors", active === a.label ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                <Icon name={a.icon} size={16} className={active === a.label ? "text-brand" : "text-ink-3"} />{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* content per section */}
        {active === "Appearance" && <div className="flex-1 min-w-0"><ThemePicker /></div>}

        {active !== "Appearance" && active !== "Teams" && (
          <div className="flex-1 min-w-0 card grid place-items-center py-20 text-center">
            <div className="flex flex-col items-center gap-3 max-w-[380px]">
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-soft text-brand"><Icon name="Settings2" size={26} /></span>
              <h3 className="m-0 text-lg font-semibold">{active}</h3>
              <p className="m-0 text-[13.5px] text-ink-2">This admin section is part of the roadmap. <b>Teams</b> and <b>Appearance</b> are fully functional today.</p>
            </div>
          </div>
        )}

        {active === "Teams" && (
        <div className="flex-1 min-w-0 card !shadow-card">
          <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
            <div>
              <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Teams</h2>
              <div className="text-[12.5px] text-ink-3 mt-0.5">6 teams · 51 members across the organization</div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-3 py-2 w-[200px]"><Icon name="Search" size={15} className="text-ink-3" /><input placeholder="Search teams..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" /></div>
              <button className="grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-line bg-card"><Icon name="SlidersHorizontal" size={16} className="text-ink-2" /></button>
              <button className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="Plus" size={15} />New Team</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  {["Team", "Members", "Projects", "Lead", "Status", ""].map((h, i) => (
                    <th key={i} className={cn("text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3.5 border-b border-line", i === 5 && "text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEAMS.map((t) => (
                  <tr key={t.name} className="hover:bg-bg-soft">
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                      <div className="flex items-center gap-3 font-semibold"><span className="grid place-items-center w-[34px] h-[34px] rounded-[9px] flex-none" style={{ background: t.ib }}><Icon name={t.ic} size={16} className="text-white" /></span>{t.name}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-ink-2">{t.mem}</td>
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-ink-2">{t.proj}</td>
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                      <div className="flex items-center gap-2.5"><span className="grid place-items-center w-[26px] h-[26px] rounded-full text-white text-[10px] font-semibold flex-none" style={{ background: PAL[t.pi] }}>{t.li}</span>{t.lead}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", t.st === "active" ? "text-emerald-600" : "text-amber-500")}><span className={cn("w-[7px] h-[7px] rounded-full", t.st === "active" ? "bg-emerald-500" : "bg-amber-500")} />{t.st[0].toUpperCase() + t.st.slice(1)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-right"><button className="text-ink-3"><Icon name="EllipsisVertical" size={17} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-[13px_20px] text-[12.5px] text-ink-3">
            <span>Showing 6 of 6 teams</span>
            <div className="flex items-center gap-1.5">
              <button className="grid place-items-center w-[30px] h-[30px] rounded-lg border border-line bg-card text-ink-2"><Icon name="ChevronLeft" size={14} /></button>
              <button className="grid place-items-center w-[30px] h-[30px] rounded-lg bg-brand text-white text-[12.5px] font-semibold">1</button>
              <button className="grid place-items-center w-[30px] h-[30px] rounded-lg border border-line bg-card text-ink-2"><Icon name="ChevronRight" size={14} /></button>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
