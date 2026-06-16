"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Card, CardLink, Tabs, Sparkline, Gauge, Donut, BarPairs, LegendRow, RangePicker, RANGE_OPTIONS } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// cumulative counts (commits/PRs/reviews) scale with the window; rates do not.
const RF = { "This Week": 1, "Last Week": 0.9, "This Month": 4.0, "Last 30 Days": 3.7, "This Quarter": 12 };

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

const TEAMS = [
  { nm: "Platform", lead: "TR Mokwena", members: 8, velocity: 128, delivery: 93, onTrack: 88, color: "#6366F1" },
  { nm: "Web", lead: "Priya Singh", members: 6, velocity: 104, delivery: 90, onTrack: 82, color: "#22C55E" },
  { nm: "Mobile", lead: "Sipho Dlamini", members: 5, velocity: 86, delivery: 84, onTrack: 74, color: "#F59E0B" },
  { nm: "Data", lead: "Naledi Kgasana", members: 4, velocity: 72, delivery: 88, onTrack: 80, color: "#8B5CF6" },
];
const INDIVIDUALS = [
  { nm: "TR Mokwena", in: "TM", pi: 0, commits: 342, prs: 42, reviews: 96, thru: 34, trend: [12, 16, 14, 22, 20, 29, 34] },
  { nm: "Thabo Nkosi", in: "TN", pi: 3, commits: 298, prs: 37, reviews: 88, thru: 31, trend: [14, 15, 18, 20, 22, 26, 30] },
  { nm: "Priya Singh", in: "PS", pi: 4, commits: 271, prs: 38, reviews: 91, thru: 33, trend: [10, 18, 16, 24, 28, 30, 33] },
  { nm: "Sipho Dlamini", in: "SD", pi: 1, commits: 233, prs: 31, reviews: 74, thru: 27, trend: [16, 14, 18, 17, 22, 24, 27] },
  { nm: "Naledi Kgasana", in: "NK", pi: 2, commits: 204, prs: 28, reviews: 69, thru: 24, trend: [12, 14, 15, 18, 20, 22, 24] },
];
const FORECAST = [
  { nm: "Apex v2.1", risk: 72, eta: "Jul 04", conf: 64, onTime: 38 },
  { nm: "Mobile App", risk: 58, eta: "Jul 18", conf: 71, onTime: 55 },
  { nm: "Analytics Module", risk: 43, eta: "Jun 30", conf: 78, onTime: 66 },
  { nm: "DevOps Pipeline", risk: 32, eta: "Jun 26", conf: 84, onTime: 74 },
  { nm: "Platform Core", risk: 21, eta: "Jun 24", conf: 90, onTime: 85 },
];
const CAP = [
  { nm: "Priya S.", av: "PS", pi: 4, used: 20, total: 20, proj: "Web" },
  { nm: "Sipho D.", av: "SD", pi: 1, used: 18, total: 21, proj: "Mobile App" },
  { nm: "Naledi K.", av: "NK", pi: 2, used: 16, total: 18, proj: "Analytics" },
  { nm: "TR Mokwena", av: "TM", pi: 0, used: 13, total: 18, proj: "Platform" },
  { nm: "Thabo N.", av: "TN", pi: 3, used: 9, total: 16, proj: "Platform" },
];
const ALLOC = [
  { value: 38, color: "#6366F1", label: "Apex v2.1" },
  { value: 27, color: "#22C55E", label: "Platform" },
  { value: 20, color: "#F59E0B", label: "Web" },
  { value: 15, color: "#A5B4FC", label: "Analytics" },
];
const capColor = (p) => (p >= 100 ? "#EF4444" : p >= 85 ? "#F59E0B" : "#6366F1");

function Avatar({ av, pi, size = 32 }) {
  return <span className="grid place-items-center rounded-full text-white font-semibold flex-none" style={{ width: size, height: size, fontSize: size * 0.34, background: PAL[pi % PAL.length] }}>{av}</span>;
}
function Bar({ pct, color, w = "flex-1" }) {
  return <span className={cn("h-[9px] bg-bg rounded-full overflow-hidden", w)}><span className="block h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} /></span>;
}

