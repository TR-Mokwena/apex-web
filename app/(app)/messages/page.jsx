"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const ME = { av: "TM", pi: 0 };

const INITIAL = [
  { id: "c1", type: "channel", name: "apex-v2-1", pv: "Sipho: Pushed the auth fix 🎉", tm: "2m", unread: 3, meta: "8 members · 5 online", msgs: [
    { day: "Today" },
    { who: "Naledi Kgosana", av: "NK", pi: 2, t: "Morning all — kicking off the v2.1 beta cutover checklist today.", tm: "9:02 AM" },
    { who: "Naledi Kgosana", av: "NK", pi: 2, t: "Can someone confirm the event-bus migration is fully done?", tm: "9:02 AM", cont: true },
    { who: "Sipho Dlamini", av: "SD", pi: 1, t: "Yep, merged Friday. All consumers switched over.", tm: "9:05 AM" },
    { me: true, t: "Nice. I'll update the milestone to 100%.", tm: "9:07 AM" },
    { who: "Sipho Dlamini", av: "SD", pi: 1, t: "Also pushed the auth fix — #4821 is in.", tm: "9:14 AM" },
    { who: "Sipho Dlamini", av: "SD", pi: 1, attach: { name: "auth-fix-summary.pdf", meta: "PDF · 142 KB" }, tm: "9:14 AM", cont: true },
    { me: true, t: "Perfect, reviewing now 👀", tm: "9:15 AM" },
    { typing: "Priya is typing" },
  ] },
  { id: "c2", type: "channel", name: "design-system", pv: "Priya: new tokens are live", tm: "25m", unread: 0, meta: "6 members · 3 online", msgs: [
    { day: "Today" }, { who: "Priya Singh", av: "PS", pi: 4, t: "New color + spacing tokens are live in the kit.", tm: "8:40 AM" }, { me: true, t: "Amazing, thank you!", tm: "8:44 AM" },
  ] },
  { id: "c3", type: "channel", name: "incidents", pv: "You: resolved — gateway healthy", tm: "1h", unread: 0, meta: "12 members · 7 online", msgs: [
    { day: "Today" }, { who: "Apex AI", av: "AI", pi: 0, t: "⚠️ Elevated error rate on gateway-service.", tm: "7:10 AM" }, { me: true, t: "On it. Rolling back the last deploy.", tm: "7:12 AM" }, { me: true, t: "Resolved — gateway healthy ✅", tm: "7:31 AM" },
  ] },
  { id: "d1", type: "dm", name: "Sipho Dlamini", av: "SD", pi: 1, pres: "on", pv: "Sounds good, ship it", tm: "4m", unread: 1, meta: "Engineering Lead · online", msgs: [
    { day: "Today" }, { who: "Sipho Dlamini", av: "SD", pi: 1, t: "Can we pair on the RBAC scopes after standup?", tm: "9:20 AM" }, { me: true, t: "Yes — 11am work for you?", tm: "9:21 AM" }, { who: "Sipho Dlamini", av: "SD", pi: 1, t: "Sounds good, ship it 🚀", tm: "9:22 AM" },
  ] },
  { id: "d2", type: "dm", name: "Priya Singh", av: "PS", pi: 4, pres: "on", pv: "I'll send the Figma link", tm: "18m", unread: 0, meta: "Design Lead · online", msgs: [
    { day: "Today" }, { who: "Priya Singh", av: "PS", pi: 4, t: "Onboarding illustrations are ready for review.", tm: "8:50 AM" }, { me: true, t: "Great, drop the link when you can.", tm: "8:51 AM" }, { who: "Priya Singh", av: "PS", pi: 4, t: "I'll send the Figma link 👍", tm: "8:52 AM" },
  ] },
  { id: "d3", type: "dm", name: "Thabo Nkosi", av: "TN", pi: 3, pres: "away", pv: "thanks for the review", tm: "2h", unread: 0, meta: "QA Lead · away", msgs: [
    { day: "Today" }, { who: "Thabo Nkosi", av: "TN", pi: 3, t: "Thanks for the review on the search PR.", tm: "7:30 AM" }, { me: true, t: "Anytime!", tm: "7:33 AM" },
  ] },
];

