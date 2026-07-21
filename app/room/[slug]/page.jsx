"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  ParticipantView,
  useCallStateHooks,
  CallingState,
  hasVideo,
  hasAudio,
  hasScreenShare,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { getDemoUser, getVideoClient, isStreamConfigured } from "@/lib/stream";

/* ============================================================================
   Apex Conference Room — the in-call (video) experience.
   Immersive, full-bleed dark screen rendered OUTSIDE the app shell (like
   /command and /onboarding).

   The video itself is now REAL: it connects to Stream (getstream.io) via a
   server-minted token, joins the call named after the room slug, and renders
   live participant tracks. Open the same /room/<slug> in another tab/device to
   see multi-party video.

   The AI layer (Apex AI assistant, live captions, transcript, action items,
   the leave-of-absence popup) is still simulated demo data layered on top —
   those aren't wired to a backend yet.
   ========================================================================= */

// Deterministic gradient per participant id — real users have no preset colour.
const PALS = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
  "linear-gradient(135deg,#0EA5E9,#14B8A6)",
];
const gradFor = (id = "") => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALS[h % PALS.length];
};
const initialsOf = (name = "") =>
  name === "You"
    ? "You"
    : name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

// ---- demo data driving the AI / transcript / absence overlays only ----
const GRADS = {
  tr: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  thabo: "linear-gradient(135deg,#10B981,#22C55E)",
  sipho: "linear-gradient(135deg,#F59E0B,#EF4444)",
  priya: "linear-gradient(135deg,#8B5CF6,#EC4899)",
  naledi: "linear-gradient(135deg,#0EA5E9,#14B8A6)",
};
const DEMO_PEOPLE = [
  { id: "tr", name: "TR Mokwena" },
  { id: "thabo", name: "Thabo Nkosi" },
  { id: "sipho", name: "Sipho Dlamini" },
  { id: "priya", name: "Priya Singh" },
];
const NALEDI = { id: "naledi", name: "Naledi Kgasana" };
const byId = (id) => DEMO_PEOPLE.find((p) => p.id === id) || NALEDI;
const initials = (name) => (name === "You" ? "You" : name.split(" ").map((w) => w[0]).slice(0, 2).join(""));

const SCRIPT = [
  { who: "tr", text: "Alright, thanks everyone for joining the mid-sprint sync." },
  { who: "thabo", text: "Quick update — the event bus is in staging, GA looks good for Friday." },
  { who: "sipho", text: "Frontend's wired to the new endpoints, just polishing the conference screens." },
  { who: "priya", text: "I'll share the updated room layouts right after this call." },
  { who: "tr", text: "Great. Any blockers on RBAC before the beta cutover?" },
  { who: "thabo", text: "One — we still need the scopes signed off by security." },
  { who: "sipho", text: "I can pick up the captions work in parallel, it's mostly done." },
  { who: "tr", text: "Perfect. Let's lock the cutover plan and wrap up." },
];
const AI_SUMMARY = [
  "Event bus is in staging; GA targeted for Friday.",
  "Frontend integrated with new endpoints — conference screens in polish.",
  "RBAC scopes pending security sign-off before the beta cutover.",
];
const ACTION_ITEMS = [
  { who: "thabo", text: "Get RBAC scopes signed off by security", due: "Today" },
  { who: "priya", text: "Share updated conference room layouts", due: "After call" },
  { who: "sipho", text: "Finish live captions implementation", due: "Tomorrow" },
];
const AI_CHIPS = ["Summarize what I missed", "List action items", "Any decisions made?", "Draft follow-up email"];
const CHAT_SEED = [
  { who: "priya", text: "Sharing the Figma link in a sec 🎨", time: "2:03 PM" },
  { who: "thabo", text: "+1 on locking the cutover plan", time: "2:05 PM" },
];
const LANGS = ["English", "isiZulu", "Afrikaans", "Sesotho", "French", "Português"];
const REACTIONS = ["👍", "🎉", "❤️", "😂", "👏", "🔥"];

const TITLES = {
  "sprint14-sync": "Sprint 14 — Mid-sprint sync",
  "design-review": "Design review — Conference Room",
  "stakeholder-demo": "Stakeholder demo",
};
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function aiAnswer(q) {
  const s = q.toLowerCase();
  if (/miss|catch|recap|summ/.test(s)) return "Here's the recap: the event bus hits GA Friday, the frontend is integrated, and RBAC scopes are the one open blocker pending security sign-off.";
  if (/action|todo|task/.test(s)) return "3 action items so far — Thabo: RBAC sign-off (today), Priya: share room layouts, Sipho: finish captions (tomorrow).";
  if (/decision|decide/.test(s)) return "Decision captured: lock the beta cutover plan once RBAC scopes are signed off by security.";
  if (/email|follow|draft/.test(s)) return "Drafted a follow-up email with the summary + action items — it'll be sent to all participants when the meeting ends.";
  return "I'm transcribing live and tracking decisions & action items. Ask me to summarize, list action items, or draft a follow-up.";
}

