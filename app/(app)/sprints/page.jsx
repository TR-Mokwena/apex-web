"use client";

import Icon from "@/components/Icon";
import { Button, Card, LineChart } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const CAPACITY = [
  { nm: "Sipho D.", av: "SD", pi: 1, used: 18, total: 21 },
  { nm: "Naledi K.", av: "NK", pi: 2, used: 16, total: 18 },
  { nm: "Priya S.", av: "PS", pi: 4, used: 20, total: 20 },
  { nm: "Thabo N.", av: "TN", pi: 3, used: 9, total: 16 },
  { nm: "TR Mokwena", av: "TM", pi: 0, used: 13, total: 18 },
];
const SPRINTS = [
  { n: "Sprint 14 — Collaboration", d: "June 12 – June 25", pct: 68, pts: "96 / 142", ic: "Zap", ib: "bg-brand-soft text-brand", badge: "bg-brand-soft text-brand-600", label: "Active", fcol: "#6366F1" },
  { n: "Sprint 15 — Analytics", d: "June 26 – Jul 8", pct: 0, pts: "0 / 130", ic: "CalendarClock", ib: "bg-[#EAF1FF] text-[#2563EB]", badge: "bg-[#EAF1FF] text-[#2563EB]", label: "Planned", fcol: "#3B82F6" },
  { n: "Sprint 13 — Foundations", d: "May 28 – June 11", pct: 100, pts: "134 / 134", ic: "Check", ib: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-600", label: "Completed", fcol: "#22C55E" },
  { n: "Sprint 12 — Onboarding", d: "May 14 – May 27", pct: 100, pts: "121 / 128", ic: "Check", ib: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-600", label: "Completed", fcol: "#22C55E" },
];
const VELOCITY = [
  { l: "S9", v: 104 }, { l: "S10", v: 120 }, { l: "S11", v: 118 }, { l: "S12", v: 121 }, { l: "S13", v: 134 }, { l: "S14", v: 96, partial: true },
];
const MAX_V = 140;

function capColor(pct) {
  return pct >= 100 ? "#EF4444" : pct >= 85 ? "#F59E0B" : "#6366F1";
}

export default function SprintsPage() {
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Zap" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Sprints</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Plan, track, and review your team&apos;s iterations.</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium"><Icon name="Folder" size={15} className="text-brand" />Apex v2.1<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
          <Button variant="primary" icon={<Icon name="Plus" size={15} />}>New Sprint</Button>
        </div>
      </div>

      {/* active sprint banner */}
      <div className="relative overflow-hidden rounded-card p-[20px_24px] text-white mb-4 flex items-center gap-7 flex-wrap" style={{ background: "linear-gradient(120deg,#1E1B4B,#312E81 60%,#4338CA)" }}>
        <span className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full" style={{ background: "rgba(139,92,246,0.4)", filter: "blur(40px)" }} />
        <div className="relative z-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#C7D2FE] flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#34D399] shadow-[0_0_0_3px_rgba(52,211,153,0.3)]" />Active sprint</div>
          <h2 className="m-0 mt-1.5 mb-1 text-[22px] font-bold">Sprint 14 — Collaboration</h2>
          <div className="text-[13px] text-[#C7D2FE]">June 12 – June 25, 2026 · 6 days remaining</div>
        </div>
        <div className="flex gap-7 md:ml-auto relative z-10">
          {[["142", "Committed pts"], ["96", "Completed pts"], ["9", "Contributors"]].map(([v, l]) => (
            <div key={l}><div className="text-[26px] font-bold leading-none">{v}</div><div className="text-[11.5px] text-[#C7D2FE] mt-1">{l}</div></div>
          ))}
        </div>
        <div className="relative z-10 w-[150px]">
          <svg width="150" height="92" viewBox="0 0 150 92">
            <path d="M16,80 A59,59 0 0 1 134,80" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="11" strokeLinecap="round" />
            <path d="M16,80 A59,59 0 0 1 134,80" fill="none" stroke="#34D399" strokeWidth="11" strokeLinecap="round" strokeDasharray="125 60" pathLength="185" />
            <text x="75" y="68" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff">68%</text>
            <text x="75" y="84" textAnchor="middle" fontSize="11" fill="#C7D2FE">complete</text>
          </svg>
        </div>
      </div>

      {/* burndown + capacity */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 mb-4">
        <Card title="Sprint Burndown" action={
          <div className="flex gap-3.5 text-xs text-ink-2">
            <span className="flex items-center gap-1.5"><span className="w-3.5 border-t-2 border-dashed border-slate-400" />Ideal</span>
            <span className="flex items-center gap-1.5"><span className="w-3.5 border-t-2 border-brand" />Actual</span>
          </div>
        }>
          <LineChart
            width={560} height={230}
            yMax={142} yTicks={[142, 106, 71, 35, 0]}
            xLabels={["Jun 12", "Jun 15", "Jun 18", "Jun 21", "Jun 24"]}
            series={[
              { values: [142, 118, 95, 71, 47, 23, 0], color: "#94A3B8", dashed: true },
              { values: [142, 130, 112, 95, 74, 52, 28], color: "var(--color-brand)" },
            ]}
          />
        </Card>

        <Card title="Team Capacity" action={<span className="text-xs text-ink-3">pts used / total</span>}>
          {CAPACITY.map((c) => {
            const pct = Math.round((c.used / c.total) * 100);
            return (
              <div key={c.av} className="flex items-center gap-3 py-2.5">
                <span className="grid place-items-center w-8 h-8 rounded-full text-white text-[11px] font-semibold flex-none" style={{ background: PAL[c.pi] }}>{c.av}</span>
                <span className="text-[13px] font-medium w-[100px] flex-none truncate">{c.nm}</span>
                <span className="flex-1 h-2 bg-bg rounded-full overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${pct}%`, background: capColor(pct) }} /></span>
                <span className="text-xs font-semibold text-ink-2 w-16 text-right tabular-nums">{c.used}/{c.total}</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* all sprints + velocity */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <Card title="All Sprints" action={<span className="text-[12.5px] font-medium text-brand cursor-pointer">View archive →</span>}>
          <div className="-mx-[18px] -mb-[18px]">
            {SPRINTS.map((s) => (
              <div key={s.n} className="flex items-center gap-3.5 px-[18px] py-3 border-b border-line last:border-b-0 cursor-pointer hover:bg-bg-soft transition-colors">
                <span className={cn("grid place-items-center w-9 h-9 rounded-[10px] flex-none", s.ib)}><Icon name={s.ic} size={17} /></span>
                <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold">{s.n}</b><span className="text-[11.5px] text-ink-3">{s.d}</span></div>
                <div className="hidden sm:block w-[120px] flex-none"><div className="h-1.5 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.fcol }} /></div></div>
                <span className="hidden md:block text-xs text-ink-2 w-[70px] text-right">{s.pts}</span>
                <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-[7px] whitespace-nowrap", s.badge)}>{s.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Velocity History" action={<span className="text-xs text-ink-3">last 6 sprints</span>}>
          <div className="flex items-end gap-3.5 h-[150px] px-1 pt-2">
            {VELOCITY.map((d) => (
              <div key={d.l} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 flex items-end w-full justify-center">
                  <div className="group relative w-4 rounded-t-[5px] cursor-pointer transition-[filter] hover:brightness-110" style={{ height: (d.v / MAX_V) * 120, background: d.partial ? "color-mix(in srgb, var(--color-brand) 55%, white)" : "var(--color-brand)" }}>
                    <span className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg bg-[#1e293b] text-white text-[11px] font-semibold whitespace-nowrap shadow-pop opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.v} pts{d.partial ? " · in progress" : ""}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-ink-3">{d.l}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-ink-2 mt-2.5">Avg velocity <b className="text-ink">128 pts</b> · trending <span className="text-emerald-600 font-semibold">↑ 9%</span></div>
        </Card>
      </div>
    </>
  );
}
