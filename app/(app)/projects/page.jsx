"use client";

import { useState, useRef } from "react";
import Icon from "@/components/Icon";
import { Button, Tabs, Avatar, Donut, LegendRow } from "@/components/ui";
import { cn } from "@/lib/cn";

const TAG_STYLE = {
  Design: "bg-[#FCE7F3] text-[#DB2777]",
  Analytics: "bg-[#CFFAFE] text-[#0891B2]",
  Platform: "bg-brand-soft text-[#4F46E5]",
  DevOps: "bg-[#FFEDD5] text-[#EA580C]",
  Backend: "bg-[#DBEAFE] text-[#2563EB]",
  Quality: "bg-[#FEE2E2] text-[#DC2626]",
  Feature: "bg-brand-soft text-[#4F46E5]",
  Integration: "bg-[#CCFBF1] text-[#0D9488]",
  AI: "bg-[#EDE9FE] text-[#7C3AED]",
};
const GRAD = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const INITIALS = ["SD", "TN", "KM", "PS", "TM"];

const COLUMNS = [
  { name: "Backlog", color: "#94A3B8", count: 18, add: true, cards: [
    { id: "APEX-215", t: "Design system audit", tag: "Design", a: 0 },
    { id: "APEX-216", t: "Implement analytics events", tag: "Analytics", a: 1 },
    { id: "APEX-217", t: "Offline sync architecture", tag: "Platform", a: 2 },
    { id: "APEX-218", t: "Error tracking integration", tag: "DevOps", a: 3 },
  ]},
  { name: "To Do", color: "#3B82F6", count: 7, add: true, cards: [
    { id: "APEX-201", t: "Create API rate limiting", tag: "Backend", a: 1 },
    { id: "APEX-202", t: "User roles & permissions", tag: "Backend", a: 2 },
    { id: "APEX-203", t: "Push notification setup", tag: "Platform", a: 0 },
    { id: "APEX-204", t: "Create unit tests", tag: "Quality", a: 3 },
  ]},
  { name: "In Progress", color: "#6366F1", count: 6, add: true, cards: [
    { id: "APEX-187", t: "Implement task comments", tag: "Feature", a: 0, sub: "2/5", sel: true },
    { id: "APEX-188", t: "Real-time activity feed", tag: "Feature", a: 2, sub: "3/5" },
    { id: "APEX-189", t: "Milestone progress tracking", tag: "Feature", a: 1, sub: "4/6" },
    { id: "APEX-190", t: "GitHub integration v2", tag: "Integration", a: 3, sub: "1/3" },
    { id: "APEX-191", t: "Advanced search", tag: "Feature", a: 4, sub: "1/3" },
  ]},
  { name: "In Review", color: "#F59E0B", count: 4, add: true, cards: [
    { id: "APEX-172", t: "Kanban board enhancement", tag: "Feature", a: 1, sub: "5/5" },
    { id: "APEX-173", t: "AI risk prediction", tag: "AI", a: 2, sub: "2/2" },
    { id: "APEX-174", t: "Sprint burndown widget", tag: "Feature", a: 0, sub: "2/2" },
    { id: "APEX-175", t: "Export reports", tag: "Feature", a: 3, sub: "1/1" },
  ]},
  { name: "Done", color: "#22C55E", count: 23, add: false, cards: [
    { id: "APEX-160", t: "Authentication flow", tag: "Backend", done: true },
    { id: "APEX-161", t: "Project creation flow", tag: "Backend", done: true },
    { id: "APEX-162", t: "Team management", tag: "Backend", done: true },
    { id: "APEX-163", t: "File upload service", tag: "Platform", done: true },
    { id: "APEX-164", t: "Email notifications", tag: "Platform", done: true },
  ]},
];

function Tag({ tag }) {
  return <span className={cn("inline-flex text-[11px] font-semibold px-2.5 py-[3px] rounded-[7px]", TAG_STYLE[tag] || "bg-slate-100 text-slate-500")}>{tag}</span>;
}

