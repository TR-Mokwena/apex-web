"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const PALETTE = {
  Triggers: [
    { label: "Schedule", icon: "Clock", ib: "#EEF0FE", icol: "#4F46E5" },
    { label: "Event", icon: "Radio", ib: "#EFF8FE", icol: "#0EA5E9" },
    { label: "Condition", icon: "GitFork", ib: "#FEF4E5", icol: "#F59E0B" },
  ],
  Actions: [
    { label: "Send Email", icon: "Mail", ib: "#EEF0FE", icol: "#4F46E5" },
    { label: "Send Notification", icon: "Bell", ib: "#F3EEFE", icol: "#8B5CF6" },
    { label: "Create Task", icon: "SquarePlus", ib: "#E7F8F0", icol: "#16A34A" },
    { label: "Update Task", icon: "SquarePen", ib: "#FEF4E5", icol: "#F59E0B" },
    { label: "Webhook", icon: "Webhook", ib: "#FDECEC", icol: "#EF4444" },
  ],
};

// static node meta; positions live in a ref so drag stays cheap
const META = [
  { w: 188, h: 86, start: true, title: "Schedule", grad: "linear-gradient(135deg,#6366F1,#818CF8)", icon: "Clock", bIcon: "Repeat", bText: "Every 7 days" },
  { w: 188, h: 86, title: "Condition", grad: "linear-gradient(135deg,#F59E0B,#F97316)", icon: "GitFork", bIcon: "CircleSlash", bText: "No activity in 7 days" },
  { w: 188, h: 86, title: "Create Task", grad: "linear-gradient(135deg,#10B981,#22C55E)", icon: "SquarePlus", bIcon: "ListTodo", bText: "Follow-up task" },
  { w: 188, h: 86, title: "Send Email", grad: "linear-gradient(135deg,#6366F1,#8B5CF6)", icon: "Mail", bIcon: "UserRound", bText: "Notify Manager" },
  { w: 120, h: 58, end: true, title: "End", icon: "Square", endBg: "#94A3B8" },
];
const INIT_POS = [{ x: 60, y: 150 }, { x: 330, y: 150 }, { x: 600, y: 60 }, { x: 870, y: 60 }, { x: 640, y: 268 }];
const CONNS = [[0, 1, "#C7CEFB"], [1, 2, "#86EFAC"], [1, 4, "#CBD5E1"], [2, 3, "#C7CEFB"]];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const outPt = (n) => [n.x + n.w, n.y + n.h / 2];
const inPt = (n) => [n.x, n.y + n.h / 2];
const curve = (a, b) => { const dx = Math.max(40, Math.abs(b[0] - a[0]) * 0.5); return `M ${a[0]} ${a[1]} C ${a[0] + dx} ${a[1]}, ${b[0] - dx} ${b[1]}, ${b[0]} ${b[1]}`; };

