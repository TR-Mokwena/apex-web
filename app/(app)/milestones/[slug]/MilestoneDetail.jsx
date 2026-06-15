"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Button, Donut } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getMilestone, milestoneTasks, STATUS, PAL, INIT } from "@/lib/milestones";

const ACTIVITY = [
  { icon: "Check", tone: "bg-emerald-50 text-emerald-600", title: "Integration tests passed", time: "3h ago" },
  { icon: "GitMerge", tone: "bg-brand-soft text-brand", title: "PR #4821 merged into milestone branch", time: "6h ago" },
  { icon: "MessageSquare", tone: "bg-[#F3EEFE] text-[#7C3AED]", title: "Priya commented on the rollback plan", time: "1d ago" },
  { icon: "Calendar", tone: "bg-[#EAF1FF] text-[#3B82F6]", title: "Due date moved to June 24", time: "2d ago" },
];

export default function MilestoneDetail({ slug }) {
  const m = getMilestone(slug);
  const [tasks, setTasks] = useState(() => (m ? milestoneTasks(m) : []));

  if (!m) {
    return (
      <div className="card grid place-items-center py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <Icon name="Flag" size={30} className="text-ink-3" />
          <div className="text-[15px] font-semibold">Milestone not found</div>
          <Link href="/milestones" className="text-[13px] font-medium text-brand">← Back to milestones</Link>
        </div>
      </div>
    );
  }

  const s = STATUS[m.st];
  const doneCount = tasks.filter((t) => t.done).length;
  const prog = Math.round((doneCount / tasks.length) * 100) || 0;
  const toggle = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div>
        <div className="flex items-center gap-2 text-[12.5px] text-ink-3 mb-2.5">
          <Link href="/milestones" className="hover:text-ink-2">Milestones</Link><Icon name="ChevronRight" size={13} /><span className="text-ink-2 font-medium">{m.t}</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={cn("grid place-items-center w-8 h-8 rounded-full border-2 flex-none", s.node)}><Icon name={s.icon} size={15} /></span>
              <h1 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{m.t}</h1>
              <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full", s.badge)}><span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />{s.label}</span>
            </div>
            <div className="text-xs text-ink-3 mt-2 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5"><Icon name="Folder" size={13} />{m.proj}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="Calendar" size={13} />{m.due}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="SquareCheckBig" size={13} />{doneCount}/{tasks.length} tasks</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button icon={<Icon name="Pencil" size={15} />} className="max-sm:!px-0 max-sm:w-10"><span className="max-sm:hidden">Edit</span></Button>
            <Button variant="secondary" className="!px-0 w-10"><Icon name="EllipsisVertical" size={15} /></Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-start">
        {/* tasks */}
        <div className="lg:col-span-2 card !shadow-card">
          <div className="flex items-center justify-between p-[16px_18px] border-b border-line">
            <h3 className="m-0 text-[15px] font-semibold">Tasks</h3>
            <span className="text-[12.5px] text-ink-3">{doneCount} of {tasks.length} done</span>
          </div>
          <div>
            {tasks.map((t) => (
              <button key={t.id} onClick={() => toggle(t.id)} className="w-full flex items-center gap-3 px-[18px] py-2.5 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors text-left">
                <span className={cn("grid place-items-center w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex-none", t.done ? "bg-emerald-500 border-emerald-500" : "border-ink-3/40")}>
                  <Icon name="Check" size={11} strokeWidth={3} className={cn("text-white", t.done ? "opacity-100" : "opacity-0")} />
                </span>
                <span className="text-[11.5px] font-mono text-ink-3 w-[72px] flex-none">{t.id}</span>
                <span className={cn("flex-1 text-[13.5px] font-medium", t.done && "line-through text-ink-3")}>{t.t}</span>
                <span className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold flex-none" style={{ background: PAL[t.av % PAL.length] }}>{INIT[t.av]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* side */}
        <div className="flex flex-col gap-3.5">
          <div className="card p-[18px] flex flex-col items-center">
            <Donut size={140} center={`${prog}%`} centerSub="complete" segments={[{ value: prog, color: s.fill }, { value: 100 - prog, color: "var(--color-bg-soft)" }]} />
            <div className="w-full mt-3">
              <div className="flex items-center justify-between text-[12.5px] mb-1.5"><span className="text-ink-2">Progress</span><span className="font-semibold tabular-nums">{prog}%</span></div>
              <div className="h-2 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full transition-[width]" style={{ width: `${prog}%`, background: s.fill }} /></div>
            </div>
          </div>

          <div className="card p-[18px]">
            <h3 className="m-0 mb-2 text-[15px] font-semibold">About</h3>
            <p className="m-0 text-[13px] text-ink-2 leading-relaxed mb-3">{m.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] text-ink-3">Owners</span>
              <div className="flex">{m.owners.map((o, i) => <span key={i} className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold border-2 border-card" style={{ background: PAL[o % PAL.length], marginLeft: i ? -8 : 0 }}>{INIT[o]}</span>)}</div>
            </div>
          </div>

          <div className="card p-[18px]">
            <h3 className="m-0 mb-3 text-[15px] font-semibold">Activity</h3>
            <div className="flex flex-col gap-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className={cn("grid place-items-center w-[28px] h-[28px] rounded-lg flex-none", a.tone)}><Icon name={a.icon} size={14} /></span>
                  <div className="flex-1 min-w-0"><div className="text-[12.5px] font-medium leading-snug">{a.title}</div><div className="text-[11px] text-ink-3 mt-0.5">{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
