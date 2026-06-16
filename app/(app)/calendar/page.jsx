"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Modal, Field, TextInput, Select, Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const CALS = {
  sprint: { label: "Sprints", color: "#6366F1", ev: "bg-brand-soft text-brand-600", dot: "bg-brand" },
  milestone: { label: "Milestones", color: "#22C55E", ev: "bg-[#E7F8F0] text-emerald-600", dot: "bg-emerald-500" },
  deadline: { label: "Deadlines", color: "#F59E0B", ev: "bg-[#FEF4E5] text-[#B45309]", dot: "bg-amber-500" },
  risk: { label: "At risk", color: "#EF4444", ev: "bg-[#FDECEC] text-[#DC2626]", dot: "bg-red-500" },
  meeting: { label: "Meetings", color: "#8B5CF6", ev: "bg-[#F3EEFE] text-[#7C3AED]", dot: "bg-violet-500" },
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TODAY = "2026-06-13";
const isoOf = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const EVENTS_SEED = {
  "2026-06-01": [{ title: "Sprint 13 review", cal: "meeting", time: "10:00 AM" }],
  "2026-06-02": [{ title: "Event bus GA", cal: "milestone" }],
  "2026-06-05": [{ title: "Design sync", cal: "meeting", time: "11:00 AM" }],
  "2026-06-08": [{ title: "GitHub GA deadline", cal: "deadline" }],
  "2026-06-12": [{ title: "Sprint 14 starts", cal: "sprint" }, { title: "Sprint planning", cal: "meeting", time: "9:00 AM" }],
  "2026-06-14": [{ title: "Standup notes", cal: "meeting", time: "9:30 AM" }],
  "2026-06-15": [{ title: "Mid-sprint check", cal: "sprint", time: "2:00 PM" }],
  "2026-06-17": [{ title: "Auth bug due", cal: "risk" }],
  "2026-06-18": [{ title: "Demo · stakeholders", cal: "meeting", time: "2:00 PM" }, { title: "RBAC review", cal: "sprint", time: "4:00 PM" }, { title: "1:1 Sipho", cal: "meeting", time: "11:00 AM" }],
  "2026-06-20": [{ title: "Comments feature due", cal: "deadline" }],
  "2026-06-22": [{ title: "Retro prep", cal: "meeting", time: "3:00 PM" }],
  "2026-06-24": [{ title: "v2.1 Beta cutover", cal: "milestone" }, { title: "Mobile launch", cal: "risk" }],
  "2026-06-25": [{ title: "Sprint 14 ends", cal: "sprint" }],
  "2026-06-26": [{ title: "Sprint 15 starts", cal: "sprint" }],
  "2026-06-28": [{ title: "Security audit", cal: "deadline", time: "1:00 PM" }],
  "2026-06-30": [{ title: "RBAC scopes due", cal: "deadline" }],
};
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonth(y, m) {
  const first = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const prevDim = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ y: m === 0 ? y - 1 : y, m: (m + 11) % 12, d: prevDim - i, out: true });
  for (let d = 1; d <= dim; d++) cells.push({ y, m, d, out: false });
  let nx = 1;
  while (cells.length < 42) cells.push({ y: m === 11 ? y + 1 : y, m: (m + 1) % 12, d: nx++, out: true });
  return cells.slice(0, 42);
}

