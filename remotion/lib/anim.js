import { interpolate, spring, Easing } from "remotion";

// Matches the app's --ease-out: cubic-bezier(0.22, 1, 0.36, 1).
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE };

// Fade + rise — the workhorse entrance for cards, captions, rows.
export function fadeUp(frame, fps, { delay = 0, dist = 24, dur = 18 } = {}) {
  const f = frame - delay;
  const opacity = interpolate(f, [0, dur], [0, 1], clamp);
  const y = interpolate(f, [0, dur], [dist, 0], clamp);
  return { opacity, transform: `translateY(${y.toFixed(2)}px)` };
}

// Springy 0→1 used for pop/scale entrances.
export function popIn(frame, fps, { delay = 0, damping = 16, mass = 0.7 } = {}) {
  return spring({ frame: frame - delay, fps, config: { damping, mass } });
}

// Eased number ramp for counting KPIs / gauges up from zero.
export function countUp(frame, fps, to, { delay = 0, dur = 30 } = {}) {
  return interpolate(frame - delay, [0, dur], [0, to], clamp);
}
