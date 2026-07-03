// Closing CTA on the brand gradient.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { fadeUp } from "../lib/anim";

export function OutroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 13, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#4f46e5 0%, #6366f1 45%, #8b5cf6 100%)" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
        <div
          className="w-[110px] h-[110px] rounded-[28px] grid place-items-center"
          style={{ background: "rgba(255,255,255,0.16)", transform: `scale(${logo})` }}
        >
          <span className="text-white text-[60px] font-bold">A</span>
        </div>
        <div className="text-white text-[76px] font-bold tracking-tight text-center" style={fadeUp(frame, fps, { delay: 10 })}>
          Start tracking with Apex
        </div>
        <div className="text-white/85 text-[26px]" style={fadeUp(frame, fps, { delay: 20 })}>
          Plan sprints · ship faster · measure impact
        </div>
        <div
          className="mt-4 px-8 py-3 rounded-pill bg-white text-[21px] font-semibold"
          style={{ color: "#4f46e5", ...fadeUp(frame, fps, { delay: 30 }) }}
        >
          eclipsesoftworks.com/apex
        </div>
        <div className="text-white/70 text-[17px] mt-1 tracking-[0.18em] uppercase" style={fadeUp(frame, fps, { delay: 38 })}>
          Built by Eclipse Softworks
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