export default function AutomationPage() {
  const pos = useRef(INIT_POS.map((p) => ({ ...p })));
  const view = useRef({ tx: 0, ty: 0, scale: 1 });
  const canvasRef = useRef(null);
  const drag = useRef(null);
  const pan = useRef(null);
  const [, force] = useState(0);
  const [sel, setSel] = useState(-1);
  const rerender = useCallback(() => force((n) => n + 1), []);

  const rect = (i) => ({ x: pos.current[i].x, y: pos.current[i].y, w: META[i].w, h: META[i].h });
  const bounds = () => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    META.forEach((_, i) => { const r = rect(i); x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  };

  const fit = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight, b = bounds(), pad = 44;
    const scale = clamp(Math.min((cw - pad * 2) / b.w, (ch - pad * 2) / b.h, 1.25), 0.4, 1.25);
    view.current = { scale, tx: (cw - b.w * scale) / 2 - b.x0 * scale, ty: (ch - b.h * scale) / 2 - b.y0 * scale };
    rerender();
  }, [rerender]);

  const zoomBy = useCallback((d) => {
    const c = canvasRef.current; if (!c) return;
    const cx = c.clientWidth / 2, cy = c.clientHeight / 2, v = view.current;
    const ns = clamp(v.scale + d, 0.4, 1.6);
    view.current = { scale: ns, tx: cx - (cx - v.tx) * (ns / v.scale), ty: cy - (cy - v.ty) * (ns / v.scale) };
    rerender();
  }, [rerender]);

  useEffect(() => {
    const onMove = (e) => {
      if (drag.current) {
        const { i, sx, sy, ox, oy } = drag.current, s = view.current.scale;
        pos.current[i] = { x: ox + (e.clientX - sx) / s, y: oy + (e.clientY - sy) / s };
        rerender();
      } else if (pan.current) {
        const p = pan.current;
        view.current = { ...view.current, tx: p.tx + (e.clientX - p.sx), ty: p.ty + (e.clientY - p.sy) };
        rerender();
      }
    };
    const onUp = () => { drag.current = null; pan.current = null; rerender(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    const t = requestAnimationFrame(fit);
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(fit, 120); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("resize", onResize); cancelAnimationFrame(t); };
  }, [fit, rerender]);

  const onNodeDown = (e, i) => {
    if (e.target.closest("[data-nodemenu]")) return;
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: pos.current[i].x, oy: pos.current[i].y };
    setSel(i); e.stopPropagation(); e.preventDefault();
  };
  const onCanvasDown = (e) => {
    if (e.target.closest("[data-node]") || e.target.closest("[data-ui]")) return;
    pan.current = { sx: e.clientX, sy: e.clientY, tx: view.current.tx, ty: view.current.ty };
    setSel(-1);
  };

  const v = view.current;
  const wires = CONNS.map(([f, t, c]) => ({ d: curve(outPt(rect(f)), inPt(rect(t))), end: inPt(rect(t)), c }));
  const labels = [
    { ...mid(outPt(rect(1)), inPt(rect(2))), text: "true", cls: "bg-emerald-500" },
    { ...mid(outPt(rect(1)), inPt(rect(4))), text: "false", cls: "bg-slate-400" },
  ];

  // minimap geometry
  const c = canvasRef.current;
  const b = bounds(), mw = 180, mh = 108, mpad = 8;
  const bw = Math.max(b.w, 200), bh = Math.max(b.h, 150);
  const ms = Math.min((mw - mpad * 2) / bw, (mh - mpad * 2) / bh);
  const ox = (mw - bw * ms) / 2, oy = (mh - bh * ms) / 2;
  const vx = c ? (-v.tx / v.scale - b.x0) * ms + ox : 0;
  const vy = c ? (-v.ty / v.scale - b.y0) * ms + oy : 0;
  const vw = c ? (c.clientWidth / v.scale) * ms : 0;
  const vh = c ? (c.clientHeight / v.scale) * ms : 0;

  return (
    <div className="-mx-4 md:-mx-7 -my-6 flex flex-col h-[calc(100vh-65px)]">
      {/* workflow header */}
      <div className="bg-white border-b border-line px-5 py-3.5 flex items-center gap-3.5 flex-none flex-wrap">
        <span className="text-[12.5px] text-ink-3 font-medium">Workflow:</span>
        <span className="text-base font-bold tracking-[-0.01em] flex items-center gap-1.5">Inactive Contributor Follow-up <Icon name="ChevronDown" size={15} className="text-ink-3" /></span>
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[11.5px] font-semibold px-2.5 py-1 rounded-full"><span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />Active</span>
        <div className="flex-1" />
        <button className="grid place-items-center w-9 h-9 rounded-[9px] border border-slate-200 bg-white"><Icon name="Undo2" size={15} className="text-ink-2" /></button>
        <button className="grid place-items-center w-9 h-9 rounded-[9px] border border-slate-200 bg-white"><Icon name="Redo2" size={15} className="text-ink-2" /></button>
        <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] border border-slate-200 bg-white text-[13px] font-medium"><Icon name="Save" size={15} className="text-ink-2" />Save</button>
        <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_rgba(99,102,241,0.8)]" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="Play" size={15} />Test Run</button>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* palette */}
        <div className="hidden md:block w-[208px] flex-none bg-white border-r border-line p-[16px_14px] overflow-y-auto">
          {Object.entries(PALETTE).map(([group, items]) => (
            <div key={group}>
              <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-ink-3 mx-1 mb-2.5 mt-5 first:mt-1.5">{group}{group === "Triggers" && <Icon name="Zap" size={14} />}</div>
              {items.map((it) => (
                <div key={it.label} className="flex items-center gap-3 p-[10px_11px] border border-line rounded-[11px] mb-2 cursor-grab active:scale-[0.98] text-[13px] font-medium bg-white hover:border-[#D6DCEA] hover:shadow-card">
                  <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: it.ib }}><Icon name={it.icon} size={16} style={{ color: it.icol }} /></span>{it.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* canvas */}
        <div
          ref={canvasRef}
          onMouseDown={onCanvasDown}
          onWheel={(e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 0.08 : -0.08); }}
          className={cn("flex-1 min-w-0 relative overflow-hidden select-none", pan.current ? "cursor-grabbing" : "cursor-grab")}
          style={{ backgroundColor: "#FBFCFE", backgroundImage: "radial-gradient(circle, #DCE1EC 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
        >
          <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${v.tx}px,${v.ty}px) scale(${v.scale})` }}>
            <svg className="absolute inset-0 overflow-visible pointer-events-none" width="1" height="1">
              {wires.map((w, i) => (
                <g key={i}><path d={w.d} fill="none" stroke={w.c} strokeWidth="2.5" /><circle cx={w.end[0]} cy={w.end[1]} r="3.5" fill={w.c} /></g>
              ))}
            </svg>
            {labels.map((l, i) => (
              <span key={i} className={`absolute text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-[7px] z-[3] ${l.cls}`} style={{ left: l.x - 16, top: l.y - 11 }}>{l.text}</span>
            ))}
            {META.map((n, i) => (
              <div key={i} data-node onMouseDown={(e) => onNodeDown(e, i)}
                className={cn("absolute bg-white border rounded-[14px] overflow-hidden cursor-grab active:cursor-grabbing", sel === i ? "border-[1.5px] border-brand shadow-[0_0_0_3px_rgba(99,102,241,0.13),0_10px_26px_-12px_rgba(16,24,40,0.22)]" : "border-line shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_26px_-12px_rgba(16,24,40,0.22)]")}
                style={{ left: pos.current[i].x, top: pos.current[i].y, width: n.w }}>
                <div className="flex items-center gap-2.5 p-[11px_12px]">
                  <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: n.end ? n.endBg : n.grad }}><Icon name={n.icon} size={16} className="text-white" /></span>
                  <span className="text-[13px] font-semibold flex-1">{n.title}</span>
                  {!n.end && <span data-nodemenu className="text-ink-3 cursor-pointer"><Icon name="EllipsisVertical" size={14} /></span>}
                </div>
                {!n.end && <div className="flex items-center gap-2 p-[9px_12px_11px] border-t border-line"><Icon name={n.bIcon} size={13} className="text-ink-3" /><span className="text-xs text-ink-2 font-medium">{n.bText}</span></div>}
                {!n.start && <span className="absolute w-[11px] h-[11px] rounded-full bg-white border-2 border-brand top-1/2 -translate-y-1/2 -left-1.5" />}
                {!n.end && <span className="absolute w-[11px] h-[11px] rounded-full bg-white border-2 border-brand top-1/2 -translate-y-1/2 -right-1.5" />}
              </div>
            ))}
          </div>

          {/* zoom controls */}
          <div data-ui className="absolute left-[18px] bottom-[18px] flex items-center gap-1.5 bg-white border border-slate-200 rounded-[11px] p-1.5 shadow-card z-[8]">
            <button onClick={() => zoomBy(-0.1)} className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Minus" size={16} /></button>
            <span className="text-[12.5px] font-semibold px-1.5 tabular-nums">{Math.round(v.scale * 100)}%</span>
            <button onClick={() => zoomBy(0.1)} className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Plus" size={16} /></button>
            <span className="w-px h-5 bg-slate-200" />
            <button onClick={fit} className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Maximize" size={16} /></button>
          </div>

          {/* minimap */}
          <div data-ui className="absolute right-[18px] bottom-[18px] w-[180px] h-[108px] bg-white border border-slate-200 rounded-[11px] shadow-card z-[8] overflow-hidden">
            {META.map((n, i) => { const r = rect(i); return <span key={i} className="absolute rounded-[3px] bg-[#C7CEFB]" style={{ left: (r.x - b.x0) * ms + ox, top: (r.y - b.y0) * ms + oy, width: r.w * ms, height: r.h * ms }} />; })}
            <span className="absolute border-[1.5px] border-brand rounded bg-brand/10" style={{ left: Math.max(0, vx), top: Math.max(0, vy), width: vw, height: vh }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function mid(a, b) { return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 }; }
