// Lightweight, dependency-free SVG charts. All compute geometry from props.
import { cn } from "@/lib/cn";

function scale(values, w, h, pad = 2) {
  const mn = Math.min(...values), mx = Math.max(...values), rng = mx - mn || 1;
  return values.map((v, i) => [
    pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2),
    pad + (1 - (v - mn) / rng) * (h - pad * 2),
  ]);
}

/* ─── Sparkline (line + optional area + end dot) ──────────────────────────── */
export function Sparkline({ values = [], width = 120, height = 46, color = "#6366F1", fill = false, dot = true, className, style }) {
  if (!values.length) return null;
  const pts = scale(values, width, height, 3);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} style={{ width: "100%", overflow: "visible", ...style }} aria-hidden="true">
      {fill && <path d={`${line} L${last[0]} ${height} L${pts[0][0]} ${height} Z`} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {dot && <circle cx={last[0]} cy={last[1]} r="3" fill={color} />}
    </svg>
  );
}

/* ─── LineChart (grid + axis labels + multiple series) ────────────────────── */
export function LineChart({ series = [], xLabels = [], yMax = 100, yTicks = [100, 75, 50, 25, 0], width = 430, height = 210, className }) {
  const left = 40, right = 12, top = 20, bottom = 30;
  const iw = width - left - right, ih = height - top - bottom;
  const x = (i, n) => left + (i / Math.max(n - 1, 1)) * iw;
  const y = (v) => top + (1 - v / yMax) * ih;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} style={{ width: "100%", height: "auto" }}>
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
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Paired bar chart (tall accent + short muted per group) ──────────────── */
export function BarPairs({ data = [], xLabels = [], max, width = 430, height = 150, className }) {
  const top = 10, bottom = 22, gap = 18, pairGap = 4;
  const ih = height - top - bottom;
  const m = max || Math.max(...data.flat(), 1);
  const groupW = (width - gap * (data.length - 1)) / data.length;
  const barW = (groupW - pairGap) / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} style={{ width: "100%", height: "auto" }}>
      {data.map(([a, b], i) => {
        const gx = i * (groupW + gap);
        const ha = (a / m) * ih, hb = (b / m) * ih;
        return (
          <g key={i}>
            <rect x={gx} y={top + ih - ha} width={barW} height={ha} rx="4" fill="#6366F1" />
            <rect x={gx + barW + pairGap} y={top + ih - hb} width={barW} height={hb} rx="4" fill="#C7CCFB" />
            {xLabels[i] && <text x={gx + groupW / 2} y={height - 6} fill="#94A3B8" fontSize="11" textAnchor="middle">{xLabels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Donut (segments) ────────────────────────────────────────────────────── */
export function Donut({ segments = [], size = 150, thickness = 6, center, centerSub, className }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 15.9155; // circumference ≈ 100 → values map to percentages
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" className={className}>
      <circle cx="21" cy="21" r={r} fill="none" stroke="#F1F3F8" strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const pct = (seg.value / total) * 100;
        const el = <circle key={i} cx="21" cy="21" r={r} fill="none" stroke={seg.color} strokeWidth={thickness} strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-acc} transform="rotate(-90 21 21)" />;
        acc += pct;
        return el;
      })}
      {center != null && <text x="21" y="20.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0F172A">{center}</text>}
      {centerSub && <text x="21" y="26" textAnchor="middle" fontSize="3.1" fill="#94A3B8">{centerSub}</text>}
    </svg>
  );
}

/* ─── Semicircle gauge ────────────────────────────────────────────────────── */
export function Gauge({ value = 0, color = "#22C55E", label, width = 170, height = 118 }) {
  const path = "M16,104 A69,69 0 0 1 154,104";
  const len = Math.PI * 69; // ≈ 216.7
  const on = (Math.max(0, Math.min(100, value)) / 100) * len;
  return (
    <svg width={width} height={height} viewBox="0 0 170 118">
      <path d={path} fill="none" stroke="#EEF1F6" strokeWidth="15" strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth="15" strokeLinecap="round" strokeDasharray={`${on} ${len}`} />
      <text x="85" y="92" textAnchor="middle" fontSize="30" fontWeight="700" fill="#0F172A">{value}%</text>
      {label && <text x="85" y="108" textAnchor="middle" fontSize="12" fill="#94A3B8">{label}</text>}
    </svg>
  );
}

/* ─── Ring (single circular progress) ─────────────────────────────────────── */
export function Ring({ value = 0, size = 58, color = "#6366F1", track = "#EAE9FE", thickness = 6 }) {
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
      <span className="flex items-center gap-2.5 text-slate-700">
        <span className="w-[9px] h-[9px] rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-semibold text-heading">{value}</span>
    </div>
  );
}
