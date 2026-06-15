"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Switch, Dropdown, MenuItem, Modal, Field, TextInput, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";

const ENV_TONE = {
  Production: "bg-emerald-50 text-emerald-600",
  Staging: "bg-amber-50 text-amber-500",
  Development: "bg-[#EAF1FF] text-[#3B82F6]",
};
const ROLLOUTS = [0, 25, 50, 75, 100];

const SEED = [
  { key: "new-dashboard", name: "New Dashboard", desc: "Redesigned global dashboard with AI insights.", on: true, rollout: 100, env: ["Production", "Staging"], updated: "2d ago" },
  { key: "ai-risk-v2", name: "AI Risk Model v2", desc: "Upgraded delay-prediction model.", on: true, rollout: 50, env: ["Staging"], updated: "5h ago" },
  { key: "realtime-presence", name: "Realtime Presence", desc: "Live cursors and presence inside projects.", on: false, rollout: 0, env: ["Staging"], updated: "1w ago" },
  { key: "export-pdf", name: "PDF Reports Export", desc: "Export analytics reports to PDF.", on: true, rollout: 100, env: ["Production"], updated: "3d ago" },
  { key: "automation-engine", name: "Automation Engine", desc: "Run workflow automations server-side.", on: false, rollout: 25, env: ["Staging", "Development"], updated: "1d ago" },
  { key: "smart-search", name: "Smart Search", desc: "AI-ranked command palette results.", on: true, rollout: 75, env: ["Staging"], updated: "6h ago" },
];

export default function FeatureFlagsSettings() {
  const [flags, setFlags] = useState(SEED);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", key: "", desc: "" });

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (key) => setFlags((fs) => fs.map((f) => (f.key === key ? { ...f, on: !f.on, rollout: !f.on && f.rollout === 0 ? 100 : f.rollout } : f)));
  const setRollout = (key, r) => setFlags((fs) => fs.map((f) => (f.key === key ? { ...f, rollout: r, on: r > 0 } : f)));
  const create = () => {
    const name = form.name.trim();
    if (!name) return;
    const key = (form.key.trim() || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFlags((fs) => [{ key, name, desc: form.desc.trim() || "No description.", on: false, rollout: 0, env: ["Development"], updated: "just now" }, ...fs]);
    setOpen(false); setForm({ name: "", key: "", desc: "" });
  };

  const list = flags.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()) || f.key.includes(query.trim().toLowerCase()));

  return (
    <div className="flex-1 min-w-0 card !shadow-card">
      <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
        <div>
          <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Feature Flags</h2>
          <div className="text-[12.5px] text-ink-3 mt-0.5">{flags.filter((f) => f.on).length} of {flags.length} flags enabled</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-3 py-2 w-[200px]">
            <Icon name="Search" size={15} className="text-ink-3" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search flags..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
          </div>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />New flag</button>
        </div>
      </div>

      <div>
        {list.map((f) => (
          <div key={f.key} className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-bg-soft transition-colors flex-wrap">
            <span className={cn("grid place-items-center w-10 h-10 rounded-[11px] flex-none", f.on ? "bg-brand-soft text-brand" : "bg-bg-soft text-ink-3")}><Icon name="Flag" size={18} /></span>
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center gap-2 flex-wrap">
                <b className="text-[14px] font-semibold">{f.name}</b>
                <code className="text-[11px] font-mono text-ink-3 bg-bg-soft rounded-md px-1.5 py-0.5">{f.key}</code>
              </div>
              <div className="text-[12px] text-ink-3 mt-0.5">{f.desc}</div>
            </div>

            <div className="flex items-center gap-1.5">
              {f.env.map((e) => <span key={e} className={cn("text-[10.5px] font-semibold px-2 py-0.5 rounded-full", ENV_TONE[e])}>{e}</span>)}
            </div>

            {/* rollout */}
            <Dropdown align="right" width={130} trigger={({ toggle: t }) => (
              <button onClick={t} className={cn("flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-line text-[12px] font-semibold tabular-nums", f.on ? "text-ink" : "text-ink-3")}>
                {f.on ? `${f.rollout}%` : "Off"}<Icon name="ChevronDown" size={12} className="text-ink-3" />
              </button>
            )}>
              {ROLLOUTS.map((r) => <MenuItem key={r} onClick={() => setRollout(f.key, r)} trailing={f.rollout === r && f.on ? <Icon name="Check" size={14} className="text-brand" /> : null}>{r}% rollout</MenuItem>)}
            </Dropdown>

            <Switch checked={f.on} onChange={() => toggle(f.key)} />
          </div>
        ))}
        {list.length === 0 && <div className="px-5 py-12 text-center text-[13.5px] text-ink-2">No flags match your search.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New feature flag"
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={create}>Create flag</Button></>}>
        <Field label="Name"><TextInput value={form.name} onChange={setF("name")} placeholder="e.g. Smart Notifications" autoFocus /></Field>
        <Field label="Key"><TextInput value={form.key} onChange={setF("key")} placeholder="smart-notifications" className="font-mono" /></Field>
        <Field label="Description"><Textarea value={form.desc} onChange={setF("desc")} rows={2} placeholder="What does this flag control?" /></Field>
        <p className="m-0 text-[12px] text-ink-3">New flags start disabled in Development.</p>
      </Modal>
    </div>
  );
}