/* ---------- small pieces ---------- */
function AudioBars({ className }) {
  return (
    <span className={cn("inline-flex items-end gap-[2px] h-3", className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-[2.5px] rounded-full bg-emerald-400 animate-pulse" style={{ height: [8, 12, 6][i], animationDelay: `${i * 120}ms`, animationDuration: "700ms" }} />
      ))}
    </span>
  );
}

function Ctrl({ icon, label, onClick, active, danger, glow, badge, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="group flex flex-col items-center gap-1.5 flex-none disabled:opacity-40 disabled:cursor-not-allowed">
      <span
        className={cn(
          "relative grid place-items-center w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-[14px] sm:rounded-[16px] transition-all duration-150 group-hover:-translate-y-0.5 group-disabled:translate-y-0",
          danger ? "bg-red-500 text-white hover:bg-red-600" : active ? "bg-brand text-white" : "bg-white/[0.08] text-slate-200 hover:bg-white/[0.16]",
          glow && "shadow-[0_0_0_1px_rgba(99,102,241,.55),0_10px_34px_-8px_rgba(99,102,241,.8)]",
        )}
      >
        <Icon name={icon} size={20} />
        {badge != null && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand text-white text-[10px] font-bold ring-2 ring-[#0a0e1a]">{badge}</span>}
      </span>
      <span className={cn("text-[10px] sm:text-[10.5px] transition-colors", active ? "text-brand" : "text-slate-400 group-hover:text-slate-200")}>{label}</span>
    </button>
  );
}

// A real participant tile — wraps Stream's <ParticipantView> (live video) with
// the Apex name/mic/speaking chrome, and an avatar fallback when the camera is off.
function StreamTile({ p, big, screen }) {
  const speaking = !!p.isSpeaking;
  const hasTrack = screen ? hasScreenShare(p) : hasVideo(p);
  const you = !!p.isLocalParticipant;
  const label = p.name || p.userId || "Guest";
  const grad = gradFor(p.userId || label);
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border transition-all duration-200 bg-[#0f1626]",
        speaking && !screen ? "border-emerald-400 ring-2 ring-emerald-400/40" : "border-white/[0.06]",
        big ? "w-full h-full" : "aspect-video",
      )}
    >
      <ParticipantView
        participant={p}
        trackType={screen ? "screenShareTrack" : "videoTrack"}
        ParticipantViewUI={null}
        mirror={you && !screen}
        className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />
      {!hasTrack && (
        <div className="absolute inset-0 grid place-items-center" style={{ background: grad }}>
          <span className="grid place-items-center rounded-full text-white font-bold" style={{ width: big ? 132 : 60, height: big ? 132 : 60, fontSize: big ? 44 : 22, background: "rgba(0,0,0,.22)" }}>
            {initialsOf(label)}
          </span>
        </div>
      )}

      <div className="absolute left-2.5 bottom-2.5 flex items-center gap-1.5 bg-black/45 backdrop-blur rounded-lg pl-1.5 pr-2.5 py-1">
        {screen ? (
          <Icon name="MonitorUp" size={13} className="text-emerald-300" />
        ) : !hasAudio(p) ? (
          <Icon name="MicOff" size={13} className="text-red-400" />
        ) : speaking ? (
          <AudioBars />
        ) : (
          <Icon name="Mic" size={13} className="text-slate-200" />
        )}
        <span className="text-[12px] font-semibold text-white">
          {label}
          {you && !screen && <span className="text-white/60 font-normal"> (you)</span>}
          {screen && <span className="text-white/60 font-normal"> · screen</span>}
        </span>
      </div>

      {speaking && !screen && <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-md px-1.5 py-0.5">Speaking</span>}
    </div>
  );
}

function Pill({ icon, label, on, onClick }) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full pl-2 pr-2.5 py-1 text-[11.5px] font-semibold backdrop-blur transition-colors border",
      on ? "bg-brand/20 border-brand/50 text-indigo-200" : "bg-black/30 border-white/10 text-slate-300 hover:text-white")}>
      <Icon name={icon} size={13} className={on ? "text-brand" : "text-slate-400"} />{label}
      <span className={cn("w-1.5 h-1.5 rounded-full", on ? "bg-emerald-400" : "bg-slate-500")} />
    </button>
  );
}

