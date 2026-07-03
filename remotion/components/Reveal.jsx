// Wipe-reveal a child via an animated clip-path — used to "draw in" charts.
import { useCurrentFrame, interpolate } from "remotion";
import { EASE } from "../lib/anim";

export function Reveal({ delay = 0, dur = 30, dir = "left", children, style }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, dur], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const clip = dir === "up" ? `inset(${100 - p}% 0 0 0)` : `inset(0 ${100 - p}% 0 0)`;
  return <div style={{ clipPath: clip, ...style }}>{children}</div>;
}
