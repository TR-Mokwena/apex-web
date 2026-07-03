// Shared chrome for the three "product page" scenes: soft brand-tinted
// background, the app window floating/scaling in, a caption + step dots.
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Frame } from "./Frame";
import { Caption } from "./Caption";
import { EASE } from "../lib/anim";
import { C } from "../lib/brand";

function StepDots({ step, total }) {
  return (
    <div className="absolute right-[210px] bottom-[80px] flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-pill"
          style={{ width: i + 1 === step ? 26 : 8, height: 8, background: i + 1 === step ? C.brand : "#cbd2e0" }}
        />
      ))}
    </div>
  );
}

export function PageScene({ active, title, caption, step, total = 3, children }) {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE };
  const opacity = interpolate(frame, [0, 22], [0, 1], clamp);
  const y = interpolate(frame, [0, 22], [44, 0], clamp);
  const scale = interpolate(frame, [0, 22], [0.965, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1300px 760px at 72% -12%, #eceefe 0%, #f6f7fb 58%)" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 210,
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <Frame active={active} title={title}>
          {children}
        </Frame>
      </div>
      <Caption kicker={caption.kicker} title={caption.title} delay={12} />
      <StepDots step={step} total={total} />
    </AbsoluteFill>
  );
}
