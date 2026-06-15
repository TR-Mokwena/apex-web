// User-selectable accent. Only --color-brand is set; --color-brand-600 and
// --color-brand-soft derive from it via color-mix in globals.css.
export const ACCENT_KEY = "apex-accent";
export const DEFAULT_ACCENT = "#6366F1";

export const ACCENTS = [
  { name: "Indigo", hex: "#6366F1" },
  { name: "Violet", hex: "#8B5CF6" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Sky", hex: "#0EA5E9" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Rose", hex: "#F43F5E" },
];

export function applyAccent(hex) {
  if (typeof document !== "undefined") document.documentElement.style.setProperty("--color-brand", hex);
}
export function saveAccent(hex) {
  try { localStorage.setItem(ACCENT_KEY, hex); } catch {}
}
export function getStoredAccent() {
  try { return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT; } catch { return DEFAULT_ACCENT; }
}

/* ─── light / dark mode ───────────────────────────────────────────────────── */
export const MODE_KEY = "apex-mode";

export function applyMode(mode) {
  if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", mode === "dark");
}
export function saveMode(mode) {
  try { localStorage.setItem(MODE_KEY, mode); } catch {}
}
export function getStoredMode() {
  try { return localStorage.getItem(MODE_KEY) === "dark" ? "dark" : "light"; } catch { return "light"; }
}
