# Apex motion graphics (Remotion)

A SaaS-style **product tour** of Apex, rendered to MP4. Built with
[Remotion](https://remotion.dev) — videos are React components, so this reuses
the app's design tokens (`app/globals.css`), fonts (Poppins / IBM Plex Mono),
and the dependency-free SVG charts from `components/ui/charts.jsx`.

> ⚠️ **Licensing:** Remotion is free for individuals and companies of up to 3
> people; larger companies need a paid Company License. Confirm before shipping.
> See https://remotion.dev/license

## Commands

```bash
npm run remotion          # open Remotion Studio (live preview + scrub)
npm run remotion:render   # render → out/apex-tour.mp4
npm run remotion:still    # render a single PNG frame → out/apex-still.png
```

First render downloads a headless Chrome (~1 min, one-time). Output lands in
`out/` (already gitignored). Remotion uses its **own** webpack bundler, so it
never touches the Next.js `.next/` cache — they're safe to run side by side.

## Structure

```
remotion.config.ts        Tailwind v4 + the project's @/ alias, wired into Remotion's webpack
remotion/
  index.js                entry — registerRoot
  Root.jsx                <Composition> list (id: "ApexTour", 1920×1080, 30fps)
  ApexTour.jsx            stitches the 5 scenes with cross-transitions; owns timing
  style.css               @import "../app/globals.css"  (Tailwind + tokens)
  lib/brand.js            fonts (Google) + JS mirror of the design tokens + avatar palette
  lib/anim.js             fadeUp / popIn / countUp helpers (matches --ease-out)
  components/
    Frame.jsx             the floating "Apex app window" (navy sidebar + topbar)
    PageScene.jsx         shared chrome: background, window entrance, caption, step dots
    Caption.jsx           lower-third kicker + headline
    Reveal.jsx            clip-path wipe (used to draw charts in)
    ui.jsx                Card / Pill / Avatar / KanbanCard (token-styled)
  scenes/                 Intro, Dashboard, Board, Insights, Outro
```

## Tweaking

- **Timing / length:** `SCENES` + `T` in `ApexTour.jsx`.
- **Copy & data:** the `const` blocks at the top of each scene in `scenes/`.
- **Aspect ratio (e.g. 1:1 or 9:16 for social):** add another `<Composition>` in
  `Root.jsx` with different `width`/`height` pointing at the same component (the
  page scenes assume 1920×1080, so vertical sizes need layout tweaks).
- **Colors/fonts:** inherited from `app/globals.css` automatically — change them
  once there and both the app and the video update.
