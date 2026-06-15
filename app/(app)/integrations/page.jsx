"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const CATEGORIES = ["All", "Source Control", "Communication", "Productivity", "Monitoring", "Developer"];

const INTEGRATIONS = [
  { name: "GitHub", cat: "Source Control", icon: "Github", color: "#181717", desc: "Sync commits, pull requests and reviews for contribution insights.", connected: true },
  { name: "GitLab", cat: "Source Control", icon: "GitBranch", color: "#FC6D26", desc: "Track merge requests and CI pipelines across your repos." },
  { name: "Slack", cat: "Communication", icon: "MessageSquare", color: "#4A154B", desc: "Post risk alerts, digests and mentions to your channels.", connected: true },
  { name: "Microsoft Teams", cat: "Communication", icon: "Video", color: "#5059C9", desc: "Deliver Apex notifications straight into Teams." },
  { name: "Jira", cat: "Productivity", icon: "SquareKanban", color: "#0052CC", desc: "Two-way issue sync to keep boards and tasks aligned." },
  { name: "Linear", cat: "Productivity", icon: "Activity", color: "#5E6AD2", desc: "Sync issues and cycles with your engineering workflow." },
  { name: "Figma", cat: "Productivity", icon: "Figma", color: "#F24E1E", desc: "Embed design files and frames directly inside tasks." },
  { name: "Notion", cat: "Productivity", icon: "FileText", color: "#111827", desc: "Link docs, specs and wikis to projects and milestones." },
  { name: "Google Calendar", cat: "Productivity", icon: "Calendar", color: "#4285F4", desc: "Push sprints, milestones and deadlines to your calendar.", connected: true },
  { name: "Sentry", cat: "Monitoring", icon: "TriangleAlert", color: "#362D59", desc: "Surface production errors as AI risk alerts." },
  { name: "Datadog", cat: "Monitoring", icon: "ChartNoAxesColumn", color: "#632CA6", desc: "Pull deploy and performance metrics into reports." },
  { name: "PagerDuty", cat: "Monitoring", icon: "Siren", color: "#06AC38", desc: "Escalate incidents and link them to affected projects." },
  { name: "CircleCI", cat: "Developer", icon: "CircleDot", color: "#343434", desc: "Show build and test status on tasks and PRs." },
  { name: "Webhooks", cat: "Developer", icon: "Webhook", color: "#6366F1", desc: "Send any Apex event to an external URL in real time." },
];

export default function IntegrationsPage() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [connected, setConnected] = useState(() => new Set(INTEGRATIONS.filter((i) => i.connected).map((i) => i.name)));

  const toggle = (name) => setConnected((c) => { const n = new Set(c); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const filtered = INTEGRATIONS.filter((i) =>
    (cat === "All" || i.cat === cat) && i.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Blocks" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Integrations</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Connect Apex to the tools your team already uses.</div>
          </div>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 rounded-field text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="Plus" size={15} />Request integration</button>
      </div>

      {/* summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-4">
        {[
          { icon: "PlugZap", tone: "bg-emerald-50 text-emerald-600", v: connected.size, l: "Connected" },
          { icon: "Blocks", tone: "bg-brand-soft text-brand", v: INTEGRATIONS.length, l: "Available" },
          { icon: "ShieldCheck", tone: "bg-amber-50 text-amber-500", v: CATEGORIES.length - 1, l: "Categories" },
        ].map((s) => (
          <div key={s.l} className="card !rounded-[14px] !shadow-card p-[15px_16px] flex items-center gap-3">
            <span className={cn("grid place-items-center w-[42px] h-[42px] rounded-xl flex-none", s.tone)}><Icon name={s.icon} size={20} /></span>
            <div><div className="text-2xl font-bold tracking-[-0.02em] leading-none">{s.v}</div><div className="text-xs text-ink-2 mt-0.5">{s.l}</div></div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex gap-1.5 bg-card border border-line rounded-[11px] p-1 shadow-card overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-colors", cat === c ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:text-ink")}>{c}</button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-card border border-line rounded-field px-3 py-2.5 w-full sm:w-[240px] shadow-card">
          <Icon name="Search" size={15} className="text-ink-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search integrations..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
        </div>
      </div>

      {/* grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filtered.map((it) => {
          const on = connected.has(it.name);
          return (
            <div key={it.name} className="card p-[18px] flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none" style={{ background: it.color }}><Icon name={it.icon} size={22} className="text-white" /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <b className="text-[14.5px] font-semibold">{it.name}</b>
                    {on && <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active</span>}
                  </div>
                  <div className="text-[11.5px] text-ink-3 mt-0.5">{it.cat}</div>
                </div>
              </div>
              <p className="m-0 text-[12.5px] text-ink-2 leading-relaxed flex-1">{it.desc}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(it.name)}
                  className={cn("flex-1 h-9 rounded-field text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors",
                    on ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-brand text-white hover:bg-brand-600")}
                >
                  {on ? <><Icon name="Check" size={15} />Connected</> : "Connect"}
                </button>
                <button className="grid place-items-center w-9 h-9 rounded-field border border-line bg-card text-ink-2 hover:border-[#C7D2FE]"><Icon name="Settings" size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card grid place-items-center py-16 text-center mt-1">
          <div className="flex flex-col items-center gap-2"><Icon name="SearchX" size={28} className="text-ink-3" /><div className="text-[13.5px] text-ink-2">No integrations match your search.</div></div>
        </div>
      )}
    </>
  );
}
