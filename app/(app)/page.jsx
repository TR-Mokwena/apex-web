"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import {
  PageHeader, Card, CardLink, Kpi, Avatar, Delta, Dropdown, MenuItem,
  LineChart, BarPairs, Donut, Gauge, Ring, Sparkline, LegendRow,
} from "@/components/ui";

/* ---- demo data ---- */
const CONTRIBUTORS = [
  { name: "Kabelo M.", score: "1,248", delta: "18%", color: "#6366F1" },
  { name: "Thabo N.", score: "980", delta: "11%", color: "#22C55E" },
  { name: "Sipho D.", score: "872", delta: "9%", color: "#F59E0B" },
  { name: "Priya S.", score: "742", delta: "7%", color: "#0EA5E9" },
  { name: "Neo K.", score: "654", delta: "6%", color: "#8B5CF6" },
];
const NOTIFICATIONS = [
  { icon: "GitMerge", tone: "green", title: "Pull request merged", sub: "#4821 Fix authentication bug", time: "2m ago" },
  { icon: "Check", tone: "indigo", title: "Task “Design System” completed", sub: "Project Apex Redesign", time: "15m ago" },
  { icon: "Flag", tone: "blue", title: "Milestone “API Gateway” updated", sub: "New due date: June 30, 2026", time: "1h ago" },
  { icon: "TriangleAlert", tone: "red", title: "AI risk alert: 2 projects", sub: "Require attention", time: "2h ago" },
];
const TASKS = [
  { title: "Design system update", project: "Project Apex Redesign", status: "In Progress", statusTone: "indigo", priority: "high" },
  { title: "AI insights panel", project: "Apex v2.1", status: "In Progress", statusTone: "indigo", priority: "medium" },
  { title: "API rate limiting", project: "Platform", status: "To Do", statusTone: "blue", priority: "low" },
  { title: "Database schema", project: "Apex v2.1", status: "To Do", statusTone: "blue", priority: "medium" },
];

// productivity values per period
const PROD_PERIODS = ["This Week", "Last Week", "This Sprint"];
const PRODUCTIVITY = {
  "This Week": [
    { label: "Completed Tasks", value: "156", delta: "18%", values: [38, 34, 36, 28, 30, 20, 24, 12] },
    { label: "Commits", value: "342", delta: "16%", values: [34, 36, 28, 30, 22, 26, 16, 14] },
    { label: "PRs Merged", value: "48", delta: "14%", values: [36, 30, 32, 24, 26, 18, 22, 10] },
  ],
  "Last Week": [
    { label: "Completed Tasks", value: "132", delta: "9%", values: [30, 28, 32, 26, 24, 22, 20, 18] },
    { label: "Commits", value: "298", delta: "11%", values: [28, 30, 26, 24, 22, 20, 18, 16] },
    { label: "PRs Merged", value: "41", delta: "7%", values: [30, 28, 26, 24, 22, 20, 18, 16] },
  ],
  "This Sprint": [
    { label: "Completed Tasks", value: "271", delta: "22%", values: [20, 26, 30, 34, 38, 44, 50, 58] },
    { label: "Commits", value: "604", delta: "19%", values: [24, 30, 34, 40, 46, 52, 58, 64] },
    { label: "PRs Merged", value: "83", delta: "15%", values: [18, 22, 28, 34, 40, 46, 52, 60] },
  ],
};
const ATT_PERIODS = ["Today", "This Week", "This Month"];
const ATTENDANCE = {
  Today: { present: 92, late: 6, absent: 2 },
  "This Week": { present: 89, late: 8, absent: 3 },
  "This Month": { present: 91, late: 7, absent: 2 },
};

const NOTI_TONE = {
  green: "bg-emerald-50 text-emerald-600",
  indigo: "bg-brand-soft text-brand",
  blue: "bg-[#EAF1FF] text-[#3B82F6]",
  red: "bg-red-50 text-red-500",
};
const PILL_TONE = { indigo: "bg-brand-soft text-brand", blue: "bg-[#EAF1FF] text-[#3B82F6]" };
const PRIORITY = { high: ["text-red-500", "bg-red-500", "High"], medium: ["text-amber-500", "bg-amber-500", "Medium"], low: ["text-emerald-500", "bg-emerald-500", "Low"] };

