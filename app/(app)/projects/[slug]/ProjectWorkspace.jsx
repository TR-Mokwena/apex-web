"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Button, Tabs, Donut, LegendRow } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getProject, BOARD, TAG_STYLE, PAL, INITIALS, STATUS_TONE } from "@/lib/projects";
import { TimelineView, GanttView, MilestonesView, FilesView, DependenciesView, ReportsView, SettingsView } from "./views";

const TABS = ["Overview", "Board", "List", "Timeline", "Gantt", "Milestones", "Files", "Dependencies", "Reports", "Settings"];
const LEGEND = [
  { name: "Backlog", color: "#94A3B8" }, { name: "To Do", color: "#3B82F6" }, { name: "In Progress", color: "#6366F1" }, { name: "In Review", color: "#F59E0B" }, { name: "Done", color: "#22C55E" },
];

function Tag({ tag }) {
  return <span className={cn("inline-flex text-[11px] font-semibold px-2.5 py-[3px] rounded-[7px]", TAG_STYLE[tag] || "bg-bg-soft text-ink-2")}>{tag}</span>;
}

export default function ProjectWorkspace({ slug }) {
  const project = getProject(slug);
  const [tab, setTab] = useState("Board");
  const [columns, setColumns] = useState(() => BOARD.map((c) => ({ ...c, cards: c.cards.map((x) => ({ ...x })) })));
  const drag = useRef(null);
  const [over, setOver] = useState(null);
  const [dragId, setDragId] = useState(null);

  if (!project) {
    return (
      <div className="card grid place-items-center py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <Icon name="FolderX" size={30} className="text-ink-3" />
          <div className="text-[15px] font-semibold">Project not found</div>
          <Link href="/projects" className="text-[13px] font-medium text-brand">← Back to projects</Link>
        </div>
      </div>
    );
  }

  /* ---- DnD ---- */
  const onDragStart = (col, id) => (e) => { drag.current = { col, id }; setDragId(id); e.dataTransfer.effectAllowed = "move"; };
  const onDragEnd = () => { drag.current = null; setOver(null); setDragId(null); };
  const onCardOver = (col, index) => (e) => { e.preventDefault(); e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setOver({ col, index: e.clientY > r.top + r.height / 2 ? index + 1 : index }); };
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
      if (d.col === over.col && idx < insert) insert--;
      card.done = over.col === cols.length - 1;
      next[over.col].cards.splice(insert, 0, card);
      return next;
    });
    onDragEnd();
  };
  const Indicator = () => <div className="h-[3px] bg-brand rounded-full mx-1 my-0.5" />;

  const totalCards = columns.reduce((n, c) => n + c.cards.length, 0);
  const segments = columns.map((c, i) => ({ value: c.cards.length, color: LEGEND[i].color, label: c.name }));

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div>
        <div className="flex items-center gap-2 text-[12.5px] text-ink-3 mb-2.5">
          <Link href="/projects" className="hover:text-ink-2">Projects</Link><Icon name="ChevronRight" size={13} /><span className="text-ink-2 font-medium">{project.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="grid place-items-center w-8 h-8 rounded-[10px] text-white text-[12px] font-bold flex-none" style={{ background: project.color }}>{project.key.slice(0, 2)}</span>
              <h1 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{project.name}</h1>
              {project.star && <Icon name="Star" size={18} className="text-amber-500 fill-amber-500" />}
              <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg", STATUS_TONE[project.status])}>{project.status}</span>
            </div>
            <p className="text-[13px] text-ink-2 mt-1.5 m-0">{project.desc}</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button icon={<Icon name="Share2" size={15} />} className="max-sm:!px-0 max-sm:w-10"><span className="max-sm:hidden">Share</span></Button>
            <Button variant="secondary" className="!px-0 w-10"><Icon name="EllipsisVertical" size={15} /></Button>
            <Button variant="primary" icon={<Icon name="Plus" size={15} />}>New Task</Button>
          </div>
        </div>
        <Tabs className="mt-3.5" items={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "Board" && (
        <div className="flex flex-col xl:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0 w-full">
            <Toolbar project={project} />
            <div className="overflow-x-auto pb-3">
              <div className="flex gap-3.5 items-start min-w-max">
                {columns.map((col, ci) => (
                  <div key={col.name} className="w-[248px] flex-none">
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-card border border-line rounded-t-[11px]" style={{ borderTop: `3px solid ${col.color}` }}>
                      <div className="flex items-center gap-2 text-[13.5px] font-semibold">
                        <span className="w-[9px] h-[9px] rounded-full" style={{ background: col.color }} />{col.name}
                        <span className="text-xs font-semibold text-ink-3 bg-bg rounded-[7px] px-2 py-0.5">{col.cards.length}</span>
                      </div>
                      <button className="text-ink-3 grid place-items-center"><Icon name="Plus" size={15} /></button>
                    </div>
                    <div onDragOver={onColOver(ci, col.cards.length)} onDrop={onDrop} className={cn("bg-bg-soft border border-line border-t-0 rounded-b-[11px] p-2.5 flex flex-col min-h-[120px] transition-colors", over?.col === ci && "bg-brand-soft/40")}>
                      {col.cards.map((c, j) => (
                        <div key={c.id}>
                          {over?.col === ci && over.index === j && <Indicator />}
                          <div draggable onDragStart={onDragStart(ci, c.id)} onDragEnd={onDragEnd} onDragOver={onCardOver(ci, j)}
                            className={cn("bg-card border rounded-[11px] p-3 mb-2.5 cursor-grab active:cursor-grabbing shadow-card transition-[border-color,opacity] hover:border-[#D6DCEA]", c.sel ? "border-[1.5px] border-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_12%,transparent)]" : "border-line", dragId === c.id && "opacity-40")}>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[11px] font-semibold text-ink-3 font-mono">{c.id}</span>
                              {c.done ? <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-500 text-white"><Icon name="Check" size={12} strokeWidth={3} /></span> : <Icon name="GripVertical" size={14} className="text-ink-3" />}
                            </div>
                            <div className="text-[13.5px] font-semibold leading-[1.35] mb-2.5">{c.t}</div>
                            <Tag tag={c.tag} />
                            <div className="flex items-center justify-between mt-2.5">
                              {c.sub ? <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2 font-medium"><Icon name="ListChecks" size={13} className="text-ink-3" />{c.sub}</span> : <span />}
                              <span className="grid place-items-center w-6 h-6 rounded-full text-white text-[10px] font-semibold" style={{ background: PAL[c.a % PAL.length] }}>{INITIALS[c.a]}</span>
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
          <SprintRail project={project} total={totalCards} segments={segments} columns={columns} />
        </div>
      )}

      {tab === "List" && <ListView columns={columns} />}
      {tab === "Overview" && <OverviewView project={project} total={totalCards} segments={segments} columns={columns} />}
      {tab === "Timeline" && <TimelineView />}
      {tab === "Gantt" && <GanttView />}
      {tab === "Milestones" && <MilestonesView />}
      {tab === "Files" && <FilesView />}
      {tab === "Dependencies" && <DependenciesView />}
      {tab === "Reports" && <ReportsView segments={segments} columns={columns} />}
      {tab === "Settings" && <SettingsView project={project} />}
    </div>
  );
}

function Toolbar({ project }) {
  const tool = "flex items-center gap-1.5 h-[34px] px-3 rounded-[9px] text-[12.5px] font-medium bg-card border border-line text-ink-2 cursor-pointer hover:border-[#C7D2FE]";
  return (
    <div className="flex items-center gap-2.5 flex-wrap mb-3">
      <button className={tool}><Icon name="CalendarRange" size={14} className="text-brand" />{project.sprint}<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
      <button className={cn(tool, "hidden sm:flex")}><Icon name="Calendar" size={14} className="text-ink-3" />Due {project.due}</button>
      <div className="flex-1" />
      <button className={tool}><Icon name="SlidersHorizontal" size={14} className="text-ink-3" />Filter</button>
      <button className={cn(tool, "hidden md:flex")}><Icon name="Layers" size={14} className="text-ink-3" />Group: Status<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
    </div>
  );
}

function SprintRail({ project, total, segments, columns }) {
  return (
    <aside className="w-full xl:w-[300px] flex-none">
      <div className="card p-[18px]">
        <h4 className="m-0 mb-0.5 text-sm font-semibold">{project.sprint}</h4>
        <div className="text-[11.5px] text-ink-3 mb-3">Due {project.due}</div>
        <div className="flex items-center gap-3.5">
          <Donut size={120} thickness={5.5} center={String(total)} centerSub="Total Tasks" segments={segments} />
          <div className="flex-1">
            {columns.map((c, i) => (
              <LegendRow key={c.name} color={LEGEND[i].color} label={c.name} value={c.cards.length} className="!py-1" />
            ))}
          </div>
        </div>
        <button className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand">View sprint report <Icon name="ArrowRight" size={14} /></button>
      </div>
    </aside>
  );
}

function ListView({ columns }) {
  const rows = columns.flatMap((col, i) => col.cards.map((c) => ({ ...c, status: col.name, color: LEGEND[i].color })));
  return (
    <div className="card !shadow-card overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>{["Task", "Status", "Label", "Assignee", "ID"].map((h) => <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3.5 border-b border-line">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-bg-soft">
              <td className="px-5 py-3 text-[13.5px] border-b border-line font-medium">{r.t}</td>
              <td className="px-5 py-3 text-[13px] border-b border-line"><span className="inline-flex items-center gap-1.5 font-medium"><span className="w-[7px] h-[7px] rounded-full" style={{ background: r.color }} />{r.status}</span></td>
              <td className="px-5 py-3 border-b border-line"><Tag tag={r.tag} /></td>
              <td className="px-5 py-3 border-b border-line"><span className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold" style={{ background: PAL[r.a % PAL.length] }}>{INITIALS[r.a]}</span></td>
              <td className="px-5 py-3 text-[11.5px] border-b border-line text-ink-3 font-mono">{r.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewView({ project, total, segments, columns }) {
  const done = columns[columns.length - 1].cards.length;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
      <div className="card p-[18px] lg:col-span-2">
        <h3 className="m-0 mb-4 text-[15px] font-semibold">Progress</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <Donut size={150} center={`${project.progress}%`} centerSub="complete" segments={segments} />
          <div className="flex-1 min-w-[180px]">
            {columns.map((c, i) => <LegendRow key={c.name} color={LEGEND[i].color} label={c.name} value={c.cards.length} />)}
          </div>
        </div>
      </div>
      <div className="card p-[18px]">
        <h3 className="m-0 mb-4 text-[15px] font-semibold">Details</h3>
        <dl className="flex flex-col gap-3 text-[13px]">
          {[["Status", project.status], ["Sprint", project.sprint], ["Due date", project.due], ["Tasks", `${done}/${total} done`], ["Key", project.key]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3"><dt className="text-ink-3">{k}</dt><dd className="m-0 font-medium text-right">{v}</dd></div>
          ))}
        </dl>
      </div>
      <div className="card p-[18px] lg:col-span-3">
        <h3 className="m-0 mb-3 text-[15px] font-semibold">Team</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {project.members.map((m) => (
            <span key={m} className="flex items-center gap-2 bg-bg border border-line rounded-full pl-1 pr-3 py-1">
              <span className="grid place-items-center w-6 h-6 rounded-full text-white text-[10px] font-semibold" style={{ background: PAL[m % PAL.length] }}>{INITIALS[m]}</span>
              <span className="text-[12.5px] font-medium">{INITIALS[m]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
