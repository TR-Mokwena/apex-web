// Opening logo sting on the dark navy brand background.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { fadeUp } from "../lib/anim";

export function IntroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const glow = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1000px 720px at 50% 34%, #1b2358 0%, #0b1020 68%)" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
        <div
          className="w-[132px] h-[132px] rounded-[34px] grid place-items-center"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            transform: `scale(${logo})`,
            boxShadow: `0 40px 90px -20px rgba(99,102,241,${0.65 * glow})`,
          }}
        >
          <span className="text-white text-[70px] font-bold">A</span>
        </div>
        <div className="text-white text-[88px] font-bold tracking-tight" style={fadeUp(frame, fps, { delay: 12, dist: 26 })}>
          Apex
        </div>
        <div className="text-[#9aa6c6] text-[27px] font-medium" style={fadeUp(frame, fps, { delay: 22, dist: 26 })}>
          AI-assisted project, sprint &amp; contribution tracking
        </div>
        <div className="text-[16px] mt-2" style={fadeUp(frame, fps, { delay: 34, dist: 20 })}>
          <span className="text-[#6b76a0] tracking-[0.22em] uppercase">by Eclipse Softworks</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
