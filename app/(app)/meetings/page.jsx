"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import { Modal, Field, TextInput, Select, Textarea, Button, Avatar, Pill } from "@/components/ui";
import { cn } from "@/lib/cn";

// Demo roster — mirrors the contributors directory. Each carries an email so the
// (simulated) invite send has a real-looking recipient list.
const PAL = ["#6366F1", "#0EA5E9", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444"];
const PEOPLE = [
  { id: "tr", name: "TR Mokwena", email: "tr.mokwena@eclipsesoftworks.dev", role: "Lead Engineer", color: PAL[0] },
  { id: "thabo", name: "Thabo Nkosi", email: "thabo.nkosi@eclipsesoftworks.dev", role: "Backend", color: PAL[1] },
  { id: "sipho", name: "Sipho Dlamini", email: "sipho.dlamini@eclipsesoftworks.dev", role: "Frontend", color: PAL[2] },
  { id: "priya", name: "Priya Singh", email: "priya.singh@eclipsesoftworks.dev", role: "Design", color: PAL[3] },
  { id: "naledi", name: "Naledi Kgasana", email: "naledi.kgasana@eclipsesoftworks.dev", role: "Product", color: PAL[4] },
  { id: "lerato", name: "Lerato Mthembu", email: "lerato.mthembu@eclipsesoftworks.dev", role: "QA", color: PAL[5] },
];
const byId = (id) => PEOPLE.find((p) => p.id === id);

const DURATIONS = ["15 min", "30 min", "45 min", "1 hour", "1.5 hours"];
const TODAY = "2026-06-25";
const HOST = "TR Mokwena";

const roomLink = (slug) => `apex.meet/${slug}`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24) || "room";

// `live` = a meeting happening right now (drives the join banner).
const SEED = [
  {
    id: "m1", title: "Sprint 14 — Mid-sprint sync", date: "2026-06-25", time: "14:00", duration: "30 min",
    host: HOST, participants: ["thabo", "sipho", "priya", "naledi"], agenda: "Blockers, RBAC progress, beta cutover plan.",
    slug: "sprint14-sync", invitesSent: true, live: true,
  },
  {
    id: "m2", title: "Design review — Conference Room", date: "2026-06-26", time: "11:00", duration: "45 min",
    host: HOST, participants: ["priya", "naledi", "sipho"], agenda: "Walk through the new scheduling flow + invite emails.",
    slug: "design-review", invitesSent: true, live: false,
  },
  {
    id: "m3", title: "Stakeholder demo", date: "2026-06-28", time: "15:00", duration: "1 hour",
    host: HOST, participants: ["thabo", "sipho", "priya", "naledi", "lerato"], agenda: "v2.1 Beta walkthrough for stakeholders.",
    slug: "stakeholder-demo", invitesSent: true, live: false,
  },
];

// Leave-of-absence notes, keyed by meeting id. For the live meeting each note
// carries a `delayMs` (compressed demo stand-in for the real 2–5 min mark at
// which it pops up) and `minuteMark` for the human-readable caption.
const SEED_ABSENCES = {
  m1: [
    { id: "a-seed1", personId: "naledi", note: "Down with the flu — I'll catch the recording. Doctor's note attached.", doc: "sick-note.pdf", minuteMark: 3, delayMs: 3500 },
    { id: "a-seed2", personId: "thabo", note: "Pulled into a prod incident, can't make the sync today.", doc: null, minuteMark: 4, delayMs: 6500 },
  ],
};

const fmtDay = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
};

