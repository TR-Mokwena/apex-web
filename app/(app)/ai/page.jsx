"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { generateReportPdf } from "@/lib/report";

const MODES = [
  { k: "Deep Research", ic: "Telescope", d: "Thorough multi-step analysis" },
  { k: "Quick Answer", ic: "Zap", d: "Fast, concise reply" },
  { k: "Web Search", ic: "Globe", d: "Pull in external context" },
  { k: "Codebase", ic: "Code", d: "Search your repositories" },
];

const GRAD = "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))";
const RISK = [
  { ms: "Mobile App Launch", icon: "Smartphone", ib: "rgba(248,113,113,.16)", icol: "#F87171", proj: "Apex v2.1", due: "June 24, 2026", level: "High", lc: "bg-[rgba(248,113,113,.16)] text-[#F87171]", reason: "2 critical dependencies delayed" },
  { ms: "Analytics Module", icon: "ChartLine", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", proj: "Apex v2.1", due: "June 30, 2026", level: "Medium", lc: "bg-[rgba(251,191,36,.16)] text-[#FBBF24]", reason: "Behind velocity by 18%" },
  { ms: "API Gateway v2", icon: "Server", ib: "rgba(251,191,36,.16)", icol: "#FBBF24", proj: "Platform Core", due: "June 28, 2026", level: "Medium", lc: "bg-[rgba(251,191,36,.16)] text-[#FBBF24]", reason: "Resource capacity low" },
  { ms: "Security Audit", icon: "ShieldCheck", ib: "rgba(52,211,153,.16)", icol: "#34D399", proj: "Platform Core", due: "Jul 02, 2026", level: "Low", lc: "bg-[rgba(52,211,153,.16)] text-[#34D399]", reason: "On track but close to buffer" },
];
const STALLED = [
  { t: "Design System update", s: "Blocked — waiting for API specification", tone: "#F87171" },
  { t: "Database schema migration", s: "Stalled 3 days — no commits", tone: "#FBBF24" },
  { t: "Webhook signatures", s: "Awaiting review since Jun 14", tone: "#FBBF24" },
];
const INACTIVE = [
  { t: "Anke Visser", s: "No commits in 6 days", tone: "#F87171" },
  { t: "Neo Kgosana", s: "1 commit this week (team avg 14)", tone: "#FBBF24" },
];
const CAPS = [
  { icon: "ChartColumnBig", grad: "linear-gradient(135deg,#6366F1,#818CF8)", b: "Smart Analysis", p: "Analyze projects, tasks, and risks", q: "Analyze project health" },
  { icon: "TrendingUp", grad: "linear-gradient(135deg,#0EA5E9,#38BDF8)", b: "Predictive Insights", p: "Predict risks and outcomes", q: "Which milestones are at risk?" },
  { icon: "FileText", grad: "linear-gradient(135deg,#10B981,#34D399)", b: "Content Generation", p: "Generate reports and summaries", q: "Generate sprint report" },
  { icon: "Lightbulb", grad: "linear-gradient(135deg,#F59E0B,#FBBF24)", b: "Recommendations", p: "Get smart suggestions", q: "What should we focus on?" },
];
const STATS = [
  { icon: "CircleCheckBig", ib: "rgba(99,102,241,.16)", icol: "#818CF8", l: "Completed Tasks", v: "156", d: "18%" },
  { icon: "CodeXml", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", l: "Commits", v: "342", d: "16%" },
  { icon: "GitMerge", ib: "rgba(139,92,246,.16)", icol: "#8B5CF6", l: "PRs Merged", v: "48", d: "14%" },
  { icon: "Users", ib: "rgba(52,211,153,.16)", icol: "#34D399", l: "Code Reviews", v: "96", d: "20%" },
];
const REPORTS_SEED = [
  { icon: "FileText", ib: "rgba(99,102,241,.16)", icol: "#818CF8", b: "Weekly Executive Summary", s: "Generated today at 9:00 AM" },
  { icon: "FileChartColumn", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", b: "Sprint 12 Analysis", s: "Generated June 16, 2026" },
  { icon: "FileWarning", ib: "rgba(248,113,113,.16)", icol: "#F87171", b: "Risk Assessment Report", s: "Generated June 15, 2026" },
];
const CHIPS = ["Summarize this week", "Show stalled tasks", "Who is inactive?", "Generate sprint report"];

const INITIAL = [
  { role: "user", text: "Which milestones are at risk?", time: "10:42 AM" },
  { role: "ai", kind: "risk", text: "Here are the milestones at risk of missing their deadlines.", time: "10:43 AM" },
];

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function buildResponse(text, gh) {
  const q = text.toLowerCase();
  const time = nowTime();
  if (/risk|at[- ]risk|milestone|delay|slip/.test(q)) return { role: "ai", kind: "risk", text: "Here are the milestones at risk of missing their deadlines.", time };
  if (/stall|block|stuck|waiting/.test(q)) return { role: "ai", kind: "list", text: `${STALLED.length} tasks are stalled or blocked right now:`, items: STALLED, time };
  if (/inactive|idle|quiet|who is|away/.test(q)) return { role: "ai", kind: "list", text: `${INACTIVE.length} contributors look inactive this week${gh ? " (from GitHub activity)" : ""}:`, items: INACTIVE, time };
  if (/report|summar|recap|digest|generate/.test(q)) return { role: "ai", kind: "report", text: "Done — I've generated a fresh report for you.", title: "Weekly Executive Summary", time };
  if (/focus|recommend|suggest|should|priorit/.test(q)) return { role: "ai", kind: "list", text: "Based on current signals, I'd prioritise these:", items: [{ t: "Unblock the Design System task", s: "It's holding up 2 downstream items", tone: "#F87171" }, { t: "Add reviewers to API Gateway v2", s: "Capacity is the main risk driver", tone: "#FBBF24" }, { t: "Re-estimate Analytics Module", s: "Tracking 18% behind velocity", tone: "#FBBF24" }], time };
  if (/health|analyze|analyse|status/.test(q)) return { role: "ai", kind: "text", text: "Across 24 active projects: 16 on track, 6 at risk, 2 overdue. Velocity is up 12% week-over-week, but Apex v2.1 is the main concern at 72% likelihood of delay.", time };
  return { role: "ai", kind: "text", text: "I can flag at-risk milestones, surface stalled work, spot inactive contributors, and generate reports. Try a suggestion below — or ask me anything about your projects.", time };
}

function DarkToggle({ on, onClick }) {
  return (
    <button type="button" onClick={onClick} role="switch" aria-checked={on} className="relative w-[38px] h-[22px] rounded-full flex-none transition-colors" style={{ background: on ? GRAD : "#28324F" }}>
      <span className={cn("absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-[left]", on ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}

function RiskTable() {
  return (
    <div className="rounded-[13px] border border-[#1E2742] overflow-x-auto" style={{ background: "#141A30" }}>
      <table className="w-full border-collapse min-w-[520px]">
        <thead><tr>{["Milestone", "Project", "Due Date", "Risk Level", "Reason"].map((h) => <th key={h} className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-[#6B7593] p-[13px_16px] border-b border-[#1E2742]">{h}</th>)}</tr></thead>
        <tbody>
          {RISK.map((r) => (
            <tr key={r.ms}>
              <td className="p-[13px_16px] text-[13px] border-b border-[#1E2742]"><div className="flex items-center gap-2.5 font-medium"><span className="grid place-items-center w-[26px] h-[26px] rounded-[7px] flex-none" style={{ background: r.ib }}><Icon name={r.icon} size={14} style={{ color: r.icol }} /></span>{r.ms}</div></td>
              <td className="p-[13px_16px] text-[13px] border-b border-[#1E2742] text-[#97A1BB]">{r.proj}</td>
              <td className="p-[13px_16px] text-[13px] border-b border-[#1E2742] text-[#97A1BB]">{r.due}</td>
              <td className="p-[13px_16px] text-[13px] border-b border-[#1E2742]"><span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-[7px] ${r.lc}`}>{r.level}</span></td>
              <td className="p-[13px_16px] text-[13px] border-b border-[#1E2742] text-[#97A1BB]">{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AIPage() {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ctx, setCtx] = useState(true);
  const [gh, setGh] = useState(true);
  const [mode, setMode] = useState("Deep Research");
  const [modeOpen, setModeOpen] = useState(false);
  const [reports, setReports] = useState(REPORTS_SEED);
  const scrollRef = useRef(null);
  const modeMeta = MODES.find((m) => m.k === mode) || MODES[0];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const send = (text) => {
    const v = (text ?? input).trim();
    if (!v || thinking) return;
    setMessages((m) => [...m, { role: "user", text: v, time: nowTime() }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const res = buildResponse(v, gh);
      setMessages((m) => [...m, res]);
      if (res.kind === "report") setReports((r) => [{ icon: "FileText", ib: "rgba(99,102,241,.16)", icol: "#818CF8", b: res.title, s: "Generated just now" }, ...r]);
      setThinking(false);
    }, mode === "Quick Answer" ? 500 : 950);
  };
  const reset = () => { setMessages(INITIAL); setThinking(false); };

  return (
    <div className="-mx-4 md:-mx-7 -my-6 px-4 md:px-7 py-6 min-h-screen text-[#EAEEF7]" style={{ background: "#080B16" }}>
      {/* header */}
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[30px] h-[30px] rounded-[9px]" style={{ background: "rgba(99,102,241,.14)" }}><Icon name="Sparkles" size={18} className="text-[#818CF8]" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">AI Command Center</h1>
            <div className="text-[13px] text-[#97A1BB] mt-0.5">Your AI assistant for smarter engineering decisions.</div>
          </div>
        </div>
      </div>

      <div className="flex gap-[18px] items-start flex-col xl:flex-row">
        {/* main column */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-[18px]">
          {/* chat */}
          <div className="rounded-[18px] border border-[#1E2742] overflow-hidden" style={{ background: "#11162A" }}>
            <div ref={scrollRef} className="p-[22px_24px] flex flex-col gap-[18px] max-h-[460px] overflow-y-auto">
              {messages.map((m, i) => m.role === "user" ? (
                <div key={i} className="self-end max-w-[78%] sm:max-w-[62%] flex flex-col items-end gap-1.5">
                  <div className="text-sm font-medium px-4 py-3 text-white rounded-[16px_16px_4px_16px]" style={{ background: GRAD }}>{m.text}</div>
                  <div className="text-[11px] text-[#6B7593]">{m.time}</div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <div className="grid place-items-center w-[34px] h-[34px] rounded-[10px] flex-none" style={{ background: GRAD }}><Icon name="Sparkles" size={18} className="text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2.5"><b className="text-[13.5px] font-semibold">Apex AI</b><span className="text-[11px] text-[#6B7593]">{m.time}</span></div>
                    <div className="text-sm mb-3">{m.text}</div>
                    {m.kind === "risk" && (
                      <>
                        <RiskTable />
                        <button onClick={() => send("Generate sprint report")} className="inline-flex items-center gap-2 mt-3.5 border border-[#28324F] rounded-[9px] p-[8px_13px] text-[12.5px] font-medium cursor-pointer" style={{ background: "#11162A" }}><Icon name="FileText" size={14} className="text-[#97A1BB]" />Turn into a report</button>
                      </>
                    )}
                    {m.kind === "list" && (
                      <div className="rounded-[13px] border border-[#1E2742] overflow-hidden" style={{ background: "#141A30" }}>
                        {m.items.map((it, j) => (
                          <div key={j} className="flex items-center gap-3 p-[12px_14px] border-b border-[#1E2742] last:border-b-0">
                            <span className="w-2 h-2 rounded-full flex-none" style={{ background: it.tone }} />
                            <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold">{it.t}</b><span className="text-[11.5px] text-[#6B7593]">{it.s}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {m.kind === "report" && (
                      <div className="flex items-center gap-3 rounded-[13px] border border-[#1E2742] p-[13px_15px]" style={{ background: "#141A30" }}>
                        <span className="grid place-items-center w-9 h-9 rounded-[10px] flex-none" style={{ background: "rgba(99,102,241,.16)" }}><Icon name="FileText" size={18} className="text-[#818CF8]" /></span>
                        <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold">{m.title}</b><span className="text-[11.5px] text-[#6B7593]">PDF · ready to share</span></div>
                        <button onClick={() => generateReportPdf(m.title)} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#818CF8]"><Icon name="Download" size={13} />Download</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-3">
                  <div className="grid place-items-center w-[34px] h-[34px] rounded-[10px] flex-none" style={{ background: GRAD }}><Icon name="Sparkles" size={18} className="text-white" /></div>
                  <div className="flex items-center gap-1 pt-2.5">
                    {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#6B7593] animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* chips */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap px-6">
              {CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="border border-[#1E2742] rounded-[10px] px-[15px] py-2.5 text-[12.5px] font-medium cursor-pointer hover:border-[#28324F] transition-colors" style={{ background: "#141A30" }}>{c}</button>)}
              <button onClick={reset} title="Reset conversation" className="grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-[#1E2742] cursor-pointer hover:border-[#28324F]" style={{ background: "#141A30" }}><Icon name="RefreshCw" size={16} className="text-[#97A1BB]" /></button>
            </div>

            {/* composer */}
            <div className="m-[16px_24px_22px] border border-[#28324F] rounded-[14px] p-[16px_16px_12px]" style={{ background: "#141A30" }}>
              <div className="flex items-center gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#6B7593]" />
                <button className="grid place-items-center w-9 h-9 rounded-[9px] cursor-pointer hover:bg-[#1E2742]"><Icon name="Mic" size={17} className="text-[#97A1BB]" /></button>
                <button onClick={() => send()} disabled={!input.trim() || thinking} className="grid place-items-center w-10 h-10 rounded-[11px] cursor-pointer shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_90%,transparent)] disabled:opacity-50" style={{ background: GRAD }}><Icon name="Send" size={18} className="text-white" /></button>
              </div>
              <div className="flex items-center gap-[18px] mt-3.5 pt-[13px] border-t border-[#1E2742] flex-wrap">
                <div className="relative">
                  <button onClick={() => setModeOpen((v) => !v)} className="flex items-center gap-2 border border-[#28324F] rounded-[9px] p-[7px_11px] text-[12.5px] font-medium cursor-pointer hover:border-[#3A4564]" style={{ background: "#11162A" }}><Icon name={modeMeta.ic} size={14} className="text-[#818CF8]" />{mode}<Icon name="ChevronDown" size={13} className={cn("text-[#6B7593] transition-transform", modeOpen && "rotate-180")} /></button>
                  {modeOpen && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setModeOpen(false)} />
                      <div className="absolute z-[61] bottom-full mb-2 left-0 w-[240px] rounded-[12px] border border-[#28324F] p-1.5 shadow-pop" style={{ background: "#141A30" }}>
                        {MODES.map((o) => (
                          <button key={o.k} onClick={() => { setMode(o.k); setModeOpen(false); }} className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-[9px] hover:bg-[#1E2742] transition-colors">
                            <Icon name={o.ic} size={16} className="text-[#818CF8] flex-none" />
                            <span className="flex-1 min-w-0"><b className="block text-[12.5px] font-semibold">{o.k}</b><span className="text-[11px] text-[#6B7593]">{o.d}</span></span>
                            {o.k === mode && <Icon name="Check" size={14} className="text-[#818CF8] flex-none" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2.5 text-[12.5px] text-[#97A1BB]">Use project context<DarkToggle on={ctx} onClick={() => setCtx((v) => !v)} /></div>
                <div className="flex items-center gap-2.5 text-[12.5px] text-[#97A1BB]">Include GitHub data<DarkToggle on={gh} onClick={() => setGh((v) => !v)} /></div>
              </div>
            </div>
          </div>

          {/* capabilities */}
          <div className="rounded-[18px] border border-[#1E2742] p-[20px_22px]" style={{ background: "#11162A" }}>
            <h3 className="m-0 mb-4 text-[15px] font-semibold">AI Capabilities</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {CAPS.map((c) => (
                <button key={c.b} onClick={() => send(c.q)} className="text-left border border-[#1E2742] rounded-[14px] p-[18px] hover:border-[#28324F] transition-colors" style={{ background: "#141A30" }}>
                  <div className="grid place-items-center w-[46px] h-[46px] rounded-[12px] mb-3.5" style={{ background: c.grad }}><Icon name={c.icon} size={22} className="text-white" /></div>
                  <b className="block text-[14.5px] font-semibold mb-1.5">{c.b}</b>
                  <p className="m-0 text-[12.5px] text-[#97A1BB] leading-relaxed">{c.p}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* right rail */}
        <div className="w-full xl:w-[340px] flex-none flex flex-col gap-4">
          <div className="rounded-[18px] border border-[#1E2742] p-[18px]" style={{ background: "#11162A" }}>
            <div className="flex items-center justify-between mb-4"><h3 className="m-0 text-[15px] font-semibold">AI Insights</h3><span className="text-[10.5px] font-semibold text-[#818CF8] rounded-full px-2.5 py-0.5" style={{ background: "rgba(99,102,241,.14)" }}>New insights</span></div>
            <div className="rounded-[13px] border border-[rgba(124,92,246,.25)] p-3.5 mb-3" style={{ background: "linear-gradient(135deg,rgba(139,92,246,.14),rgba(99,102,241,.08))" }}>
              <div className="flex gap-2.5">
                <div className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: "rgba(139,92,246,.2)" }}><Icon name="Sparkles" size={16} className="text-[#8B5CF6]" /></div>
                <div><b className="text-[13.5px] font-semibold leading-tight">Apex v2.1 is 72% likely to be delayed</b><p className="mt-1.5 mb-0 text-xs text-[#97A1BB]">Reason: 3 milestones behind schedule</p></div>
              </div>
              <button onClick={() => send("Which milestones are at risk?")} className="inline-flex items-center gap-1.5 mt-2.5 text-[12.5px] font-medium text-[#818CF8]">View details <Icon name="ArrowRight" size={13} /></button>
            </div>
            {[
              { b: "Thabo N. has high impact this week", s: "12 commits, 4 PRs, 6 reviews", ar: "trend" },
              { b: "Design System task is blocked", s: "Waiting for API specification", ar: "dot" },
              { b: "Team velocity increased by 15%", s: "Compared to last week", ar: "trend", green: true },
            ].map((ins) => (
              <div key={ins.b} className="flex gap-2.5 py-2.5 border-t border-[#1E2742]">
                <div className="grid place-items-center w-[30px] h-[30px] rounded-lg flex-none" style={{ background: ins.green ? "rgba(52,211,153,.16)" : "rgba(99,102,241,.16)" }}><Icon name="FileText" size={15} style={{ color: ins.green ? "#34D399" : "#818CF8" }} /></div>
                <div className="flex-1 min-w-0"><b className="block text-[12.5px] font-semibold leading-snug">{ins.b}</b><span className="text-[11.5px] text-[#6B7593]">{ins.s}</span></div>
                {ins.ar === "dot" ? <span className="w-2 h-2 rounded-full bg-[#F87171] mt-1.5" /> : <Icon name="TrendingUp" size={15} className="text-[#34D399] flex-none" />}
              </div>
            ))}
          </div>

          <div className="rounded-[18px] border border-[#1E2742] p-[18px]" style={{ background: "#11162A" }}>
            <h3 className="m-0 mb-4 text-[15px] font-semibold">Quick Stats <span className="text-[13px] text-[#97A1BB] font-normal">(This Week)</span></h3>
            <div className="grid grid-cols-2 gap-2.5">
              {STATS.map((s) => (
                <div key={s.l} className="border border-[#1E2742] rounded-[12px] p-3.5" style={{ background: "#141A30" }}>
                  <div className="flex items-center gap-2 mb-2.5"><span className="grid place-items-center w-[26px] h-[26px] rounded-[7px]" style={{ background: s.ib }}><Icon name={s.icon} size={14} style={{ color: s.icol }} /></span><span className="text-[11.5px] text-[#97A1BB]">{s.l}</span></div>
                  <div className="text-2xl font-bold tracking-[-0.02em]">{s.v}</div>
                  <div className="text-[11.5px] font-semibold text-[#34D399] mt-0.5 flex items-center gap-0.5"><Icon name="ArrowUp" size={11} />{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#1E2742] p-[18px]" style={{ background: "#11162A" }}>
            <h3 className="m-0 mb-4 text-[15px] font-semibold">Recent AI Reports</h3>
            {reports.map((r, i) => (
              <button key={r.b + i} onClick={() => generateReportPdf(r.b)} title="Download PDF" className={`w-full text-left flex items-center gap-2.5 py-2.5 group/rep ${i > 0 ? "border-t border-[#1E2742]" : "pt-0.5"}`}>
                <div className="grid place-items-center w-8 h-8 rounded-lg flex-none" style={{ background: r.ib }}><Icon name={r.icon} size={16} style={{ color: r.icol }} /></div>
                <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold">{r.b}</b><span className="text-[11.5px] text-[#6B7593]">{r.s}</span></div>
                <Icon name="Download" size={15} className="text-[#6B7593] opacity-0 group-hover/rep:opacity-100 transition-opacity flex-none" />
              </button>
            ))}
            <button onClick={() => send("Generate sprint report")} className="block mt-3 text-[12.5px] font-medium text-[#818CF8] cursor-pointer">Generate a new report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
