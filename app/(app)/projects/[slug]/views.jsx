"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { LineChart, Donut, BarPairs, LegendRow, Switch, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PAL, INITIALS, TAG_STYLE } from "@/lib/projects";

const TONE = {
  green: "bg-emerald-50 text-emerald-600", indigo: "bg-brand-soft text-brand", blue: "bg-[#EAF1FF] text-[#3B82F6]",
  red: "bg-red-50 text-red-500", violet: "bg-[#F3EEFE] text-[#7C3AED]", amber: "bg-amber-50 text-amber-500", slate: "bg-slate-100 text-slate-500",
};
const LEGEND = [{ color: "#94A3B8" }, { color: "#3B82F6" }, { color: "#6366F1" }, { color: "#F59E0B" }, { color: "#22C55E" }];

/* ─── Timeline ────────────────────────────────────────────────────────────── */
const EVENTS = [
  { icon: "GitMerge", tone: "green", title: "PR #4821 merged", desc: "Fix authentication bug · Sipho Dlamini", time: "2h ago" },
  { icon: "Check", tone: "indigo", title: "Task completed", desc: "“Design system update” moved to Done", time: "5h ago" },
  { icon: "Flag", tone: "blue", title: "Milestone updated", desc: "API Gateway · due moved to June 30", time: "1d ago" },
  { icon: "GitCommitHorizontal", tone: "slate", title: "12 commits pushed", desc: "across 4 branches by the team", time: "1d ago" },
  { icon: "UserPlus", tone: "violet", title: "Priya Singh joined", desc: "added to the project as Designer", time: "2d ago" },
  { icon: "Rocket", tone: "amber", title: "Deployed to staging", desc: "gateway-service v2.3.1", time: "3d ago" },
];
export function TimelineView() {
  return (
    <div className="card p-[18px] md:p-6">
      <h3 className="m-0 mb-5 text-[15px] font-semibold">Activity Timeline</h3>
      <div className="relative pl-[34px] before:content-[''] before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
        {EVENTS.map((e, i) => (
          <div key={i} className="relative pb-5 last:pb-0">
            <span className={cn("absolute -left-[34px] top-0 grid place-items-center w-[28px] h-[28px] rounded-full border-2 border-white", TONE[e.tone])}><Icon name={e.icon} size={14} /></span>
            <div className="flex items-start justify-between gap-3">
              <div><b className="text-[13.5px] font-semibold">{e.title}</b><p className="m-0 text-[12.5px] text-ink-2 mt-0.5">{e.desc}</p></div>
              <span className="text-[11.5px] text-ink-3 whitespace-nowrap flex-none">{e.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Gantt ───────────────────────────────────────────────────────────────── */
const DAYS = 14, START_DAY = 12, TODAY = 6;
const GT = [
  { t: "Implement task comments", id: "APEX-187", a: 0, start: 0, len: 6, color: "#6366F1" },
  { t: "Real-time activity feed", id: "APEX-188", a: 2, start: 2, len: 5, color: "#8B5CF6" },
  { t: "Milestone progress tracking", id: "APEX-189", a: 1, start: 4, len: 5, color: "#0EA5E9" },
  { t: "GitHub integration v2", id: "APEX-190", a: 3, start: 6, len: 6, color: "#10B981" },
  { t: "Advanced search", id: "APEX-191", a: 4, start: 8, len: 4, color: "#F59E0B" },
];
export function GanttView() {
  return (
    <div className="card p-[18px] overflow-x-auto">
      <h3 className="m-0 mb-4 text-[15px] font-semibold">Timeline · June 2026</h3>
      <div className="min-w-[680px]">
        <div className="grid" style={{ gridTemplateColumns: "180px 1fr" }}>
          <div />
          <div className="grid mb-2" style={{ gridTemplateColumns: `repeat(${DAYS},1fr)` }}>
            {Array.from({ length: DAYS }, (_, i) => (
              <span key={i} className={cn("text-[10px] text-center", i === TODAY ? "text-red-500 font-bold" : "text-ink-3")}>{START_DAY + i}</span>
            ))}
          </div>
        </div>
        {GT.map((r) => (
          <div key={r.id} className="grid items-center h-9" style={{ gridTemplateColumns: "180px 1fr" }}>
            <div className="flex items-center gap-2 pr-3 min-w-0">
              <span className="grid place-items-center w-5 h-5 rounded-full text-white text-[8px] font-semibold flex-none" style={{ background: PAL[r.a % PAL.length] }}>{INITIALS[r.a]}</span>
              <div className="min-w-0"><div className="text-[11.5px] font-medium leading-tight truncate">{r.t}</div><div className="text-[10px] text-ink-3 font-mono">{r.id}</div></div>
            </div>
            <div className="relative h-9">
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${DAYS},1fr)` }}>{Array.from({ length: DAYS }, (_, i) => <span key={i} className="border-l border-[#F1F3F8]" />)}</div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-400/60" style={{ left: `${(TODAY / DAYS) * 100}%` }} />
              <div className="absolute top-[7px] h-[22px] rounded-md flex items-center px-2.5 text-[11px] font-semibold text-white whitespace-nowrap overflow-hidden" style={{ left: `${(r.start / DAYS) * 100}%`, width: `${(r.len / DAYS) * 100}%`, background: r.color }}>{r.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Milestones ──────────────────────────────────────────────────────────── */
const MS_STATUS = {
  done: { badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", label: "Completed", fill: "#22C55E" },
  active: { badge: "bg-brand-soft text-brand-600", dot: "bg-brand", label: "On track", fill: "#6366F1" },
  risk: { badge: "bg-amber-50 text-[#B45309]", dot: "bg-amber-500", label: "At risk", fill: "#F59E0B" },
};
const MILESTONES = [
  { t: "v2.1 Beta cutover", due: "Due June 24", prog: 68, st: "active", tasks: "17/25", owners: [0, 1, 4] },
  { t: "RBAC permission scopes", due: "Due June 30", prog: 55, st: "active", tasks: "11/20", owners: [0] },
  { t: "Collaboration features", due: "Due June 24", prog: 41, st: "risk", tasks: "9/22", owners: [1, 3] },
  { t: "Event bus migration", due: "Completed June 2", prog: 100, st: "done", tasks: "14/14", owners: [2, 1] },
];
export function MilestonesView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
      {MILESTONES.map((m) => {
        const s = MS_STATUS[m.st];
        return (
          <div key={m.t} className="card p-[18px]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div><div className="text-[15px] font-semibold">{m.t}</div><div className="text-xs text-ink-3 mt-1 flex items-center gap-1"><Icon name="Calendar" size={13} />{m.due}</div></div>
              <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-full flex-none", s.badge)}><span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />{s.label}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.prog}%`, background: s.fill }} /></div>
              <span className="text-[13px] font-bold tabular-nums w-[42px] text-right">{m.prog}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-2 flex items-center gap-1.5"><Icon name="SquareCheckBig" size={14} className="text-ink-3" />{m.tasks} tasks</span>
              <div className="flex">{m.owners.map((o, i) => <span key={i} className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold border-2 border-white" style={{ background: PAL[o % PAL.length], marginLeft: i ? -8 : 0 }}>{INITIALS[o]}</span>)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Files ───────────────────────────────────────────────────────────────── */
const FILES = [
  { name: "Technical Spec v2.pdf", type: "pdf", size: "2.4 MB", by: "Sipho D.", when: "2h ago", icon: "FileText", tone: "red" },
  { name: "Architecture Diagram.fig", type: "figma", size: "8.1 MB", by: "Priya S.", when: "1d ago", icon: "PenTool", tone: "violet" },
  { name: "API Contract.json", type: "json", size: "142 KB", by: "Thabo N.", when: "1d ago", icon: "FileJson", tone: "amber" },
  { name: "Sprint 12 Retro.md", type: "md", size: "18 KB", by: "TR Mokwena", when: "3d ago", icon: "FileText", tone: "indigo" },
  { name: "Demo Recording.mp4", type: "video", size: "124 MB", by: "Naledi K.", when: "4d ago", icon: "FileVideo", tone: "blue" },
  { name: "Brand Assets.zip", type: "zip", size: "56 MB", by: "Priya S.", when: "1w ago", icon: "FileArchive", tone: "slate" },
];
export function FilesView() {
  return (
    <div className="card !shadow-card">
      <div className="flex items-center justify-between p-[16px_18px] border-b border-line">
        <h3 className="m-0 text-[15px] font-semibold">Files <span className="text-ink-3 font-normal">({FILES.length})</span></h3>
        <Button variant="primary" size="sm" icon={<Icon name="Upload" size={14} />}>Upload</Button>
      </div>
      <div>
        {FILES.map((f) => (
          <div key={f.name} className="flex items-center gap-3 px-[18px] py-3 border-b border-line last:border-b-0 hover:bg-[#FBFCFE] transition-colors cursor-pointer">
            <span className={cn("grid place-items-center w-10 h-10 rounded-[10px] flex-none", TONE[f.tone])}><Icon name={f.icon} size={18} /></span>
            <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold truncate">{f.name}</b><span className="text-[11.5px] text-ink-3">{f.size} · {f.by} · {f.when}</span></div>
            <button className="grid place-items-center w-8 h-8 rounded-lg text-ink-3 hover:bg-bg flex-none"><Icon name="Download" size={16} /></button>
            <button className="grid place-items-center w-8 h-8 rounded-lg text-ink-3 hover:bg-bg flex-none"><Icon name="EllipsisVertical" size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dependencies ────────────────────────────────────────────────────────── */
const DEPS = [
  { from: "APEX-190", fromT: "GitHub integration v2", rel: "is blocked by", to: "APEX-201", toT: "Create API rate limiting", status: "blocked" },
  { from: "APEX-188", fromT: "Real-time activity feed", rel: "blocks", to: "APEX-189", toT: "Milestone progress tracking", status: "ok" },
  { from: "APEX-187", fromT: "Implement task comments", rel: "is blocked by", to: "APEX-202", toT: "User roles & permissions", status: "blocked" },
  { from: "APEX-174", fromT: "Sprint burndown widget", rel: "blocks", to: "APEX-175", toT: "Export reports", status: "ok" },
];
export function DependenciesView() {
  return (
    <div className="card !shadow-card">
      <div className="p-[16px_18px] border-b border-line"><h3 className="m-0 text-[15px] font-semibold">Dependencies</h3><div className="text-[12.5px] text-ink-3 mt-0.5">How tasks block and unblock each other.</div></div>
      <div>
        {DEPS.map((d, i) => (
          <div key={i} className="flex items-center gap-3 px-[18px] py-3.5 border-b border-line last:border-b-0 flex-wrap">
            <span className="flex items-center gap-2 min-w-0"><span className="text-[11px] font-mono text-ink-3">{d.from}</span><span className="text-[13px] font-medium truncate max-w-[180px]">{d.fromT}</span></span>
            <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full", d.status === "blocked" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600")}>
              <Icon name={d.status === "blocked" ? "Ban" : "ArrowRight"} size={12} />{d.rel}
            </span>
            <span className="flex items-center gap-2 min-w-0"><span className="text-[11px] font-mono text-ink-3">{d.to}</span><span className="text-[13px] font-medium truncate max-w-[180px]">{d.toT}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Reports ─────────────────────────────────────────────────────────────── */
export function ReportsView({ segments, columns }) {
  const stats = [
    { l: "Velocity", v: "34", d: "+12%", icon: "Zap", tone: "indigo" },
    { l: "Cycle time", v: "2.6d", d: "−8%", icon: "Clock", tone: "green" },
    { l: "Open tasks", v: String(columns.slice(0, 4).reduce((n, c) => n + c.cards.length, 0)), d: "", icon: "ListTodo", tone: "amber" },
    { l: "Completed", v: String(columns[columns.length - 1].cards.length), d: "+6", icon: "CircleCheckBig", tone: "green" },
  ];
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
        {stats.map((s) => (
          <div key={s.l} className="card !rounded-[14px] !shadow-card p-[15px_16px]">
            <div className="flex items-center gap-2 mb-2.5"><span className={cn("grid place-items-center w-7 h-7 rounded-lg", TONE[s.tone])}><Icon name={s.icon} size={15} /></span><span className="text-[11.5px] text-ink-2">{s.l}</span></div>
            <div className="text-[24px] font-bold tracking-[-0.02em]">{s.v}</div>
            {s.d && <div className="text-[11.5px] font-semibold text-emerald-600 mt-0.5">{s.d}</div>}
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3.5">
        <div className="card p-[18px]">
          <h3 className="m-0 mb-3 text-[15px] font-semibold">Sprint Burndown</h3>
          <LineChart xLabels={["Jun 12", "Jun 15", "Jun 18", "Jun 21", "Jun 24"]} yMax={60} yTicks={[60, 45, 30, 15, 0]}
            series={[{ values: [60, 48, 36, 24, 12, 0], color: "#94A3B8", dashed: true }, { values: [60, 54, 44, 33, 22, 10], color: "#6366F1" }]} />
        </div>
        <div className="card p-[18px]">
          <h3 className="m-0 mb-3 text-[15px] font-semibold">Task Distribution</h3>
          <div className="flex items-center gap-4">
            <Donut size={130} segments={segments} center={String(segments.reduce((n, s) => n + s.value, 0))} centerSub="tasks" />
            <div className="flex-1">{segments.map((s) => <LegendRow key={s.label} color={s.color} label={s.label} value={s.value} className="!py-1" />)}</div>
          </div>
        </div>
      </div>
      <div className="card p-[18px]">
        <h3 className="m-0 mb-3 text-[15px] font-semibold">Weekly GitHub Activity</h3>
        <BarPairs xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} data={[[40, 24], [62, 38], [34, 20], [80, 50], [30, 18], [56, 34], [22, 10]]} />
      </div>
    </div>
  );
}

/* ─── Settings ────────────────────────────────────────────────────────────── */
const SWATCHES = ["#6366F1", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
export function SettingsView({ project }) {
  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key);
  const [desc, setDesc] = useState(project.desc);
  const [color, setColor] = useState(project.color);
  const field = "h-10 border border-slate-200 rounded-[10px] px-3 text-sm outline-none focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)] bg-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
      <div className="card p-[18px] lg:col-span-2">
        <h3 className="m-0 mb-4 text-[15px] font-semibold">General</h3>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5"><span className="text-[12.5px] font-medium text-ink-2">Project name</span><input value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-[12.5px] font-medium text-ink-2">Key</span><input value={key} onChange={(e) => setKey(e.target.value.toUpperCase())} className={cn(field, "w-32 font-mono")} maxLength={5} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-[12.5px] font-medium text-ink-2">Description</span><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={cn(field, "h-auto py-2.5 resize-none")} /></label>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-2">Color</span>
            <div className="flex gap-2">
              {SWATCHES.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={cn("w-7 h-7 rounded-full transition-transform hover:scale-110", color === c && "ring-2 ring-offset-2 ring-ink/30")} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 pt-1"><Button variant="primary">Save changes</Button><Button>Cancel</Button></div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="card p-[18px]">
          <h3 className="m-0 mb-3 text-[15px] font-semibold">Preferences</h3>
          {[["Public to organization", true], ["Email notifications", true], ["Require review on merge", false]].map(([label, on]) => (
            <div key={label} className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-b-0">
              <span className="text-[13px] font-medium">{label}</span><Switch defaultChecked={on} />
            </div>
          ))}
        </div>
        <div className="card p-[18px] border-red-200">
          <h3 className="m-0 mb-1 text-[15px] font-semibold text-red-500">Danger zone</h3>
          <p className="m-0 text-[12.5px] text-ink-2 mb-3">Archiving hides the project. Deleting is permanent.</p>
          <div className="flex flex-col gap-2">
            <button className="h-10 rounded-[10px] border border-slate-200 text-[13px] font-semibold text-ink-2 hover:bg-bg">Archive project</button>
            <button className="h-10 rounded-[10px] bg-red-50 text-red-500 text-[13px] font-semibold hover:bg-red-100">Delete project</button>
          </div>
        </div>
      </div>
    </div>
  );
}
