"use client";

import Icon from "@/components/Icon";

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

const NODES = [
  { x: 60, y: 150, w: 188, h: 86, start: true, title: "Schedule", grad: "linear-gradient(135deg,#6366F1,#818CF8)", icon: "Clock", bIcon: "Repeat", bText: "Every 7 days" },
  { x: 330, y: 150, w: 188, h: 86, title: "Condition", grad: "linear-gradient(135deg,#F59E0B,#F97316)", icon: "GitFork", bIcon: "CircleSlash", bText: "No activity in 7 days" },
  { x: 600, y: 60, w: 188, h: 86, title: "Create Task", grad: "linear-gradient(135deg,#10B981,#22C55E)", icon: "SquarePlus", bIcon: "ListTodo", bText: "Follow-up task" },
  { x: 870, y: 60, w: 188, h: 86, title: "Send Email", grad: "linear-gradient(135deg,#6366F1,#8B5CF6)", icon: "Mail", bIcon: "UserRound", bText: "Notify Manager" },
  { x: 640, y: 268, w: 120, h: 58, end: true, title: "End", icon: "Square", endBg: "#94A3B8" },
];
const CONNS = [[0, 1, "#C7CEFB"], [1, 2, "#86EFAC"], [1, 4, "#CBD5E1"], [2, 3, "#C7CEFB"]];

const outPt = (n) => [n.x + n.w, n.y + n.h / 2];
const inPt = (n) => [n.x, n.y + n.h / 2];
const curve = (a, b) => { const dx = Math.max(40, Math.abs(b[0] - a[0]) * 0.5); return `M ${a[0]} ${a[1]} C ${a[0] + dx} ${a[1]}, ${b[0] - dx} ${b[1]}, ${b[0]} ${b[1]}`; };

export default function AutomationPage() {
  const wires = CONNS.map(([f, t, c]) => ({ d: curve(outPt(NODES[f]), inPt(NODES[t])), end: inPt(NODES[t]), c }));
  const labels = [
    { ...mid(outPt(NODES[1]), inPt(NODES[2])), text: "true", cls: "bg-emerald-500" },
    { ...mid(outPt(NODES[1]), inPt(NODES[4])), text: "false", cls: "bg-slate-400" },
  ];

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
                <div key={it.label} className="flex items-center gap-3 p-[10px_11px] border border-line rounded-[11px] mb-2 cursor-grab text-[13px] font-medium bg-white hover:border-[#D6DCEA] hover:shadow-card">
                  <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: it.ib }}><Icon name={it.icon} size={16} style={{ color: it.icol }} /></span>{it.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* canvas */}
        <div className="flex-1 min-w-0 relative overflow-auto" style={{ backgroundColor: "#FBFCFE", backgroundImage: "radial-gradient(circle, #DCE1EC 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}>
          <div className="relative" style={{ width: 1100, height: 380 }}>
            <svg className="absolute inset-0 overflow-visible pointer-events-none" width="1100" height="380">
              {wires.map((w, i) => (
                <g key={i}><path d={w.d} fill="none" stroke={w.c} strokeWidth="2.5" /><circle cx={w.end[0]} cy={w.end[1]} r="3.5" fill={w.c} /></g>
              ))}
            </svg>
            {labels.map((l, i) => (
              <span key={i} className={`absolute text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-[7px] z-[3] ${l.cls}`} style={{ left: l.x - 16, top: l.y - 11 }}>{l.text}</span>
            ))}
            {NODES.map((n, i) => (
              <div key={i} className="absolute bg-white border border-line rounded-[14px] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_26px_-12px_rgba(16,24,40,0.22)]" style={{ left: n.x, top: n.y, width: n.w }}>
                <div className="flex items-center gap-2.5 p-[11px_12px]">
                  <span className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: n.end ? n.endBg : n.grad }}><Icon name={n.icon} size={16} className="text-white" /></span>
                  <span className="text-[13px] font-semibold flex-1">{n.title}</span>
                  {!n.end && <Icon name="EllipsisVertical" size={14} className="text-ink-3" />}
                </div>
                {!n.end && <div className="flex items-center gap-2 p-[9px_12px_11px] border-t border-line"><Icon name={n.bIcon} size={13} className="text-ink-3" /><span className="text-xs text-ink-2 font-medium">{n.bText}</span></div>}
                {!n.start && <span className="absolute w-[11px] h-[11px] rounded-full bg-white border-2 border-brand top-1/2 -translate-y-1/2 -left-1.5" />}
                {!n.end && <span className="absolute w-[11px] h-[11px] rounded-full bg-white border-2 border-brand top-1/2 -translate-y-1/2 -right-1.5" />}
              </div>
            ))}
          </div>

          {/* zoom controls (decorative) */}
          <div className="absolute left-[18px] bottom-[18px] flex items-center gap-1.5 bg-white border border-slate-200 rounded-[11px] p-1.5 shadow-card z-[8]">
            <span className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Minus" size={16} /></span>
            <span className="text-[12.5px] font-semibold px-1.5 tabular-nums">100%</span>
            <span className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Plus" size={16} /></span>
            <span className="w-px h-5 bg-slate-200" />
            <span className="grid place-items-center w-8 h-8 rounded-lg cursor-pointer text-ink-2 hover:bg-bg"><Icon name="Maximize" size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function mid(a, b) { return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 }; }
