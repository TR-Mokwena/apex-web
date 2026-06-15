"use client";

// Lightweight, dependency-free SVG charts with hover tooltips.
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

function scale(values, w, h, pad = 2) {
  const mn = Math.min(...values), mx = Math.max(...values), rng = mx - mn || 1;
  return values.map((v, i) => [
    pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2),
    pad + (1 - (v - mn) / rng) * (h - pad * 2),
  ]);
}

/* Cursor-following tooltip + the hook that positions it inside a chart. */
function Tooltip({ tip }) {
  if (!tip) return null;
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg bg-ink text-white text-[11px] font-semibold whitespace-nowrap shadow-pop"
      style={{ left: tip.x, top: tip.y - 8 }}
    >
      {tip.label != null && <span className="text-white/55 font-medium mr-1">{tip.label}</span>}
      {tip.value}
    </div>
  );
}
function useTip() {
  const ref = useRef(null);
  const [tip, setTip] = useState(null);
  const show = (label, value) => (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, label, value });
  };
  const hide = () => setTip(null);
  return { ref, tip, show, hide };
}

/* ─── Sparkline (line + optional area + end dot) ──────────────────────────── */
export function Sparkline({ values = [], width = 120, height = 46, color = "var(--color-brand)", fill = false, dot = true, label, className, style }) {
  const { ref, tip, show, hide } = useTip();
  if (!values.length) return null;
  const pts = scale(values, width, height, 3);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <span ref={ref} className={cn("relative block", className)} style={style}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block w-full overflow-visible" aria-hidden="true">
        {fill && <path d={`${line} L${last[0]} ${height} L${pts[0][0]} ${height} Z`} fill={color} opacity="0.12" />}
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {dot && <circle cx={last[0]} cy={last[1]} r="3" fill={color} />}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="7" fill="transparent" className="cursor-pointer" onMouseMove={show(label, values[i])} onMouseLeave={hide} />
        ))}
      </svg>
      <Tooltip tip={tip} />
    </span>
  );
}

