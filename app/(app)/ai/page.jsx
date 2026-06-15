"use client";

import Icon from "@/components/Icon";

const GRAD = "linear-gradient(135deg,#6366F1,#8B5CF6)";
const RISK = [
  { ms: "Mobile App Launch", icon: "Smartphone", ib: "rgba(248,113,113,.16)", icol: "#F87171", proj: "Apex v2.1", due: "June 24, 2026", level: "High", lc: "bg-[rgba(248,113,113,.16)] text-[#F87171]", reason: "2 critical dependencies delayed" },
  { ms: "Analytics Module", icon: "ChartLine", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", proj: "Apex v2.1", due: "June 30, 2026", level: "Medium", lc: "bg-[rgba(251,191,36,.16)] text-[#FBBF24]", reason: "Behind velocity by 18%" },
  { ms: "API Gateway v2", icon: "Server", ib: "rgba(251,191,36,.16)", icol: "#FBBF24", proj: "Platform Core", due: "June 28, 2026", level: "Medium", lc: "bg-[rgba(251,191,36,.16)] text-[#FBBF24]", reason: "Resource capacity low" },
  { ms: "Security Audit", icon: "ShieldCheck", ib: "rgba(52,211,153,.16)", icol: "#34D399", proj: "Platform Core", due: "Jul 02, 2026", level: "Low", lc: "bg-[rgba(52,211,153,.16)] text-[#34D399]", reason: "On track but close to buffer" },
];
const CAPS = [
  { icon: "ChartColumnBig", grad: "linear-gradient(135deg,#6366F1,#818CF8)", b: "Smart Analysis", p: "Analyze projects, tasks, and risks" },
  { icon: "TrendingUp", grad: "linear-gradient(135deg,#0EA5E9,#38BDF8)", b: "Predictive Insights", p: "Predict risks and outcomes" },
  { icon: "FileText", grad: "linear-gradient(135deg,#10B981,#34D399)", b: "Content Generation", p: "Generate reports and summaries" },
  { icon: "Lightbulb", grad: "linear-gradient(135deg,#F59E0B,#FBBF24)", b: "Recommendations", p: "Get smart suggestions" },
];
const STATS = [
  { icon: "CircleCheckBig", ib: "rgba(99,102,241,.16)", icol: "#818CF8", l: "Completed Tasks", v: "156", d: "18%" },
  { icon: "CodeXml", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", l: "Commits", v: "342", d: "16%" },
  { icon: "GitMerge", ib: "rgba(139,92,246,.16)", icol: "#8B5CF6", l: "PRs Merged", v: "48", d: "14%" },
  { icon: "Users", ib: "rgba(52,211,153,.16)", icol: "#34D399", l: "Code Reviews", v: "96", d: "20%" },
];
const REPORTS = [
  { icon: "FileText", ib: "rgba(99,102,241,.16)", icol: "#818CF8", b: "Weekly Executive Summary", s: "Generated today at 9:00 AM" },
  { icon: "FileChartColumn", ib: "rgba(56,189,248,.16)", icol: "#38BDF8", b: "Sprint 12 Analysis", s: "Generated June 16, 2026" },
  { icon: "FileWarning", ib: "rgba(248,113,113,.16)", icol: "#F87171", b: "Risk Assessment Report", s: "Generated June 15, 2026" },
];
const CHIPS = ["Summarize this week", "Show stalled tasks", "Who is inactive?", "Generate sprint report"];

export default function AIPage() {
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
            <div className="p-[22px_24px] flex flex-col gap-[18px]">
              <div className="self-end max-w-[62%] flex flex-col items-end gap-1.5">
                <div className="text-sm font-medium px-4 py-3 text-white rounded-[16px_16px_4px_16px]" style={{ background: GRAD }}>Which milestones are at risk?</div>
                <div className="text-[11px] text-[#6B7593]">10:42 AM</div>
              </div>
              <div className="flex gap-3">
                <div className="grid place-items-center w-[34px] h-[34px] rounded-[10px] flex-none" style={{ background: GRAD }}><Icon name="Sparkles" size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2.5"><b className="text-[13.5px] font-semibold">Apex AI</b><span className="text-[11px] text-[#6B7593]">10:43 AM</span></div>
                  <div className="text-sm mb-3">Here are the milestones at risk of missing their deadlines.</div>
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
                    <div className="inline-flex items-center gap-2 m-[14px_16px] border border-[#28324F] rounded-[9px] p-[8px_13px] text-[12.5px] font-medium cursor-pointer" style={{ background: "#11162A" }}><Icon name="FileText" size={14} className="text-[#97A1BB]" />View full report</div>
                  </div>
                </div>
              </div>
            </div>

            {/* chips */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap px-6">
              {CHIPS.map((c) => <div key={c} className="border border-[#1E2742] rounded-[10px] px-[15px] py-2.5 text-[12.5px] font-medium cursor-pointer hover:border-[#28324F]" style={{ background: "#141A30" }}>{c}</div>)}
              <div className="grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-[#1E2742] cursor-pointer" style={{ background: "#141A30" }}><Icon name="RefreshCw" size={16} className="text-[#97A1BB]" /></div>
            </div>

            {/* composer */}
            <div className="m-[16px_24px_22px] border border-[#28324F] rounded-[14px] p-[16px_16px_12px]" style={{ background: "#141A30" }}>
              <div className="flex items-center gap-3">
                <input placeholder="Ask anything..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#6B7593]" />
                <div className="grid place-items-center w-9 h-9 rounded-[9px] cursor-pointer"><Icon name="Mic" size={17} className="text-[#97A1BB]" /></div>
                <div className="grid place-items-center w-10 h-10 rounded-[11px] cursor-pointer shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_90%,transparent)]" style={{ background: GRAD }}><Icon name="Send" size={18} className="text-white" /></div>
              </div>
              <div className="flex items-center gap-[18px] mt-3.5 pt-[13px] border-t border-[#1E2742] flex-wrap">
                <div className="flex items-center gap-2 border border-[#28324F] rounded-[9px] p-[7px_11px] text-[12.5px] font-medium cursor-pointer" style={{ background: "#11162A" }}><Icon name="Telescope" size={14} className="text-[#97A1BB]" />Deep Research<Icon name="ChevronDown" size={13} className="text-[#6B7593]" /></div>
                {["Use project context", "Include GitHub data"].map((t) => (
                  <div key={t} className="flex items-center gap-2.5 text-[12.5px] text-[#97A1BB]">{t}<span className="relative w-[38px] h-[22px] rounded-full" style={{ background: GRAD }}><span className="absolute top-0.5 left-[18px] w-[18px] h-[18px] rounded-full bg-card" /></span></div>
                ))}
              </div>
            </div>
          </div>

          {/* capabilities */}
          <div className="rounded-[18px] border border-[#1E2742] p-[20px_22px]" style={{ background: "#11162A" }}>
            <h3 className="m-0 mb-4 text-[15px] font-semibold">AI Capabilities</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {CAPS.map((c) => (
                <div key={c.b} className="border border-[#1E2742] rounded-[14px] p-[18px]" style={{ background: "#141A30" }}>
                  <div className="grid place-items-center w-[46px] h-[46px] rounded-[12px] mb-3.5" style={{ background: c.grad }}><Icon name={c.icon} size={22} className="text-white" /></div>
                  <b className="block text-[14.5px] font-semibold mb-1.5">{c.b}</b>
                  <p className="m-0 text-[12.5px] text-[#97A1BB] leading-relaxed">{c.p}</p>
                </div>
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
              <div className="inline-flex items-center gap-1.5 mt-2.5 text-[12.5px] font-medium text-[#818CF8]">View details <Icon name="ArrowRight" size={13} /></div>
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
            {REPORTS.map((r, i) => (
              <div key={r.b} className={`flex gap-2.5 py-2.5 ${i > 0 ? "border-t border-[#1E2742]" : "pt-0.5"}`}>
                <div className="grid place-items-center w-8 h-8 rounded-lg flex-none" style={{ background: r.ib }}><Icon name={r.icon} size={16} style={{ color: r.icol }} /></div>
                <div><b className="block text-[13px] font-semibold">{r.b}</b><span className="text-[11.5px] text-[#6B7593]">{r.s}</span></div>
              </div>
            ))}
            <a className="block mt-3 text-[12.5px] font-medium text-[#818CF8] cursor-pointer">View all reports</a>
          </div>
        </div>
      </div>
    </div>
  );
}