const BLANK = { title: "", date: TODAY, cal: "meeting", time: "" };
const fmtLong = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export default function CalendarPage() {
  const [cur, setCur] = useState({ y: 2026, m: 5 });
  const [sel, setSel] = useState(TODAY);
  const [hidden, setHidden] = useState(new Set());
  const [events, setEvents] = useState(EVENTS_SEED);
  const [view, setView] = useState("Month");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);

  const evAt = (id) => (events[id] || []).filter((e) => !hidden.has(e.cal));
  const step = (dir) => setCur((c) => { const d = new Date(c.y, c.m + dir, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const today = () => { setCur({ y: 2026, m: 5 }); setSel(TODAY); };
  const toggleCal = (k) => setHidden((h) => { const n = new Set(h); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const create = () => {
    if (!form.title.trim() || !form.date) return;
    setEvents((ev) => ({ ...ev, [form.date]: [...(ev[form.date] || []), { title: form.title.trim(), cal: form.cal, ...(form.time.trim() ? { time: form.time.trim() } : {}) }] }));
    setSel(form.date);
    setForm(BLANK);
    setOpen(false);
  };
  const openNew = () => { setForm({ ...BLANK, date: sel }); setOpen(true); };

  const cells = buildMonth(cur.y, cur.m);
  const upcoming = Object.keys(events).sort().filter((d) => d >= TODAY).flatMap((d) => evAt(d).map((e) => ({ date: d, ...e }))).slice(0, 5);

  // week containing the selected day (Sun–Sat)
  const selDate = new Date(sel + "T00:00:00");
  const weekDays = [...Array(7)].map((_, i) => { const d = new Date(selDate); d.setDate(selDate.getDate() - selDate.getDay() + i); return isoOf(d.getFullYear(), d.getMonth(), d.getDate()); });

  const AgendaRow = ({ e }) => (
    <div className="flex gap-3 py-2.5 border-b border-line last:border-b-0">
      <div className="w-[3px] rounded-[2px] flex-none" style={{ background: CALS[e.cal].color }} />
      <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold">{e.title}</b><span className="text-[11.5px] text-ink-3">{e.time ? e.time + " · " : ""}{CALS[e.cal].label}</span></div>
    </div>
  );

  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Calendar" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Calendar</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Sprints, milestones, deadlines and meetings in one view.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={today} className="h-[34px] px-3.5 rounded-[9px] border border-line bg-card text-[12.5px] font-semibold text-ink-2 shadow-card hover:text-brand-600">Today</button>
          <div className="flex items-center gap-1.5">
            <button onClick={() => step(-1)} className="grid place-items-center w-[34px] h-[34px] rounded-[9px] border border-line bg-card shadow-card"><Icon name="ChevronLeft" size={16} className="text-ink-2" /></button>
            <span className="text-[15px] font-semibold min-w-[150px] text-center">{MONTHS[cur.m]} {cur.y}</span>
            <button onClick={() => step(1)} className="grid place-items-center w-[34px] h-[34px] rounded-[9px] border border-line bg-card shadow-card"><Icon name="ChevronRight" size={16} className="text-ink-2" /></button>
          </div>
          <div className="flex bg-card border border-line rounded-[10px] p-[3px] shadow-card">
            {["Day", "Week", "Month"].map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn("px-3.5 py-[7px] rounded-[7px] text-[12.5px] font-medium cursor-pointer", v === view ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2")}>{v}</button>
            ))}
          </div>
          <button onClick={openNew} className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />New Event</button>
        </div>
      </div>

      <div className="flex gap-4 items-start flex-col xl:flex-row">
        {/* month grid */}
        {view === "Month" && (
        <div className="flex-1 min-w-0 w-full card !shadow-card overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-line">
            {DOW.map((d) => <div key={d} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr" style={{ minHeight: 540 }}>
            {cells.map((c, i) => {
              const id = isoOf(c.y, c.m, c.d);
              const evs = evAt(id);
              const shown = evs.slice(0, 3);
              const extra = evs.length - shown.length;
              return (
                <div key={i} onClick={() => setSel(id)} onDoubleClick={() => { setForm({ ...BLANK, date: id }); setOpen(true); }} className={cn("border-r border-b border-line p-2 flex flex-col gap-1 overflow-hidden cursor-pointer transition-colors hover:bg-bg-soft [&:nth-child(7n)]:border-r-0", c.out && "bg-bg-soft", id === sel && "shadow-[inset_0_0_0_2px_var(--color-brand)]")}>
                  <span className={cn("grid place-items-center w-6 h-6 rounded-full text-[12.5px] font-semibold flex-none", id === TODAY ? "bg-brand text-white" : c.out ? "text-ink-3 font-medium" : "text-ink-2")}>{c.d}</span>
                  {shown.map((e, j) => (
                    <span key={j} className={cn("flex items-center gap-1.5 text-[11px] font-semibold px-1.5 py-[3px] rounded-md truncate", CALS[e.cal].ev)}>
                      <span className={cn("w-[5px] h-[5px] rounded-full flex-none", CALS[e.cal].dot)} />{e.title}
                    </span>
                  ))}
                  {extra > 0 && <span className="text-[10.5px] text-ink-3 font-semibold pl-1.5">+{extra} more</span>}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* day agenda */}
        {view === "Day" && (
        <div className="flex-1 min-w-0 w-full card !shadow-card p-[18px_20px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0 text-[15px] font-semibold">{fmtLong(sel)}{sel === TODAY && <span className="ml-2 text-[11px] font-semibold text-brand bg-brand-soft rounded-full px-2 py-0.5">Today</span>}</h3>
            <button onClick={openNew} className="text-[12.5px] font-medium text-brand">+ Add</button>
          </div>
          {evAt(sel).length === 0 ? <div className="text-[13px] text-ink-3 py-10 text-center">No events on this day.</div> : evAt(sel).map((e, i) => <AgendaRow key={i} e={e} />)}
        </div>
        )}

        {/* week agenda */}
        {view === "Week" && (
        <div className="flex-1 min-w-0 w-full card !shadow-card p-[18px_20px]">
          <h3 className="m-0 mb-3 text-[15px] font-semibold">Week of {new Date(weekDays[0] + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}</h3>
          <div className="flex flex-col gap-4">
            {weekDays.map((id) => {
              const evs = evAt(id);
              const dt = new Date(id + "T00:00:00");
              return (
                <div key={id}>
                  <button onClick={() => setSel(id)} className={cn("flex items-center gap-2 text-[12.5px] font-semibold mb-1.5", id === TODAY ? "text-brand" : id === sel ? "text-brand-600" : "text-ink-2")}>
                    {dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}{id === TODAY && <span className="text-[10px] bg-brand-soft text-brand rounded-full px-1.5 py-0.5">Today</span>}
                  </button>
                  {evs.length === 0 ? <div className="text-[12px] text-ink-3 pl-1">—</div> : <div className="border border-line rounded-[11px] divide-y divide-line">{evs.map((e, i) => <div key={i} className="px-3"><AgendaRow e={e} /></div>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* rail */}
        <div className="w-full xl:w-[300px] flex-none flex flex-col gap-4">
          <div className="card !shadow-card p-[16px_18px]">
            <h3 className="m-0 mb-3 text-sm font-semibold">{MONTHS[cur.m]} {cur.y}</h3>
            <div className="grid grid-cols-7 gap-0.5">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-[10px] font-semibold text-ink-3 text-center py-1">{d}</div>)}
              {cells.map((c, i) => {
                const id = isoOf(c.y, c.m, c.d);
                const has = (EVENTS[id] || []).length > 0;
                return (
                  <button key={i} onClick={() => setSel(id)} className={cn("relative text-xs text-center py-1.5 rounded-[7px]", c.out && "text-ink-3 opacity-50", id === TODAY ? "bg-brand text-white font-semibold" : id === sel ? "shadow-[inset_0_0_0_1.5px_var(--color-brand)] text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                    {c.d}
                    {has && <span className={cn("absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", id === TODAY ? "bg-card" : "bg-brand")} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card !shadow-card p-[16px_18px]">
            <h3 className="m-0 mb-3 text-sm font-semibold">Upcoming</h3>
            {upcoming.length === 0 ? <div className="text-[12.5px] text-ink-3 py-2.5 text-center">No upcoming events</div> : upcoming.map((e, i) => {
              const dt = new Date(e.date + "T00:00:00");
              return (
                <div key={i} className="flex gap-3 py-2.5 border-b border-line last:border-b-0 cursor-pointer hover:opacity-80">
                  <div className="w-[42px] flex-none text-center"><div className="text-[17px] font-bold leading-none">{dt.getDate()}</div><div className="text-[10px] text-ink-3 uppercase mt-0.5">{dt.toLocaleDateString("en-US", { month: "short" })}</div></div>
                  <div className="w-[3px] rounded-[2px] flex-none" style={{ background: CALS[e.cal].color }} />
                  <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold truncate">{e.title}</b><span className="text-[11.5px] text-ink-3">{e.time ? e.time + " · " : ""}{CALS[e.cal].label}</span></div>
                </div>
              );
            })}
          </div>

          <div className="card !shadow-card p-[16px_18px]">
            <h3 className="m-0 mb-3 text-sm font-semibold">Calendars</h3>
            <div className="flex flex-col gap-1">
              {Object.keys(CALS).map((k) => {
                const off = hidden.has(k);
                return (
                  <button key={k} onClick={() => toggleCal(k)} className={cn("flex items-center gap-2.5 text-[12.5px] text-ink-2 px-1.5 py-[5px] rounded-lg hover:bg-bg select-none", off && "opacity-45")}>
                    <span className="w-[9px] h-[9px] rounded-full flex-none" style={{ background: CALS[k].color }} />{CALS[k].label}
                    <Icon name="Check" size={15} className={cn("ml-auto text-ink-3", off && "opacity-0")} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New event"
        footer={<>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={create} disabled={!form.title.trim() || !form.date}>Add event</Button>
        </>}>
        <Field label="Title"><TextInput value={form.title} onChange={setF("title")} placeholder="e.g. Sprint review" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><TextInput type="date" value={form.date} onChange={setF("date")} /></Field>
          <Field label="Time (optional)"><TextInput value={form.time} onChange={setF("time")} placeholder="e.g. 10:00 AM" /></Field>
        </div>
        <Field label="Calendar">
          <Select value={form.cal} onChange={setF("cal")}>{Object.keys(CALS).map((k) => <option key={k} value={k}>{CALS[k].label}</option>)}</Select>
        </Field>
      </Modal>
    </>
  );
}