const BLANK = { title: "", date: TODAY, time: "10:00", duration: "30 min", participants: [], agenda: "" };
const ABS_BLANK = { meetingId: "", personId: "", note: "", doc: null };

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(SEED);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [toast, setToast] = useState(null); // { kind, ... }
  const [lastInvite, setLastInvite] = useState(null); // email-preview payload
  const [absences, setAbsences] = useState(SEED_ABSENCES); // { [meetingId]: [note] }
  const [absOpen, setAbsOpen] = useState(false);
  const [absForm, setAbsForm] = useState(ABS_BLANK);
  const [liveNotices, setLiveNotices] = useState([]); // absence notes popped during the live meeting

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  // Seeded absences for the live meeting surface a few seconds in — a compressed
  // stand-in for the real "2–5 minutes into the meeting" popup.
  useEffect(() => {
    const liveMeeting = SEED.find((m) => m.live);
    if (!liveMeeting) return;
    const timers = (SEED_ABSENCES[liveMeeting.id] || []).map((a) =>
      setTimeout(() => setLiveNotices((n) => (n.some((x) => x.id === a.id) ? n : [...n, { ...a, person: byId(a.personId) }])), a.delayMs),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleP = (id) =>
    setForm((f) => ({ ...f, participants: f.participants.includes(id) ? f.participants.filter((x) => x !== id) : [...f.participants, id] }));

  const valid = form.title.trim() && form.date && form.time && form.participants.length > 0;

  const openNew = () => { setForm(BLANK); setOpen(true); };

  const schedule = () => {
    if (!valid) return;
    const recipients = form.participants.map(byId);
    const slug = slugify(form.title);
    const meeting = {
      id: `m${Date.now()}`, title: form.title.trim(), date: form.date, time: form.time, duration: form.duration,
      host: HOST, participants: [...form.participants], agenda: form.agenda.trim(), slug, invitesSent: true, live: false,
    };
    setMeetings((m) => [...m, meeting].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
    // Simulated email dispatch — no real mail leaves the app (UI demo).
    setLastInvite({ meeting, recipients, sentAt: new Date() });
    setToast({ kind: "invite", count: recipients.length, names: recipients.map((r) => r.name.split(" ")[0]) });
    setOpen(false);
    setForm(BLANK);
  };

  const setAbsF = (k) => (e) => setAbsForm((f) => ({ ...f, [k]: e.target.value }));
  const openAbsence = (meetingId = "") => { setAbsForm({ ...ABS_BLANK, meetingId }); setAbsOpen(true); };
  const absValid = absForm.meetingId && absForm.personId && absForm.note.trim();
  const dismissNotice = (id) => setLiveNotices((n) => n.filter((x) => x.id !== id));

  const submitAbsence = () => {
    if (!absValid) return;
    const entry = { id: `a${Date.now()}`, personId: absForm.personId, note: absForm.note.trim(), doc: absForm.doc, minuteMark: 3 };
    setAbsences((prev) => ({ ...prev, [absForm.meetingId]: [...(prev[absForm.meetingId] || []), entry] }));
    const liveMeeting = meetings.find((m) => m.live);
    const person = byId(absForm.personId);
    if (liveMeeting && absForm.meetingId === liveMeeting.id) {
      // Surface 2–5 min in (compressed to a few seconds for the demo).
      const delay = 4000 + Math.random() * 2000;
      setTimeout(() => setLiveNotices((n) => [...n, { ...entry, person }]), delay);
      setToast({ kind: "absence", title: "Absence note saved", text: "Participants are notified 2–5 min into the meeting." });
    } else {
      setToast({ kind: "absence", title: `${person.name.split(" ")[0]} marked absent`, text: "All participants have been notified." });
    }
    setAbsOpen(false);
    setAbsForm(ABS_BLANK);
  };

  const absOf = (meetingId) => (absences[meetingId] || []);

  const live = meetings.find((m) => m.live);
  const upcoming = meetings.filter((m) => !m.live).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      {/* header */}
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Video" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Conference Room</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Host meetings and auto-invite participants by email when you set a time.</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={() => openAbsence()} className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-[10px] border border-line bg-card text-[13px] font-semibold text-ink-2 shadow-card hover:text-amber-600 hover:border-amber-200">
            <Icon name="UserMinus" size={15} />Notify absence
          </button>
          <button onClick={openNew} className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}>
            <Icon name="CalendarPlus" size={15} />Schedule meeting
          </button>
        </div>
      </div>

      {/* live room banner */}
      {live && (
        <div className="card !shadow-card mb-4 p-0 overflow-hidden">
          <div className="p-[20px_22px] flex items-center justify-between gap-6 flex-wrap" style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)" }}>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-red-500 rounded-full px-2.5 py-[3px] mb-2">
                <span className="w-[6px] h-[6px] rounded-full bg-white animate-pulse" />LIVE NOW
              </span>
              <h2 className="m-0 text-[18px] font-bold text-white truncate">{live.title}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-[12.5px] text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Icon name="Clock" size={14} />{fmt12(live.time)} · {live.duration}</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="Link2" size={14} />{roomLink(live.slug)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex -space-x-2.5 justify-end">
                  {live.participants.slice(0, 5).map((id) => {
                    const p = byId(id);
                    const absent = absOf(live.id).some((a) => a.personId === id);
                    return <Avatar key={id} name={p.name} color={p.color} size={34} className={cn("ring-2 ring-[#0F172A]", absent && "opacity-40 grayscale")} />;
                  })}
                </div>
                {absOf(live.id).length > 0 && <div className="text-[11px] text-amber-300 mt-1 inline-flex items-center gap-1"><Icon name="UserMinus" size={12} />{absOf(live.id).length} away</div>}
              </div>
              <button className="flex items-center gap-2 h-[40px] px-5 rounded-[11px] bg-white text-[13px] font-bold text-slate-900 hover:bg-slate-100">
                <Icon name="Video" size={16} />Join now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start flex-col xl:flex-row">
        {/* upcoming meetings */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-[15px] font-semibold">Upcoming meetings</h3>
            <span className="text-[12px] text-ink-3">{upcoming.length} scheduled</span>
          </div>

          {upcoming.length === 0 ? (
            <div className="card !shadow-card text-[13px] text-ink-3 py-12 text-center">No meetings scheduled yet.</div>
          ) : (
            upcoming.map((m) => {
              const ppl = m.participants.map(byId);
              const away = absOf(m.id);
              return (
                <div key={m.id} className="card !shadow-card p-[16px_18px] flex items-start gap-4 flex-wrap">
                  <div className="w-[52px] flex-none text-center">
                    <div className="text-[10px] text-ink-3 uppercase font-semibold">{new Date(m.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</div>
                    <div className="text-[22px] font-bold leading-none">{new Date(m.date + "T00:00:00").getDate()}</div>
                    <div className="text-[10.5px] text-ink-3 mt-0.5">{new Date(m.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}</div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <b className="text-[14.5px] font-semibold">{m.title}</b>
                      {m.invitesSent && (
                        <Pill tone="green"><Icon name="MailCheck" size={11} className="mr-1" />Invites sent</Pill>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[12px] text-ink-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5"><Icon name="Clock" size={13} />{fmt12(m.time)} · {m.duration}</span>
                      <span className="inline-flex items-center gap-1.5"><Icon name="Link2" size={13} />{roomLink(m.slug)}</span>
                    </div>
                    {m.agenda && <div className="text-[12.5px] text-ink-2 mt-2 line-clamp-1">{m.agenda}</div>}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <div className="flex -space-x-2">
                        {ppl.slice(0, 5).map((p) => {
                          const absent = away.some((a) => a.personId === p.id);
                          return <Avatar key={p.id} name={p.name} color={p.color} size={26} className={cn("ring-2 ring-card", absent && "opacity-40 grayscale")} />;
                        })}
                      </div>
                      <span className="text-[11.5px] text-ink-3">{ppl.length} participant{ppl.length !== 1 ? "s" : ""}</span>
                      {away.length > 0 && <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-amber-600"><Icon name="UserMinus" size={12} />{away.length} away</span>}
                      <button onClick={() => openAbsence(m.id)} className="text-[11.5px] font-semibold text-ink-3 hover:text-amber-600">Can&apos;t make it?</button>
                    </div>
                  </div>
                  <button className="flex-none flex items-center gap-1.5 h-9 px-4 rounded-[10px] border border-line bg-card text-[12.5px] font-semibold text-brand-600 shadow-card hover:border-[#C7D2FE]">
                    <Icon name="Video" size={15} />Join
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* rail */}
        <div className="w-full xl:w-[320px] flex-none flex flex-col gap-4">
          {/* last invite preview */}
          {lastInvite ? (
            <div className="card !shadow-card p-[16px_18px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-emerald-50"><Icon name="Mail" size={15} className="text-emerald-600" /></span>
                <h3 className="m-0 text-sm font-semibold">Invite email sent</h3>
              </div>
              <div className="border border-line rounded-[11px] overflow-hidden text-[12px]">
                <div className="px-3.5 py-2.5 bg-bg-soft border-b border-line">
                  <div className="text-ink-3">Subject</div>
                  <div className="font-semibold text-ink">Invitation: {lastInvite.meeting.title}</div>
                </div>
                <div className="px-3.5 py-3 flex flex-col gap-2 text-ink-2">
                  <div><span className="text-ink-3">When · </span>{fmtDay(lastInvite.meeting.date)}, {fmt12(lastInvite.meeting.time)} ({lastInvite.meeting.duration})</div>
                  <div><span className="text-ink-3">Where · </span><span className="text-brand-600">{roomLink(lastInvite.meeting.slug)}</span></div>
                  <div>
                    <span className="text-ink-3">To · </span>{lastInvite.recipients.length} participant{lastInvite.recipients.length !== 1 ? "s" : ""}
                    <div className="flex flex-col gap-0.5 mt-1">
                      {lastInvite.recipients.map((r) => <span key={r.id} className="text-ink font-mono text-[11px]">{r.email}</span>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-ink-3 mt-2 flex items-center gap-1.5">
                <Icon name="Info" size={12} />Demo only — no real email is sent.
              </div>
            </div>
          ) : (
            <div className="card !shadow-card p-[18px] text-center">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-soft mx-auto mb-2.5"><Icon name="MailPlus" size={19} className="text-brand" /></span>
              <h3 className="m-0 text-sm font-semibold">Auto invites</h3>
              <p className="text-[12.5px] text-ink-2 mt-1 mb-0">Set a date &amp; time and Apex emails every participant the room link automatically.</p>
            </div>
          )}

          {/* roster */}
          <div className="card !shadow-card p-[16px_18px]">
            <h3 className="m-0 mb-3 text-sm font-semibold">Team</h3>
            <div className="flex flex-col gap-2.5">
              {PEOPLE.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <Avatar name={p.name} color={p.color} size={30} />
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] text-ink-3 truncate">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* schedule modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Schedule meeting" width={520}
        footer={<>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" icon={<Icon name="Send" size={14} />} onClick={schedule} disabled={!valid}>Schedule &amp; send invites</Button>
        </>}>
        <Field label="Title"><TextInput value={form.title} onChange={setF("title")} placeholder="e.g. Sprint 15 planning" autoFocus /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date"><TextInput type="date" value={form.date} onChange={setF("date")} /></Field>
          <Field label="Time"><TextInput type="time" value={form.time} onChange={setF("time")} /></Field>
          <Field label="Duration"><Select value={form.duration} onChange={setF("duration")}>{DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
        </div>
        <Field label={`Participants (${form.participants.length} selected)`}>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {PEOPLE.map((p) => {
              const on = form.participants.includes(p.id);
              return (
                <button key={p.id} type="button" onClick={() => toggleP(p.id)}
                  className={cn("inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border text-[12px] font-medium transition-colors",
                    on ? "border-brand bg-brand-soft text-brand-600" : "border-line bg-card text-ink-2 hover:border-[#C7D2FE]")}>
                  <Avatar name={p.name} color={p.color} size={20} />
                  {p.name.split(" ")[0]}
                  {on && <Icon name="Check" size={13} className="text-brand" />}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Agenda (optional)"><Textarea value={form.agenda} onChange={setF("agenda")} rows={3} placeholder="What will you cover?" /></Field>
        <div className="flex items-start gap-2 text-[12px] text-ink-2 bg-bg-soft border border-line rounded-[10px] px-3 py-2.5">
          <Icon name="Mail" size={15} className="text-brand mt-0.5 flex-none" />
          <span>On schedule, an invite with the room link is emailed to all {form.participants.length || "selected"} participant{form.participants.length === 1 ? "" : "s"}.</span>
        </div>
      </Modal>

      {/* notify-absence modal */}
      <Modal open={absOpen} onClose={() => setAbsOpen(false)} title="Notify absence" width={480}
        footer={<>
          <Button onClick={() => setAbsOpen(false)}>Cancel</Button>
          <Button variant="primary" icon={<Icon name="Send" size={14} />} onClick={submitAbsence} disabled={!absValid}>Send note</Button>
        </>}>
        <Field label="Meeting">
          <Select value={absForm.meetingId} onChange={setAbsF("meetingId")}>
            <option value="">Select a meeting…</option>
            {meetings.map((m) => <option key={m.id} value={m.id}>{m.title} — {fmtDay(m.date)}{m.live ? " (live now)" : ""}</option>)}
          </Select>
        </Field>
        <Field label="Who won't make it?">
          <Select value={absForm.personId} onChange={setAbsF("personId")}>
            <option value="">Select a person…</option>
            {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Reason / note"><Textarea value={absForm.note} onChange={setAbsF("note")} rows={3} placeholder="Let everyone know why you can't attend" autoFocus /></Field>
        <Field label="Supporting document (optional)">
          <div className="flex items-center gap-2.5 flex-wrap">
            <label className="inline-flex items-center gap-2 h-10 px-3.5 rounded-[10px] border border-dashed border-line bg-bg-soft text-[12.5px] font-medium text-ink-2 cursor-pointer hover:border-brand hover:text-brand-600">
              <Icon name="Paperclip" size={15} />{absForm.doc ? "Replace file" : "Attach file"}
              <input type="file" className="hidden" onChange={(e) => setAbsForm((f) => ({ ...f, doc: e.target.files?.[0]?.name || null }))} />
            </label>
            {absForm.doc && (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-ink bg-bg-soft border border-line rounded-[8px] px-2.5 py-1.5">
                <Icon name="FileText" size={14} className="text-brand" />{absForm.doc}
                <button type="button" onClick={() => setAbsForm((f) => ({ ...f, doc: null }))} className="text-ink-3 hover:text-ink"><Icon name="X" size={13} /></button>
              </span>
            )}
          </div>
        </Field>
        <div className="flex items-start gap-2 text-[12px] text-ink-2 bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2.5">
          <Icon name="BellRing" size={15} className="text-amber-600 mt-0.5 flex-none" />
          <span>This note pops up <b>2–5 minutes into the meeting</b> so everyone in the room is notified of the absence.</span>
        </div>
      </Modal>

      {/* live-meeting absence popups — surface "during" the meeting */}
      {liveNotices.length > 0 && (
        <div className="fixed bottom-6 left-6 z-[90] flex flex-col gap-2.5 w-[330px] max-w-[calc(100vw-3rem)]">
          {liveNotices.map((a) => (
            <div key={a.id} className="bg-card border border-line rounded-[12px] shadow-pop p-3.5 animate-[fadeIn_.2s_ease]">
              <div className="flex items-start gap-3">
                <Avatar name={a.person.name} color={a.person.color} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <b className="text-[13px] font-semibold truncate">{a.person.name}</b>
                    <Pill tone="amber">Absent</Pill>
                  </div>
                  <div className="text-[10.5px] text-ink-3 mt-0.5 inline-flex items-center gap-1"><Icon name="Clock" size={11} />Shown {a.minuteMark} min into the meeting</div>
                  <p className="text-[12.5px] text-ink-2 mt-1.5 mb-0">{a.note}</p>
                  {a.doc && (
                    <button className="inline-flex items-center gap-1.5 mt-2 text-[11.5px] font-semibold text-brand-600 hover:underline">
                      <Icon name="Paperclip" size={12} />{a.doc}
                    </button>
                  )}
                </div>
                <button onClick={() => dismissNotice(a.id)} className="text-ink-3 hover:text-ink flex-none"><Icon name="X" size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 bg-card border border-line rounded-[12px] shadow-pop px-4 py-3 max-w-[340px] animate-[fadeIn_.18s_ease]">
          {toast.kind === "absence" ? (
            <>
              <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-amber-50 flex-none"><Icon name="BellRing" size={18} className="text-amber-600" /></span>
              <div>
                <div className="text-[13px] font-semibold">{toast.title}</div>
                <div className="text-[11.5px] text-ink-3">{toast.text}</div>
              </div>
            </>
          ) : (
            <>
              <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-emerald-50 flex-none"><Icon name="MailCheck" size={18} className="text-emerald-600" /></span>
              <div>
                <div className="text-[13px] font-semibold">Invites sent to {toast.count} participant{toast.count !== 1 ? "s" : ""}</div>
                <div className="text-[11.5px] text-ink-3 truncate">{toast.names.join(", ")}</div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
