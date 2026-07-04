"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import CallModal from "@/components/messages/CallModal";
import { Modal, Field, TextInput, Dropdown, MenuItem, MenuLabel, MenuSep } from "@/components/ui";

const EMOJI = ["👍", "🎉", "🙌", "🔥", "😄", "🚀", "👀", "✅", "❤️", "😅", "🙏", "💡", "⚡", "🐛", "☕", "🎯"];

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
  const [query, setQuery] = useState("");
  // On phones the list and thread can't both fit — swap between them.
  const [mobileView, setMobileView] = useState("list");
  const [call, setCall] = useState(null);       // { mode, title, subtitle, avatar, bg, isChannel }
  const [showInfo, setShowInfo] = useState(false);
  const [compose, setCompose] = useState(false);
  const [composeName, setComposeName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const msgsRef = useRef(null);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  const c = convos.find((x) => x.id === active);

  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, [active, convos]);

  const select = (id) => {
    setActive(id);
    setMobileView("thread");
    setShowInfo(false);
    setConvos((cs) => cs.map((x) => (x.id === id ? { ...x, unread: 0 } : x)));
  };

  const pushMsg = (msg, preview) => setConvos((cs) => cs.map((x) => {
    if (x.id !== active) return x;
    const msgs = x.msgs.filter((m) => !m.typing).concat({ me: true, tm: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), ...msg });
    return { ...x, msgs, pv: preview, tm: "now" };
  }));

  const send = () => {
    const v = draft.trim();
    if (!v) return;
    pushMsg({ t: v }, "You: " + v.slice(0, 28));
    setDraft("");
    setShowEmoji(false);
  };

  const addEmoji = (e) => { setDraft((d) => d + e); inputRef.current?.focus(); };

  const onAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1048576).toFixed(1)} MB`;
    const ext = (file.name.split(".").pop() || "FILE").toUpperCase();
    pushMsg({ attach: { name: file.name, meta: `${ext} · ${kb}` } }, "You: 📎 " + file.name.slice(0, 24));
    e.target.value = "";
  };

  const startCall = (mode) => {
    if (!c) return;
    setCall({
      mode,
      title: c.type === "channel" ? "# " + c.name : c.name,
      subtitle: c.meta,
      avatar: c.av,
      bg: PAL[c.pi ?? 0],
      isChannel: c.type === "channel",
    });
  };

  const endCall = (seconds = 0) => {
    const label = call?.mode === "video" ? "Video call" : "Voice call";
    const dur = seconds > 0 ? ` · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "";
    pushMsg({ t: `${label}${dur}`, call: label }, "You: " + label);
    setCall(null);
  };

  const markAllRead = () => setConvos((cs) => cs.map((x) => ({ ...x, unread: 0 })));

  const createConversation = () => {
    const name = composeName.trim();
    if (!name) return;
    const id = "d" + Date.now();
    const conv = { id, type: "dm", name, av: name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(), pi: convos.length % PAL.length, pres: "on", pv: "New conversation", tm: "now", unread: 0, meta: "Direct message", msgs: [{ day: "Today" }] };
    setConvos((cs) => [conv, ...cs]);
    setActive(id);
    setMobileView("thread");
    setCompose(false);
    setComposeName("");
  };

  const match = (cv) => (cv.type === "channel" ? "# " + cv.name : cv.name).toLowerCase().includes(query.trim().toLowerCase());
  const f = (x) => match(x) && (tab !== "Unread" || x.unread > 0);
  const channels = (tab === "All" || tab === "Channels" || tab === "Unread") ? convos.filter((x) => x.type === "channel" && f(x)) : [];
  const dms = (tab === "All" || tab === "DMs" || tab === "Unread") ? convos.filter((x) => x.type === "dm" && f(x)) : [];
  const empty = channels.length === 0 && dms.length === 0;

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
          <button onClick={() => setCompose(true)} title="New message" className="grid place-items-center w-[38px] h-[38px] rounded-[10px] bg-card border border-line shadow-card hover:bg-bg transition-colors"><Icon name="PenLine" size={17} className="text-ink-2" /></button>
          <Dropdown align="right" width={200} trigger={({ toggle }) => (
            <button onClick={toggle} title="Filter & options" className="grid place-items-center w-[38px] h-[38px] rounded-[10px] bg-card border border-line shadow-card hover:bg-bg transition-colors"><Icon name="SlidersHorizontal" size={17} className="text-ink-2" /></button>
          )}>
            <MenuLabel>Show</MenuLabel>
            {["All", "Unread", "Channels", "DMs"].map((t) => (
              <MenuItem key={t} icon={tab === t ? "Check" : "Dot"} onClick={() => setTab(t)}>{t}</MenuItem>
            ))}
            <MenuSep />
            <MenuItem icon="CheckCheck" onClick={markAllRead}>Mark all as read</MenuItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex bg-card border border-line rounded-card shadow-card overflow-hidden">
        {/* conversation list */}
        <div className={cn("w-full sm:w-[288px] flex-none border-r border-line flex-col min-h-0 sm:flex", mobileView === "list" ? "flex" : "hidden")}>
          <div className="p-[14px_14px_10px]"><div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-[11px] py-2"><Icon name="Search" size={15} className="text-ink-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />{query && <button onClick={() => setQuery("")} className="text-ink-3 hover:text-ink"><Icon name="X" size={14} /></button>}</div></div>
          <div className="flex gap-1 px-3.5 pb-2">
            {["All", "Unread", "Channels", "DMs"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("text-xs font-medium px-3 py-1.5 rounded-lg", tab === t ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2")}>{t}</button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2.5">
            {empty && <div className="text-[12.5px] text-ink-3 text-center py-10">No conversations{query ? ` for “${query}”` : ""}.</div>}
            {[["Channels", channels], ["Direct messages", dms]].filter(([, list]) => list.length > 0).map(([label, list]) => (
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
        <div className={cn("flex-1 min-w-0 flex-col min-h-0 sm:flex", mobileView === "thread" ? "flex" : "hidden")}>
          <div className="flex items-center gap-3 p-[13px_18px] border-b border-line flex-none">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              aria-label="Back to conversations"
              className="sm:hidden grid place-items-center w-9 h-9 -ml-1.5 rounded-[9px] text-ink-2 hover:bg-bg flex-none"
            >
              <Icon name="ArrowLeft" size={18} />
            </button>
            <ConvAvatar c={c} />
            <div className="flex-1 min-w-0"><b className="block text-[14.5px] font-semibold">{c.type === "channel" ? "# " + c.name : c.name}</b><span className="text-[11.5px] text-ink-3">{c.meta}</span></div>
            <div className="flex gap-2">
              <button onClick={() => startCall("voice")} title="Voice call" aria-label="Voice call" className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-2 hover:bg-bg hover:text-brand transition-colors"><Icon name="Phone" size={17} /></button>
              <button onClick={() => startCall("video")} title="Video call" aria-label="Video call" className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-2 hover:bg-bg hover:text-brand transition-colors"><Icon name="Video" size={17} /></button>
              <button onClick={() => setShowInfo((v) => !v)} title="Conversation info" aria-label="Conversation info" className={cn("grid place-items-center w-[34px] h-[34px] rounded-[9px] transition-colors", showInfo ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-bg")}><Icon name="Info" size={17} /></button>
            </div>
          </div>

          <div ref={msgsRef} className="flex-1 min-h-0 overflow-y-auto p-[18px_20px] flex flex-col gap-[3px]">
            {c.msgs.map((m, i) => {
              if (m.day) return <div key={i} className="flex items-center gap-3 my-3.5 before:content-[''] before:flex-1 before:h-px before:bg-line after:content-[''] after:flex-1 after:h-px after:bg-line"><span className="text-[11px] font-semibold text-ink-3">{m.day}</span></div>;
              if (m.typing) return <div key={i} className="flex items-center gap-2 pt-1.5 px-1 text-ink-3 text-xs"><span className="inline-flex gap-[3px]">{[0, 1, 2].map((d) => <i key={d} className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}</span>{m.typing}…</div>;
              if (m.call) return <div key={i} className="flex justify-center my-2"><span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg border border-line text-[11.5px] text-ink-2"><Icon name={m.call === "Video call" ? "Video" : "Phone"} size={13} className="text-brand" />{m.t}<span className="text-ink-3">· {m.tm}</span></span></div>;
              const me = !!m.me;
              return (
                <div key={i} className={cn("flex gap-2.5 mt-2.5 items-end", me && "flex-row-reverse")}>
                  <span className={cn("grid place-items-center w-[30px] h-[30px] rounded-full text-white text-[11px] font-semibold flex-none", m.cont && "invisible")} style={{ background: me ? PAL[ME.pi] : PAL[m.pi] }}>{me ? ME.av : m.av}</span>
                  <div className={cn("flex flex-col gap-[3px] max-w-[64%]", me && "items-end")}>
                    {!me && !m.cont && <span className="text-[11.5px] font-semibold text-ink-2 mb-0.5 px-1">{m.who}</span>}
                    {m.attach ? (
                      <div className="flex items-center gap-2.5 p-[9px_12px] rounded-xl bg-card border border-line w-fit"><span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-soft flex-none"><Icon name="FileText" size={16} className="text-brand" /></span><div><b className="block text-[12.5px] font-semibold">{m.attach.name}</b><span className="text-[11px] text-ink-3">{m.attach.meta}</span></div></div>
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
            <input ref={fileRef} type="file" onChange={onAttach} className="hidden" />
            <div className="flex items-end gap-2.5 bg-bg border border-line rounded-[14px] p-[8px_10px_8px_14px] focus-within:border-brand focus-within:bg-card focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]">
              <button onClick={() => fileRef.current?.click()} title="Attach file" className="grid place-items-center w-[34px] h-[34px] rounded-[9px] text-ink-3 hover:bg-card hover:text-ink-2 transition-colors"><Icon name="Paperclip" size={18} /></button>
              <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`Message ${c.type === "channel" ? "# " + c.name : c.name}`} className="flex-1 bg-transparent outline-none text-[13.5px] py-1.5 min-w-0" />
              <div className="relative">
                <button onClick={() => setShowEmoji((v) => !v)} title="Emoji" className={cn("grid place-items-center w-[34px] h-[34px] rounded-[9px] transition-colors", showEmoji ? "bg-brand-soft text-brand" : "text-ink-3 hover:bg-card hover:text-ink-2")}><Icon name="Smile" size={18} /></button>
                {showEmoji && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowEmoji(false)} />
                    <div className="absolute z-20 bottom-full right-0 mb-2 grid grid-cols-8 gap-0.5 p-2 bg-card border border-line rounded-[12px] shadow-pop w-[264px]">
                      {EMOJI.map((e) => (
                        <button key={e} onClick={() => addEmoji(e)} className="grid place-items-center h-8 rounded-lg text-lg hover:bg-bg transition-colors">{e}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button onClick={send} title="Send" className="grid place-items-center w-[38px] h-[38px] rounded-[11px] flex-none shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="SendHorizontal" size={18} className="text-white" /></button>
            </div>
          </div>
        </div>

        {/* info panel */}
        {showInfo && (
          <div className="hidden lg:flex w-[264px] flex-none flex-col border-l border-line min-h-0">
            <div className="flex items-center justify-between p-[13px_16px] border-b border-line flex-none">
              <b className="text-[13.5px] font-semibold">Details</b>
              <button onClick={() => setShowInfo(false)} aria-label="Close details" className="grid place-items-center w-8 h-8 rounded-lg text-ink-3 hover:bg-bg"><Icon name="X" size={16} /></button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col items-center gap-4">
              <ConvAvatar c={c} size={72} />
              <div className="text-center">
                <div className="text-[15px] font-semibold">{c.type === "channel" ? "# " + c.name : c.name}</div>
                <div className="text-[12px] text-ink-3 mt-0.5">{c.meta}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[["Phone", "Call", () => startCall("voice")], ["Video", "Video", () => startCall("video")], ["BellOff", "Mute", markAllRead]].map(([icon, label, fn]) => (
                  <button key={label} onClick={fn} className="flex flex-col items-center gap-1.5 py-2.5 rounded-[11px] bg-bg hover:bg-brand-soft text-ink-2 hover:text-brand transition-colors">
                    <Icon name={icon} size={17} /><span className="text-[11px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <div className="w-full">
                <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3 mb-2">
                  {c.type === "channel" ? "Members" : "About"}
                </div>
                <div className="text-[12.5px] text-ink-2 leading-relaxed">
                  {c.type === "channel"
                    ? "Shared channel for the team. Files and pinned messages appear here."
                    : `${c.name} — ${c.meta}. Direct message thread.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={compose} onClose={() => setCompose(false)} title="New message" width={420}
        footer={<>
          <button onClick={() => setCompose(false)} className="h-9 px-4 rounded-[10px] text-[13px] font-medium text-ink-2 hover:bg-bg">Cancel</button>
          <button onClick={createConversation} disabled={!composeName.trim()} className="h-9 px-4 rounded-[10px] text-[13px] font-semibold text-white bg-brand disabled:opacity-40">Start chat</button>
        </>}>
        <Field label="To">
          <TextInput autoFocus value={composeName} onChange={(e) => setComposeName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createConversation()} placeholder="Name or email…" />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {["Lerato Modise", "James Okoro", "Amara Chen"].map((n) => (
            <button key={n} onClick={() => setComposeName(n)} className="text-[12px] px-2.5 py-1.5 rounded-full bg-bg border border-line text-ink-2 hover:border-brand hover:text-brand transition-colors">{n}</button>
          ))}
        </div>
      </Modal>

      {call && (
        <CallModal
          mode={call.mode}
          title={call.title}
          subtitle={call.subtitle}
          avatar={call.avatar}
          bg={call.bg}
          isChannel={call.isChannel}
          onEnd={endCall}
        />
      )}
    </div>
  );
}
