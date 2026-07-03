// Lower-third caption (kicker + headline) sitting in the margin under the frame.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeUp } from "../lib/anim";

export function Caption({ kicker, title, delay = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = fadeUp(frame, fps, { delay, dist: 30 });
  const b = fadeUp(frame, fps, { delay: delay + 6, dist: 30 });
  return (
    <div className="absolute left-[210px] bottom-[60px]" style={{ width: 1500 }}>
      <div className="text-brand text-[18px] font-semibold uppercase mb-2 tracking-[0.16em]" style={a}>
        {kicker}
      </div>
      <div className="text-heading text-[46px] font-bold leading-[1.05]" style={b}>
        {title}
      </div>
    </div>
  );
}