/* ─── LineChart (grid + axis labels + multiple series) ────────────────────── */
export function LineChart({ series = [], xLabels = [], yMax = 100, yTicks = [100, 75, 50, 25, 0], width = 430, height = 210, className }) {
  const { ref, tip, show, hide } = useTip();
  const left = 40, right = 12, top = 20, bottom = 30;
  const iw = width - left - right, ih = height - top - bottom;
  const x = (i, n) => left + (i / Math.max(n - 1, 1)) * iw;
  const y = (v) => top + (1 - v / yMax) * ih;
  return (
    <span ref={ref} className={cn("relative block", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block w-full h-auto">
        <g stroke="#F1F3F8" strokeWidth="1">
          {yTicks.map((t) => <line key={t} x1={left} y1={y(t)} x2={width - right} y2={y(t)} />)}
        </g>
        <g fill="#94A3B8" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">
          {yTicks.map((t) => <text key={t} x={left - 8} y={y(t) + 4}>{t}</text>)}
        </g>
        <g fill="#94A3B8" fontSize="11" textAnchor="middle">
          {xLabels.map((l, i) => <text key={i} x={x(i, xLabels.length)} y={height - 10}>{l}</text>)}
        </g>
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => [x(i, s.values.length), y(v)]);
          const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
          return (
            <g key={si}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={s.dashed ? 2 : 2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "4 4" : undefined} />
              {!s.dashed && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />)}
              {pts.map((p, i) => (
                <circle key={"h" + i} cx={p[0]} cy={p[1]} r="9" fill="transparent" className="cursor-pointer" onMouseMove={show(xLabels[i], s.values[i])} onMouseLeave={hide} />
              ))}
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </span>
  );
}

/* ─── Paired bar chart (tall accent + short muted per group) ──────────────── */
export function BarPairs({ data = [], xLabels = [], max, width = 430, height = 150, className }) {
  const { ref, tip, show, hide } = useTip();
  const top = 10, bottom = 22, gap = 18, pairGap = 4;
  const ih = height - top - bottom;
  const m = max || Math.max(...data.flat(), 1);
  const groupW = (width - gap * (data.length - 1)) / data.length;
  const barW = (groupW - pairGap) / 2;
  return (
    <span ref={ref} className={cn("relative block", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block w-full h-auto">
        {data.map(([a, b], i) => {
          const gx = i * (groupW + gap);
          const ha = (a / m) * ih, hb = (b / m) * ih;
          return (
            <g key={i}>
              <rect x={gx} y={top + ih - ha} width={barW} height={ha} rx="4" fill="var(--color-brand)" className="cursor-pointer hover:opacity-85" onMouseMove={show(xLabels[i], a)} onMouseLeave={hide} />
              <rect x={gx + barW + pairGap} y={top + ih - hb} width={barW} height={hb} rx="4" className="cursor-pointer hover:opacity-85" style={{ fill: "color-mix(in srgb, var(--color-brand) 32%, white)" }} onMouseMove={show(xLabels[i], b)} onMouseLeave={hide} />
              {xLabels[i] && <text x={gx + groupW / 2} y={height - 6} fill="#94A3B8" fontSize="11" textAnchor="middle">{xLabels[i]}</text>}
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </span>
  );
}

/* ─── Donut (segments) ────────────────────────────────────────────────────── */
export function Donut({ segments = [], size = 150, thickness = 6, center, centerSub, className }) {
  const { ref, tip, show, hide } = useTip();
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 15.9155; // circumference ≈ 100 → values map to percentages
  let acc = 0;
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <svg width={size} height={size} viewBox="0 0 42 42">
        <circle cx="21" cy="21" r={r} fill="none" stroke="#F1F3F8" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          const el = (
            <circle key={i} cx="21" cy="21" r={r} fill="none" stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-acc} transform="rotate(-90 21 21)"
              className="cursor-pointer hover:opacity-80"
              onMouseMove={show(seg.label, seg.display != null ? seg.display : `${Math.round(pct)}%`)} onMouseLeave={hide} />
          );
          acc += pct;
          return el;
        })}
        {center != null && <text x="21" y="20.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0F172A">{center}</text>}
        {centerSub && <text x="21" y="26" textAnchor="middle" fontSize="3.1" fill="#94A3B8">{centerSub}</text>}
      </svg>
      <Tooltip tip={tip} />
    </span>
  );
}

/* ─── Semicircle gauge ────────────────────────────────────────────────────── */
export function Gauge({ value = 0, color = "#22C55E", label, width = 170, height = 118 }) {
  const { ref, tip, show, hide } = useTip();
  const path = "M16,104 A69,69 0 0 1 154,104";
  const len = Math.PI * 69; // ≈ 216.7
  const on = (Math.max(0, Math.min(100, value)) / 100) * len;
  return (
    <span ref={ref} className="relative inline-block">
      <svg width={width} height={height} viewBox="0 0 170 118">
        <path d={path} fill="none" stroke="#EEF1F6" strokeWidth="15" strokeLinecap="round" />
        <path d={path} fill="none" stroke={color} strokeWidth="15" strokeLinecap="round" strokeDasharray={`${on} ${len}`}
          className="cursor-pointer" onMouseMove={show(label, `${value}%`)} onMouseLeave={hide} />
        <text x="85" y="92" textAnchor="middle" fontSize="30" fontWeight="700" fill="#0F172A">{value}%</text>
        {label && <text x="85" y="108" textAnchor="middle" fontSize="12" fill="#94A3B8">{label}</text>}
      </svg>
      <Tooltip tip={tip} />
    </span>
  );
}

/* ─── Ring (single circular progress) ─────────────────────────────────────── */
export function Ring({ value = 0, size = 58, color = "var(--color-brand)", track = "var(--color-brand-soft)", thickness = 6 }) {
  const r = 16.5, c = 2 * Math.PI * r;
  const on = (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="none" stroke={track} strokeWidth={thickness} />
      <circle cx="21" cy="21" r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${on} ${c}`} transform="rotate(-90 21 21)" />
    </svg>
  );
}

/* ─── Coloured legend row (dot · label · value) ───────────────────────────── */
export function LegendRow({ color, label, value, className }) {
  return (
    <div className={cn("flex items-center justify-between text-[13px] py-[5px]", className)}>
      <span className="flex items-center gap-2.5 text-ink">
        <span className="w-[9px] h-[9px] rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-semibold text-heading">{value}</span>
    </div>
  );
}
