"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

/* ─── node type registry ──────────────────────────────────────────────────── */
const NODE_TYPES = {
  schedule: { title: "Schedule", group: "Triggers", icon: "Clock", grad: "linear-gradient(135deg,#6366F1,#818CF8)", pi: "#EEF0FE", pc: "#4F46E5", bIcon: "Repeat", hasIn: false, fields: [{ key: "days", label: "Run every (days)", type: "number" }], body: (c) => `Every ${c.days || 7} days` },
  event: { title: "Event", group: "Triggers", icon: "Radio", grad: "linear-gradient(135deg,#0EA5E9,#38BDF8)", pi: "#EFF8FE", pc: "#0EA5E9", bIcon: "Zap", hasIn: false, fields: [{ key: "event", label: "Event name" }], body: (c) => c.event || "On event" },
  condition: { title: "Condition", group: "Triggers", icon: "GitFork", grad: "linear-gradient(135deg,#F59E0B,#F97316)", pi: "#FEF4E5", pc: "#F59E0B", bIcon: "CircleSlash", branches: true, fields: [{ key: "expr", label: "Condition" }], body: (c) => c.expr || "If…" },
  email: { title: "Send Email", group: "Actions", icon: "Mail", grad: "linear-gradient(135deg,#6366F1,#8B5CF6)", pi: "#EEF0FE", pc: "#4F46E5", bIcon: "UserRound", fields: [{ key: "to", label: "Recipient" }, { key: "subject", label: "Subject" }], body: (c) => (c.to ? `To ${c.to}` : "Send email") },
  notify: { title: "Send Notification", group: "Actions", icon: "Bell", grad: "linear-gradient(135deg,#8B5CF6,#A78BFA)", pi: "#F3EEFE", pc: "#8B5CF6", bIcon: "Bell", fields: [{ key: "msg", label: "Message" }], body: (c) => c.msg || "Send notification" },
  createTask: { title: "Create Task", group: "Actions", icon: "SquarePlus", grad: "linear-gradient(135deg,#10B981,#22C55E)", pi: "#E7F8F0", pc: "#16A34A", bIcon: "ListTodo", fields: [{ key: "task", label: "Task title" }, { key: "assignee", label: "Assignee" }], body: (c) => c.task || "Create task" },
  updateTask: { title: "Update Task", group: "Actions", icon: "SquarePen", grad: "linear-gradient(135deg,#F59E0B,#FBBF24)", pi: "#FEF4E5", pc: "#F59E0B", bIcon: "SquarePen", fields: [{ key: "task", label: "Task" }, { key: "status", label: "New status" }], body: (c) => c.task || "Update task" },
  webhook: { title: "Webhook", group: "Actions", icon: "Webhook", grad: "linear-gradient(135deg,#EF4444,#F87171)", pi: "#FDECEC", pc: "#EF4444", bIcon: "Webhook", fields: [{ key: "url", label: "URL" }], body: (c) => c.url || "POST webhook" },
  end: { title: "End", group: "Flow", icon: "Square", grad: "#94A3B8", pi: "#F1F5F9", pc: "#64748B", bIcon: null, hasOut: false, fields: [], body: () => "" },
};
const PALETTE_GROUPS = ["Triggers", "Actions", "Flow"];

