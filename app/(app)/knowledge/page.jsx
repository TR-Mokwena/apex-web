"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Dropdown, MenuItem, Modal, Field, TextInput, Select, Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const CATS = [
  { label: "All Pages", icon: "Files" },
  { label: "Architecture", icon: "LayoutTemplate" },
  { label: "ADRs", icon: "GitBranch" },
  { label: "Meeting Notes", icon: "NotebookPen" },
  { label: "Retrospectives", icon: "History" },
  { label: "Playbooks", icon: "BookMarked" },
  { label: "Incident Reports", icon: "Siren" },
  { label: "Post-Mortems", icon: "FileSearch" },
];
const CAT_ICON = {
  Architecture: "Workflow", ADRs: "GitBranch", "Meeting Notes": "NotebookPen",
  Retrospectives: "History", Playbooks: "BookMarked", "Incident Reports": "Siren", "Post-Mortems": "FileSearch",
};
const PREFIX = {
  Architecture: "ARC", ADRs: "ADR", "Meeting Notes": "MTG",
  Retrospectives: "RETRO", Playbooks: "PB", "Incident Reports": "INC", "Post-Mortems": "PM",
};
const TAG_STYLE = {
  Web: "bg-brand-soft text-[#4F46E5]",
  Architecture: "bg-[#EDE9FE] text-[#7C3AED]",
  Data: "bg-[#FEF3C7] text-[#B45309]",
  Security: "bg-[#FEE2E2] text-[#DC2626]",
  Process: "bg-[#DBEAFE] text-[#2563EB]",
  Infra: "bg-[#CCFBF1] text-[#0D9488]",
};
const TAG_HEX = {
  Web: ["#EEF0FE", "#4F46E5"], Architecture: ["#EDE9FE", "#7C3AED"], Data: ["#FEF3C7", "#B45309"],
  Security: ["#FEE2E2", "#DC2626"], Process: ["#DBEAFE", "#2563EB"], Infra: ["#CCFBF1", "#0D9488"],
};
const TAGS = Object.keys(TAG_HEX);
const SORTS = ["Recently updated", "Oldest", "Title A–Z"];
const WORKSPACES = ["Eclipse Softworks", "Apex Labs", "OmniConnect SA"];

