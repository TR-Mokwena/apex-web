// Lightweight rebuilds of the app's UI primitives, using the same token classes.
// (The real ones are "use client" + coupled to next/navigation; these are
// self-contained so the video stays easy to tweak. Charts ARE reused as-is.)
import { C, PAL } from "../lib/brand";

const INITIALS = ["AM", "TK", "JR", "SD", "LP"];

export function Card({ className = "", style, children }) {
  return (
    <div className={`bg-card border border-line rounded-card shadow-card ${className}`} style={style}>
      {children}
    </div>
  );
}

const TONES = {
  brand: ["#eef0fe", "#4f46e5"],
  emerald: ["rgba(34,197,94,0.14)", "#15803d"],
  amber: ["rgba(245,158,11,0.16)", "#b45309"],
  slate: ["#eef2f7", "#64748b"],
};
export function Pill({ children, tone = "brand" }) {
  const [bg, color] = TONES[tone] || TONES.brand;
  return (
    <span className="inline-flex items-center px-2.5 py-[3px] rounded-pill text-[12px] font-semibold" style={{ background: bg, color }}>
      {children}
    </span>
  );
}

export function Avatar({ from, to, size = 30, label }) {
  return (
    <div
      className="rounded-pill grid place-items-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {label}
    </div>
  );
}

export function KanbanCard({ title, tag, tone, who = 0 }) {
  const [from, to] = PAL[who % PAL.length];
  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <Pill tone={tone}>{tag}</Pill>
        <Avatar size={26} from={from} to={to} label={INITIALS[who % INITIALS.length]} />
      </div>
      <div className="text-[14.5px] text-ink font-medium leading-snug">{title}</div>
    </Card>
  );
}

export { C };