const PRES = { on: "bg-emerald-500", away: "bg-amber-500", off: "bg-ink-3" };

function ConvAvatar({ c, size = 38 }) {
  if (c.type === "channel") return <span className="grid place-items-center rounded-[11px] bg-brand-soft text-brand-600 flex-none" style={{ width: size, height: size }}><Icon name="Hash" size={18} /></span>;
  return (
    <span className="relative grid place-items-center rounded-full text-white text-[13px] font-semibold flex-none" style={{ width: size, height: size, background: PAL[c.pi] }}>
      {c.av}{c.pres && <span className={cn("absolute -right-px -bottom-px w-[11px] h-[11px] rounded-full border-2 border-white", PRES[c.pres])} />}
    </span>
  );
}

export default function MessagesPage() {
  const [convos, setConvos] = useState(INITIAL);
  const [active, setActive] = useState("c1");
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState("All");
  const msgsRef = useRef(null);
  const c = convos.find((x) => x.id === active);

  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, [active, convos]);

  const select = (id) => {
    setActive(id);
    setConvos((cs) => cs.map((x) => (x.id === id ? { ...x, unread: 0 } : x)));
  };
  const send = () => {
    const v = draft.trim();
    if (!v) return;
    setConvos((cs) => cs.map((x) => {
      if (x.id !== active) return x;
      const msgs = x.msgs.filter((m) => !m.typing).concat({ me: true, t: v, tm: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) });
      return { ...x, msgs, pv: "You: " + v.slice(0, 28) };
    }));
    setDraft("");
  };

  const channels = convos.filter((x) => x.type === "channel");
  const dms = convos.filter((x) => x.type === "dm");

  return (
    <div className="flex flex-col h-[calc(100vh-114px)]">
      <div className="flex items-center justify-between mb-3.5 flex-none">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="MessageSquare" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[22px] font-bold tracking-[-0.02em]">Messages</h1>
            <div className="text-[12.5px] text-ink-2 mt-0.5">Team channels and direct messages.</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="grid place-items-center w-[38px] h-[38px] rounded-[10px] bg-white border border-slate-200 shadow-card"><Icon name="PenLine" size={17} className="text-ink-2" /></button>
          <button className="grid place-items-center w-[38px] h-[38px] rounded-[10px] bg-white border border-slate-200 shadow-card"><Icon name="SlidersHorizontal" size={17} className="text-ink-2" /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex bg-white border border-line rounded-card shadow-card overflow-hidden">
        {/* conversation list */}
        <div className="w-[288px] flex-none border-r border-line flex-col min-h-0 hidden sm:flex">
          <div className="p-[14px_14px_10px]"><div className="flex items-center gap-2 bg-bg border border-slate-200 rounded-[10px] px-[11px] py-2"><Icon name="Search" size={15} className="text-ink-3" /><input placeholder="Search messages..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" /></div></div>
          <div className="flex gap-1 px-3.5 pb-2">
            {["All", "Unread", "Channels", "DMs"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("text-xs font-medium px-3 py-1.5 rounded-lg", tab === t ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2")}>{t}</button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2.5">
            {[["Channels", channels], ["Direct messages", dms]].map(([label, list]) => (
              <div key={label}>
                <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3 p-[12px_8px_6px]">{label}</div>
                {list.map((cv) => (
                  <button key={cv.id} onClick={() => select(cv.id)} className={cn("w-full flex items-center gap-3 p-[9px_8px] rounded-[11px] text-left transition-colors", cv.id === active ? "bg-brand-soft" : "hover:bg-bg")}>
                    <ConvAvatar c={cv} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2"><span className="text-[13.5px] font-semibold truncate">{cv.type === "channel" ? "# " + cv.name : cv.name}</span><span className="text-[11px] text-ink-3 flex-none">{cv.tm}</span></div>
                      <div className={cn("text-xs truncate mt-px", cv.unread ? "text-ink-2 font-medium" : "text-ink-3")}>{cv.pv}</div>
                    </div>
                    {cv.unread > 0 && <span className="min-w-[18px] h-[18px] px-1.5 grid place-items-center rounded-full bg-brand text-white text-[10.5px] font-bold flex-none">{cv.unread}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* thread */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="flex items-center gap-3 p-[13px_18px] border-b border-line flex-none">
            <ConvAvatar c={c} />
            <div className="flex-1 min-w-0"><b className="block text-[14.5px] font-semibold">{c.type === "channel" ? "# " + c.name : c.name}</b><span className="text-[11.5px] text-ink-3">{c.meta}</span></div>
            <div className="flex gap-2">
              {["Phone", "Video", "Info"].map((i) => <button key={i} className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-2 hover:bg-bg"><Icon name={i} size={17} /></button>)}
            </div>
          </div>

          <div ref={msgsRef} className="flex-1 min-h-0 overflow-y-auto p-[18px_20px] flex flex-col gap-[3px]">
            {c.msgs.map((m, i) => {
              if (m.day) return <div key={i} className="flex items-center gap-3 my-3.5 before:content-[''] before:flex-1 before:h-px before:bg-line after:content-[''] after:flex-1 after:h-px after:bg-line"><span className="text-[11px] font-semibold text-ink-3">{m.day}</span></div>;
              if (m.typing) return <div key={i} className="flex items-center gap-2 pt-1.5 px-1 text-ink-3 text-xs"><span className="inline-flex gap-[3px]">{[0, 1, 2].map((d) => <i key={d} className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}</span>{m.typing}…</div>;
              const me = !!m.me;
              return (
                <div key={i} className={cn("flex gap-2.5 mt-2.5 items-end", me && "flex-row-reverse")}>
                  <span className={cn("grid place-items-center w-[30px] h-[30px] rounded-full text-white text-[11px] font-semibold flex-none", m.cont && "invisible")} style={{ background: me ? PAL[ME.pi] : PAL[m.pi] }}>{me ? ME.av : m.av}</span>
                  <div className={cn("flex flex-col gap-[3px] max-w-[64%]", me && "items-end")}>
                    {!me && !m.cont && <span className="text-[11.5px] font-semibold text-ink-2 mb-0.5 px-1">{m.who}</span>}
                    {m.attach ? (
                      <div className="flex items-center gap-2.5 p-[9px_12px] rounded-xl bg-white border border-line w-fit"><span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-soft flex-none"><Icon name="FileText" size={16} className="text-brand" /></span><div><b className="block text-[12.5px] font-semibold">{m.attach.name}</b><span className="text-[11px] text-ink-3">{m.attach.meta}</span></div></div>
                    ) : (
                      <div className={cn("text-[13.5px] leading-relaxed px-3 py-2.5 rounded-[14px] w-fit border", me ? "bg-brand text-white border-transparent rounded-br-[5px]" : "bg-bg text-ink border-line rounded-bl-[5px]")}>{m.t}</div>
                    )}
                    {!m.cont && <span className="text-[10.5px] text-ink-3 px-1.5">{m.tm}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-none border-t border-line p-[12px_16px_14px]">
            <div className="flex items-end gap-2.5 bg-bg border border-slate-200 rounded-[14px] p-[8px_10px_8px_14px] focus-within:border-brand focus-within:bg-white focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]">
              <button className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-3 hover:bg-white"><Icon name="Paperclip" size={18} /></button>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`Message ${c.type === "channel" ? "# " + c.name : c.name}`} className="flex-1 bg-transparent outline-none text-[13.5px] py-1.5 min-w-0" />
              <button className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-3 hover:bg-white"><Icon name="Smile" size={18} /></button>
              <button onClick={send} className="grid place-items-center w-[38px] h-[38px] rounded-[11px] flex-none shadow-[0_8px_18px_-8px_rgba(99,102,241,0.8)]" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="SendHorizontal" size={18} className="text-white" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
