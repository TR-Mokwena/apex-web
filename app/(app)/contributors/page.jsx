"use client";

import { useState, useRef } from "react";
import Icon from "@/components/Icon";
import { Card, CardLink, Tabs, Delta, Sparkline } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const PEOPLE = [
  { nm: "TR Mokwena", cm: "1,248 commits", in: "TM" },
  { nm: "Thabo Nkosi", cm: "980 commits", in: "TN" },
  { nm: "Sipho Dlamini", cm: "672 commits", in: "SD" },
  { nm: "Priya Singh", cm: "742 commits", in: "PS" },
  { nm: "Naledi Kgasana", cm: "654 commits", in: "NK" },
];
const STATS = [
  { l: "Commits", v: "1,248", d: "12%" },
  { l: "Pull Requests", v: "42", d: "18%" },
  { l: "Reviews", v: "96", d: "6%" },
  { l: "Lines of Code", v: "12.4k", d: "11%" },
];

// accent-derived ramp — mixes the brand with the card colour so it adapts to light/dark
const RAMP = [
  "color-mix(in srgb, var(--color-brand) 8%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 28%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 48%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 70%, var(--color-card))",
  "var(--color-brand)",
  "color-mix(in srgb, var(--color-brand) 78%, black)",
];
const HM_ROWS = ["11 PM", "9 PM", "6 PM", "12 PM", "9 AM"];
const HM_COLS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COL_W = [0.8, 0.95, 1, 0.9, 0.85, 0.4, 0.3];
const ROW_W = [0.55, 0.85, 1, 0.9, 0.6];
function heatValue(r, c) {
  const base = COL_W[c] * ROW_W[r];
  const noise = ((Math.sin(r * 3.1 + c * 1.7) + 1) / 2) * 0.35;
  return Math.round(Math.max(0, Math.min(1, base * 0.72 + noise)) * 22);
}
const levelOf = (v) => (v === 0 ? 0 : v < 4 ? 1 : v < 8 ? 2 : v < 13 ? 3 : v < 18 ? 4 : 5);

function Heatmap() {
  const ref = useRef(null);
  const [tip, setTip] = useState(null);
  const show = (r, c) => (e) => {
    const box = ref.current?.getBoundingClientRect();
    if (box) setTip({ x: e.clientX - box.left, y: e.clientY - box.top, v: heatValue(r, c), label: `${HM_COLS[c]} · ${HM_ROWS[r]}` });
  };
  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-[42px_1fr] gap-2">
        <div />
        <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mb-2">{HM_COLS.map((c) => <span key={c}>{c}</span>)}</div>
        <div className="flex flex-col justify-between text-[11px] text-ink-3 py-0.5">{HM_ROWS.map((r) => <span key={r}>{r}</span>)}</div>
        <div className="grid grid-cols-7 auto-rows-fr gap-[5px]">
          {HM_ROWS.map((_, r) => HM_COLS.map((__, c) => (
            <div key={`${r}-${c}`} className="aspect-square rounded-[5px] cursor-pointer transition-shadow hover:ring-2 hover:ring-brand/50"
              style={{ background: RAMP[levelOf(heatValue(r, c))] }} onMouseMove={show(r, c)} onMouseLeave={() => setTip(null)} />
          )))}
        </div>
      </div>
      {tip && (
        <div className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg bg-[#1e293b] text-white text-[11px] font-semibold whitespace-nowrap shadow-pop" style={{ left: tip.x, top: tip.y - 8 }}>
          <span className="text-white/55 font-medium mr-1">{tip.label}</span>{tip.v} contributions
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-end mt-3.5 text-[11px] text-ink-3">
        Less{RAMP.slice(0, 5).map((c, i) => <span key={i} className="w-3 h-3 rounded" style={{ background: c }} />)}More
      </div>
    </div>
  );
}

export default function ContributorsPage() {
  const [sel, setSel] = useState(0);
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="GitPullRequestArrow" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Contribution Intelligence</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Engineering contribution analytics across your organization.</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-[18px]">
        <Tabs items={["Overview", "Commits", "Pull Requests", "Reviews", "Activity"]} value="Overview" className="!border-0" />
        <button className="inline-flex items-center gap-2.5 text-[13px] font-medium text-ink-2"><Icon name="Calendar" size={15} className="text-ink-3" />June 12 – June 18, 2026<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* people rail */}
        <div className="w-full lg:w-[228px] flex-none card !shadow-card p-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-2.5 pt-2.5 pb-2">Contributors</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-1">
            {PEOPLE.map((p, i) => (
              <button key={p.nm} onClick={() => setSel(i)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[11px] text-left transition-colors", sel === i ? "bg-brand-soft" : "hover:bg-bg")}>
                <span className="grid place-items-center w-9 h-9 rounded-full flex-none text-white text-[13px] font-semibold" style={{ background: PAL[i % PAL.length] }}>{p.in}</span>
                <div className="min-w-0 flex-1"><div className="text-[13.5px] font-semibold leading-tight truncate">{p.nm}</div><div className="text-[11.5px] text-ink-3 mt-0.5">{p.cm}</div></div>
                <Icon name="ChevronRight" size={15} className={cn("ml-auto", sel === i ? "text-brand" : "text-ink-3")} />
              </button>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="flex-1 min-w-0 flex flex-col gap-[18px]">
          <Card title="Contribution Overview" action={<CardLink>View detailed breakdown</CardLink>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.l} className="border border-line rounded-[13px] p-[16px_18px]">
                  <div className="text-[12.5px] text-ink-2 font-medium">{s.l}</div>
                  <div className="text-[28px] font-bold tracking-[-0.02em] leading-[1.1] mt-2">{s.v}</div>
                  <Delta value={s.d} className="mt-1.5 !text-xs" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-[18px]">
            <Card title="Activity Heatmap">
              <Heatmap />
            </Card>

            <Card title="Contribution Trend" action={<span className="flex items-center gap-2 text-xs text-ink-2"><span className="w-4 border-t-2 border-brand" />Commits</span>}>
              <Sparkline values={[25, 38, 33, 46, 42, 62, 55]} width={420} height={210} fill color="var(--color-brand)" />
              <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mt-1">
                {["12", "13", "14", "15", "16", "17", "18"].map((d) => <span key={d}>Jun {d}</span>)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
