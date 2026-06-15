"use client";

import Icon from "@/components/Icon";
import { Card, CardLink, Tabs, Sparkline, Gauge, Donut } from "@/components/ui";
import { cn } from "@/lib/cn";

const OPS = [
  { l: "Total Projects", v: "24", d: "13%", dir: "up", icon: "Folder", tone: "bg-brand-soft text-brand" },
  { l: "On Track", v: "16", vClass: "text-emerald-600", d: "9%", dir: "up", icon: "CircleCheckBig", tone: "bg-emerald-50 text-emerald-600" },
  { l: "At Risk", v: "6", vClass: "text-amber-500", d: "3%", dir: "down", icon: "TriangleAlert", tone: "bg-amber-50 text-amber-500" },
  { l: "Overdue", v: "2", vClass: "text-red-500", d: "1%", dir: "down", icon: "ClockAlert", tone: "bg-red-50 text-red-500" },
  { l: "Team Members", v: "48", d: "0%", dir: "flat", icon: "Users", tone: "bg-violet-50 text-violet-500" },
];
const KPIS = [
  { l: "Velocity", v: "34", d: "12% vs last sprint", dir: "up", values: [12, 16, 14, 22, 20, 29, 34], color: "var(--color-brand)" },
  { l: "Cycle Time", v: "2.6", unit: " days", d: "8% faster", dir: "down", good: true, values: [24, 20, 22, 16, 18, 12, 10], color: "#22C55E" },
  { l: "Delivery Rate", v: "91", unit: "%", d: "6%", dir: "up", values: [18, 20, 19, 25, 24, 30, 33], color: "var(--color-brand)" },
  { l: "Bug Rate", v: "3.2", unit: "%", d: "2%", dir: "down", good: true, values: [22, 20, 23, 18, 20, 14, 12], color: "#22C55E" },
];
const RISK = [
  { nm: "Apex v2.1", pct: 72, color: "#EF4444" },
  { nm: "Mobile App", pct: 58, color: "#F59E0B" },
  { nm: "Analytics Module", pct: 43, color: "#F59E0B" },
  { nm: "DevOps Pipeline", pct: 32, color: "#6366F1" },
  { nm: "Platform Core", pct: 21, color: "#6366F1" },
];
const HEALTH = [
  { nm: "Morale", pct: 86, color: "#22C55E" },
  { nm: "Workload balance", pct: 74, color: "#22C55E" },
  { nm: "Focus time", pct: 68, color: "#F59E0B" },
  { nm: "Collaboration", pct: 91, color: "#22C55E" },
];

function MiniDelta({ d, dir, good }) {
  const color = dir === "flat" ? "text-ink-3" : good || dir === "up" ? "text-emerald-600" : "text-red-500";
  const icon = dir === "up" ? "ArrowUp" : dir === "down" ? "ArrowDown" : "Minus";
  return <span className={cn("flex items-center gap-1 text-[12px] font-semibold mt-1.5", color)}><Icon name={icon} size={13} />{d}</span>;
}

export default function ReportsPage() {
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="ChartPie" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Analytics Suite</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Executive overview · engineering performance &amp; delivery health</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium text-ink-2"><Icon name="Calendar" size={15} className="text-ink-3" />June 12 – June 18, 2026<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
          <button className="grid place-items-center w-10 h-10 card rounded-field text-slate-600"><Icon name="RefreshCw" size={18} /></button>
          <button className="grid place-items-center w-10 h-10 rounded-field text-white" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="Download" size={18} /></button>
        </div>
      </div>

      <Tabs className="mb-[18px]" items={[
        { label: "Overview" }, { label: "Team" }, { label: "Individual" }, { label: "Predictive" }, { label: "Capacity" },
      ]} value="Overview" />

      {/* operational strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-3.5">
        {OPS.map((o) => (
          <div key={o.l} className="card !rounded-[14px] !shadow-card p-[15px_16px] relative">
            <div className="text-xs text-ink-2 font-medium">{o.l}</div>
            <div className={cn("text-[26px] font-bold tracking-[-0.02em] mt-1.5 leading-none", o.vClass)}>{o.v}</div>
            <MiniDelta d={o.d} dir={o.dir} />
            <span className={cn("absolute top-3.5 right-3.5 grid place-items-center w-[30px] h-[30px] rounded-[9px]", o.tone)}><Icon name={o.icon} size={16} /></span>
          </div>
        ))}
      </div>

      {/* performance KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 mb-[18px]">
        {KPIS.map((k) => (
          <div key={k.l} className="card !rounded-[14px] !shadow-card p-[16px_18px]">
            <div className="text-[12.5px] text-ink-2 font-medium">{k.l}</div>
            <div className="flex items-end justify-between gap-2.5 mt-2">
              <span className="text-[30px] font-bold tracking-[-0.02em] leading-none">{k.v}{k.unit && <small className="text-[15px] text-ink-3 font-semibold">{k.unit}</small>}</span>
              <Sparkline values={k.values} width={74} height={34} color={k.color} className="!w-[74px]" />
            </div>
            <MiniDelta d={k.d} dir={k.dir} good={k.good} />
          </div>
        ))}
      </div>

      {/* velocity trend + predictive risk */}
      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4 mb-4">
        <Card title="Velocity Trend" action={
          <div className="flex items-center gap-4 text-xs text-ink-2">
            <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-brand" />Current</span>
            <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-[#A5B4FC]" />Previous</span>
          </div>
        }>
          <Sparkline values={[12, 16, 14, 26, 22, 38, 42]} width={560} height={220} fill color="var(--color-brand)" />
          <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mt-1">
            {["May 20", "May 25", "May 30", "Jun 5", "Jun 10", "Jun 15", "Jun 18"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </Card>

        <Card title="Predictive Risk" action={<CardLink>Details</CardLink>}>
          <div className="flex flex-col items-center justify-center gap-1.5 py-1.5">
            <Gauge value={72} color="#EF4444" label="Risk Score" width={190} height={130} />
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full bg-red-50 text-red-500"><span className="w-[7px] h-[7px] rounded-full bg-red-500" />High Risk</span>
            <div className="text-xs text-ink-2 text-center mt-1.5 max-w-[230px]">3 milestones trending behind schedule this cycle.</div>
          </div>
        </Card>
      </div>

      {/* projects at risk + team health */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Projects at Risk" action={<CardLink>View all</CardLink>}>
          <div className="flex flex-col gap-[15px]">
            {RISK.map((r) => (
              <div key={r.nm} className="flex items-center gap-3.5">
                <span className="text-[13px] font-medium w-[130px] flex-none">{r.nm}</span>
                <span className="flex-1 h-[9px] bg-bg rounded-full overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} /></span>
                <span className="text-[13px] font-semibold w-[42px] text-right tabular-nums">{r.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Team Health" action={<CardLink>Breakdown</CardLink>}>
          <div className="flex items-center gap-[22px] flex-wrap">
            <Donut size={148} thickness={5.5} center="Good" centerSub="82 / 100" segments={[{ value: 82, color: "#22C55E" }, { value: 18, color: "#F1F3F8" }]} />
            <div className="flex-1 min-w-[200px] flex flex-col gap-2.5">
              {HEALTH.map((h) => (
                <div key={h.nm} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium flex-1">{h.nm}</span>
                  <span className="h-[9px] bg-bg rounded-full overflow-hidden w-[120px]"><span className="block h-full rounded-full" style={{ width: `${h.pct}%`, background: h.color }} /></span>
                  <span className="text-[13px] font-semibold w-7 text-right tabular-nums">{h.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
