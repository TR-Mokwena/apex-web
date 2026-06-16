"use client";

import { useState, useRef } from "react";
import Icon from "@/components/Icon";
import { Card, CardLink, Tabs, Delta, Sparkline, Dropdown, MenuItem } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
// `w` = a contributor's typical weekly volume; tab KPIs scale it by the range factor.
const PEOPLE = [
  { nm: "TR Mokwena", cm: "1,248 commits", in: "TM", w: { commits: 52, adds: 2100, dels: 980, prs: 6, merged: 5, closed: 1, reviews: 12, approved: 9, changes: 3 } },
  { nm: "Thabo Nkosi", cm: "980 commits", in: "TN", w: { commits: 41, adds: 1680, dels: 760, prs: 5, merged: 4, closed: 1, reviews: 9, approved: 7, changes: 2 } },
  { nm: "Sipho Dlamini", cm: "672 commits", in: "SD", w: { commits: 33, adds: 1290, dels: 540, prs: 4, merged: 3, closed: 1, reviews: 8, approved: 6, changes: 2 } },
  { nm: "Priya Singh", cm: "742 commits", in: "PS", w: { commits: 38, adds: 1520, dels: 690, prs: 5, merged: 4, closed: 0, reviews: 11, approved: 9, changes: 2 } },
  { nm: "Naledi Kgasana", cm: "654 commits", in: "NK", w: { commits: 29, adds: 1100, dels: 470, prs: 3, merged: 3, closed: 0, reviews: 7, approved: 5, changes: 2 } },
];
const STAT_LABELS = ["Commits", "Pull Requests", "Reviews", "Lines of Code"];

// Selectable reporting windows. Each drives the stat tiles, the heatmap intensity
// (`heat`) and the trend chart (7 points + matching day labels).
const RANGE_KEYS = ["This Week", "Last Week", "Last 2 Weeks", "This Month", "Last 30 Days"];
const RANGES = {
  "This Week": {
    label: "Jun 12 – Jun 18, 2026", heat: 1,
    stats: ["1,248", "42", "96", "12.4k"], deltas: ["12%", "18%", "6%", "11%"],
    trend: [25, 38, 33, 46, 42, 62, 55],
    days: ["Jun 12", "Jun 13", "Jun 14", "Jun 15", "Jun 16", "Jun 17", "Jun 18"],
  },
  "Last Week": {
    label: "Jun 5 – Jun 11, 2026", heat: 0.82,
    stats: ["1,032", "37", "88", "10.1k"], deltas: ["7%", "9%", "4%", "8%"],
    trend: [30, 28, 35, 32, 40, 48, 44],
    days: ["Jun 5", "Jun 6", "Jun 7", "Jun 8", "Jun 9", "Jun 10", "Jun 11"],
  },
  "Last 2 Weeks": {
    label: "Jun 4 – Jun 18, 2026", heat: 0.92,
    stats: ["2,280", "79", "184", "22.5k"], deltas: ["10%", "14%", "5%", "9%"],
    trend: [40, 44, 38, 52, 48, 66, 60],
    days: ["Jun 4", "Jun 6", "Jun 8", "Jun 11", "Jun 13", "Jun 15", "Jun 18"],
  },
  "This Month": {
    label: "Jun 1 – Jun 30, 2026", heat: 1.18,
    stats: ["4,690", "163", "372", "48.9k"], deltas: ["15%", "21%", "9%", "13%"],
    trend: [180, 220, 260, 300, 350, 420, 460],
    days: ["Jun 1", "Jun 6", "Jun 11", "Jun 16", "Jun 21", "Jun 26", "Jun 30"],
  },
  "Last 30 Days": {
    label: "May 19 – Jun 18, 2026", heat: 1.12,
    stats: ["4,512", "158", "361", "46.2k"], deltas: ["13%", "17%", "7%", "12%"],
    trend: [150, 190, 230, 280, 330, 400, 440],
    days: ["May 19", "May 24", "May 29", "Jun 3", "Jun 8", "Jun 13", "Jun 18"],
  },
};

