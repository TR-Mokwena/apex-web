"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import ApexMark from "@/components/Apex.svg";
import { Switch } from "@/components/ui";
import { cn } from "@/lib/cn";
import { signIn } from "@/lib/auth";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const STEPS = ["Organization", "Teams", "Repositories", "Invite", "Finish"];
const ILLUS = [
  { ic: "Rocket", t: "Welcome aboard", x: "Let's get Eclipse Softworks set up in a few quick steps." },
  { ic: "UsersRound", t: "Build your teams", x: "Teams keep work organized and contribution insights meaningful." },
  { ic: "GitBranch", t: "Bring your code in", x: "Apex reads commits, PRs and reviews to surface delivery health." },
  { ic: "Mail", t: "Better together", x: "Invite teammates so everyone stays in sync from day one." },
  { ic: "PartyPopper", t: "Ready for liftoff", x: "Your workspace is configured. Time to explore your dashboard." },
];
const SUGGEST = ["Platform", "Mobile", "DevOps", "QA", "Data", "Marketing"];
const TEAM_COLORS = ["#6366F1", "#0EA5E9", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"];

const FIELD = "flex items-center h-11 border border-line rounded-[11px] bg-card overflow-hidden focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [teams, setTeams] = useState([{ n: "Engineering", c: "#6366F1" }, { n: "Product", c: "#0EA5E9" }, { n: "Design", c: "#8B5CF6" }]);
  const [teamInput, setTeamInput] = useState("");
  const [repos, setRepos] = useState([
    { n: "apex-web", d: "TypeScript · 2.3k commits", on: true },
    { n: "apex-api", d: "Go · 1.8k commits", on: true },
    { n: "apex-mobile", d: "React Native · 940 commits", on: true },
    { n: "apex-infra", d: "Terraform · 410 commits", on: false },
    { n: "apex-docs", d: "MDX · 220 commits", on: false },
  ]);
  const [invites, setInvites] = useState([
    { e: "sipho@eclipsesoftworks.com", r: "Admin", av: "SD", pi: 1 },
    { e: "priya@eclipsesoftworks.com", r: "Lead", av: "PS", pi: 4 },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  const addTeam = (name) => { const n = name.trim(); if (n) setTeams((t) => [...t, { n, c: TEAM_COLORS[t.length % TEAM_COLORS.length] }]); };
  const addInvite = () => { const e = inviteEmail.trim(); if (!e) return; const av = (e[0] + e.split("@")[0].slice(-1)).toUpperCase(); setInvites((v) => [...v, { e, r: inviteRole, av, pi: v.length % 5 }]); setInviteEmail(""); };
  const next = () => { if (step === 4) { signIn({ remember: true }); router.push("/"); return; } setStep((s) => s + 1); };
  const il = ILLUS[step];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(1100px 500px at 110% -10%, #E6E9FF 0%, transparent 55%), radial-gradient(900px 460px at -10% 110%, #EDE7FF 0%, transparent 55%), #F1F3F9" }}>
      <div className="flex items-center justify-between p-[22px_30px]">
        <div className="flex items-center gap-2.5">
          <ApexMark className="w-[34px] h-[34px]" />
          <div><div className="text-xl font-bold leading-none">Apex</div><div className="text-[10.5px] text-ink-3 mt-0.5">by Eclipse Softworks</div></div>
        </div>
        <Link href="/" className="text-[13px] font-medium text-ink-2 flex items-center gap-1.5">Skip setup<Icon name="ChevronRight" size={15} /></Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-[10px_24px_40px]">
        <div className="w-[min(980px,100%)] bg-card border border-line rounded-[24px] shadow-[0_30px_70px_-30px_rgba(16,24,40,0.35)] overflow-hidden">
          {/* stepper */}
          <div className="flex items-center p-[24px_34px_6px] overflow-x-auto">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <button onClick={() => i <= step && setStep(i)} className="flex items-center gap-2.5 flex-none">
                  <span className={cn("grid place-items-center w-[30px] h-[30px] rounded-full text-[13px] font-semibold border-[1.5px] transition", i === step ? "bg-brand text-white border-brand shadow-[0_0_0_4px_var(--color-brand-soft)]" : i < step ? "bg-brand text-white border-brand" : "bg-bg text-ink-3 border-line")}>
                    {i < step ? <Icon name="Check" size={15} /> : i + 1}
                  </span>
                  <span className={cn("text-[13.5px] whitespace-nowrap hidden sm:inline", i === step ? "text-ink font-semibold" : i < step ? "text-ink-2 font-medium" : "text-ink-3 font-medium")}>{label}</span>
                </button>
                {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 mx-3.5 rounded-sm overflow-hidden"><div className="h-full bg-brand transition-[width]" style={{ width: i < step ? "100%" : "0%" }} /></div>}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_360px]">
            {/* form */}
            <div className="p-[26px_34px_30px] min-h-[380px]">
              {step === 0 && (
                <Pane title="Create your organization" lede="Set up your workspace on Apex.">
                  <Field label="Organization name"><input defaultValue="Eclipse Softworks" className="flex-1 outline-none text-sm px-[13px] h-full" /></Field>
                  <Field label="Subdomain"><input defaultValue="eclipsesoftworks" className="flex-1 outline-none text-sm px-[13px] h-full" /><span className="px-[13px] text-[13px] text-ink-3 bg-bg h-full flex items-center border-l border-line">.apex.io</span></Field>
                  <Field label="Country" select><select className="flex-1 outline-none text-sm px-[13px] h-full appearance-none cursor-pointer bg-transparent"><option>South Africa</option><option>Nigeria</option><option>Kenya</option><option>United Kingdom</option><option>United States</option></select></Field>
                </Pane>
              )}
              {step === 1 && (
                <Pane title="Set up your teams" lede="Organize people into teams that match how you work.">
                  <div className="flex gap-2.5">
                    <span className={cn(FIELD, "flex-1")}><input value={teamInput} onChange={(e) => setTeamInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (addTeam(teamInput), setTeamInput(""))} placeholder="e.g. Platform" className="flex-1 outline-none text-sm px-[13px] h-full" /></span>
                    <button onClick={() => { addTeam(teamInput); setTeamInput(""); }} className="h-11 px-4 rounded-[11px] bg-brand-soft text-brand-600 text-[13.5px] font-semibold flex items-center gap-1.5"><Icon name="Plus" size={15} />Add team</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teams.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[13px] font-medium bg-brand-soft text-brand-600"><span className="w-2 h-2 rounded-full" style={{ background: t.c }} />{t.n}<button onClick={() => setTeams((ts) => ts.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100"><Icon name="X" size={13} /></button></span>
                    ))}
                  </div>
                  <div className="text-xs text-ink-3">Suggested teams</div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGEST.filter((s) => !teams.find((t) => t.n === s)).map((s) => (
                      <button key={s} onClick={() => addTeam(s)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[13px] font-medium border border-dashed border-line text-ink-2 bg-card hover:border-brand hover:text-brand-600"><Icon name="Plus" size={14} />{s}</button>
                    ))}
                  </div>
                </Pane>
              )}
              {step === 2 && (
                <Pane title="Connect repositories" lede="Link the repos Apex should track for contribution insights.">
                  <div className="flex items-center gap-2.5 p-[12px_14px] rounded-xl bg-[#0D1117] text-white"><Icon name="Github" size={18} /><b className="text-[13px] font-semibold">github.com/eclipse-softworks</b><span className="ml-auto text-xs text-[#34D399] font-semibold flex items-center gap-1.5"><Icon name="CircleCheckBig" size={14} />Connected</span></div>
                  <div className="flex flex-col gap-2.5">
                    {repos.map((r, i) => (
                      <div key={r.n} className="flex items-center gap-3 p-[11px_13px] border border-line rounded-xl bg-card">
                        <span className="grid place-items-center w-[34px] h-[34px] rounded-[9px] flex-none bg-bg"><Icon name="GitBranch" size={16} className="text-ink-2" /></span>
                        <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold">{r.n}</b><span className="text-[11.5px] text-ink-3">{r.d}</span></div>
                        <Switch checked={r.on} onChange={() => setRepos((rs) => rs.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} />
                      </div>
                    ))}
                  </div>
                </Pane>
              )}
              {step === 3 && (
                <Pane title="Invite your team" lede="Bring teammates into Apex. They'll get an email invite.">
                  <div className="flex gap-2.5 flex-wrap">
                    <span className={cn(FIELD, "flex-1 min-w-[160px]")}><input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addInvite()} placeholder="name@eclipsesoftworks.com" className="flex-1 outline-none text-sm px-[13px] h-full" /></span>
                    <span className={cn(FIELD, "w-[130px] relative")}><select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="flex-1 outline-none text-sm px-[13px] h-full appearance-none cursor-pointer bg-transparent"><option>Member</option><option>Admin</option><option>Lead</option><option>Viewer</option></select></span>
                    <button onClick={addInvite} className="h-11 px-4 rounded-[11px] bg-brand-soft text-brand-600 text-[13.5px] font-semibold flex items-center gap-1.5"><Icon name="Plus" size={15} />Add</button>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {invites.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 p-[11px_13px] border border-line rounded-xl bg-card">
                        <span className="grid place-items-center w-[30px] h-[30px] rounded-full text-white text-[11px] font-semibold flex-none" style={{ background: PAL[v.pi] }}>{v.av}</span>
                        <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold truncate">{v.e}</b><span className="text-[11.5px] text-ink-3">Pending invite</span></div>
                        <span className="text-[11.5px] font-semibold text-ink-2 bg-bg border border-line rounded-[7px] px-2.5 py-1">{v.r}</span>
                        <button onClick={() => setInvites((vs) => vs.filter((_, j) => j !== i))} className="text-ink-3 grid place-items-center"><Icon name="X" size={15} /></button>
                      </div>
                    ))}
                  </div>
                </Pane>
              )}
              {step === 4 && (
                <div className="flex flex-col items-center text-center pt-2.5 gap-4">
                  <span className="relative grid place-items-center w-[74px] h-[74px] rounded-full bg-[#E7F8F0] before:content-[''] before:absolute before:-inset-2.5 before:rounded-full before:bg-emerald-500/10"><Icon name="Check" size={34} className="text-emerald-600" /></span>
                  <div><h2 className="m-0 text-[22px] font-bold">You're all set!</h2><div className="text-[13.5px] text-ink-2 mt-1">Eclipse Softworks is ready to go on Apex.</div></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    {[
                      { ic: "Building2", b: "eclipsesoftworks", s: ".apex.io workspace" },
                      { ic: "UsersRound", b: `${teams.length} teams`, s: "created" },
                      { ic: "GitBranch", b: `${repos.filter((r) => r.on).length} repos`, s: "connected" },
                      { ic: "Mail", b: `${invites.length} invites`, s: "sent" },
                    ].map((s) => (
                      <div key={s.b} className="flex items-center gap-3 p-[12px_14px] border border-line rounded-xl text-left">
                        <span className="grid place-items-center w-[34px] h-[34px] rounded-[9px] flex-none bg-brand-soft"><Icon name={s.ic} size={16} className="text-brand" /></span>
                        <div><b className="text-base font-bold">{s.b}</b><span className="block text-[11.5px] text-ink-3">{s.s}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* illustration */}
            <div className="relative overflow-hidden flex flex-col items-center justify-center gap-5 p-[34px] text-white order-first lg:order-none min-h-[170px]" style={{ background: "linear-gradient(155deg,#5B5BF0 0%,#7C5CF6 55%,#9A6BF8 100%)" }}>
              <span className="absolute rounded-full blur-lg opacity-50 w-[150px] h-[150px] -top-8 -right-8" style={{ background: "rgba(255,255,255,.18)" }} />
              <span className="absolute rounded-full blur-lg opacity-50 w-[120px] h-[120px] -bottom-5 -left-8" style={{ background: "rgba(14,165,233,.4)" }} />
              <div className="grid place-items-center w-[104px] h-[104px] rounded-[28px] relative z-10 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.4)]" style={{ background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.25)" }}><Icon name={il.ic} size={48} className="text-white" /></div>
              <div className="text-center relative z-10"><h3 className="m-0 mb-2 text-lg font-bold">{il.t}</h3><p className="m-0 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>{il.x}</p></div>
              <div className="flex gap-1.5 relative z-10">{ILLUS.map((_, i) => <span key={i} className={cn("h-[7px] rounded-full transition-all", i === step ? "w-[22px] bg-card" : "w-[7px] bg-white/40")} />)}</div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between p-[18px_34px] border-t border-line">
            <span className="text-[12.5px] text-ink-3">Step {step + 1} of 5</span>
            <div className="flex gap-2.5">
              <button onClick={() => step > 0 && setStep((s) => s - 1)} disabled={step === 0} className="h-[42px] px-[18px] rounded-[11px] border border-line bg-card text-[13.5px] font-semibold flex items-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed"><Icon name="ArrowLeft" size={16} />Back</button>
              <button onClick={next} className="h-[42px] px-[18px] rounded-[11px] text-white text-[13.5px] font-semibold flex items-center gap-2 shadow-[0_10px_22px_-10px_color-mix(in_srgb,var(--color-brand)_90%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}>
                {step === 4 ? "Go to dashboard" : step === 3 ? "Finish setup" : "Continue"}<Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pane({ title, lede, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div><h2 className="m-0 mb-1 text-xl font-bold tracking-[-0.01em]">{title}</h2><div className="text-[13.5px] text-ink-2">{lede}</div></div>
      {children}
    </div>
  );
}

function Field({ label, select, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-2">{label}</span>
      <span className={cn(FIELD, select && "relative")}>
        {children}
        {select && <span className="absolute right-3 pointer-events-none text-ink-3"><Icon name="ChevronDown" size={15} /></span>}
      </span>
    </label>
  );
}