const DEFAULT = {
  nodes: [
    { id: "n1", type: "schedule", x: 60, y: 150, config: { days: 7 } },
    { id: "n2", type: "condition", x: 330, y: 150, config: { expr: "No activity in 7 days" } },
    { id: "n3", type: "createTask", x: 600, y: 60, config: { task: "Follow-up task" } },
    { id: "n4", type: "email", x: 870, y: 60, config: { to: "Manager" } },
    { id: "n5", type: "end", x: 640, y: 268, config: {} },
  ],
  conns: [{ id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n2", to: "n5" }, { id: "e4", from: "n3", to: "n4" }],
};
const STORAGE = "apex-automation-v1";

const sizeOf = (type) => ({ w: type === "end" ? 120 : 188, h: NODE_TYPES[type].bIcon ? 86 : 54 });
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const curve = (a, b) => { const dx = Math.max(40, Math.abs(b[0] - a[0]) * 0.5); return `M ${a[0]} ${a[1]} C ${a[0] + dx} ${a[1]}, ${b[0] - dx} ${b[1]}, ${b[0]} ${b[1]}`; };
const uid = () => Math.random().toString(36).slice(2, 9);

export default function AutomationPage() {
  const [nodes, setNodes] = useState(DEFAULT.nodes);
  const [conns, setConns] = useState(DEFAULT.conns);
  const [sel, setSel] = useState(null);
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 });
  const [connecting, setConnecting] = useState(null); // {fromId, to:[x,y]}
  const [running, setRunning] = useState(null); // node id currently "executing"
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState(null); // mobile: "palette" | null

  const canvasRef = useRef(null);
  const viewRef = useRef(view);
  const drag = useRef(null);
  const pan = useRef(null);
  const hist = useRef({ past: [], future: [] });
  const [, bump] = useState(0);
  useEffect(() => { viewRef.current = view; }, [view]);

  const node = (id) => nodes.find((n) => n.id === id);
  const outPt = (n) => { const s = sizeOf(n.type); return [n.x + s.w, n.y + s.h / 2]; };
  const inPt = (n) => { const s = sizeOf(n.type); return [n.x, n.y + s.h / 2]; };

  /* history */
  const snapshot = useCallback(() => { hist.current.past.push({ nodes: structuredClone(nodes), conns: structuredClone(conns) }); hist.current.future = []; bump((n) => n + 1); }, [nodes, conns]);
  const undo = () => { const h = hist.current; if (!h.past.length) return; h.future.push({ nodes, conns }); const p = h.past.pop(); setNodes(p.nodes); setConns(p.conns); setSel(null); bump((n) => n + 1); };
  const redo = () => { const h = hist.current; if (!h.future.length) return; h.past.push({ nodes, conns }); const f = h.future.pop(); setNodes(f.nodes); setConns(f.conns); setSel(null); bump((n) => n + 1); };

  /* load / save */
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) { const d = JSON.parse(raw); if (d.nodes) { setNodes(d.nodes); setConns(d.conns || []); } } } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const save = () => { localStorage.setItem(STORAGE, JSON.stringify({ nodes, conns })); setSaved(true); setTimeout(() => setSaved(false), 1400); };
  const reset = () => { snapshot(); setNodes(structuredClone(DEFAULT.nodes)); setConns(structuredClone(DEFAULT.conns)); setSel(null); };

  /* viewport */
  const bounds = useCallback(() => {
    if (!nodes.length) return { x0: 0, y0: 0, w: 400, h: 300 };
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    nodes.forEach((n) => { const s = sizeOf(n.type); x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + s.w); y1 = Math.max(y1, n.y + s.h); });
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }, [nodes]);
  const fit = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight, b = bounds(), pad = 44;
    const scale = clamp(Math.min((cw - pad * 2) / b.w, (ch - pad * 2) / b.h, 1.25), 0.4, 1.25);
    setView({ scale, tx: (cw - b.w * scale) / 2 - b.x0 * scale, ty: (ch - b.h * scale) / 2 - b.y0 * scale });
  }, [bounds]);
  const zoomBy = (d) => {
    const c = canvasRef.current; if (!c) return;
    const cx = c.clientWidth / 2, cy = c.clientHeight / 2;
    setView((v) => { const ns = clamp(v.scale + d, 0.4, 1.6); return { scale: ns, tx: cx - (cx - v.tx) * (ns / v.scale), ty: cy - (cy - v.ty) * (ns / v.scale) }; });
  };
  const toStage = (cx, cy) => { const r = canvasRef.current.getBoundingClientRect(), v = viewRef.current; return [(cx - r.left - v.tx) / v.scale, (cy - r.top - v.ty) / v.scale]; };

  useEffect(() => {
    const onMove = (e) => {
      if (drag.current) {
        if (!drag.current.moved) { drag.current.moved = true; snapshot(); }
        const { id, sx, sy, ox, oy } = drag.current, s = viewRef.current.scale;
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x: ox + (e.clientX - sx) / s, y: oy + (e.clientY - sy) / s } : n)));
      } else if (pan.current) {
        const p = pan.current; setView((v) => ({ ...v, tx: p.tx + (e.clientX - p.sx), ty: p.ty + (e.clientY - p.sy) }));
      } else if (connecting) {
        setConnecting((c) => ({ ...c, to: toStage(e.clientX, e.clientY) }));
      }
    };
    const onUp = (e) => {
      if (connecting) {
        // For touch, e.target stays on the origin port (implicit pointer capture),
        // so hit-test the actual element under the release point.
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const portEl = el?.closest?.("[data-portin]");
        const toId = portEl?.getAttribute("data-portin");
        if (toId && toId !== connecting.fromId) {
          snapshot();
          setConns((cs) => (cs.some((x) => x.from === connecting.fromId && x.to === toId) ? cs : [...cs, { id: uid(), from: connecting.fromId, to: toId }]));
        }
        setConnecting(null);
      }
      drag.current = null; pan.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); };
  }, [connecting, snapshot]);

  useEffect(() => {
    const t = requestAnimationFrame(fit);
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(fit, 120); };
    window.addEventListener("resize", onResize);
    const onKey = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && sel && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) { e.preventDefault(); deleteNode(sel); }
    };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(t); window.removeEventListener("resize", onResize); window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, fit]);

  /* mutations */
  const addNode = (type, x, y) => { snapshot(); const s = sizeOf(type); const id = uid(); setNodes((ns) => [...ns, { id, type, x: x - s.w / 2, y: y - s.h / 2, config: {} }]); setSel(id); };
  const addAtCenter = (type) => { const c = canvasRef.current; if (!c) return; const r = c.getBoundingClientRect(); const [x, y] = toStage(r.left + c.clientWidth / 2, r.top + c.clientHeight / 2); addNode(type, x, y); setSheet(null); };
  const deleteNode = (id) => { snapshot(); setNodes((ns) => ns.filter((n) => n.id !== id)); setConns((cs) => cs.filter((c) => c.from !== id && c.to !== id)); setSel(null); };
  const deleteConn = (id) => { snapshot(); setConns((cs) => cs.filter((c) => c.id !== id)); };
  const updateNode = (id, patch) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  const updateConfig = (id, key, val) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, config: { ...n.config, [key]: val } } : n)));

  /* test run — walk from triggers along connections */
  const testRun = () => {
    if (running) return;
    const order = [];
    const seen = new Set();
    const walk = (id) => { if (seen.has(id)) return; seen.add(id); order.push(id); conns.filter((c) => c.from === id).forEach((c) => walk(c.to)); };
    nodes.filter((n) => NODE_TYPES[n.type].hasIn === false).forEach((n) => walk(n.id));
    if (!order.length) { setToast("Add a trigger node to run"); setTimeout(() => setToast(""), 1800); return; }
    let i = 0;
    const tick = () => {
      if (i >= order.length) { setRunning(null); setToast("Test run complete ✓"); setTimeout(() => setToast(""), 1800); return; }
      setRunning(order[i]); i++; setTimeout(tick, 480);
    };
    tick();
  };

  /* canvas events */
  const onNodeDown = (e, id) => { if (e.target.closest("[data-port]") || e.target.closest("[data-nodemenu]")) return; drag.current = { id, sx: e.clientX, sy: e.clientY, ox: node(id).x, oy: node(id).y, moved: false }; setSel(id); e.stopPropagation(); e.preventDefault(); };
  const onCanvasDown = (e) => { if (e.target.closest("[data-node]") || e.target.closest("[data-ui]")) return; pan.current = { sx: e.clientX, sy: e.clientY, tx: view.tx, ty: view.ty }; setSel(null); };
  const onPortDown = (e, id) => { e.stopPropagation(); e.preventDefault(); setConnecting({ fromId: id, to: outPt(node(id)) }); };

  /* derived wires + branch labels */
  const condOut = {}; // count outputs per condition node for true/false labels
  const wires = conns.map((c) => {
    const fn = node(c.from), tn = node(c.to);
    if (!fn || !tn) return null;
    const a = outPt(fn), b = inPt(tn);
    let color = "#C7CEFB", label = null;
    if (NODE_TYPES[fn.type].branches) { const k = condOut[c.from] = (condOut[c.from] || 0) + 1; if (k === 1) { color = "#86EFAC"; label = "true"; } else { color = "#CBD5E1"; label = "false"; } }
    return { id: c.id, d: curve(a, b), end: b, color, label, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
  }).filter(Boolean);

  const selNode = sel ? node(sel) : null;
  const b = bounds();
  const c = canvasRef.current, mw = 180, mh = 108, mp = 8;
  const bw = Math.max(b.w, 200), bh = Math.max(b.h, 150), ms = Math.min((mw - mp * 2) / bw, (mh - mp * 2) / bh);
  const mox = (mw - bw * ms) / 2, moy = (mh - bh * ms) / 2;

  /* inspector — shared between the desktop sidebar and the mobile bottom sheet */
  const inspType = selNode ? NODE_TYPES[selNode.type] : null;
  const inspectorHeader = selNode && (
    <div className="flex items-center justify-between p-[16px_18px] border-b border-line flex-none">
      <div className="flex items-center gap-2.5">
        <span className="grid place-items-center w-8 h-8 rounded-lg flex-none" style={{ background: inspType.grad }}><Icon name={inspType.icon} size={16} className="text-white" /></span>
        <b className="text-[14px] font-semibold">{inspType.title}</b>
      </div>
      <button onClick={() => setSel(null)} className="text-ink-3 grid place-items-center"><Icon name="X" size={17} /></button>
    </div>
  );
  const inspectorBody = selNode && (
    <div className="p-[18px] flex flex-col gap-4 overflow-y-auto">
      {inspType.fields.length === 0 && <div className="text-[12.5px] text-ink-3">This node has no configuration.</div>}
      {inspType.fields.map((f) => (
        <label key={f.key} className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-2">{f.label}</span>
          <input
            type={f.type === "number" ? "number" : "text"}
            value={selNode.config[f.key] ?? ""}
            onFocus={snapshot}
            onChange={(e) => updateConfig(selNode.id, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
            className="h-10 border border-line rounded-[10px] px-3 text-sm outline-none focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]"
          />
        </label>
      ))}
      <div className="pt-2 border-t border-line">
        <button onClick={() => deleteNode(selNode.id)} className="w-full h-10 rounded-[10px] bg-red-50 text-red-500 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-red-100"><Icon name="Trash2" size={15} />Delete node</button>
      </div>
      <p className="text-[11.5px] text-ink-3 leading-relaxed">Drag a node's right dot onto another node's left dot to connect them. Click a wire to remove it. Press Delete to remove the selected node.</p>
    </div>
  );

  return (
    <div className="-mx-4 md:-mx-7 -my-6 flex flex-col h-[calc(100vh-65px)]">
      {/* header */}
      <div className="bg-card border-b border-line px-3 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2 sm:gap-3.5 flex-none flex-wrap">
        <span className="hidden sm:inline text-[12.5px] text-ink-3 font-medium">Workflow:</span>
        <span className="text-[15px] sm:text-base font-bold tracking-[-0.01em] flex items-center gap-1.5 min-w-0"><span className="truncate max-w-[150px] sm:max-w-none">Inactive Contributor Follow-up</span> <Icon name="ChevronDown" size={15} className="text-ink-3 flex-none" /></span>
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[11.5px] font-semibold px-2.5 py-1 rounded-full"><span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />Active</span>
        <div className="flex-1" />
        <button onClick={() => setSheet("palette")} className="md:hidden flex items-center gap-1.5 h-9 px-3 rounded-[9px] border border-line bg-card text-[13px] font-medium"><Icon name="Plus" size={15} className="text-ink-2" />Add</button>
        <button onClick={undo} disabled={!hist.current.past.length} title="Undo" className="grid place-items-center w-9 h-9 rounded-[9px] border border-line bg-card disabled:opacity-40"><Icon name="Undo2" size={15} className="text-ink-2" /></button>
        <button onClick={redo} disabled={!hist.current.future.length} title="Redo" className="grid place-items-center w-9 h-9 rounded-[9px] border border-line bg-card disabled:opacity-40"><Icon name="Redo2" size={15} className="text-ink-2" /></button>
        <button onClick={reset} title="Reset to default" className="grid place-items-center w-9 h-9 rounded-[9px] border border-line bg-card"><Icon name="RotateCcw" size={15} className="text-ink-2" /></button>
        <button onClick={save} className="flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] border border-line bg-card text-[13px] font-medium"><Icon name={saved ? "Check" : "Save"} size={15} className={saved ? "text-emerald-500" : "text-ink-2"} />{saved ? "Saved" : "Save"}</button>
        <button onClick={testRun} className="flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name={running ? "Loader" : "Play"} size={15} className={running ? "animate-spin" : ""} />Test Run</button>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* palette */}
        <div className="hidden md:block w-[208px] flex-none bg-card border-r border-line p-[16px_14px] overflow-y-auto">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink-3 mx-1 mb-2.5">Drag onto canvas</div>
          {PALETTE_GROUPS.map((group) => (
            <div key={group}>
              <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-ink-3 mx-1 mb-2.5 mt-5">{group}{group === "Triggers" && <Icon name="Zap" size={14} />}</div>
              {Object.entries(NODE_TYPES).filter(([, t]) => t.group === group).map(([type, t]) => (
                <div key={type} draggable onDragStart={(e) => e.dataTransfer.setData("type", type)} onClick={() => addAtCenter(type)} title="Drag onto canvas or click to add"
                  className="flex items-center gap-3 p-[10px_11px] border border-line rounded-[11px] mb-2 cursor-grab active:scale-[0.98] text-[13px] font-medium bg-card hover:border-[#D6DCEA] hover:shadow-card">
                  <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: t.pi }}><Icon name={t.icon} size={16} style={{ color: t.pc }} /></span>{t.title}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* canvas */}
        <div
          ref={canvasRef}
          onPointerDown={onCanvasDown}
          onWheel={(e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 0.08 : -0.08); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const type = e.dataTransfer.getData("type"); if (NODE_TYPES[type]) { const [x, y] = toStage(e.clientX, e.clientY); addNode(type, x, y); } }}
          className={cn("flex-1 min-w-0 relative overflow-hidden select-none touch-none", pan.current ? "cursor-grabbing" : "cursor-grab")}
          style={{ backgroundColor: "#FBFCFE", backgroundImage: "radial-gradient(circle, #DCE1EC 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
        >
          <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${view.tx}px,${view.ty}px) scale(${view.scale})` }}>
            <svg className="absolute inset-0 overflow-visible" width="1" height="1">
              {wires.map((w) => (
                <g key={w.id} className="group">
                  <path d={w.d} fill="none" stroke="transparent" strokeWidth="16" className="cursor-pointer pointer-events-auto" onClick={() => deleteConn(w.id)}><title>Click to remove</title></path>
                  <path d={w.d} fill="none" stroke={w.color} strokeWidth="2.5" className="pointer-events-none group-hover:stroke-red-400" />
                  <circle cx={w.end[0]} cy={w.end[1]} r="3.5" fill={w.color} className="pointer-events-none" />
                </g>
              ))}
              {connecting && (() => { const fn = node(connecting.fromId); return fn && connecting.to ? <path d={curve(outPt(fn), connecting.to)} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="5 5" className="pointer-events-none" /> : null; })()}
            </svg>
            {wires.filter((w) => w.label).map((w) => (
              <span key={w.id} className={cn("absolute text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-[7px] z-[3] pointer-events-none", w.label === "true" ? "bg-emerald-500" : "bg-slate-400")} style={{ left: w.mid[0] - 16, top: w.mid[1] - 11 }}>{w.label}</span>
            ))}
            {nodes.map((n) => {
              const t = NODE_TYPES[n.type], s = sizeOf(n.type), isSel = sel === n.id, isRun = running === n.id;
              return (
                <div key={n.id} data-node onPointerDown={(e) => onNodeDown(e, n.id)}
                  className={cn("absolute bg-card border rounded-[14px] cursor-grab active:cursor-grabbing transition-shadow",
                    isRun ? "border-[1.5px] border-emerald-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]" : isSel ? "border-[1.5px] border-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_13%,transparent),0_10px_26px_-12px_rgba(16,24,40,0.22)]" : "border-line shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_26px_-12px_rgba(16,24,40,0.22)]")}
                  style={{ left: n.x, top: n.y, width: s.w }}>
                  <div className="flex items-center gap-2.5 p-[11px_12px]">
                    <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: t.grad }}><Icon name={t.icon} size={16} className="text-white" /></span>
                    <span className="text-[13px] font-semibold flex-1 truncate">{t.title}</span>
                    {n.type !== "end" && <button data-nodemenu onClick={() => deleteNode(n.id)} className="text-ink-3 hover:text-red-500 cursor-pointer"><Icon name="Trash2" size={13} /></button>}
                  </div>
                  {t.bIcon && <div className="flex items-center gap-2 p-[9px_12px_11px] border-t border-line"><Icon name={t.bIcon} size={13} className="text-ink-3" /><span className="text-xs text-ink-2 font-medium truncate">{t.body(n.config)}</span></div>}
                  {t.hasIn !== false && <span data-portin={n.id} className="absolute w-[13px] h-[13px] rounded-full bg-card border-2 border-brand top-1/2 -translate-y-1/2 -left-[7px] hover:scale-125 transition-transform" />}
                  {t.hasOut !== false && <span data-port onPointerDown={(e) => onPortDown(e, n.id)} title="Drag to connect" className="absolute w-[15px] h-[15px] rounded-full bg-card border-2 border-brand top-1/2 -translate-y-1/2 -right-[7px] cursor-crosshair hover:scale-125 hover:bg-brand transition-transform" />}
                </div>
              );
            })}
          </div>

          {/* empty hint */}
          {!nodes.length && <div className="absolute inset-0 grid place-items-center text-ink-3 text-sm pointer-events-none">Drag a trigger from the palette to start</div>}

          {/* zoom */}
          <div data-ui className="absolute left-[18px] bottom-[18px] flex items-center gap-1.5 bg-card border border-line rounded-[11px] p-1.5 shadow-card z-[8]">
            <button onClick={() => zoomBy(-0.1)} className="grid place-items-center w-8 h-8 rounded-lg text-ink-2 hover:bg-bg"><Icon name="Minus" size={16} /></button>
            <span className="text-[12.5px] font-semibold px-1.5 tabular-nums">{Math.round(view.scale * 100)}%</span>
            <button onClick={() => zoomBy(0.1)} className="grid place-items-center w-8 h-8 rounded-lg text-ink-2 hover:bg-bg"><Icon name="Plus" size={16} /></button>
            <span className="w-px h-5 bg-slate-200" />
            <button onClick={fit} title="Fit" className="grid place-items-center w-8 h-8 rounded-lg text-ink-2 hover:bg-bg"><Icon name="Maximize" size={16} /></button>
          </div>

          {/* minimap */}
          <div data-ui className="hidden sm:block absolute right-[18px] bottom-[18px] w-[180px] h-[108px] bg-card border border-line rounded-[11px] shadow-card z-[8] overflow-hidden">
            {nodes.map((n) => { const s = sizeOf(n.type); return <span key={n.id} className="absolute rounded-[3px] bg-[#C7CEFB]" style={{ left: (n.x - b.x0) * ms + mox, top: (n.y - b.y0) * ms + moy, width: s.w * ms, height: s.h * ms }} />; })}
            {c && <span className="absolute border-[1.5px] border-brand rounded bg-brand/10" style={{ left: Math.max(0, (-view.tx / view.scale - b.x0) * ms + mox), top: Math.max(0, (-view.ty / view.scale - b.y0) * ms + moy), width: (c.clientWidth / view.scale) * ms, height: (c.clientHeight / view.scale) * ms }} />}
          </div>

          {toast && <div data-ui className="absolute left-1/2 -translate-x-1/2 bottom-[18px] bg-[#1e293b] text-white text-[12.5px] font-medium px-4 py-2 rounded-[10px] shadow-pop z-[9]">{toast}</div>}
        </div>

        {/* inspector — desktop sidebar */}
        {selNode && (
          <div className="hidden lg:flex w-[280px] flex-none bg-card border-l border-line flex-col">
            {inspectorHeader}
            {inspectorBody}
          </div>
        )}
      </div>

      {/* inspector — mobile bottom sheet */}
      {selNode && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t border-line rounded-t-2xl shadow-pop flex flex-col max-h-[62vh]">
          <div className="mx-auto mt-2 mb-1 h-1 w-9 rounded-full bg-slate-300 flex-none" />
          {inspectorHeader}
          {inspectorBody}
        </div>
      )}

      {/* palette — mobile bottom sheet (tap to add) */}
      {sheet === "palette" && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSheet(null)} />
          <div className="relative bg-card rounded-t-2xl shadow-pop max-h-[72vh] overflow-y-auto p-4 pb-6">
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between mb-1">
              <b className="text-[15px] font-semibold">Add a node</b>
              <button onClick={() => setSheet(null)} className="text-ink-3 grid place-items-center"><Icon name="X" size={18} /></button>
            </div>
            {PALETTE_GROUPS.map((group) => (
              <div key={group}>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink-3 mx-1 mb-2 mt-4">{group}</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(NODE_TYPES).filter(([, t]) => t.group === group).map(([type, t]) => (
                    <button key={type} onClick={() => addAtCenter(type)}
                      className="flex items-center gap-2.5 p-[10px_11px] border border-line rounded-[11px] text-[13px] font-medium bg-card text-left active:scale-[0.98]">
                      <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: t.pi }}><Icon name={t.icon} size={16} style={{ color: t.pc }} /></span>
                      <span className="truncate">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
