// Brand kit for the video: the same fonts + tokens as the Apex app, loaded in a
// way Remotion's renderer understands (Google fonts via @remotion/google-fonts,
// tokens mirrored as plain JS for inline styles / SVG fills).
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

export const { fontFamily: poppins } = loadPoppins("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export const { fontFamily: mono } = loadPlexMono("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

// JS mirror of app/globals.css @theme (for inline styles & chart fills).
export const C = {
  brand: "#6366f1",
  brand600: "#5457d6",
  brandSoft: "#eef0fe",
  bg: "#f6f7fb",
  bgSoft: "#fbfcfe",
  card: "#ffffff",
  line: "#edf0f5",
  ink: "#1e293b",
  ink2: "#64748b",
  ink3: "#94a3b8",
  heading: "#0f172a",
  emerald: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  violet: "#8b5cf6",
};

// The recurring avatar gradients (mirrors PAL across the app screens).
export const PAL = [
  ["#6366f1", "#8b5cf6"],
  ["#f59e0b", "#ef4444"],
  ["#22c55e", "#14b8a6"],
  ["#0ea5e9", "#6366f1"],
  ["#ec4899", "#f43f5e"],
];
