"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const GRAD = {
  SD: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  NK: "linear-gradient(135deg,#0EA5E9,#6366F1)",
  KM: "linear-gradient(135deg,#10B981,#22C55E)",
  PS: "linear-gradient(135deg,#F59E0B,#EF4444)",
  TN: "linear-gradient(135deg,#8B5CF6,#EC4899)",
};
const PRI_COLOR = { critical: "#EF4444", high: "#F59E0B", medium: "#6366F1", low: "#22C55E" };
const LABEL_STYLE = {
  feature: "bg-brand-soft text-[#4F46E5]",
  bug: "bg-[#FEE2E2] text-[#DC2626]",
  design: "bg-[#FCE7F3] text-[#DB2777]",
  infra: "bg-[#CCFBF1] text-[#0D9488]",
  backend: "bg-[#DBEAFE] text-[#2563EB]",
  research: "bg-[#FEF3C7] text-[#B45309]",
};

const SUMMARY = [
  { icon: "ListTodo", tone: "bg-brand-soft text-brand", v: "42", l: "Total tasks" },
  { icon: "Loader", tone: "bg-brand-soft text-brand", v: "11", l: "In progress" },
  { icon: "Clock", tone: "bg-amber-50 text-amber-500", v: "7", l: "Due this week" },
  { icon: "TriangleAlert", tone: "bg-red-50 text-red-500", v: "3", l: "Overdue" },
];

const GROUPS = [
  { name: "In Progress", color: "#6366F1", tasks: [
    { id: "APEX-187", t: "Implement task comments", proj: "Apex v2.1", pri: "high", label: "feature", av: "SD", due: "June 20", d: "soon" },
    { id: "APEX-188", t: "Real-time activity feed", proj: "Apex v2.1", pri: "medium", label: "feature", av: "NK", due: "June 22" },
    { id: "APEX-190", t: "GitHub integration v2", proj: "Platform", pri: "high", label: "backend", av: "PS", due: "June 18", d: "over" },
    { id: "APEX-191", t: "Advanced search indexing", proj: "Apex v2.1", pri: "medium", label: "research", av: "TN", due: "June 24" },
  ]},
  { name: "To Do", color: "#3B82F6", tasks: [
    { id: "APEX-201", t: "Create API rate limiting", proj: "Platform", pri: "high", label: "backend", av: "SD", due: "June 25" },
    { id: "APEX-204", t: "Fix authentication bug", proj: "Platform", pri: "critical", label: "bug", av: "NK", due: "June 17", d: "over" },
    { id: "APEX-209", t: "Onboarding illustration set", proj: "Design System", pri: "low", label: "design", av: "PS", due: "June 28" },
    { id: "APEX-212", t: "Terraform module cleanup", proj: "Infra", pri: "medium", label: "infra", av: "KM", due: "June 30" },
  ]},
  { name: "In Review", color: "#F59E0B", tasks: [
    { id: "APEX-172", t: "Kanban board enhancement", proj: "Apex v2.1", pri: "medium", label: "feature", av: "NK", due: "June 19", d: "soon" },
    { id: "APEX-173", t: "AI risk prediction model", proj: "Analytics", pri: "high", label: "research", av: "TN", due: "June 21" },
  ]},
  { name: "Done", color: "#22C55E", done: true, tasks: [
    { id: "APEX-160", t: "Authentication flow", proj: "Platform", pri: "high", label: "backend", av: "SD", due: "June 12" },
    { id: "APEX-164", t: "Email notifications service", proj: "Platform", pri: "medium", label: "backend", av: "KM", due: "June 10" },
  ]},
];

function TaskRow({ task, groupDone }) {
  const [done, setDone] = useState(groupDone);
  return (
    <div className={cn("flex items-center gap-3 px-[18px] py-3 border-b border-line last:border-b-0 hover:bg-[#FBFCFE] transition-colors", done && "[&_.tt]:line-through [&_.tt]:text-ink-3")}>
      <button onClick={() => setDone((d) => !d)} className={cn("grid place-items-center w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex-none", done ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}>
        <Icon name="Check" size={11} strokeWidth={3} className={cn("text-white", done ? "opacity-100" : "opacity-0")} />
      </button>
      <span className="w-[3px] h-[18px] rounded-[2px] flex-none" style={{ background: PRI_COLOR[task.pri] }} title={task.pri} />
      <span className="hidden md:block text-[11.5px] font-semibold text-ink-3 font-mono w-16 flex-none">{task.id}</span>
      <div className="flex-1 min-w-0">
        <div className="tt text-[13.5px] font-medium text-ink truncate">{task.t}</div>
        <div className="hidden md:block text-[11.5px] text-ink-3">{task.proj}</div>
      </div>
      <span className={cn("hidden md:inline-flex text-[11px] font-semibold px-2.5 py-[3px] rounded-[7px] flex-none", LABEL_STYLE[task.label])}>{task.label}</span>
      <span className={cn("hidden sm:flex items-center gap-1.5 text-xs w-24 flex-none", task.d === "over" ? "text-red-500 font-semibold" : task.d === "soon" ? "text-amber-500" : "text-ink-2")}>
        <Icon name={task.d === "over" ? "TriangleAlert" : "Calendar"} size={13} />{task.due}
      </span>
      <span className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold flex-none" style={{ background: GRAD[task.av] }}>{task.av}</span>
    </div>
  );
}

function TaskGroup({ group }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card !shadow-card overflow-hidden mb-3.5" style={{ borderRadius: 16 }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2.5 px-[18px] py-3 border-b border-line text-left">
        <span className="w-[9px] h-[9px] rounded-full flex-none" style={{ background: group.color }} />
        <b className="text-[13.5px] font-semibold">{group.name}</b>
        <span className="text-[11.5px] font-semibold text-ink-3 bg-bg rounded-full px-2 py-px">{group.tasks.length}</span>
        <Icon name="ChevronDown" size={16} className={cn("ml-auto text-ink-3 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div>{group.tasks.map((t) => <TaskRow key={t.id} task={t} groupDone={group.done} />)}</div>}
    </div>
  );
}

export default function TasksPage() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="SquareCheckBig" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Tasks</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Everything assigned across your projects and sprints.</div>
          </div>
        </div>
        <Button variant="primary" icon={<Icon name="Plus" size={15} />}>New Task</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
        {SUMMARY.map((s) => (
          <div key={s.l} className="card !rounded-[14px] !shadow-card p-[15px_16px] flex items-center gap-3">
            <span className={cn("grid place-items-center w-[42px] h-[42px] rounded-xl flex-none", s.tone)}><Icon name={s.icon} size={20} /></span>
            <div>
              <div className="text-2xl font-bold tracking-[-0.02em] leading-none">{s.v}</div>
              <div className="text-xs text-ink-2 mt-0.5">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-[11px] p-1 shadow-card">
          {["All", "My Tasks", "Assigned by me", "Recently updated"].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={cn("px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors", filter === c ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:text-ink")}>{c}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] bg-white border border-slate-200 text-[12.5px] font-medium text-ink-2 shadow-card"><Icon name="SlidersHorizontal" size={14} className="text-ink-3" />Filter</button>
        <button className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] bg-white border border-slate-200 text-[12.5px] font-medium text-ink-2 shadow-card"><Icon name="Layers" size={14} className="text-ink-3" />Group: Status<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
      </div>

      <div>{GROUPS.map((g) => <TaskGroup key={g.name} group={g} />)}</div>
    </>
  );
}
