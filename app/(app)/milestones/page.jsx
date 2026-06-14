"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const INIT = ["TM", "SD", "TN", "PS", "NK"];

const STATUS = {
  done: { node: "bg-emerald-50 border-emerald-500 text-emerald-600", icon: "Check", badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", label: "Completed", fill: "#22C55E" },
  active: { node: "bg-brand-soft border-brand text-brand", icon: "Loader", badge: "bg-brand-soft text-brand-600", dot: "bg-brand", label: "On track", fill: "#6366F1" },
  risk: { node: "bg-amber-50 border-amber-500 text-amber-500", icon: "TriangleAlert", badge: "bg-amber-50 text-[#B45309]", dot: "bg-amber-500", label: "At risk", fill: "#F59E0B" },
  stalled: { node: "bg-red-50 border-red-500 text-red-500", icon: "OctagonX", badge: "bg-red-50 text-[#DC2626]", dot: "bg-red-500", label: "Stalled", fill: "#EF4444" },
};

const MILESTONES = [
  { t: "Event bus migration", proj: "Platform Core", due: "Completed June 2", prog: 100, st: "done", tasks: "14/14", owners: [1, 0] },
  { t: "v2.1 Beta cutover", proj: "Apex v2.1", due: "Due June 24", prog: 68, st: "active", tasks: "17/25", owners: [0, 1, 4] },
  { t: "RBAC permission scopes", proj: "Platform Core", due: "Due June 30", prog: 55, st: "active", tasks: "11/20", owners: [0] },
  { t: "Mobile App Launch", proj: "Apex v2.1", due: "Due June 24", prog: 41, st: "risk", tasks: "9/22", owners: [1, 3] },
  { t: "Analytics Module GA", proj: "Analytics", due: "Due Jul 15", prog: 12, st: "stalled", tasks: "3/18", owners: [3] },
  { t: "Observability rollout", proj: "Infra", due: "Due Aug 2", prog: 27, st: "active", tasks: "4/15", owners: [2, 1] },
];

const TABS = [["All", 6], ["Active", 3], ["At risk", 2], ["Completed", 1]];

export default function MilestonesPage() {
  const [tab, setTab] = useState("All");
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Flag" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Milestones</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Track delivery checkpoints across Apex v2.1 and beyond.</div>
          </div>
        </div>
        <Button variant="primary" icon={<Icon name="Plus" size={15} />}>New Milestone</Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-[18px]">
        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-[11px] p-1 shadow-card">
          {TABS.map(([label, ct]) => (
            <button key={label} onClick={() => setTab(label)} className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors", tab === label ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:text-ink")}>
              {label}<span className={cn("text-[11px] font-semibold", tab === label ? "text-brand-600" : "text-ink-3")}>{ct}</span>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex bg-white border border-slate-200 rounded-[10px] p-[3px] shadow-card">
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-xs font-medium bg-brand-soft text-brand-600"><Icon name="GitCommitVertical" size={14} />Timeline</span>
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-xs font-medium text-ink-2 cursor-pointer"><Icon name="ChartGantt" size={14} />Gantt</span>
        </div>
      </div>

      {/* timeline */}
      <div className="relative">
        {/* continuous line, centered in the 30px node gutter (center = 15px) */}
        <span aria-hidden className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-slate-200" />
        {MILESTONES.map((m) => {
          const s = STATUS[m.st];
          return (
            <div key={m.t} className="relative flex gap-4 mb-4">
              <div className="flex-none w-[30px] flex items-center justify-center">
                <span className={cn("relative z-10 grid place-items-center w-[30px] h-[30px] rounded-full border-2", s.node)}><Icon name={s.icon} size={14} /></span>
              </div>
              <div className="flex-1 min-w-0 card !shadow-card overflow-hidden cursor-pointer transition-colors hover:border-[#D6DCEA]">
                <div className="flex items-start gap-3.5 px-[18px] pt-4 pb-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold tracking-[-0.01em]">{m.t}</div>
                    <div className="text-xs text-ink-3 mt-1 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1"><Icon name="Folder" size={13} />{m.proj}</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-ink-3" />
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={13} />{m.due}</span>
                    </div>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-full flex-none", s.badge)}><span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />{s.label}</span>
                </div>
                <div className="px-[18px] pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.prog}%`, background: s.fill }} /></div>
                    <span className="text-[13px] font-bold tabular-nums w-[42px] text-right">{m.prog}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-ink-2">
                      <span className="flex items-center gap-1.5"><Icon name="SquareCheckBig" size={14} className="text-ink-3" />{m.tasks} tasks</span>
                      <span className="hidden sm:flex items-center gap-1.5"><Icon name="GitCommitHorizontal" size={14} className="text-ink-3" />{m.proj}</span>
                    </div>
                    <div className="flex">
                      {m.owners.map((o, i) => (
                        <span key={i} className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold border-2 border-white" style={{ background: PAL[o], marginLeft: i ? -8 : 0 }}>{INIT[o]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