function Toolbar() {
  const tool = "flex items-center gap-1.5 h-[34px] px-3 rounded-[9px] text-[12.5px] font-medium bg-white border border-slate-200 text-ink-2 cursor-pointer hover:border-[#C7D2FE]";
  return (
    <div className="flex items-center gap-2.5 flex-wrap mb-3">
      <button className={tool}><Icon name="CalendarRange" size={14} className="text-brand" />Sprint 12<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
      <button className={tool}><Icon name="Calendar" size={14} className="text-ink-3" />June 12 – June 25, 2026<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
      <div className="flex-1" />
      <button className={tool}><Icon name="SlidersHorizontal" size={14} className="text-ink-3" />Filter</button>
      <button className={tool}><Icon name="Layers" size={14} className="text-ink-3" />Group by: Status<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
      <button className={tool}><Icon name="ArrowUpDown" size={14} className="text-ink-3" />Sort</button>
    </div>
  );
}

export default function ProjectsPage() {
  const [columns, setColumns] = useState(COLUMNS);
  const drag = useRef(null); // { col, id }
  const [over, setOver] = useState(null); // { col, index }
  const [dragId, setDragId] = useState(null);

  const onDragStart = (col, id) => (e) => { drag.current = { col, id }; setDragId(id); e.dataTransfer.effectAllowed = "move"; };
  const onDragEnd = () => { drag.current = null; setOver(null); setDragId(null); };
  const onCardOver = (col, index) => (e) => {
    e.preventDefault(); e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setOver({ col, index: e.clientY > r.top + r.height / 2 ? index + 1 : index });
  };
  const onColOver = (col, count) => (e) => { e.preventDefault(); setOver({ col, index: count }); };
  const onDrop = () => {
    const d = drag.current;
    if (!d || !over) return onDragEnd();
    setColumns((cols) => {
      const next = cols.map((c) => ({ ...c, cards: [...c.cards] }));
      const idx = next[d.col].cards.findIndex((c) => c.id === d.id);
      if (idx < 0) return cols;
      const [card] = next[d.col].cards.splice(idx, 1);
      let insert = over.index;
      if (d.col === over.col && idx < over.index) insert--;
      next[over.col].cards.splice(insert, 0, card);
      return next;
    });
    onDragEnd();
  };

  const Indicator = () => <div className="h-[3px] bg-brand rounded-full mx-1 my-0.5" />;

  return (
    <div className="flex flex-col gap-4">
      {/* project header */}
      <div>
        <div className="flex items-center gap-2 text-[12.5px] text-ink-3 mb-2.5">
          <span>Projects</span><Icon name="ChevronRight" size={13} /><span className="text-ink-2 font-medium">Apex v2.1</span>
        </div>
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="m-0 text-[22px] font-bold tracking-[-0.02em]">Apex v2.1</h1>
              <Icon name="Star" size={18} className="text-amber-500 fill-amber-500" />
              <span className="flex items-center gap-1.5 bg-brand-soft text-brand-600 text-xs font-semibold px-2.5 py-1 rounded-lg cursor-pointer">Active<Icon name="ChevronDown" size={13} /></span>
            </div>
            <p className="text-[13px] text-ink-2 mt-1.5 m-0">Next-generation engineering operating system</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button icon={<Icon name="Share2" size={15} />}>Share</Button>
            <Button variant="secondary" className="!px-0 w-10"><Icon name="EllipsisVertical" size={15} /></Button>
            <Button variant="primary" icon={<Icon name="Plus" size={15} />}>New Task</Button>
          </div>
        </div>
        <Tabs className="mt-3.5" items={["Overview", "Board", "List", "Timeline", "Gantt", "Milestones", "Files", "Dependencies", "Reports", "Settings"]} value="Board" />
      </div>

      <div className="flex gap-4 items-start">
        {/* board */}
        <div className="flex-1 min-w-0">
          <Toolbar />
          <div className="overflow-x-auto pb-3">
            <div className="flex gap-3.5 items-start min-w-max">
              {columns.map((col, ci) => (
                <div key={col.name} className="w-[248px] flex-none">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-line rounded-t-[11px]" style={{ borderTop: `3px solid ${col.color}` }}>
                    <div className="flex items-center gap-2 text-[13.5px] font-semibold">
                      <span className="w-[9px] h-[9px] rounded-full" style={{ background: col.color }} />{col.name}
                      <span className="text-xs font-semibold text-ink-3 bg-bg rounded-[7px] px-2 py-0.5">{col.cards.length}</span>
                    </div>
                    <button className="text-ink-3 grid place-items-center"><Icon name="Plus" size={15} /></button>
                  </div>
                  <div
                    onDragOver={onColOver(ci, col.cards.length)}
                    onDrop={onDrop}
                    className={cn("bg-[#fbfcfe] border border-line border-t-0 rounded-b-[11px] p-2.5 flex flex-col min-h-[120px] transition-colors", over?.col === ci && "bg-brand-soft/40")}
                  >
                    {col.cards.map((c, j) => (
                      <div key={c.id}>
                        {over?.col === ci && over.index === j && <Indicator />}
                        <div
                          draggable
                          onDragStart={onDragStart(ci, c.id)}
                          onDragEnd={onDragEnd}
                          onDragOver={onCardOver(ci, j)}
                          className={cn(
                            "bg-white border rounded-[11px] p-3 mb-2.5 cursor-grab active:cursor-grabbing shadow-card transition-[border-color,opacity] hover:border-[#D6DCEA]",
                            c.sel ? "border-[1.5px] border-brand shadow-[0_0_0_3px_rgba(99,102,241,0.12)]" : "border-line",
                            dragId === c.id && "opacity-40",
                          )}
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] font-semibold text-ink-3 font-mono">{c.id}</span>
                            {c.done
                              ? <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-500 text-white"><Icon name="Check" size={12} strokeWidth={3} /></span>
                              : <Icon name="GripVertical" size={14} className="text-ink-3" />}
                          </div>
                          <div className="text-[13.5px] font-semibold leading-[1.35] mb-2.5">{c.t}</div>
                          <Tag tag={c.tag} />
                          <div className="flex items-center justify-between mt-2.5">
                            {c.sub
                              ? <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2 font-medium"><Icon name="ListChecks" size={13} className="text-ink-3" />{c.sub}</span>
                              : <span />}
                            {!c.done && <Avatar name={INITIALS[c.a]} color={GRAD[c.a % GRAD.length]} size={24} style={{ fontSize: 10 }} />}
                          </div>
                        </div>
                      </div>
                    ))}
                    {over?.col === ci && over.index === col.cards.length && <Indicator />}
                    {col.add && <button className="flex items-center gap-1.5 px-1.5 py-2.5 text-[12.5px] text-ink-3 font-medium"><Icon name="Plus" size={14} />Add task</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* sprint summary rail */}
        <aside className="hidden xl:flex w-[300px] flex-none flex-col gap-3.5">
          <div className="card p-[18px]">
            <h4 className="m-0 mb-0.5 text-sm font-semibold">Sprint 12</h4>
            <div className="text-[11.5px] text-ink-3 mb-3">June 12 – June 25, 2026</div>
            <div className="flex items-center gap-3.5">
              <Donut size={120} thickness={5.5} center="23" centerSub="Total Tasks" segments={[
                { value: 38, color: "#22C55E" }, { value: 26, color: "#6366F1" }, { value: 17, color: "#F59E0B" }, { value: 12, color: "#3B82F6" }, { value: 7, color: "#94A3B8" },
              ]} />
              <div className="flex-1">
                <LegendRow color="#22C55E" label="Done" value="38%" className="!py-1" />
                <LegendRow color="#6366F1" label="In Progress" value="26%" className="!py-1" />
                <LegendRow color="#F59E0B" label="In Review" value="17%" className="!py-1" />
                <LegendRow color="#3B82F6" label="To Do" value="12%" className="!py-1" />
                <LegendRow color="#94A3B8" label="Backlog" value="8%" className="!py-1" />
              </div>
            </div>
            <button className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand">View sprint report <Icon name="ArrowRight" size={14} /></button>
          </div>
        </aside>
      </div>
    </div>
  );
}