function PeriodSelect({ value, options, onChange }) {
  return (
    <Dropdown align="right" width={150} trigger={({ toggle }) => (
      <button onClick={toggle} className="flex items-center gap-1.5 border border-line rounded-[9px] px-2.5 py-1.5 text-xs font-medium text-ink-2 hover:border-[#C7D2FE]">{value}<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
    )}>
      {options.map((o) => <MenuItem key={o} onClick={() => onChange(o)} trailing={o === value ? <Icon name="Check" size={14} className="text-brand" /> : null}>{o}</MenuItem>)}
    </Dropdown>
  );
}

function TaskItem({ task, done, onToggle }) {
  const [tone, dot, label] = PRIORITY[task.priority];
  return (
    <Link href="/tasks" className="flex items-center gap-3 py-[11px] border-t border-line first:border-t-0 -mx-2 px-2 rounded-[9px] hover:bg-bg-soft transition-colors">
      <span
        role="checkbox"
        aria-checked={done}
        onClick={(e) => { e.preventDefault(); onToggle(); }}
        className={`grid place-items-center w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex-none cursor-pointer transition-colors ${done ? "bg-emerald-500 border-emerald-500" : "border-line"}`}
      >
        <Icon name="Check" size={11} strokeWidth={3.2} className={done ? "opacity-100" : "opacity-0"} />
      </span>
      <span className="flex-1 min-w-0">
        <b className={`block text-[13px] font-semibold ${done ? "text-ink-3 line-through" : "text-ink"}`}>{task.title}</b>
        <span className="text-[11.5px] text-ink-3">{task.project}</span>
      </span>
      <span className={`text-[11px] font-semibold rounded-[7px] px-2.5 py-[3px] whitespace-nowrap ${PILL_TONE[task.statusTone]}`}>{task.status}</span>
      <span className={`hidden sm:flex items-center gap-1.5 text-xs font-medium w-[62px] ${tone}`}>
        <span className={`w-[7px] h-[7px] rounded-full ${dot}`} />
        {label}
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [prodPeriod, setProdPeriod] = useState("This Week");
  const [attPeriod, setAttPeriod] = useState("Today");
  const [doneTasks, setDoneTasks] = useState(() => new Set());

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const toggleTask = (i) => setDoneTasks((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const att = ATTENDANCE[attPeriod];

  return (
    <>
      <PageHeader
        title={`${greeting}, TR! 👋`}
        subtitle="Here's what's happening across your organization today."
        actions={
          <Link href="/calendar" className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium text-ink cursor-pointer">
            <Icon name="Calendar" size={15} className="text-ink-3" />
            June 12 – June 18, 2026
            <Icon name="ChevronDown" size={15} className="text-ink-3" />
          </Link>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-3.5">
        <Link href="/projects"><Kpi label="Active Projects" value="24" delta="12% from last week" deltaArrow="up" icon="Folder" iconTone="indigo" /></Link>
        <Link href="/sprints"><Kpi label="Sprint Progress" value="68%" delta="On Track" deltaTone="ok" visual={<Ring value={68} size={58} />} /></Link>
        <Link href="/contributors"><Kpi label="Team Health" value="Good" valueClass="!text-[26px] !mt-[7px] text-emerald-600" delta="8% from last week" deltaArrow="up" visual={<Sparkline values={[8, 14, 11, 22, 18, 30, 26, 40]} width={92} height={44} color="#10B981" fill dot={false} className="!w-[92px]" />} /></Link>
        <Link href="/ai"><Kpi label="AI Risk Alerts" value="6" valueClass="text-red-500" delta="Needs attention" deltaTone="warn" icon="TriangleAlert" iconTone="red" /></Link>
        <Link href="/reports"><Kpi label="Attendance Today" value={`${att.present}%`} delta="Present" deltaTone="ok" icon="Users" iconTone="green" /></Link>
      </div>

      <div className="flex flex-col xl:flex-row gap-3.5 items-start">
        {/* LEFT */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-3.5">
          <div className="grid md:grid-cols-2 gap-3.5">
            <Card title="Sprint Burndown" action={
              <div className="flex gap-3.5 text-xs text-ink-2">
                <span className="flex items-center gap-1.5"><span className="w-3.5 border-t-2 border-dashed border-slate-400" />Ideal</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 border-t-2 border-brand" />Actual</span>
              </div>
            }>
              <LineChart
                xLabels={["Jun 12", "Jun 14", "Jun 16", "Jun 18", "Jun 20", "Jun 22"]}
                series={[
                  { values: [100, 80, 60, 40, 20, 0], color: "#94A3B8", dashed: true },
                  { values: [100, 90, 76, 58, 40, 12], color: "var(--color-brand)" },
                ]}
              />
              <CardLink href="/sprints" className="mt-1.5">View all sprints</CardLink>
            </Card>

            <Card title="GitHub Activity (This Week)">
              <div className="flex items-end gap-2.5">
                <div>
                  <div className="text-[30px] font-bold text-heading leading-none">1,429</div>
                  <div className="text-[12.5px] text-ink-2 mt-1">Events</div>
                </div>
                <Delta value="15%" className="ml-auto mb-0.5 !text-[12.5px] font-semibold" />
              </div>
              <BarPairs
                className="mt-1.5"
                xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                data={[[56, 36], [72, 48], [44, 30], [90, 60], [36, 24], [76, 44], [32, 0]]}
              />
              <CardLink href="/reports" className="mt-1.5">View full report</CardLink>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-3.5">
            <Card title="Projects Overview">
              <div className="flex items-center gap-5">
                <Donut size={150} center="24" centerSub="Total Projects" segments={[
                  { value: 51, color: "#6366F1" }, { value: 21, color: "#22C55E" }, { value: 17, color: "#F59E0B" }, { value: 11, color: "#A5B4FC" },
                ]} />
                <div className="flex-1">
                  <LegendRow color="#6366F1" label="In Progress" value="51%" />
                  <LegendRow color="#22C55E" label="In Review" value="21%" />
                  <LegendRow color="#F59E0B" label="Planning" value="17%" />
                  <LegendRow color="#A5B4FC" label="Completed" value="11%" />
                </div>
              </div>
              <CardLink href="/projects" className="mt-3">View all projects</CardLink>
            </Card>

            <Card title="Top Contributors (This Week)">
              <div>
                {CONTRIBUTORS.map((c, i) => (
                  <Link key={c.name} href="/contributors" className="flex items-center gap-3 py-2 -mx-1.5 px-1.5 rounded-[9px] hover:bg-bg-soft transition-colors">
                    <span className="text-xs text-ink-3 w-3 font-semibold">{i + 1}</span>
                    <Avatar name={c.name} size={30} color={c.color} />
                    <span className="flex-1 text-[13.5px] font-medium text-ink">{c.name}</span>
                    <span className="font-semibold text-[13.5px] text-heading">{c.score}</span>
                    <Delta value={c.delta} className="w-12 justify-end !text-xs" />
                  </Link>
                ))}
              </div>
              <CardLink href="/contributors" className="mt-2.5">View leaderboard</CardLink>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-3.5">
            <Card title="Productivity Trend" action={<PeriodSelect value={prodPeriod} options={PROD_PERIODS} onChange={setProdPeriod} />}>
              <div className="grid grid-cols-3 gap-2">
                {PRODUCTIVITY[prodPeriod].map((p) => (
                  <div key={p.label} className="px-1">
                    <div className="text-xs text-ink-2 font-medium">{p.label}</div>
                    <div className="text-[24px] font-bold text-heading mt-1">{p.value}</div>
                    <Delta value={p.delta} className="!text-[11.5px] mt-0.5" />
                    <Sparkline values={p.values} className="mt-2" height={46} />
                  </div>
                ))}
              </div>
              <CardLink href="/reports" className="mt-3.5">View full analytics</CardLink>
            </Card>

            <Card title="Attendance Overview" action={<PeriodSelect value={attPeriod} options={ATT_PERIODS} onChange={setAttPeriod} />}>
              <div className="flex items-center gap-[18px]">
                <Gauge value={att.present} label="Present" />
                <div className="flex flex-col gap-2.5 flex-1">
                  <LegendRow color="#22C55E" label="Present" value={`${att.present}%`} className="!py-0" />
                  <LegendRow color="#F59E0B" label="Late" value={`${att.late}%`} className="!py-0" />
                  <LegendRow color="#EF4444" label="Absent" value={`${att.absent}%`} className="!py-0" />
                </div>
              </div>
              <CardLink href="/reports" className="mt-2.5">View attendance report</CardLink>
            </Card>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="w-full xl:w-[372px] flex-none flex flex-col gap-3.5">
          <div className="rounded-card p-[18px] relative overflow-hidden bg-gradient-to-br from-[#F4F3FF] to-[#FBF6FF] border border-[#E9E5FF]">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-card shadow-[0_2px_8px_rgba(124,58,237,0.18)]"><Icon name="Sparkles" size={17} className="text-violet-500" /></span>
                <h3 className="m-0 text-[15px] font-semibold text-[#1E1B4B]">AI Insight</h3>
              </div>
              <span className="text-[11px] font-semibold text-violet-500 bg-card border border-[#E9E5FF] rounded-full px-2.5 py-[3px]">New</span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-[#312E5A] font-medium m-0 mb-4 max-w-[74%]">
              Milestone <b className="text-[#1E1B4B] font-bold">“Apex v2.1”</b> has a <b className="text-[#1E1B4B] font-bold">72% chance</b> of being delayed based on current velocity and open dependencies.
            </p>
            <Link href="/ai" className="inline-block bg-brand text-white rounded-[10px] px-4 py-2.5 text-[13px] font-semibold cursor-pointer shadow-[0_8px_18px_-8px_rgba(99,102,241,0.9)] hover:-translate-y-px transition-transform">View insight</Link>
            <svg className="absolute -right-8 top-8 w-[190px] h-[190px] opacity-85 pointer-events-none" viewBox="0 0 200 200" fill="none">
              <path d="M100 30 L160 65 L160 135 L100 170 L40 135 L40 65 Z" stroke="#B7A6F5" strokeWidth="1.5" />
              <path d="M100 70 L130 88 L130 122 L100 140 L70 122 L70 88 Z" fill="#C9B8FA" opacity="0.5" />
            </svg>
          </div>

          <Card title="Recent Notifications" action={<CardLink href="/notifications">View all</CardLink>}>
            {NOTIFICATIONS.map((n, i) => (
              <Link key={i} href="/notifications" className="flex gap-3 py-[11px] border-t border-line first:border-t-0 -mx-2 px-2 rounded-[9px] hover:bg-bg-soft transition-colors">
                <span className={`grid place-items-center w-[34px] h-[34px] rounded-[10px] flex-none ${NOTI_TONE[n.tone]}`}><Icon name={n.icon} size={16} /></span>
                <span className="flex-1 min-w-0">
                  <b className="block text-[13px] font-semibold text-ink">{n.title}</b>
                  <span className="text-xs text-ink-2">{n.sub}</span>
                </span>
                <span className="text-[11.5px] text-ink-3 whitespace-nowrap">{n.time}</span>
              </Link>
            ))}
          </Card>

          <Card title="My Tasks" action={<span className="text-[12.5px] font-medium text-ink-3">{doneTasks.size} of {TASKS.length} done</span>}>
            {TASKS.map((t, i) => <TaskItem key={i} task={t} done={doneTasks.has(i)} onToggle={() => toggleTask(i)} />)}
            <CardLink href="/tasks" className="mt-3">View all tasks</CardLink>
          </Card>
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 pt-4 pb-1.5 text-[12.5px] text-ink-2">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />System Status&nbsp;·&nbsp;All systems operational</div>
        <div>Last updated: 2 minutes ago</div>
        <div className="flex items-center gap-2 text-emerald-500"><Icon name="CircleCheckBig" size={15} />Data synced</div>
      </footer>
    </>
  );
}
