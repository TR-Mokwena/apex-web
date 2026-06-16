"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Card, CardLink, Tabs, Sparkline, Gauge, Donut, RangePicker, RANGE_OPTIONS } from "@/components/ui";
import { cn } from "@/lib/cn";

// Static presentation (labels/icons/colours/shape); numbers come from RD per range.
const OPS_META = [
  { l: "Total Projects", icon: "Folder", tone: "bg-brand-soft text-brand", d: "13%", dir: "up" },
  { l: "On Track", icon: "CircleCheckBig", tone: "bg-emerald-50 text-emerald-600", vClass: "text-emerald-600", d: "9%", dir: "up" },
  { l: "At Risk", icon: "TriangleAlert", tone: "bg-amber-50 text-amber-500", vClass: "text-amber-500", d: "3%", dir: "down" },
  { l: "Overdue", icon: "ClockAlert", tone: "bg-red-50 text-red-500", vClass: "text-red-500", d: "1%", dir: "down" },
  { l: "Team Members", icon: "Users", tone: "bg-violet-50 text-violet-500", d: "0%", dir: "flat" },
];
const KPI_META = [
  { l: "Velocity", unit: "", color: "var(--color-brand)", values: [12, 16, 14, 22, 20, 29, 34], d: "12% vs last sprint", dir: "up" },
  { l: "Cycle Time", unit: " days", color: "#22C55E", good: true, values: [24, 20, 22, 16, 18, 12, 10], d: "8% faster", dir: "down" },
  { l: "Delivery Rate", unit: "%", color: "var(--color-brand)", values: [18, 20, 19, 25, 24, 30, 33], d: "6%", dir: "up" },
  { l: "Bug Rate", unit: "%", color: "#22C55E", good: true, values: [22, 20, 23, 18, 20, 14, 12], d: "2%", dir: "down" },
];
const RISK_META = ["Apex v2.1", "Mobile App", "Analytics Module", "DevOps Pipeline", "Platform Core"];
const HEALTH_META = ["Morale", "Workload balance", "Focus time", "Collaboration"];

const riskColor = (p) => (p >= 60 ? "#EF4444" : p >= 40 ? "#F59E0B" : "#6366F1");
const healthColor = (p) => (p >= 80 ? "#22C55E" : p >= 60 ? "#F59E0B" : "#EF4444");

// Per-range demo data. `ops`/`kpis` are values aligned to *_META; `vel`/`velDays`
// drive the velocity trend; `score` is the predictive-risk gauge.
const RD = {
  "This Week": {
    ops: ["24", "16", "6", "2", "48"], kpis: ["34", "2.6", "91", "3.2"],
    risk: [72, 58, 43, 32, 21], health: [86, 74, 68, 91], score: 72,
    vel: [12, 16, 14, 26, 22, 38, 42], velDays: ["Jun 12", "Jun 13", "Jun 14", "Jun 15", "Jun 16", "Jun 17", "Jun 18"],
  },
  "Last Week": {
    ops: ["23", "15", "6", "2", "47"], kpis: ["31", "2.8", "88", "3.6"],
    risk: [68, 55, 46, 30, 24], health: [83, 72, 66, 89], score: 66,
    vel: [10, 14, 13, 20, 19, 30, 34], velDays: ["Jun 5", "Jun 6", "Jun 7", "Jun 8", "Jun 9", "Jun 10", "Jun 11"],
  },
  "This Month": {
    ops: ["24", "17", "5", "2", "48"], kpis: ["38", "2.4", "93", "2.7"],
    risk: [64, 50, 40, 28, 20], health: [88, 76, 70, 92], score: 58,
    vel: [22, 26, 30, 28, 34, 38, 40], velDays: ["Jun 1", "Jun 6", "Jun 11", "Jun 16", "Jun 21", "Jun 26", "Jun 30"],
  },
  "Last 30 Days": {
    ops: ["24", "16", "6", "2", "48"], kpis: ["36", "2.5", "92", "2.9"],
    risk: [66, 52, 42, 29, 22], health: [87, 75, 69, 90], score: 61,
    vel: [20, 24, 28, 26, 32, 36, 42], velDays: ["May 19", "May 24", "May 29", "Jun 3", "Jun 8", "Jun 13", "Jun 18"],
  },
  "This Quarter": {
    ops: ["26", "18", "5", "3", "50"], kpis: ["33", "2.7", "90", "3.0"],
    risk: [60, 48, 38, 30, 22], health: [85, 74, 67, 90], score: 54,
    vel: [18, 22, 30, 28, 36, 40, 46], velDays: ["Apr 1", "Apr 21", "May 5", "May 19", "Jun 2", "Jun 16", "Jun 30"],
  },
};
const REPORT_RANGES = RANGE_OPTIONS.filter((o) => RD[o.key]);

function MiniDelta({ d, dir, good }) {
  const color = dir === "flat" ? "text-ink-3" : good || dir === "up" ? "text-emerald-600" : "text-red-500";
  const icon = dir === "up" ? "ArrowUp" : dir === "down" ? "ArrowDown" : "Minus";
  return <span className={cn("flex items-center gap-1 text-[12px] font-semibold mt-1.5", color)}><Icon name={icon} size={13} />{d}</span>;
}

