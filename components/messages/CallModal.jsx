"use client";

import { useEffect, useRef, useState } from "react";
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  ParticipantView,
  ParticipantsAudio,
  useCallStateHooks,
  useCall,
  CallingState,
  hasVideo,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { getVideoClient, getCurrentUser, isStreamConfigured } from "@/lib/stream";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * 1:1 (and small-group) voice / video call overlay.
 *
 * When Stream is configured it runs a REAL call: it joins the Stream call named
 * by `callId`, publishes mic (+ camera for video mode), plays remote audio and
 * renders remote/self video. Open the same conversation on another device to
 * connect. Without Stream keys it falls back to the local-only simulated call
 * (mic level meter off getUserMedia), so the demo still works.
 */
export default function CallModal(props) {
  if (isStreamConfigured && props.callId) return <RealCall {...props} />;
  return <SimulatedCall {...props} />;
}

/* ============================================================================
   Shared presentational shell — owns the timer + escape-to-end, renders the
   frame (video slot or avatar with the audio-reactive ripple) and controls.
   ========================================================================= */
function CallView({
  mode, title, subtitle, isChannel, avatar, bg,
  status, muted, camOff, speaker, level, noDevice,
  showVideo, videoNode, pipNode,
  onToggleMute, onToggleCam, onToggleSpeaker, onEnd,
}) {
  const [seconds, setSeconds] = useState(0);
  const secRef = useRef(0);
  const end = () => onEnd(secRef.current);

  useEffect(() => {
    if (status !== "active") return;
    const iv = setInterval(() => setSeconds((s) => { secRef.current = s + 1; return s + 1; }), 1000);
    return () => clearInterval(iv);
  }, [status]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onEnd(secRef.current);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onEnd]);

  const ring = muted ? 0 : level;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-between py-14 text-white bg-gradient-to-b from-[#141A32] to-[#0B0F1E]">
      {/* video fills the frame in video mode */}
      {mode === "video" && (
        <div className={cn("absolute inset-0 transition-opacity", showVideo ? "opacity-100" : "opacity-0")}>{videoNode}</div>
      )}
      {mode === "video" && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />}

      {/* self picture-in-picture (when a remote video is primary) */}
      {mode === "video" && showVideo && pipNode && (
        <div className="absolute top-5 right-5 w-[116px] sm:w-[140px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] bg-black/40 z-10">
          {pipNode}
        </div>
      )}

      {/* callee */}
      <div className={cn("relative flex flex-col gap-4 mt-6", showVideo ? "w-full items-start px-5" : "items-center")}>
        {!showVideo && (
          <div className="relative grid place-items-center">
            {status === "active" && !muted && [0, 1].map((r) => (
              <span
                key={r}
                className="absolute rounded-full border border-white/20"
                style={{ width: 128, height: 128, transform: `scale(${1 + ring * (r ? 0.9 : 0.5) + r * 0.15})`, opacity: 0.5 - ring * 0.2, transition: "transform 90ms linear" }}
              />
            ))}
            <span
              className={cn("grid place-items-center rounded-full font-semibold flex-none shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)]", isChannel ? "bg-white/10" : "text-white")}
              style={{ width: 112, height: 112, fontSize: 34, background: isChannel ? undefined : bg }}
            >
              {isChannel ? <Icon name="Hash" size={44} /> : avatar}
            </span>
          </div>
        )}
        <div className={cn(showVideo ? "text-left drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]" : "text-center")}>
          <div className="text-[22px] font-semibold tracking-[-0.01em]">{title}</div>
          <div className={cn("mt-1 text-[13px] text-white/70 flex items-center gap-1.5", !showVideo && "justify-center")}>
            <Icon name={mode === "video" ? "Video" : "Phone"} size={13} />
            {status === "connecting" ? "Calling…" : fmt(seconds)}
            {subtitle && status === "connecting" && <span className="text-white/40">· {subtitle}</span>}
            {noDevice && status === "active" && <span className="text-white/40">· no mic</span>}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="relative flex items-center gap-4">
        <CallBtn active={muted} onClick={onToggleMute} icon={muted ? "MicOff" : "Mic"} label={muted ? "Unmute" : "Mute"} />
        {mode === "video" && (
          <CallBtn active={camOff} onClick={onToggleCam} icon={camOff ? "VideoOff" : "Video"} label={camOff ? "Start video" : "Stop video"} />
        )}
        <CallBtn active={!speaker} onClick={onToggleSpeaker} icon={speaker ? "Volume2" : "VolumeX"} label="Speaker" />
        <button
          type="button"
          onClick={end}
          aria-label="End call"
          className="grid place-items-center w-[68px] h-[52px] rounded-[26px] bg-red-500 hover:bg-red-600 text-white shadow-[0_10px_30px_-8px_rgba(239,68,68,0.8)] transition-colors"
        >
          <Icon name="PhoneOff" size={22} />
        </button>
      </div>
    </div>
  );
}