const DOCS_SEED = [
  { id: "ARC-001", t: "System Context & Service Map", date: "June 12, 2026", who: "Sipho D.", tag: "Architecture", cat: "Architecture", ts: 62, body: "High-level map of Apex services and their boundaries.\nThe web app talks to the API gateway, which fans out to the projects, contributions and billing services over an internal event bus." },
  { id: "ARC-002", t: "Frontend Rendering Strategy", date: "June 9, 2026", who: "Priya S.", tag: "Web", cat: "Architecture", ts: 59, body: "Next.js App Router with mostly client components for interactive screens.\nHeavy data views prefer server components once the data layer lands; charts stay client-side." },
  { id: "ARC-003", t: "Multi-tenant Data Model", date: "June 5, 2026", who: "Thabo N.", tag: "Data", cat: "Architecture", ts: 55, body: "Row-level tenancy keyed by organization id with Postgres RLS.\nShared schema, isolated rows — simpler ops than schema-per-tenant at our scale." },
  { id: "ADR-001", t: "Choose Next.js for Web Platform", date: "June 10, 2026", who: "TR Mokwena", tag: "Web", cat: "ADRs", ts: 60, body: "Context: we needed SSR, routing and a strong React story.\nDecision: adopt Next.js (App Router). Consequences: one framework for routing, rendering and API routes." },
  { id: "ADR-002", t: "Adopt Event-Driven Architecture", date: "June 8, 2026", who: "Sipho D.", tag: "Architecture", cat: "ADRs", ts: 58, body: "Decision: services communicate via an event bus rather than synchronous calls.\nImproves resilience and decoupling; adds eventual-consistency complexity." },
  { id: "ADR-003", t: "Data Partitioning Strategy", date: "June 6, 2026", who: "Thabo N.", tag: "Data", cat: "ADRs", ts: 56, body: "Partition large activity tables by month to keep contribution queries fast.\nOlder partitions are rolled to cold storage after 12 months." },
  { id: "ADR-004", t: "Authentication with Keycloak", date: "June 3, 2026", who: "Priya S.", tag: "Security", cat: "ADRs", ts: 53, body: "Decision: use Keycloak for OIDC/SAML and social login.\nGives us SSO and fine-grained roles without building auth from scratch." },
  { id: "ADR-005", t: "Git Workflow Strategy", date: "May 29, 2026", who: "TR Mokwena", tag: "Process", cat: "ADRs", ts: 49, body: "Trunk-based development with short-lived branches and required PR review.\nReleases cut from main behind feature flags." },
  { id: "ADR-006", t: "Container Orchestration with Kubernetes", date: "May 25, 2026", who: "Naledi K.", tag: "Infra", cat: "ADRs", ts: 45, body: "Decision: run services on managed Kubernetes.\nStandard deploys, autoscaling and rollout controls outweigh the operational overhead." },
  { id: "ADR-007", t: "API Versioning Convention", date: "May 22, 2026", who: "Sipho D.", tag: "Process", cat: "ADRs", ts: 42, body: "Version in the URL path (/v2). Breaking changes ship a new major; additive changes do not." },
  { id: "MTG-014", t: "Sprint 14 Planning", date: "June 12, 2026", who: "TR Mokwena", tag: "Process", cat: "Meeting Notes", ts: 61, body: "Committed 142 points across collaboration features.\nRisks: OmniConnect integration scope and review bandwidth." },
  { id: "MTG-013", t: "Q3 Roadmap Sync", date: "June 4, 2026", who: "Naledi K.", tag: "Process", cat: "Meeting Notes", ts: 54, body: "Aligned on three bets: contribution intelligence, billing, and the SA messaging backbone." },
  { id: "RETRO-013", t: "Sprint 13 Retrospective", date: "June 11, 2026", who: "Priya S.", tag: "Process", cat: "Retrospectives", ts: 57, body: "Went well: design system velocity. Improve: flaky CI and late reviews.\nAction: add a review SLA and quarantine flaky tests." },
  { id: "RETRO-482", t: "Incident #482 Retro", date: "June 2, 2026", who: "Sipho D.", tag: "Infra", cat: "Retrospectives", ts: 52, body: "Team retro on the API latency spike — focus on alert tuning and runbook clarity." },
  { id: "PB-001", t: "On-call Runbook", date: "May 30, 2026", who: "Naledi K.", tag: "Infra", cat: "Playbooks", ts: 50, body: "Paging, escalation and the first 15 minutes of an incident.\nDashboards, log queries and rollback commands in one place." },
  { id: "PB-002", t: "Release Playbook", date: "May 27, 2026", who: "TR Mokwena", tag: "Process", cat: "Playbooks", ts: 47, body: "Cut from main, run smoke checks, flip the flag, watch error rate, announce." },
  { id: "INC-482", t: "API latency spike", date: "June 13, 2026", who: "Naledi K.", tag: "Infra", cat: "Incident Reports", ts: 63, body: "p95 latency rose to 2.4s for 18 minutes.\nCause: connection pool exhaustion under a traffic burst. Mitigation: raised pool size and added backpressure." },
  { id: "INC-477", t: "Auth outage", date: "June 1, 2026", who: "Priya S.", tag: "Security", cat: "Incident Reports", ts: 51, body: "Login failures for ~6 minutes after a Keycloak config change.\nRolled back the realm change; added a staging gate for realm edits." },
  { id: "PM-482", t: "Database failover", date: "June 13, 2026", who: "Thabo N.", tag: "Data", cat: "Post-Mortems", ts: 63, body: "Primary failed over cleanly; replica lag caused a brief read-stale window.\nFollow-up: tune replication and add a lag alert." },
  { id: "PM-460", t: "Webhook backlog", date: "May 24, 2026", who: "Sipho D.", tag: "Infra", cat: "Post-Mortems", ts: 44, body: "Outbound webhook queue backed up after a partner endpoint slowed.\nAdded per-endpoint circuit breakers and a dead-letter queue." },
];

const BLANK = { title: "", cat: "Architecture", tag: "Architecture", author: "" };