/* ============================================================================
   Top-level: set up the Stream client + call, then render the room UI inside
   the StreamVideo / StreamCall providers.
   ========================================================================= */
export default function RoomPage() {
  const { slug } = useParams();
  const router = useRouter();
  const roomId = String(slug || "apex-room").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64) || "apex-room";
  const title = TITLES[slug] || String(slug || "Conference Room").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [status, setStatus] = useState(isStreamConfigured ? "connecting" : "unconfigured"); // connecting | joined | error | unconfigured
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isStreamConfigured) return;
    let active = true;
    const c = getVideoClient(getDemoUser());
    const theCall = c.call("default", roomId);
    setClient(c);
    setCall(theCall);
    setStatus("connecting");
    theCall
      .join({ create: true })
      .then(() => active && setStatus("joined"))
      .catch((e) => {
        if (active) {
          setError(String(e?.message || e));
          setStatus("error");
        }
      });
    return () => {
      active = false;
      if (theCall.state.callingState !== CallingState.LEFT) theCall.leave().catch(() => {});
    };
  }, [roomId]);

  if (!isStreamConfigured) return <SetupScreen title={title} slug={roomId} onExit={() => router.push("/meetings")} />;
  if (status === "error") return <ErrorScreen title={title} error={error} onExit={() => router.push("/meetings")} />;
  if (!client || !call) return <ConnectingScreen title={title} />;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme className="contents">
          <RoomInner slug={slug} title={title} roomId={roomId} joining={status !== "joined"} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

/* ---------- lightweight full-screen states ---------- */
function Shell({ children }) {
  return <div className="fixed inset-0 grid place-items-center bg-[#0a0e1a] text-slate-100 font-sans p-6">{children}</div>;
}
function ConnectingScreen({ title }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/15 animate-pulse"><Icon name="Video" size={24} className="text-brand" /></span>
        <div className="text-[15px] font-semibold">Joining {title}…</div>
        <div className="text-[12.5px] text-slate-400">Connecting to the room</div>
      </div>
    </Shell>
  );
}
function ErrorScreen({ title, error, onExit }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-red-500/15"><Icon name="TriangleAlert" size={24} className="text-red-400" /></span>
        <div className="text-[15px] font-semibold">Couldn&apos;t join {title}</div>
        <div className="text-[12.5px] text-slate-400 break-words">{error || "The call failed to connect."}</div>
        <button onClick={onExit} className="mt-2 h-10 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-[13px] font-semibold">Back to lobby</button>
      </div>
    </Shell>
  );
}
function SetupScreen({ title, slug, onExit }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-3 text-center max-w-lg">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-amber-500/15"><Icon name="KeyRound" size={24} className="text-amber-400" /></span>
        <div className="text-[15px] font-semibold">Video isn&apos;t configured yet</div>
        <div className="text-[12.5px] text-slate-400">
          Set <code className="text-slate-200">NEXT_PUBLIC_STREAM_API_KEY</code> and <code className="text-slate-200">STREAM_API_SECRET</code> in
          <code className="text-slate-200"> .env.local</code> (see <code className="text-slate-200">.env.example</code>), then restart the dev server.
          Room <b className="text-slate-300">{slug}</b> will connect once Stream is set up.
        </div>
        <button onClick={onExit} className="mt-2 h-10 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-[13px] font-semibold">Back to lobby</button>
      </div>
    </Shell>
  );
}

/* ============================================================================
   The in-call UI. Runs inside StreamCall, so it can read live call state.
   ========================================================================= */
