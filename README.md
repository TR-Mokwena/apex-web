# Apex

**AI-assisted project, sprint & contribution tracker** by Eclipse Softworks.

A Next.js (App Router) + Tailwind v4 web app — a light "indigo on slate" theme with a dark navy sidebar, modernized from a set of standalone HTML design mockups. It's a **front-end UI kit**: there is no backend yet, so every screen renders demo data defined inline, and interactions persist in React state (a few in `localStorage`).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000 (or next free port)
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build — compiles every route, lints, prerenders |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |

There's no test suite — **`npm run build` is the fastest full correctness check** (it type-checks, lints, and prerenders all routes).

> **Gotcha:** dev and build share the `.next/` directory. Running `npm run build` while `npm run dev` is live (or vice-versa) corrupts the cache and yields `ENOENT … vendor-chunks/*.js` errors. Fix: stop the server, `rm -rf .next`, restart. `.next/` is gitignored, so deleting it is always safe.

## Tech stack

- **Next.js 15** (App Router, JSX — no TypeScript)
- **Tailwind CSS v4** (`@theme` design tokens in `app/globals.css`)
- **lucide-react** icons (via `components/Icon.jsx`)
- **jsPDF** for client-side PDF generation (invoices + AI reports)
- `next/font/google` — Poppins (display/sans) + IBM Plex Mono

## Architecture

Real **per-page routing**. App routes live under `app/(app)/` — a route group sharing one chrome via `app/(app)/layout.jsx` → `components/shell/AppShell.jsx`:

- `components/shell/Sidebar.jsx` — navy gradient sidebar; nav config + active-route detection, Quick Create, collapse, mobile drawer.
- `components/shell/Topbar.jsx` — sticky bar: search (→ `/command`, bound to ⌘K), quick-add, notifications, messages, org switcher.
- `lib/nav.js` — the `NAV` array driving the sidebar **and** the command palette.

Routes **outside** the `(app)` group render with no shell, by design: `app/command/` (palette overlay), `app/onboarding/` (5-step wizard), and `app/login/`.

**Adding a screen** = create `app/(app)/<route>/page.jsx`, and add a `NAV` entry in `lib/nav.js` if it belongs in the sidebar.

### Pages

| Route | Highlights |
| --- | --- |
| `/` | Dashboard — KPIs, charts, AI insight; date-range picker drives the figures |
| `/projects`, `/projects/[slug]` | Project list + detail (board / list / timeline views) |
| `/tasks` | Kanban + table with create modal, drag & drop |
| `/milestones`, `/milestones/[slug]` | Milestones + detail |
| `/sprints` | Active-sprint banner, burndown, velocity; project switcher + New Sprint modal |
| `/contributors` | Contribution Intelligence — Overview / Commits / PRs / Reviews / Activity tabs, heatmap, range picker |
| `/reports` | Analytics Suite — Overview / Team / Individual / Predictive / Capacity tabs |
| `/calendar` | Month / Week / Day views, New Event modal, calendar filters |
| `/knowledge` | Knowledge Hub — category/tag/search filtering, reader + new-page modals |
| `/ai` | AI Command Center (dark theme) — working chat, Deep Research modes, PDF report generation |
| `/automation` | Visual workflow builder (drag nodes, connect, test run) — touch-friendly |
| `/integrations` | Integration directory + multi-step connect workflow |
| `/messages` | Channels & DMs with live send, search, filters |
| `/notifications` | Feed with mark-all-read, tab filters |
| `/settings` | Admin sections: General, Appearance, Teams, Users, Roles, Audit Logs, Feature Flags, Integrations, API Keys, Billing |
| `/command` | ⌘K palette with filtering + keyboard nav |
| `/onboarding`, `/login` | Standalone flows (no app shell) |

`/ai` is intentionally **dark-themed** (the mockup was); it full-bleeds a dark background over the light main area.

## Styling & design tokens

Tokens live in `app/globals.css` under Tailwind v4's `@theme`. The palette maps onto Tailwind's built-in `indigo` / `slate` / `emerald` / `amber` / `red` scales.

- **Prefer Tailwind's built-in color utilities** (`bg-indigo-500`, `text-slate-500`, …) for general color.
- Use the **semantic/brand tokens** for kit surfaces: `bg-brand` / `text-brand` / `bg-brand-soft`, `text-ink*` / `text-heading`, `bg-bg`, `bg-card`, `border-line`, `bg-sidebar*`, `rounded-card` / `rounded-field` / `rounded-pill`, `shadow-card` / `shadow-pop`. The `.card` class is defined in `globals.css`.
- Faithful pixel values are kept as Tailwind **arbitrary values** (`w-[34px]`, `text-[13.5px]`, `rounded-[11px]`) to match the mockups. The editor lints these with `suggestCanonicalClasses` warnings — **these are intentional; ignore them.**

### Theming

- **Accent**: `lib/theme.js` sets `--color-brand`; an accent picker lives in Settings → Appearance.
- **Light/dark mode**: token overrides + a no-flash inline `<head>` script.
- **Country-based locale**: `lib/locale.js` derives currency (ZAR base + FX) and number formatting from the org's country, with manual separator formatting to avoid hydration mismatches.

## Shared components (`components/ui/`, barrel `@/components/ui`)

Reusable primitives — reach for these before re-implementing: `Card` / `CardLink`, `PageHeader`, `Button`, `Tabs`, `Switch`, `Dropdown` / `MenuItem`, `Modal` / `Field` / `TextInput` / `Select` / `Textarea`, `Pill` / `Priority` / `Delta`, `Avatar`, `Kpi`, `RangePicker`, `StubPage`, and a dependency-free SVG **chart set** in `charts.jsx` (`Sparkline`, `LineChart`, `BarPairs`, `Donut`, `Gauge`, `Ring`, `LegendRow`).

`components/Icon.jsx` wraps `lucide-react` — request icons by PascalCase name (`<Icon name="LayoutDashboard" />`). `components/BrandLogo.jsx` renders real brand marks (Simple Icons CDN, lucide fallback) for the integration cards.

## Conventions

- Pages and interactive components are `"use client"`. The `@/` alias maps to the project root (`jsconfig.json`).
- Variant/tone/status are plain objects mapping a string key → className, with a fallback (see `PILL_TONE`, `STATUS` maps in the screens).
- Demo data is defined as module-level consts at the top of each page (`TEAMS`, `MILESTONES`, `EVENTS`, …). There is no shared data layer or fetching yet.

## Status & roadmap

All screens are fully built and interactive against demo data, and `npm run build` passes clean. The natural next step is a **backend**: real auth, a data layer / API, and live data to replace the inline demo consts — at which point the integration "connect" flows become real OAuth and reports/contributions read live sources.

---

© Eclipse Softworks
