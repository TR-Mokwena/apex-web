"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * Voice / video call overlay. No signalling backend — but genuinely functional
 * locally: it acquires the mic (and camera for video) via getUserMedia, drives a
 * live level meter off a Web Audio AnalyserNode, and Mute/Camera really toggle the
 * track. Falls back to a simulated call if permission is denied or no device exists.
 */
export default function CallModal({ mode, title, subtitle, avatar, bg, isChannel, onEnd }) {
  const [status, setStatus] = useState("connecting"); // connecting → active
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [level, setLevel] = useState(0);
  const [noDevice, setNoDevice] = useState(false);

  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);

  // Acquire media + set up the level analyser once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === "video" });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current && mode === "video") videoRef.current.srcObject = stream;

        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
          setLevel(Math.min(1, Math.sqrt(sum / data.length) * 3.2));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        if (!cancelled) setNoDevice(true);
      }
    })();

    const t = setTimeout(() => setStatus("active"), 1500);
    return () => {
      cancelled = true;
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (ctxRef.current) ctxRef.current.close().catch(() => {});
    };
  }, [mode]);

  // Call timer.
  useEffect(() => {
    if (status !== "active") return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [status]);

  // Mute / camera really gate the tracks.
  useEffect(() => { streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !muted)); }, [muted]);
  useEffect(() => { streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOff)); }, [camOff]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onEnd();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onEnd]);

  const showVideo = mode === "video" && !camOff && !noDevice;
  const ring = muted ? 0 : level;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-between py-14 text-white bg-gradient-to-b from-[#141A32] to-[#0B0F1E]">
      {/* self video fills the frame in video mode */}
      {mode === "video" && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn("absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity", showVideo ? "opacity-100" : "opacity-0")}
        />
      )}
      {mode === "video" && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />}

      {/* callee */}
      <div className="relative flex flex-col items-center gap-4 mt-6">
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
        <div className={cn("text-center", showVideo && "absolute top-2 left-0 right-0")}>
          <div className="text-[22px] font-semibold tracking-[-0.01em]">{title}</div>
          <div className="mt-1 text-[13px] text-white/60 flex items-center justify-center gap-1.5">
            <Icon name={mode === "video" ? "Video" : "Phone"} size={13} />
            {status === "connecting" ? "Calling…" : fmt(seconds)}
            {noDevice && status === "active" && <span className="text-white/40">· no mic</span>}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="relative flex items-center gap-4">
        <CallBtn active={muted} onClick={() => setMuted((m) => !m)} icon={muted ? "MicOff" : "Mic"} label={muted ? "Unmute" : "Mute"} />
        {mode === "video" && (
          <CallBtn active={camOff} onClick={() => setCamOff((c) => !c)} icon={camOff ? "VideoOff" : "Video"} label={camOff ? "Start video" : "Stop video"} />
        )}
        <CallBtn active={!speaker} onClick={() => setSpeaker((s) => !s)} icon={speaker ? "Volume2" : "VolumeX"} label="Speaker" />
        <button
          type="button"
          onClick={onEnd}
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