function RoomInner({ slug, title, roomId, joining }) {
  const router = useRouter();

  const {
    useParticipants,
    useMicrophoneState,
    useCameraState,
    useScreenShareState,
    useHasOngoingScreenShare,
    useDominantSpeaker,
    useParticipantCount,
  } = useCallStateHooks();

  const participants = useParticipants();
  const participantCount = useParticipantCount();
  const { microphone, isMute: micMuted } = useMicrophoneState();
  const { camera, isMute: camMuted } = useCameraState();
  const { screenShare, isMute: shareMuted } = useScreenShareState();
  const someoneSharing = useHasOngoingScreenShare();
  const dominant = useDominantSpeaker();

  const sharer = someoneSharing ? participants.find((p) => hasScreenShare(p)) : null;

  // device + AI toggles (device ones are real; AI ones are demo)
  const [recording, setRecording] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [noise, setNoise] = useState(true);
  const [framing, setFraming] = useState(true);
  const [hand, setHand] = useState(false);
  const [layout, setLayout] = useState("gallery"); // gallery | speaker
  const [lang, setLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const [reactOpen, setReactOpen] = useState(false);

  const [panel, setPanel] = useState("ai"); // ai | transcript | people | chat | null

  // live state (demo AI layer)
  const [elapsed, setElapsed] = useState(0);
  const [recSec, setRecSec] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [caption, setCaption] = useState(null);
  const [aiReady, setAiReady] = useState(false);
  const [aiThread, setAiThread] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [chat, setChat] = useState(CHAT_SEED);
  const [chatInput, setChatInput] = useState("");
  const [floats, setFloats] = useState([]);
  const [absence, setAbsence] = useState(null);
  const [banner, setBanner] = useState(null);

  const tRef = useRef(null);
  const aiRef = useRef(null);

  // meeting timer
  useEffect(() => { const t = setInterval(() => setElapsed((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (!recording) return; const t = setInterval(() => setRecSec((s) => s + 1), 1000); return () => clearInterval(t); }, [recording]);
  useEffect(() => { const t = setTimeout(() => setAiReady(true), 2600); return () => clearTimeout(t); }, []);
  // streaming transcript / captions (demo)
  useEffect(() => {
    let i = 0;
    const tick = () => {
      const line = SCRIPT[i % SCRIPT.length];
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTranscript((tr) => [...tr, { ...line, time }].slice(-40));
      setCaption(line);
      i += 1;
    };
    tick();
    const t = setInterval(tick, 4200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { const t = setTimeout(() => setAbsence({ name: NALEDI.name, note: "Down with the flu — I'll catch the recording. Doctor's note attached.", doc: "sick-note.pdf", minuteMark: 3 }), 5200); return () => clearTimeout(t); }, []);
  useEffect(() => { tRef.current?.scrollTo({ top: tRef.current.scrollHeight, behavior: "smooth" }); }, [transcript, panel]);
  useEffect(() => { aiRef.current?.scrollTo({ top: aiRef.current.scrollHeight, behavior: "smooth" }); }, [aiThread]);

  const speaker = dominant || participants[0];

  const toggleRec = () => {
    setRecording((r) => {
      const next = !r;
      if (next) { setRecSec(0); setBanner({ tone: "rec", text: "Recording started — Apex AI is capturing highlights, a transcript and a summary." }); }
      else setBanner({ tone: "done", text: "Recording saved · AI summary + highlights will be emailed to all participants." });
      setTimeout(() => setBanner(null), 4600);
      return next;
    });
  };

  const askAi = (q) => {
    const text = q ?? aiInput.trim();
    if (!text) return;
    setAiThread((t) => [...t, { role: "user", text }]);
    setAiInput("");
    setTimeout(() => setAiThread((t) => [...t, { role: "ai", text: aiAnswer(text) }]), 650);
  };
  const sendChat = () => {
    const text = chatInput.trim(); if (!text) return;
    setChat((c) => [...c, { who: "you", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
  };
  const react = (emoji) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, emoji, x: 40 + Math.random() * 20 }]);
    setReactOpen(false);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 2000);
  };

  const leave = async () => {
    try { await screenShare?.disable?.(); } catch { /* ignore */ }
    router.push("/meetings");
  };

  const others = participants.filter((p) => p.sessionId !== speaker?.sessionId);

  const panelToggles = (
    <>
      <Ctrl icon="Sparkles" label="Apex AI" glow active={panel === "ai"} onClick={() => setPanel((p) => (p === "ai" ? null : "ai"))} />
      <Ctrl icon="Users" label="People" badge={participantCount} active={panel === "people"} onClick={() => setPanel((p) => (p === "people" ? null : "people"))} />
      <Ctrl icon="MessageSquare" label="Chat" active={panel === "chat"} onClick={() => setPanel((p) => (p === "chat" ? null : "chat"))} />
    </>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a0e1a] text-slate-100 font-sans">
      {/* ---------- top bar ---------- */}
      <header className="flex items-center justify-between gap-4 px-4 h-14 border-b border-white/[0.06] flex-none">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-8 h-8 rounded-lg flex-none" style={{ background: GRADS.tr }}><Icon name="Video" size={17} className="text-white" /></span>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold leading-tight truncate">{title}</div>
            <div className="text-[11px] text-slate-400 leading-tight">apex.meet/{roomId}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-none">
          {joining && <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-300 bg-amber-500/10 rounded-full px-2.5 py-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />Connecting…</span>}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 bg-white/[0.06] rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{clock(elapsed)}
          </span>
          {recording && (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-red-300 bg-red-500/15 border border-red-500/30 rounded-full px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />REC {clock(recSec)}
            </span>
          )}
          <div className="relative hidden sm:block">
            <button onClick={() => setLangOpen((o) => !o)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/[0.12] rounded-full px-2.5 py-1">
              <Icon name="Languages" size={14} className="text-brand" />{lang}<Icon name="ChevronDown" size={13} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#121a2c] border border-white/10 rounded-xl shadow-pop p-1 z-30">
                <div className="px-2.5 py-1.5 text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold">AI translate captions</div>
                {LANGS.map((l) => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} className={cn("w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] hover:bg-white/[0.06]", l === lang ? "text-brand font-semibold" : "text-slate-300")}>{l}</button>
                ))}
              </div>
            )}
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-300/90 bg-emerald-500/10 rounded-full px-2.5 py-1"><Icon name="ShieldCheck" size={13} />Encrypted</span>
          <span className="inline-flex items-center gap-1 text-emerald-400" title="Excellent connection"><Icon name="SignalHigh" size={16} /></span>
          <button onClick={leave} className="grid place-items-center w-8 h-8 rounded-lg text-slate-400 hover:bg-white/[0.08] hover:text-white" title="Back to lobby"><Icon name="X" size={18} /></button>
        </div>
      </header>

      {/* ---------- body ---------- */}
      <div className="flex-1 flex min-h-0">
        {/* stage */}
        <div className="relative flex-1 min-w-0 p-3 sm:p-4">
          {/* AI status — top-left */}
          <div className="absolute top-5 sm:top-6 left-5 sm:left-7 z-20 flex flex-col items-start gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur border border-brand/30 pl-2 pr-3 py-1.5">
              <span className="grid place-items-center w-5 h-5 rounded-full" style={{ background: GRADS.tr }}><Icon name="Sparkles" size={12} className="text-white" /></span>
              <span className="text-[11.5px] font-semibold text-indigo-200">Apex AI</span>
              <span className="text-[11px] text-slate-400">· listening &amp; transcribing</span>
              <AudioBars />
            </span>
          </div>
          {/* AI toggles — top-right */}
          <div className="absolute top-5 sm:top-6 right-5 sm:right-7 z-20 flex flex-col items-end gap-2">
            <Pill icon="Waves" label="AI noise" on={noise} onClick={() => setNoise((v) => !v)} />
            <Pill icon="ScanFace" label="Auto-frame" on={framing} onClick={() => setFraming((v) => !v)} />
          </div>

          {/* recording / status banner */}
          {banner && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#121a2c]/95 backdrop-blur border border-white/10 rounded-xl shadow-pop px-4 py-2.5 max-w-[90%]">
              <span className={cn("grid place-items-center w-7 h-7 rounded-lg flex-none", banner.tone === "rec" ? "bg-red-500/20" : "bg-emerald-500/20")}>
                <Icon name={banner.tone === "rec" ? "Disc" : "MailCheck"} size={15} className={banner.tone === "rec" ? "text-red-400" : "text-emerald-400"} />
              </span>
              <span className="text-[12.5px] text-slate-200">{banner.text}</span>
            </div>
          )}

          {/* video grid / speaker / screenshare */}
          {sharer ? (
            <div className="h-full flex gap-3 flex-col lg:flex-row">
              <div className="flex-1 min-h-0"><StreamTile p={sharer} big screen /></div>
              <div className="flex lg:flex-col gap-3 lg:w-[200px] overflow-auto">
                {participants.map((p) => <div key={p.sessionId} className="w-[150px] lg:w-full flex-none"><StreamTile p={p} /></div>)}
              </div>
            </div>
          ) : participants.length === 0 ? (
            <div className="h-full grid place-items-center">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/[0.06] animate-pulse"><Icon name="Video" size={24} /></span>
                <div className="text-[13px] font-medium">{joining ? "Connecting to the room…" : "Waiting for participants…"}</div>
              </div>
            </div>
          ) : layout === "speaker" && speaker ? (
            <div className="h-full flex flex-col gap-3">
              <div className="flex-1 min-h-0"><StreamTile p={speaker} big /></div>
              {others.length > 0 && (
                <div className="flex gap-3 h-[110px] flex-none overflow-x-auto">
                  {others.map((p) => <div key={p.sessionId} className="aspect-video h-full flex-none"><StreamTile p={p} /></div>)}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full grid gap-3 content-center grid-cols-2 lg:grid-cols-3">
              {participants.map((p) => <StreamTile key={p.sessionId} p={p} />)}
              <div className="aspect-video rounded-2xl border border-dashed border-white/10 grid place-items-center text-slate-500">
                <button onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})} className="flex flex-col items-center gap-1.5 hover:text-slate-300" title="Copy room link">
                  <Icon name="UserPlus" size={22} /><span className="text-[12px] font-medium">Copy invite link</span>
                </button>
              </div>
            </div>
          )}

          {/* live captions overlay (demo) */}
          {captions && caption && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 max-w-[80%] flex items-center gap-2.5 bg-black/65 backdrop-blur rounded-xl px-4 py-2.5">
              <Icon name="Captions" size={15} className="text-brand flex-none" />
              <span className="text-[13.5px] text-slate-100"><b className="text-brand-soft text-indigo-300">{byId(caption.who).name}:</b> {caption.text}</span>
              {lang !== "English" && <span className="text-[10px] font-semibold text-slate-400 bg-white/10 rounded px-1.5 py-0.5 flex-none">{lang}</span>}
            </div>
          )}

          {/* floating reactions */}
          <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
            {floats.map((f) => <span key={f.id} className="absolute text-3xl" style={{ left: `${f.x}px`, bottom: 0, animation: "floatUp 2s ease-out forwards" }}>{f.emoji}</span>)}
          </div>

          {/* absence popup (demo) */}
          {absence && (
            <div className="absolute bottom-5 left-5 z-30 w-[320px] max-w-[calc(100%-2.5rem)] bg-[#121a2c]/95 backdrop-blur border border-amber-500/30 rounded-xl shadow-pop p-3.5 animate-[fadeIn_.25s_ease]">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-9 h-9 rounded-full text-white font-bold flex-none" style={{ background: GRADS.naledi }}>NK</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <b className="text-[13px] font-semibold">{absence.name}</b>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded px-1.5 py-px">Absent</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5 inline-flex items-center gap-1"><Icon name="Clock" size={11} />Shown {absence.minuteMark} min into the meeting</div>
                  <p className="text-[12.5px] text-slate-300 mt-1.5 mb-0">{absence.note}</p>
                  {absence.doc && <button className="inline-flex items-center gap-1.5 mt-2 text-[11.5px] font-semibold text-brand-soft text-indigo-300 hover:underline"><Icon name="Paperclip" size={12} />{absence.doc}</button>}
                </div>
                <button onClick={() => setAbsence(null)} className="text-slate-500 hover:text-white flex-none"><Icon name="X" size={15} /></button>
              </div>
            </div>
          )}
        </div>

        {/* ---------- side panel ---------- */}
        {panel && (
          <aside className="z-40 bg-[#0c121f] flex flex-col max-sm:fixed max-sm:inset-x-0 max-sm:top-14 max-sm:bottom-20 max-sm:border-t max-sm:border-white/[0.06] sm:w-[340px] sm:max-w-[88vw] sm:flex-none sm:border-l sm:border-white/[0.06]">
            <div className="flex items-center gap-1 px-2 pt-2 flex-none">
              {[
                { k: "ai", icon: "Sparkles", label: "Apex AI" },
                { k: "transcript", icon: "Captions", label: "Transcript" },
                { k: "people", icon: "Users", label: "People" },
                { k: "chat", icon: "MessageSquare", label: "Chat" },
              ].map((t) => (
                <button key={t.k} onClick={() => setPanel(t.k)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-colors", panel === t.k ? "bg-white/[0.08] text-white" : "text-slate-400 hover:text-slate-200")}>
                  <Icon name={t.icon} size={14} className={panel === t.k ? "text-brand" : ""} />{t.label}
                </button>
              ))}
              <button onClick={() => setPanel(null)} className="grid place-items-center w-8 h-8 rounded-lg text-slate-500 hover:bg-white/[0.08] hover:text-white"><Icon name="PanelRightClose" size={16} /></button>
            </div>

            {/* AI ASSISTANT (demo) */}
            {panel === "ai" && (
              <div ref={aiRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3.5">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Icon name="FileText" size={14} className="text-brand" />
                    <span className="text-[12.5px] font-semibold">Live summary</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 rounded-full px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>
                  </div>
                  {!aiReady ? (
                    <div className="flex flex-col gap-2">{[90, 75, 82].map((w, i) => <div key={i} className="h-2.5 rounded bg-white/[0.06] animate-pulse" style={{ width: `${w}%` }} />)}</div>
                  ) : (
                    <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                      {AI_SUMMARY.map((s, i) => <li key={i} className="flex gap-2 text-[12.5px] text-slate-300"><Icon name="Dot" size={16} className="text-brand flex-none -ml-1" />{s}</li>)}
                    </ul>
                  )}
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2 mb-2.5"><Icon name="ListChecks" size={14} className="text-brand" /><span className="text-[12.5px] font-semibold">Action items detected</span><span className="ml-auto text-[11px] text-slate-500">{ACTION_ITEMS.length}</span></div>
                  <div className="flex flex-col gap-2.5">
                    {ACTION_ITEMS.map((a, i) => {
                      const p = byId(a.who);
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="grid place-items-center w-6 h-6 rounded-full text-white text-[10px] font-bold flex-none" style={{ background: GRADS[a.who] }}>{initials(p.name)}</span>
                          <div className="min-w-0 flex-1"><div className="text-[12.5px] text-slate-200 leading-snug">{a.text}</div><div className="text-[11px] text-slate-500">{p.name.split(" ")[0]} · {a.due}</div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand/15 flex-none"><Icon name="Star" size={16} className="text-brand" /></span>
                  <div className="text-[12px] text-slate-300">{recording ? "Capturing AI highlights for the recording…" : "Start recording to auto-capture AI highlights & chapters."}</div>
                </div>

                {aiThread.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {aiThread.map((m, i) => (
                      <div key={i} className={cn("max-w-[88%] text-[12.5px] rounded-2xl px-3 py-2", m.role === "user" ? "self-end bg-brand text-white rounded-br-md" : "self-start bg-white/[0.06] text-slate-200 rounded-bl-md")}>{m.text}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {panel === "ai" && (
              <div className="flex-none border-t border-white/[0.06] p-3">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {AI_CHIPS.map((c) => <button key={c} onClick={() => askAi(c)} className="text-[11px] text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full px-2.5 py-1">{c}</button>)}
                </div>
                <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2">
                  <Icon name="Sparkles" size={15} className="text-brand flex-none" />
                  <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAi()} placeholder="Ask Apex AI about this meeting…" className="flex-1 bg-transparent outline-none text-[12.5px] text-slate-100 placeholder:text-slate-500" />
                  <button onClick={() => askAi()} className="grid place-items-center w-7 h-7 rounded-lg bg-brand text-white flex-none hover:bg-brand-600"><Icon name="ArrowUp" size={15} /></button>
                </div>
              </div>
            )}

            {/* TRANSCRIPT (demo) */}
            {panel === "transcript" && (
              <div ref={tRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5"><Icon name="Languages" size={12} />Transcribing in {lang} · auto-punctuation on</div>
                {transcript.map((t, i) => {
                  const p = byId(t.who);
                  return (
                    <div key={i} className="flex gap-2.5">
                      <span className="grid place-items-center w-6 h-6 rounded-full text-white text-[10px] font-bold flex-none mt-0.5" style={{ background: GRADS[t.who] }}>{initials(p.name)}</span>
                      <div><div className="text-[11px] text-slate-500"><b className="text-slate-300 font-semibold">{p.name.split(" ")[0]}</b> · {t.time}</div><div className="text-[12.5px] text-slate-200 leading-snug">{t.text}</div></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PEOPLE (real participants) */}
            {panel === "people" && (
              <div className="flex-1 overflow-y-auto px-3.5 py-3">
                <div className="flex items-center justify-between mb-2"><span className="text-[12px] font-semibold text-slate-300">In call · {participantCount}</span></div>
                <div className="flex flex-col">
                  {participants.map((p) => (
                    <div key={p.sessionId} className="flex items-center gap-2.5 py-2 border-b border-white/[0.05] last:border-0">
                      <span className="grid place-items-center w-8 h-8 rounded-full text-white text-[11px] font-bold flex-none" style={{ background: gradFor(p.userId || p.name) }}>{initialsOf(p.name || p.userId)}</span>
                      <div className="flex-1 min-w-0"><div className="text-[12.5px] font-semibold truncate">{p.name || p.userId}{p.isLocalParticipant && <span className="text-slate-500 font-normal"> (you)</span>}</div></div>
                      {p.isSpeaking && <AudioBars />}
                      <Icon name={hasAudio(p) ? "Mic" : "MicOff"} size={14} className={hasAudio(p) ? "text-slate-400" : "text-red-400"} />
                      <Icon name={hasVideo(p) ? "Video" : "VideoOff"} size={14} className={hasVideo(p) ? "text-slate-400" : "text-slate-600"} />
                    </div>
                  ))}
                  {/* absentee (demo) */}
                  <div className="flex items-center gap-2.5 py-2 opacity-60">
                    <span className="grid place-items-center w-8 h-8 rounded-full text-white text-[11px] font-bold flex-none grayscale" style={{ background: GRADS.naledi }}>NK</span>
                    <div className="flex-1 min-w-0"><div className="text-[12.5px] font-semibold truncate">{NALEDI.name}</div><div className="text-[10.5px] text-amber-300/90 inline-flex items-center gap-1"><Icon name="UserMinus" size={11} />Sent a leave note</div></div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAT (demo) */}
            {panel === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
                  {chat.map((m, i) => {
                    const you = m.who === "you"; const p = you ? { name: "You" } : byId(m.who);
                    return (
                      <div key={i} className={cn("flex flex-col", you && "items-end")}>
                        <div className="text-[10.5px] text-slate-500 mb-0.5">{you ? "You" : p.name.split(" ")[0]} · {m.time}</div>
                        <div className={cn("max-w-[85%] text-[12.5px] rounded-2xl px-3 py-2", you ? "bg-brand text-white rounded-br-md" : "bg-white/[0.06] text-slate-200 rounded-bl-md")}>{m.text}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex-none border-t border-white/[0.06] p-3">
                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Message everyone…" className="flex-1 bg-transparent outline-none text-[12.5px] text-slate-100 placeholder:text-slate-500" />
                    <button onClick={sendChat} className="grid place-items-center w-7 h-7 rounded-lg bg-brand text-white flex-none hover:bg-brand-600"><Icon name="Send" size={14} /></button>
                  </div>
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* ---------- control bar ---------- */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-20 border-t border-white/[0.06] flex-none">
        <div className="hidden lg:flex flex-1 items-center gap-2 text-[11.5px] text-slate-400">
          <Icon name="Captions" size={14} className={captions ? "text-brand" : ""} />{captions ? "Captions on" : "Captions off"}
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <Icon name="Waves" size={14} className={noise ? "text-brand" : ""} />Noise {noise ? "suppressed" : "off"}
        </div>

        <div className="flex-1 lg:flex-none min-w-0 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Ctrl icon={micMuted ? "MicOff" : "Mic"} label={micMuted ? "Unmute" : "Mute"} danger={micMuted} onClick={() => microphone.toggle()} />
          <Ctrl icon={camMuted ? "VideoOff" : "Video"} label={camMuted ? "Start" : "Stop"} danger={camMuted} onClick={() => camera.toggle()} />
          <Ctrl icon="MonitorUp" label="Share" active={!shareMuted} onClick={() => screenShare.toggle()} />
          <Ctrl icon="Disc" label={recording ? "Stop rec" : "Record"} danger={recording} onClick={toggleRec} />
          <Ctrl icon="Smile" label="React" active={reactOpen} onClick={() => setReactOpen((v) => !v)} />
          <Ctrl icon="Captions" label="Captions" active={captions} onClick={() => setCaptions((v) => !v)} />
          <Ctrl icon="Hand" label="Raise" active={hand} onClick={() => setHand((v) => !v)} />
          <Ctrl icon={layout === "speaker" ? "LayoutGrid" : "SquareUser"} label="Layout" onClick={() => setLayout((l) => (l === "gallery" ? "speaker" : "gallery"))} />
          <span className="sm:hidden w-px h-9 bg-white/10 flex-none mx-0.5" />
          <div className="sm:hidden flex items-center gap-1.5">{panelToggles}</div>
        </div>

        {reactOpen && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-[#121a2c] border border-white/10 rounded-full px-2 py-1.5 shadow-pop">
            {REACTIONS.map((e) => <button key={e} onClick={() => react(e)} className="text-xl hover:scale-125 transition-transform px-0.5">{e}</button>)}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-none lg:flex-1">
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">{panelToggles}</div>
          <button onClick={leave} className="flex items-center gap-2 h-11 sm:h-[52px] px-4 sm:px-5 rounded-[14px] sm:rounded-[16px] bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold flex-none">
            <Icon name="PhoneOff" size={18} /><span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      <style>{`@keyframes floatUp{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-160px);opacity:0}}`}</style>
    </div>
  );
}
