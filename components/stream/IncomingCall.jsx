"use client";

import { useCalls, StreamCall, StreamTheme, CallingState } from "@stream-io/video-react-sdk";
import Icon from "@/components/Icon";
import { InCall } from "@/components/messages/CallModal";

const PALS = ["#6366F1", "#0EA5E9", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444"];
const colorFor = (id = "") => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALS[h % PALS.length];
};
const initialsOf = (name = "") => name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

/**
 * Global incoming-call surface. Watches every call the client knows about and:
 *  - shows a ringing banner for an inbound call (accept / decline)
 *  - renders the full in-call UI once the user has accepted (joined)
 * Outgoing calls (created by me) are handled by <CallModal>, so they're ignored.
 */
export default function IncomingCall() {
  const calls = useCalls();

  const inbound = calls.filter((c) => c.isCreatedByMe === false && c.ringing);
  const active = inbound.find((c) => c.state.callingState === CallingState.JOINED);
  const ringing = inbound.find((c) => c.state.callingState === CallingState.RINGING);

  if (active) {
    const caller = active.state.createdBy;
    const name = caller?.name || caller?.id || "Caller";
    return (
      <StreamCall call={active}>
        <StreamTheme className="contents">
          <InCall
            mode={active.state.custom?.mode || "voice"}
            title={name}
            subtitle=""
            avatar={initialsOf(name)}
            bg={colorFor(caller?.id || name)}
            onEnd={() => { /* leaving the call unmounts this via useCalls */ }}
          />
        </StreamTheme>
      </StreamCall>
    );
  }

  if (ringing) return <IncomingBanner call={ringing} />;
  return null;
}

function IncomingBanner({ call }) {
  const caller = call.state.createdBy;
  const name = caller?.name || caller?.id || "Someone";
  const isVideo = (call.state.custom?.mode || "voice") === "video";
  const bg = colorFor(caller?.id || name);

  const accept = () => call.join().catch(() => {}); // join() auto-accepts a ringing call
  const decline = () => call.leave({ reject: true, reason: "decline" }).catch(() => {});

  return (
    <div className="fixed bottom-6 right-6 z-[95] w-[320px] max-w-[calc(100vw-3rem)] bg-[#141A32] text-white border border-white/10 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] p-4 animate-[fadeIn_.2s_ease]">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-12 h-12 rounded-full font-semibold text-white flex-none" style={{ background: bg }}>{initialsOf(name)}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold truncate">{name}</div>
          <div className="text-[12.5px] text-white/60 flex items-center gap-1.5">
            <Icon name={isVideo ? "Video" : "Phone"} size={13} />
            Incoming {isVideo ? "video" : "voice"} call…
          </div>
        </div>
        <span className="relative flex h-2.5 w-2.5 flex-none">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </div>
      <div className="flex items-center gap-2.5 mt-3.5">
        <button onClick={decline} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-colors">
          <Icon name="PhoneOff" size={17} />Decline
        </button>
        <button onClick={accept} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold transition-colors">
          <Icon name={isVideo ? "Video" : "Phone"} size={17} />Accept
        </button>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
