import { useId } from "react";

/**
 * Apex brand mark — a gradient peak "A": a bold straight left blade, a curved
 * "ribbon" right blade, a lightened left face for a two-tone fold, and a swoosh
 * arc as the crossbar. Uses the brand tokens so it follows the active accent and
 * light/dark mode. `size` sets both dimensions; pass `className` for layout.
 */
export function ApexMark({ size = 40, className, title }) {
  const id = useId();
  const g = `apex-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role={title ? "img" : "presentation"} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={g} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-brand)" />
          <stop offset="1" stopColor="var(--color-brand-600)" />
        </linearGradient>
      </defs>

      {/* right blade — curved ribbon */}
      <path d="M24 6.5 Q37 19 43 42 L34.5 42 L24 16 Z" fill={`url(#${g})`} stroke={`url(#${g})`} strokeWidth="1.6" strokeLinejoin="round" />
      {/* left blade — bold straight leg */}
      <path d="M5 42 L24 6.5 L24 16 L13.5 42 Z" fill={`url(#${g})`} stroke={`url(#${g})`} strokeWidth="1.6" strokeLinejoin="round" />
      {/* two-tone fold: lighten the left face */}
      <path d="M5 42 L24 6.5 L24 16 L13.5 42 Z" fill="#fff" opacity="0.14" />
      {/* swoosh crossbar */}
      <path d="M18 28 Q24 35.8 30 28 Q24 31.4 18 28 Z" fill={`url(#${g})`} stroke={`url(#${g})`} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export default ApexMark;