export default function KnowledgePage() {
  const [docs, setDocs] = useState(DOCS_SEED);
  const [cat, setCat] = useState("All Pages");
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [sort, setSort] = useState("Recently updated");
  const [workspace, setWorkspace] = useState("Eclipse Softworks");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [reader, setReader] = useState(null);

  const countFor = (label) => (label === "All Pages" ? docs.length : docs.filter((d) => d.cat === label).length);

  const visible = docs
    .filter((d) => cat === "All Pages" || d.cat === cat)
    .filter((d) => tagFilter === "All" || d.tag === tagFilter)
    .filter((d) => `${d.id} ${d.t} ${d.who} ${d.tag}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (sort === "Title A–Z" ? a.t.localeCompare(b.t) : sort === "Oldest" ? a.ts - b.ts : b.ts - a.ts));

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const create = () => {
    if (!form.title.trim()) return;
    const num = (docs.filter((d) => d.cat === form.cat).length + 1).toString().padStart(3, "0");
    const nd = {
      id: `${PREFIX[form.cat] || "DOC"}-${num}`,
      t: form.title.trim(),
      date: "June 16, 2026",
      who: form.author.trim() || "You",
      tag: form.tag,
      cat: form.cat,
      ts: Math.max(...docs.map((d) => d.ts)) + 1,
      body: "Draft — start writing this page.",
    };
    setDocs((s) => [nd, ...s]);
    setForm(BLANK);
    setOpen(false);
    setCat(form.cat);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="BookOpen" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Knowledge Hub</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Documentation, decisions, and institutional knowledge.</div>
          </div>
        </div>
        <Dropdown align="right" width={200} trigger={({ toggle, open: isOpen }) => (
          <button onClick={toggle} className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium"><Icon name="Building2" size={16} className="text-brand" />{workspace}<Icon name="ChevronDown" size={15} className={cn("text-ink-3 transition-transform", isOpen && "rotate-180")} /></button>
        )}>
          {WORKSPACES.map((w) => (
            <MenuItem key={w} icon="Building2" onClick={() => setWorkspace(w)} trailing={w === workspace ? <Icon name="Check" size={14} className="text-brand" /> : null}>{w}</MenuItem>
          ))}
        </Dropdown>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* category rail */}
        <div className="w-full lg:w-[210px] flex-none card !shadow-card p-3.5">
          <div className="text-sm font-bold tracking-[-0.01em] px-2 pt-1 pb-3.5">Knowledge Hub</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-[3px]">
            {CATS.map((c) => (
              <button key={c.label} onClick={() => setCat(c.label)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-[13px] font-medium text-left transition-colors", cat === c.label ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                <Icon name={c.icon} size={16} className={cat === c.label ? "text-brand" : "text-ink-3"} />{c.label}
                <span className={cn("ml-auto text-[11px] font-semibold rounded-[7px] px-1.5", cat === c.label ? "bg-card text-brand-600" : "bg-bg text-ink-3")}>{countFor(c.label)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* doc list */}
        <div className="flex-1 min-w-0 card !shadow-card overflow-hidden">
          <div className="flex items-center gap-3 p-[16px_18px] border-b border-line flex-wrap">
            <div className="flex-1 flex items-center gap-2.5 bg-bg border border-line rounded-[10px] px-3 py-2.5 min-w-[180px]"><Icon name="Search" size={16} className="text-ink-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search knowledge..." className="flex-1 bg-transparent outline-none text-[13px]" />{query && <button onClick={() => setQuery("")} className="text-ink-3 hover:text-ink"><Icon name="X" size={14} /></button>}</div>
            <Dropdown align="right" width={170} trigger={({ toggle }) => (
              <button onClick={toggle} title="Filter by tag" className={cn("grid place-items-center w-[38px] h-[38px] rounded-[10px] border bg-card", tagFilter !== "All" ? "border-brand text-brand" : "border-line text-ink-2")}><Icon name="SlidersHorizontal" size={16} /></button>
            )}>
              <MenuItem onClick={() => setTagFilter("All")} trailing={tagFilter === "All" ? <Icon name="Check" size={14} className="text-brand" /> : null}>All tags</MenuItem>
              {TAGS.map((t) => (
                <MenuItem key={t} onClick={() => setTagFilter(t)} trailing={tagFilter === t ? <Icon name="Check" size={14} className="text-brand" /> : null}>{t}</MenuItem>
              ))}
            </Dropdown>
            <button onClick={() => { setForm({ ...BLANK, cat: cat === "All Pages" ? "Architecture" : cat }); setOpen(true); }} className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />New</button>
          </div>
          <div className="p-[18px]">
            <div className="flex items-center justify-between mb-1.5 gap-3 flex-wrap">
              <h3 className="m-0 text-[15px] font-semibold">{cat === "All Pages" ? "All pages" : cat}<span className="text-ink-3 font-medium"> · {visible.length}</span></h3>
              <Dropdown align="right" width={170} trigger={({ toggle }) => (
                <button onClick={toggle} className="flex items-center gap-1.5 text-xs text-ink-2 font-medium">{sort}<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
              )}>
                {SORTS.map((s) => (
                  <MenuItem key={s} onClick={() => setSort(s)} trailing={s === sort ? <Icon name="Check" size={14} className="text-brand" /> : null}>{s}</MenuItem>
                ))}
              </Dropdown>
            </div>
            <div>
              {visible.map((d, i) => (
                <div key={d.id}>
                  <div onClick={() => setReader(d)} className="flex items-center gap-3.5 p-[13px_10px] rounded-xl cursor-pointer transition-colors hover:bg-bg">
                    <span className="grid place-items-center w-10 h-10 rounded-[10px] flex-none" style={{ background: TAG_HEX[d.tag][0] }}><Icon name={CAT_ICON[d.cat] || "FileText"} size={19} style={{ color: TAG_HEX[d.tag][1] }} /></span>
                    <div className="flex-1 min-w-0">
                      <b className="block text-[13.5px] font-semibold leading-[1.35]">{d.id}: {d.t}</b>
                      <span className="text-[11.5px] text-ink-3 mt-0.5 inline-flex items-center gap-1.5">{d.date}<span className="w-[3px] h-[3px] rounded-full bg-ink-3" />{d.who}</span>
                    </div>
                    <span className={cn("hidden sm:inline-flex text-[11.5px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap", TAG_STYLE[d.tag])}>{d.tag}</span>
                    <Icon name="ChevronRight" size={17} className="text-ink-3 flex-none" />
                  </div>
                  {i < visible.length - 1 && <div className="h-px bg-line mx-2.5" />}
                </div>
              ))}
              {visible.length === 0 && (
                <div className="grid place-items-center py-16 text-center">
                  <div className="flex flex-col items-center gap-2"><Icon name="SearchX" size={28} className="text-ink-3" /><div className="text-[13.5px] text-ink-2">No pages match your filters.</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* reader */}
      <Modal open={!!reader} onClose={() => setReader(null)} title={reader ? reader.id : ""} width={560}
        footer={<Button variant="primary" onClick={() => setReader(null)}>Close</Button>}>
        {reader && (
          <>
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none" style={{ background: TAG_HEX[reader.tag][0] }}><Icon name={CAT_ICON[reader.cat] || "FileText"} size={22} style={{ color: TAG_HEX[reader.tag][1] }} /></span>
              <div className="flex-1 min-w-0">
                <h2 className="m-0 text-[17px] font-bold leading-snug">{reader.t}</h2>
                <div className="text-[12px] text-ink-3 mt-1 inline-flex items-center gap-1.5 flex-wrap">{reader.cat}<span className="w-[3px] h-[3px] rounded-full bg-ink-3" />{reader.date}<span className="w-[3px] h-[3px] rounded-full bg-ink-3" />{reader.who}</div>
              </div>
              <span className={cn("text-[11.5px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap", TAG_STYLE[reader.tag])}>{reader.tag}</span>
            </div>
            <div className="flex flex-col gap-3 pt-1 border-t border-line">
              {reader.body.split("\n").map((p, i) => <p key={i} className="m-0 text-[13.5px] text-ink-2 leading-relaxed">{p}</p>)}
            </div>
          </>
        )}
      </Modal>

      {/* new page */}
      <Modal open={open} onClose={() => setOpen(false)} title="New page"
        footer={<>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={create} disabled={!form.title.trim()}>Create page</Button>
        </>}>
        <Field label="Title"><TextInput value={form.title} onChange={set("title")} placeholder="e.g. Caching Strategy" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.cat} onChange={set("cat")}>{Object.keys(PREFIX).map((c) => <option key={c} value={c}>{c}</option>)}</Select>
          </Field>
          <Field label="Tag">
            <Select value={form.tag} onChange={set("tag")}>{TAGS.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          </Field>
        </div>
        <Field label="Author"><TextInput value={form.author} onChange={set("author")} placeholder="Your name" /></Field>
      </Modal>
    </>
  );
}
