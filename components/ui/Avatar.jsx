import { cn } from "@/lib/cn";

const PALETTE = ["#6366F1", "#22C55E", "#F59E0B", "#0EA5E9", "#8B5CF6", "#EF4444"];

function hueFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/** Initials avatar. Pass `color` to override the name-hashed colour. */
export function Avatar({ name = "", size = 30, color, className, style }) {
  const initials = name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return (
    <span
      className={cn("grid place-items-center rounded-full flex-none text-white font-semibold", className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: color || hueFor(name), ...style }}
    >
      {initials}
    </span>
  );
}