function TeamView() {
  const maxV = Math.max(...TEAMS.map((t) => t.velocity));
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 mb-[18px]">
        {TEAMS.map((t) => (
          <div key={t.nm} className="card !rounded-[14px] !shadow-card p-[16px_18px]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: t.color }} />
              <b className="text-[14px] font-semibold">{t.nm}</b>
              <span className="ml-auto text-[11.5px] text-ink-3">{t.members} people</span>
            </div>
            <div className="text-[30px] font-bold tracking-[-0.02em] mt-2.5 leading-none">{t.velocity}<small className="text-[13px] text-ink-3 font-semibold"> pts</small></div>
            <div className="text-[11.5px] text-ink-3 mt-1">avg velocity · led by {t.lead}</div>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11.5px]"><span className="w-[64px] text-ink-2 flex-none">Delivery</span><Bar pct={t.delivery} color="#22C55E" /><span className="w-8 text-right font-semibold tabular-nums">{t.delivery}%</span></div>
              <div className="flex items-center gap-2 text-[11.5px]"><span className="w-[64px] text-ink-2 flex-none">On track</span><Bar pct={t.onTrack} color={t.color} /><span className="w-8 text-right font-semibold tabular-nums">{t.onTrack}%</span></div>
            </div>
          </div>
        ))}
      </div>
      <Card title="Velocity by Team">
        <div className="flex items-end gap-6 h-[180px] px-2 pt-2">
          {TEAMS.map((t) => (
            <div key={t.nm} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 flex items-end w-full justify-center">
                <div className="group relative w-9 rounded-t-[6px] transition-[filter] hover:brightness-110" style={{ height: `${(t.velocity / maxV) * 140}px`, background: t.color }}>
                  <span className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg bg-[#1e293b] text-white text-[11px] font-semibold whitespace-nowrap shadow-pop opacity-0 group-hover:opacity-100 transition-opacity">{t.velocity} pts</span>
                </div>
              </div>
              <div className="text-[12px] font-medium text-ink-2">{t.nm}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function IndividualView({ f }) {
  return (
    <Card title="Individual Performance" action={<CardLink>Export CSV</CardLink>}>
      <div className="-mx-[18px] -mb-[18px] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ink-3 border-b border-line">
              <th className="font-semibold px-[18px] py-2.5">Contributor</th>
              <th className="font-semibold px-3 py-2.5 text-right">Commits</th>
              <th className="font-semibold px-3 py-2.5 text-right">PRs</th>
              <th className="font-semibold px-3 py-2.5 text-right">Reviews</th>
              <th className="font-semibold px-3 py-2.5 text-right">Throughput</th>
              <th className="font-semibold px-[18px] py-2.5 text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {INDIVIDUALS.map((p) => (
              <tr key={p.nm} className="border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
                <td className="px-[18px] py-2.5"><span className="flex items-center gap-2.5"><Avatar av={p.in} pi={p.pi} size={30} /><b className="text-[13px] font-semibold">{p.nm}</b></span></td>
                <td className="px-3 py-2.5 text-right text-[13px] font-medium tabular-nums">{fmt(p.commits * f)}</td>
                <td className="px-3 py-2.5 text-right text-[13px] font-medium tabular-nums">{fmt(p.prs * f)}</td>
                <td className="px-3 py-2.5 text-right text-[13px] font-medium tabular-nums">{fmt(p.reviews * f)}</td>
                <td className="px-3 py-2.5 text-right text-[13px] font-semibold tabular-nums">{p.thru}</td>
                <td className="px-[18px] py-2.5"><span className="flex justify-end"><Sparkline values={p.trend} width={84} height={28} className="!w-[84px]" /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PredictiveView({ score }) {
  return (
    <div className="grid lg:grid-cols-[1fr_1.7fr] gap-4">
      <Card title="Overall Risk" action={<CardLink>How it works</CardLink>}>
        <div className="flex flex-col items-center justify-center gap-1.5 py-1.5">
          <Gauge value={score} color={riskColor(score)} label="Risk Score" width={190} height={130} />
          <div className="text-xs text-ink-2 text-center mt-1.5 max-w-[230px]">Forecast from velocity, scope churn and open dependencies for the selected window.</div>
        </div>
      </Card>
      <Card title="Milestone Forecast">
        <div className="-mx-[18px] -mb-[18px] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-ink-3 border-b border-line">
                <th className="font-semibold px-[18px] py-2.5">Milestone</th>
                <th className="font-semibold px-3 py-2.5">Risk</th>
                <th className="font-semibold px-3 py-2.5 text-right">Predicted</th>
                <th className="font-semibold px-3 py-2.5 text-right">On-time</th>
                <th className="font-semibold px-[18px] py-2.5 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {FORECAST.map((m) => (
                <tr key={m.nm} className="border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
                  <td className="px-[18px] py-2.5 text-[13px] font-semibold">{m.nm}</td>
                  <td className="px-3 py-2.5"><span className="flex items-center gap-2 w-[120px]"><Bar pct={m.risk} color={riskColor(m.risk)} /><span className="text-[12px] font-semibold tabular-nums w-7">{m.risk}%</span></span></td>
                  <td className="px-3 py-2.5 text-right text-[13px] tabular-nums">{m.eta}</td>
                  <td className={cn("px-3 py-2.5 text-right text-[13px] font-semibold tabular-nums", m.onTime >= 60 ? "text-emerald-600" : m.onTime >= 45 ? "text-amber-500" : "text-red-500")}>{m.onTime}%</td>
                  <td className="px-[18px] py-2.5 text-right text-[13px] text-ink-2 tabular-nums">{m.conf}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CapacityView() {
  const totalUsed = CAP.reduce((s, c) => s + c.used, 0);
  const totalCap = CAP.reduce((s, c) => s + c.total, 0);
  const util = Math.round((totalUsed / totalCap) * 100);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-[18px]">
        {[["Allocated", `${totalUsed} pts`], ["Capacity", `${totalCap} pts`], ["Utilization", `${util}%`], ["Available", `${totalCap - totalUsed} pts`]].map(([l, v]) => (
          <div key={l} className="card !rounded-[14px] !shadow-card p-[15px_16px]">
            <div className="text-xs text-ink-2 font-medium">{l}</div>
            <div className="text-[26px] font-bold tracking-[-0.02em] mt-1.5 leading-none">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Capacity by Member" action={<span className="text-xs text-ink-3">pts used / total</span>}>
          <div className="flex flex-col">
            {CAP.map((c) => {
              const pct = Math.round((c.used / c.total) * 100);
              return (
                <div key={c.av} className="flex items-center gap-3 py-2.5">
                  <Avatar av={c.av} pi={c.pi} size={32} />
                  <div className="w-[110px] flex-none min-w-0"><b className="block text-[13px] font-medium truncate">{c.nm}</b><span className="text-[11px] text-ink-3">{c.proj}</span></div>
                  <Bar pct={pct} color={capColor(pct)} />
                  <span className="text-xs font-semibold text-ink-2 w-14 text-right tabular-nums">{c.used}/{c.total}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Allocation by Project">
          <div className="flex items-center gap-[22px] flex-wrap">
            <Donut size={148} thickness={5.5} center={`${totalUsed}`} centerSub="pts allocated" segments={ALLOC} />
            <div className="flex-1 min-w-[180px] flex flex-col gap-1">
              {ALLOC.map((a) => <LegendRow key={a.label} color={a.color} label={a.label} value={`${a.value}%`} />)}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function MiniDelta({ d, dir, good }) {
  const color = dir === "flat" ? "text-ink-3" : good || dir === "up" ? "text-emerald-600" : "text-red-500";
  const icon = dir === "up" ? "ArrowUp" : dir === "down" ? "ArrowDown" : "Minus";
  return <span className={cn("flex items-center gap-1 text-[12px] font-semibold mt-1.5", color)}><Icon name={icon} size={13} />{d}</span>;
}

export default function ReportsPage() {
  const [range, setRange] = useState("This Week");
  const [tab, setTab] = useState("Overview");
  const d = RD[range];
  const f = RF[range] ?? 1;
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
      ]} value={tab} onChange={setTab} />

      {tab === "Team" && <TeamView />}
      {tab === "Individual" && <IndividualView f={f} />}
      {tab === "Predictive" && <PredictiveView score={d.score} />}
      {tab === "Capacity" && <CapacityView />}

      {tab === "Overview" && <>
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
      </>}
    </>
  );
}