function CallBtn({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid place-items-center w-[52px] h-[52px] rounded-full transition-colors backdrop-blur",
        active ? "bg-white text-[#141A32]" : "bg-white/12 hover:bg-white/20 text-white",
      )}
    >
      <Icon name={icon} size={21} />
    </button>
  );
}

/* Drives the ripple level meter from a raw mic MediaStream via Web Audio. */
function useMicLevel(mediaStream, muted) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!mediaStream || muted || !mediaStream.getAudioTracks().length) { setLevel(0); return; }
    let raf;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    ctx.createMediaStreamSource(mediaStream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
      setLevel(Math.min(1, Math.sqrt(sum / data.length) * 3.2));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); ctx.close().catch(() => {}); };
  }, [mediaStream, muted]);
  return level;
}

/* ============================================================================
   Real Stream-backed call.
   ========================================================================= */
function RealCall(props) {
  const { mode, callId, members } = props;
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  // Stable key so an inline `members` array doesn't re-run the effect each render.
  const memberKey = JSON.stringify((members || []).map((m) => m.id));

  useEffect(() => {
    const c = getVideoClient();
    const ring = (members || []).length > 0;
    // Ring calls get a fresh unique id (membership + ring events connect the
    // parties); non-ring calls use the deterministic id so both sides can join.
    const id = ring
      ? `call-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      : String(callId || "call").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64);
    const theCall = c.call("default", id);
    setClient(c);
    setCall(theCall);
    let active = true;
    (async () => {
      try {
        if (ring) {
          const me = getCurrentUser();
          const ids = [...new Set([me.id, ...(members || []).map((m) => m.id)].filter(Boolean))];
          await theCall.getOrCreate({ ring: true, data: { members: ids.map((uid) => ({ user_id: uid })), custom: { mode } } });
          await theCall.join();
        } else {
          await theCall.join({ create: true });
        }
        if (!active) return;
        try {
          await theCall.microphone.enable();
          if (mode === "video") await theCall.camera.enable();
        } catch { /* permission denied — call still connects, just no local media */ }
      } catch { /* connection failed */ }
    })();
    return () => {
      active = false;
      if (theCall.state.callingState !== CallingState.LEFT) theCall.leave().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId, mode, memberKey]);

  if (!client || !call) {
    return <CallView {...props} status="connecting" muted={false} camOff={mode !== "video"} speaker level={0} showVideo={false} onToggleMute={() => {}} onToggleCam={() => {}} onToggleSpeaker={() => {}} />;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme className="contents">
          <InCall {...props} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

// The in-call UI. Expects to run inside a <StreamCall> — reused for both
// outgoing (RealCall) and accepted incoming (IncomingCall) calls.
export function InCall(props) {
  const { mode, onEnd } = props;
  const call = useCall();
  const {
    useMicrophoneState,
    useCameraState,
    useCallCallingState,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();

  const { microphone, isMute: micMuted, mediaStream: micStream } = useMicrophoneState();
  const { camera, isMute: camMuted } = useCameraState();
  const callingState = useCallCallingState();
  const localP = useLocalParticipant();
  const remotes = useRemoteParticipants();

  const [speaker, setSpeaker] = useState(true);
  const level = useMicLevel(micStream, micMuted);

  const status = callingState === CallingState.JOINED ? "active" : "connecting";

  // Leave the Stream call when the user ends, then notify the parent.
  const endedRef = useRef(false);
  const handleEnd = async (seconds) => {
    if (endedRef.current) return;
    endedRef.current = true;
    try { if (call && call.state.callingState !== CallingState.LEFT) await call.leave(); } catch { /* already gone */ }
    onEnd?.(seconds);
  };
  // Auto-close if the call ends remotely (other side hangs up / rejects).
  useEffect(() => {
    if (callingState === CallingState.LEFT && !endedRef.current) {
      endedRef.current = true;
      onEnd?.(0);
    }
  }, [callingState, onEnd]);

  // Pick the primary video: a remote camera if present, otherwise our own.
  const remoteVideo = remotes.find((p) => hasVideo(p));
  const primary = remoteVideo || (localP && hasVideo(localP) ? localP : null);
  const showVideo = mode === "video" && !!primary;
  const isSelfPrimary = primary && primary === localP;

  const videoNode = primary ? (
    <ParticipantView
      participant={primary}
      trackType="videoTrack"
      ParticipantViewUI={null}
      mirror={isSelfPrimary}
      muteAudio
      className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
    />
  ) : null;

  // Self preview shown as PiP only when a remote is the primary video.
  const pipNode = !isSelfPrimary && localP && hasVideo(localP) ? (
    <ParticipantView
      participant={localP}
      trackType="videoTrack"
      ParticipantViewUI={null}
      mirror
      muteAudio
      className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
    />
  ) : null;

  return (
    <>
      {/* remote audio playback (gated by the speaker toggle) */}
      <ParticipantsAudio participants={speaker ? remotes : []} />
      <CallView
        {...props}
        status={status}
        muted={micMuted}
        camOff={camMuted}
        speaker={speaker}
        level={level}
        noDevice={!micStream}
        showVideo={showVideo}
        videoNode={videoNode}
        pipNode={pipNode}
        onToggleMute={() => microphone.toggle()}
        onToggleCam={() => camera.toggle()}
        onToggleSpeaker={() => setSpeaker((s) => !s)}
        onEnd={handleEnd}
      />
    </>
  );
}

/* ============================================================================
   Local-only fallback (no Stream keys) — preserves the original demo behaviour:
   acquires the mic/camera via getUserMedia and drives the meter locally, but
   there is no peer connection.
   ========================================================================= */
function SimulatedCall(props) {
  const { mode } = props;
  const [status, setStatus] = useState("connecting");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [noDevice, setNoDevice] = useState(false);
  const [stream, setStream] = useState(null);

  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const level = useMicLevel(stream, muted);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === "video" });
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = s;
        setStream(s);
        if (videoRef.current && mode === "video") videoRef.current.srcObject = s;
      } catch {
        if (!cancelled) setNoDevice(true);
      }
    })();
    const t = setTimeout(() => setStatus("active"), 1500);
    return () => {
      cancelled = true;
      clearTimeout(t);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [mode]);

  useEffect(() => { streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !muted)); }, [muted]);
  useEffect(() => { streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOff)); }, [camOff]);

  const showVideo = mode === "video" && !camOff && !noDevice;
  const videoNode = (
    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
  );

  return (
    <CallView
      {...props}
      status={status}
      muted={muted}
      camOff={camOff}
      speaker={speaker}
      level={level}
      noDevice={noDevice}
      showVideo={showVideo}
      videoNode={videoNode}
      onToggleMute={() => setMuted((m) => !m)}
      onToggleCam={() => setCamOff((c) => !c)}
      onToggleSpeaker={() => setSpeaker((s) => !s)}
    />
  );
}