// accent-derived ramp — mixes the brand with the card colour so it adapts to light/dark
const RAMP = [
  "color-mix(in srgb, var(--color-brand) 8%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 28%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 48%, var(--color-card))",
  "color-mix(in srgb, var(--color-brand) 70%, var(--color-card))",
  "var(--color-brand)",
  "color-mix(in srgb, var(--color-brand) 78%, black)",
];
const HM_ROWS = ["11 PM", "9 PM", "6 PM", "12 PM", "9 AM"];
const HM_COLS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COL_W = [0.8, 0.95, 1, 0.9, 0.85, 0.4, 0.3];
const ROW_W = [0.55, 0.85, 1, 0.9, 0.6];
function heatValue(r, c, scale = 1) {
  const base = COL_W[c] * ROW_W[r];
  const noise = ((Math.sin(r * 3.1 + c * 1.7) + 1) / 2) * 0.35;
  return Math.round(Math.min(1, (base * 0.72 + noise) * scale) * 22);
}
const levelOf = (v) => (v === 0 ? 0 : v < 4 ? 1 : v < 8 ? 2 : v < 13 ? 3 : v < 18 ? 4 : 5);

function Heatmap({ scale = 1 }) {
  const ref = useRef(null);
  const [tip, setTip] = useState(null);
  const hv = (r, c) => heatValue(r, c, scale);
  const show = (r, c) => (e) => {
    const box = ref.current?.getBoundingClientRect();
    if (box) setTip({ x: e.clientX - box.left, y: e.clientY - box.top, v: hv(r, c), label: `${HM_COLS[c]} · ${HM_ROWS[r]}` });
  };
  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-[42px_1fr] gap-2">
        <div />
        <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mb-2">{HM_COLS.map((c) => <span key={c}>{c}</span>)}</div>
        <div className="flex flex-col justify-between text-[11px] text-ink-3 py-0.5">{HM_ROWS.map((r) => <span key={r}>{r}</span>)}</div>
        <div className="grid grid-cols-7 auto-rows-fr gap-[5px]">
          {HM_ROWS.map((_, r) => HM_COLS.map((__, c) => (
            <div key={`${r}-${c}`} className="aspect-square rounded-[5px] cursor-pointer transition-shadow hover:ring-2 hover:ring-brand/50"
              style={{ background: RAMP[levelOf(hv(r, c))] }} onMouseMove={show(r, c)} onMouseLeave={() => setTip(null)} />
          )))}
        </div>
      </div>
      {tip && (
        <div className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg bg-[#1e293b] text-white text-[11px] font-semibold whitespace-nowrap shadow-pop" style={{ left: tip.x, top: tip.y - 8 }}>
          <span className="text-white/55 font-medium mr-1">{tip.label}</span>{tip.v} contributions
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-end mt-3.5 text-[11px] text-ink-3">
        Less{RAMP.slice(0, 5).map((c, i) => <span key={i} className="w-3 h-3 rounded" style={{ background: c }} />)}More
      </div>
    </div>
  );
}

// How much a range scales a contributor's weekly volume in the per-person tabs.
const RANGE_F = { "This Week": 1, "Last Week": 0.85, "Last 2 Weeks": 1.9, "This Month": 4.1, "Last 30 Days": 3.8 };

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const COMMITS = [
  { h: "a3f9c21", msg: "Fix race condition in auth token refresh", repo: "apex/api", add: 142, del: 38, t: "2h ago" },
  { h: "7b1e904", msg: "Add WhatsApp delivery channel via OmniConnect", repo: "apex/web", add: 318, del: 24, t: "5h ago" },
  { h: "e29d7a0", msg: "Refactor sprint burndown chart to SVG", repo: "apex/web", add: 96, del: 120, t: "1d ago" },
  { h: "c41b8f5", msg: "Country-based currency & number formatting", repo: "apex/web", add: 210, del: 12, t: "1d ago" },
  { h: "f08a3d2", msg: "Cache GitHub contribution aggregates", repo: "apex/api", add: 174, del: 46, t: "2d ago" },
  { h: "9d52e7b", msg: "Wire real brand logos on integrations page", repo: "apex/web", add: 64, del: 9, t: "3d ago" },
];
const PRS = [
  { n: 4821, t: "Fix authentication bug", st: "merged", repo: "apex/api", t2: "merged 2h ago" },
  { n: 4810, t: "Webhook signature verification", st: "open", repo: "apex/api", t2: "opened 6h ago" },
  { n: 4805, t: "Real-time activity feed", st: "merged", repo: "apex/web", t2: "merged 1d ago" },
  { n: 4799, t: "Rate limiting middleware", st: "open", repo: "apex/api", t2: "opened 1d ago" },
  { n: 4790, t: "Deprecate legacy export endpoint", st: "closed", repo: "apex/api", t2: "closed 2d ago" },
];
const PR_TONE = { open: ["bg-[#EAF1FF] text-[#2563EB]", "GitPullRequestArrow"], merged: ["bg-brand-soft text-brand-600", "GitMerge"], closed: ["bg-red-50 text-red-500", "GitPullRequestClosed"] };
const REVIEWS = [
  { pr: "API Gateway v2", author: "Sipho Dlamini", verdict: "approved", t: "1h ago" },
  { pr: "Design system update", author: "Priya Singh", verdict: "changes", t: "3h ago" },
  { pr: "Notification preferences", author: "Naledi Kgasana", verdict: "approved", t: "6h ago" },
  { pr: "Auth token refresh", author: "Thabo Nkosi", verdict: "commented", t: "1d ago" },
  { pr: "Billing invoices PDF", author: "Priya Singh", verdict: "approved", t: "1d ago" },
];
const REV_TONE = { approved: ["bg-emerald-50 text-emerald-600", "CircleCheckBig", "approved"], changes: ["bg-amber-50 text-amber-500", "MessageSquareWarning", "changes requested"], commented: ["bg-[#EAF1FF] text-[#2563EB]", "MessageSquare", "commented"] };
const ACTIVITY = [
  { ic: "GitCommit", tone: "bg-brand-soft text-brand", act: "pushed 4 commits to", tgt: "apex/web", t: "2h ago" },
  { ic: "GitMerge", tone: "bg-emerald-50 text-emerald-600", act: "merged PR #4821 in", tgt: "apex/api", t: "5h ago" },
  { ic: "GitPullRequestArrow", tone: "bg-[#EAF1FF] text-[#2563EB]", act: "opened PR #4810 in", tgt: "apex/api", t: "6h ago" },
  { ic: "MessageSquare", tone: "bg-violet-50 text-violet-500", act: "reviewed PR #4805 in", tgt: "apex/web", t: "1d ago" },
  { ic: "GitCommit", tone: "bg-brand-soft text-brand", act: "pushed 2 commits to", tgt: "apex/api", t: "1d ago" },
  { ic: "CircleCheckBig", tone: "bg-emerald-50 text-emerald-600", act: "approved PR #4799 in", tgt: "apex/api", t: "2d ago" },
];

function StatTile({ label, value, delta, tone }) {
  return (
    <div className="border border-line rounded-[13px] p-[16px_18px]">
      <div className="text-[12.5px] text-ink-2 font-medium">{label}</div>
      <div className={cn("text-[28px] font-bold tracking-[-0.02em] leading-[1.1] mt-2", tone)}>{value}</div>
      {delta && <Delta value={delta} className="mt-1.5 !text-xs" />}
    </div>
  );
}

function CommitsView({ person, f }) {
  const w = person.w;
  const commits = w.commits * f, adds = w.adds * f, dels = w.dels * f;
  return (
    <>
      <Card title={`Commits · ${person.nm}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile label="Total commits" value={fmt(commits)} />
          <StatTile label="Additions" value={`+${fmt(adds)}`} tone="text-emerald-600" />
          <StatTile label="Deletions" value={`−${fmt(dels)}`} tone="text-red-500" />
          <StatTile label="Avg / day" value={fmt(commits / 7)} />
        </div>
      </Card>
      <Card title="Recent commits">
        <div className="-mx-[18px] -mb-[18px]">
          {COMMITS.map((c) => (
            <div key={c.h} className="flex items-center gap-3 px-[18px] py-3 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
              <span className="grid place-items-center w-9 h-9 rounded-[10px] flex-none bg-brand-soft text-brand"><Icon name="GitCommit" size={17} /></span>
              <div className="flex-1 min-w-0">
                <b className="block text-[13.5px] font-medium truncate">{c.msg}</b>
                <span className="text-[11.5px] text-ink-3 font-mono">{c.repo} · {c.h}</span>
              </div>
              <span className="hidden sm:flex items-center gap-2 text-[11.5px] font-semibold tabular-nums flex-none"><span className="text-emerald-600">+{c.add}</span><span className="text-red-500">−{c.del}</span></span>
              <span className="text-[11.5px] text-ink-3 whitespace-nowrap flex-none w-[56px] text-right">{c.t}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function PullRequestsView({ person, f }) {
  const w = person.w;
  const merged = Math.round(w.merged * f), open = Math.round(w.prs * f - merged), closed = Math.round(w.closed * f);
  const rate = Math.round((merged / Math.max(merged + closed, 1)) * 100);
  return (
    <>
      <Card title={`Pull requests · ${person.nm}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile label="Open" value={Math.max(open, 0)} tone="text-[#2563EB]" />
          <StatTile label="Merged" value={merged} tone="text-brand" />
          <StatTile label="Closed" value={closed} tone="text-red-500" />
          <StatTile label="Merge rate" value={`${rate}%`} />
        </div>
      </Card>
      <Card title="Pull requests">
        <div className="-mx-[18px] -mb-[18px]">
          {PRS.map((p) => {
            const [tone, ic] = PR_TONE[p.st];
            return (
              <div key={p.n} className="flex items-center gap-3 px-[18px] py-3 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
                <span className={cn("grid place-items-center w-9 h-9 rounded-[10px] flex-none", tone)}><Icon name={ic} size={17} /></span>
                <div className="flex-1 min-w-0">
                  <b className="block text-[13.5px] font-medium truncate">{p.t}</b>
                  <span className="text-[11.5px] text-ink-3 font-mono">{p.repo} #{p.n}</span>
                </div>
                <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-[7px] capitalize flex-none", tone)}>{p.st}</span>
                <span className="hidden md:block text-[11.5px] text-ink-3 whitespace-nowrap flex-none w-[100px] text-right">{p.t2}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function ReviewsView({ person, f }) {
  const w = person.w;
  const given = Math.round(w.reviews * f), approved = Math.round(w.approved * f), changes = Math.round(w.changes * f);
  const rate = Math.round((approved / Math.max(given, 1)) * 100);
  return (
    <>
      <Card title={`Code reviews · ${person.nm}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile label="Reviews given" value={given} />
          <StatTile label="Approved" value={approved} tone="text-emerald-600" />
          <StatTile label="Changes requested" value={changes} tone="text-amber-500" />
          <StatTile label="Approval rate" value={`${rate}%`} />
        </div>
      </Card>
      <Card title="Recent reviews">
        <div className="-mx-[18px] -mb-[18px]">
          {REVIEWS.map((r, i) => {
            const [tone, ic, label] = REV_TONE[r.verdict];
            return (
              <div key={i} className="flex items-center gap-3 px-[18px] py-3 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors">
                <span className={cn("grid place-items-center w-9 h-9 rounded-[10px] flex-none", tone)}><Icon name={ic} size={17} /></span>
                <div className="flex-1 min-w-0">
                  <b className="block text-[13.5px] font-medium truncate">{r.pr}</b>
                  <span className="text-[11.5px] text-ink-3">by {r.author}</span>
                </div>
                <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-[7px] whitespace-nowrap flex-none", tone)}>{label}</span>
                <span className="text-[11.5px] text-ink-3 whitespace-nowrap flex-none w-[56px] text-right">{r.t}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function ActivityView({ person }) {
  return (
    <Card title="Activity timeline" action={<span className="text-xs text-ink-3">{person.nm}</span>}>
      <div className="relative pl-1">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
            {i < ACTIVITY.length - 1 && <span className="absolute left-[18px] top-9 bottom-0 w-px bg-line" />}
            <span className={cn("grid place-items-center w-9 h-9 rounded-full flex-none z-10", a.tone)}><Icon name={a.ic} size={16} /></span>
            <div className="flex-1 min-w-0 pt-1.5">
              <div className="text-[13px] leading-snug"><b className="font-semibold">{person.nm}</b> <span className="text-ink-2">{a.act}</span> <b className="font-semibold text-brand-600">{a.tgt}</b></div>
              <div className="text-[11.5px] text-ink-3 mt-0.5">{a.t}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ContributorsPage() {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState("Overview");
  const [range, setRange] = useState("This Week");
  const R = RANGES[range];
  const person = PEOPLE[sel];
  const f = RANGE_F[range] ?? 1;
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-[18px] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="GitPullRequestArrow" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Contribution Intelligence</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Engineering contribution analytics across your organization.</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-[18px]">
        <Tabs items={["Overview", "Commits", "Pull Requests", "Reviews", "Activity"]} value={tab} onChange={setTab} className="!border-0" />
        <Dropdown align="right" width={172} trigger={({ toggle, open }) => (
          <button onClick={toggle} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-ink-2 hover:text-ink">
            <Icon name="Calendar" size={15} className="text-ink-3" />{R.label}
            <Icon name="ChevronDown" size={15} className={cn("text-ink-3 transition-transform", open && "rotate-180")} />
          </button>
        )}>
          {RANGE_KEYS.map((k) => (
            <MenuItem key={k} onClick={() => setRange(k)} trailing={k === range ? <Icon name="Check" size={14} className="text-brand" /> : null}>
              <span className="flex flex-col"><span className="font-medium">{k}</span><span className="text-[11px] text-ink-3">{RANGES[k].label}</span></span>
            </MenuItem>
          ))}
        </Dropdown>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* people rail */}
        <div className="w-full lg:w-[228px] flex-none card !shadow-card p-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-2.5 pt-2.5 pb-2">Contributors</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-1">
            {PEOPLE.map((p, i) => (
              <button key={p.nm} onClick={() => setSel(i)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[11px] text-left transition-colors", sel === i ? "bg-brand-soft" : "hover:bg-bg")}>
                <span className="grid place-items-center w-9 h-9 rounded-full flex-none text-white text-[13px] font-semibold" style={{ background: PAL[i % PAL.length] }}>{p.in}</span>
                <div className="min-w-0 flex-1"><div className="text-[13.5px] font-semibold leading-tight truncate">{p.nm}</div><div className="text-[11.5px] text-ink-3 mt-0.5">{p.cm}</div></div>
                <Icon name="ChevronRight" size={15} className={cn("ml-auto", sel === i ? "text-brand" : "text-ink-3")} />
              </button>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="flex-1 min-w-0 flex flex-col gap-[18px]">
          {tab === "Overview" && (
            <>
              <Card title="Contribution Overview" action={<CardLink>View detailed breakdown</CardLink>}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STAT_LABELS.map((l, i) => (
                    <div key={l} className="border border-line rounded-[13px] p-[16px_18px]">
                      <div className="text-[12.5px] text-ink-2 font-medium">{l}</div>
                      <div className="text-[28px] font-bold tracking-[-0.02em] leading-[1.1] mt-2">{R.stats[i]}</div>
                      <Delta value={R.deltas[i]} className="mt-1.5 !text-xs" />
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-[18px]">
                <Card title="Activity Heatmap">
                  <Heatmap scale={R.heat} />
                </Card>

                <Card title="Contribution Trend" action={<span className="flex items-center gap-2 text-xs text-ink-2"><span className="w-4 border-t-2 border-brand" />Commits</span>}>
                  <Sparkline values={R.trend} width={420} height={210} fill color="var(--color-brand)" />
                  <div className="grid grid-cols-7 text-[11px] text-ink-3 text-center mt-1">
                    {R.days.map((d) => <span key={d}>{d}</span>)}
                  </div>
                </Card>
              </div>
            </>
          )}

          {tab === "Commits" && <CommitsView person={person} f={f} />}
          {tab === "Pull Requests" && <PullRequestsView person={person} f={f} />}
          {tab === "Reviews" && <ReviewsView person={person} f={f} />}
          {tab === "Activity" && <ActivityView person={person} />}
        </div>
      </div>
    </>
  );
}
