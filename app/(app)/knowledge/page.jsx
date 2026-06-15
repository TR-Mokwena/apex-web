"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

const CATS = [
  { label: "All Pages", icon: "Files", ct: 128 },
  { label: "Architecture", icon: "LayoutTemplate", ct: 24 },
  { label: "ADRs", icon: "GitBranch", ct: 31 },
  { label: "Meeting Notes", icon: "NotebookPen", ct: 42 },
  { label: "Retrospectives", icon: "History", ct: 18 },
  { label: "Playbooks", icon: "BookMarked", ct: 9 },
  { label: "Incident Reports", icon: "Siren", ct: 6 },
  { label: "Post-Mortems", icon: "FileSearch", ct: 4 },
];
const TAG_STYLE = {
  Web: "bg-brand-soft text-[#4F46E5]",
  Architecture: "bg-[#EDE9FE] text-[#7C3AED]",
  Data: "bg-[#FEF3C7] text-[#B45309]",
  Security: "bg-[#FEE2E2] text-[#DC2626]",
  Process: "bg-[#DBEAFE] text-[#2563EB]",
  Infra: "bg-[#CCFBF1] text-[#0D9488]",
};
const DOCS = [
  { id: "ADR-001", t: "Choose Next.js for Web Platform", date: "June 10, 2026", who: "TR Mokwena", tag: "Web", ic: "FileCode2", ib: "#EEF0FE", icol: "#4F46E5" },
  { id: "ADR-002", t: "Adopt Event-Driven Architecture", date: "June 8, 2026", who: "Sipho D.", tag: "Architecture", ic: "Workflow", ib: "#EDE9FE", icol: "#7C3AED" },
  { id: "ADR-003", t: "Data Partitioning Strategy", date: "June 6, 2026", who: "Thabo N.", tag: "Data", ic: "Database", ib: "#FEF3C7", icol: "#B45309" },
  { id: "ADR-004", t: "Authentication with Keycloak", date: "June 3, 2026", who: "Priya S.", tag: "Security", ic: "ShieldCheck", ib: "#FEE2E2", icol: "#DC2626" },
  { id: "ADR-005", t: "Git Workflow Strategy", date: "May 29, 2026", who: "TR Mokwena", tag: "Process", ic: "GitBranch", ib: "#DBEAFE", icol: "#2563EB" },
  { id: "ADR-006", t: "Container Orchestration with Kubernetes", date: "May 25, 2026", who: "Naledi K.", tag: "Infra", ic: "Server", ib: "#CCFBF1", icol: "#0D9488" },
  { id: "ADR-007", t: "API Versioning Convention", date: "May 22, 2026", who: "Sipho D.", tag: "Process", ic: "GitBranch", ib: "#DBEAFE", icol: "#2563EB" },
];

export default function KnowledgePage() {
  const [cat, setCat] = useState("Architecture");
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
        <button className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium"><Icon name="Building2" size={16} className="text-brand" />Eclipse Softworks<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* category rail */}
        <div className="w-full lg:w-[210px] flex-none card !shadow-card p-3.5">
          <div className="text-sm font-bold tracking-[-0.01em] px-2 pt-1 pb-3.5">Knowledge Hub</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-[3px]">
            {CATS.map((c) => (
              <button key={c.label} onClick={() => setCat(c.label)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-[13px] font-medium text-left transition-colors", cat === c.label ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                <Icon name={c.icon} size={16} className={cat === c.label ? "text-brand" : "text-ink-3"} />{c.label}
                <span className={cn("ml-auto text-[11px] font-semibold rounded-[7px] px-1.5", cat === c.label ? "bg-card text-brand-600" : "bg-bg text-ink-3")}>{c.ct}</span>
              </button>
            ))}
          </div>
        </div>

        {/* doc list */}
        <div className="flex-1 min-w-0 card !shadow-card overflow-hidden">
          <div className="flex items-center gap-3 p-[16px_18px] border-b border-line flex-wrap">
            <div className="flex-1 flex items-center gap-2.5 bg-bg border border-line rounded-[10px] px-3 py-2.5 min-w-[180px]"><Icon name="Search" size={16} className="text-ink-3" /><input placeholder="Search knowledge..." className="flex-1 bg-transparent outline-none text-[13px]" /><span className="text-[11px] text-ink-3 border border-line rounded-[5px] px-1.5">⌘K</span></div>
            <button className="grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-line bg-card"><Icon name="SlidersHorizontal" size={16} className="text-ink-2" /></button>
            <button className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_rgba(99,102,241,0.8)]" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}><Icon name="Plus" size={15} />New</button>
          </div>
          <div className="p-[18px]">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="m-0 text-[15px] font-semibold">Architecture Decision Records</h3>
              <button className="flex items-center gap-1.5 text-xs text-ink-2 font-medium">Recently updated<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
            </div>
            <div>
              {DOCS.map((d, i) => (
                <div key={d.id}>
                  <div className="flex items-center gap-3.5 p-[13px_10px] rounded-xl cursor-pointer transition-colors hover:bg-bg">
                    <span className="grid place-items-center w-10 h-10 rounded-[10px] flex-none" style={{ background: d.ib }}><Icon name={d.ic} size={19} style={{ color: d.icol }} /></span>
                    <div className="flex-1 min-w-0">
                      <b className="block text-[13.5px] font-semibold leading-[1.35]">{d.id}: {d.t}</b>
                      <span className="text-[11.5px] text-ink-3 mt-0.5 inline-flex items-center gap-1.5">{d.date}<span className="w-[3px] h-[3px] rounded-full bg-ink-3" />{d.who}</span>
                    </div>
                    <span className={cn("hidden sm:inline-flex text-[11.5px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap", TAG_STYLE[d.tag])}>{d.tag}</span>
                    <Icon name="ChevronRight" size={17} className="text-ink-3 flex-none" />
                  </div>
                  {i < DOCS.length - 1 && <div className="h-px bg-line mx-2.5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