export default function ReportsPage() {
  const [range, setRange] = useState("This Week");
  const d = RD[range];
  const healthScore = Math.round(d.health.reduce((s, x) => s + x, 0) / d.health.length);
  const healthLabel = healthScore >= 80 ? "Good" : healthScore >= 60 ? "Fair" : "Low";
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
          <RangePicker value={range} onChange={setRange} options={REPORT_RANGES} />
          <button className="grid place-items-center w-10 h-10 card rounded-field text-ink-2"><Icon name="RefreshCw" size={18} /></button>
          <button className="grid place-items-center w-10 h-10 rounded-field text-white" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Download" size={18} /></button>
        </div>
      </div>

      <Tabs className="mb-[18px]" items={[
        { label: "Overview" }, { label: "Team" }, { label: "Individual" }, { label: "Predictive" }, { label: "Capacity" },
      ]} value="Overview" />

      {/* operational strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-3.5">
        {OPS_META.map((o, i) => (
          <div key={o.l} className="card !rounded-[14px] !shadow-card p-[15px_16px] relative">
            <div className="text-xs text-ink-2 font-medium">{o.l}</div>
            <div className={cn("text-[26px] font-bold tracking-[-0.02em] mt-1.5 leading-none", o.vClass)}>{d.ops[i]}</div>
            <MiniDelta d={o.d} dir={o.dir} />
            <span className={cn("absolute top-3.5 right-3.5 grid place-items-center w-[30px] h-[30px] rounded-[9px]", o.tone)}><Icon name={o.icon} size={16} /></span>
          </div>
        ))}
      </div>

      {/* performance KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 mb-[18px]">
        {KPI_META.map((k, i) => (
          <div key={k.l} className="card !rounded-[14px] !shadow-card p-[16px_18px]">
            <div className="text-[12.5px] text-ink-2 font-medium">{k.l}</div>
            <div className="flex items-end justify-between gap-2.5 mt-2">
              <span className="text-[30px] font-bold tracking-[-0.02em] leading-none">{d.kpis[i]}{k.unit && <small className="text-[15px] text-ink-3 font-semibold">{k.unit}</small>}</span>
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
          <Sparkline values={d.vel} width={560} height={220} fill color="var(--color-brand)" />
          <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mt-1">
            {d.velDays.map((lbl) => <span key={lbl}>{lbl}</span>)}
          </div>
        </Card>

        <Card title="Predictive Risk" action={<CardLink>Details</CardLink>}>
          <div className="flex flex-col items-center justify-center gap-1.5 py-1.5">
            <Gauge value={d.score} color={riskColor(d.score)} label="Risk Score" width={190} height={130} />
            {(() => {
              const lvl = d.score >= 60 ? ["High Risk", "bg-red-50 text-red-500", "bg-red-500"] : d.score >= 40 ? ["Moderate Risk", "bg-amber-50 text-amber-500", "bg-amber-500"] : ["Low Risk", "bg-emerald-50 text-emerald-600", "bg-emerald-500"];
              return <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full", lvl[1])}><span className={cn("w-[7px] h-[7px] rounded-full", lvl[2])} />{lvl[0]}</span>;
            })()}
            <div className="text-xs text-ink-2 text-center mt-1.5 max-w-[230px]">{d.risk.filter((p) => p >= 50).length} milestones trending behind schedule this cycle.</div>
          </div>
        </Card>
      </div>

      {/* projects at risk + team health */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Projects at Risk" action={<CardLink>View all</CardLink>}>
          <div className="flex flex-col gap-[15px]">
            {RISK_META.map((nm, i) => (
              <div key={nm} className="flex items-center gap-3.5">
                <span className="text-[13px] font-medium w-[130px] flex-none">{nm}</span>
                <span className="flex-1 h-[9px] bg-bg rounded-full overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${d.risk[i]}%`, background: riskColor(d.risk[i]) }} /></span>
                <span className="text-[13px] font-semibold w-[42px] text-right tabular-nums">{d.risk[i]}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Team Health" action={<CardLink>Breakdown</CardLink>}>
          <div className="flex items-center gap-[22px] flex-wrap">
            <Donut size={148} thickness={5.5} center={healthLabel} centerSub={`${healthScore} / 100`} segments={[{ value: healthScore, color: "#22C55E" }, { value: 100 - healthScore, color: "#F1F3F8" }]} />
            <div className="flex-1 min-w-[200px] flex flex-col gap-2.5">
              {HEALTH_META.map((nm, i) => (
                <div key={nm} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium flex-1">{nm}</span>
                  <span className="h-[9px] bg-bg rounded-full overflow-hidden w-[120px]"><span className="block h-full rounded-full" style={{ width: `${d.health[i]}%`, background: healthColor(d.health[i]) }} /></span>
                  <span className="text-[13px] font-semibold w-7 text-right tabular-nums">{d.health[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
