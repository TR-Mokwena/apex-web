"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Dropdown, MenuItem, MenuSep, Modal, Field, TextInput, Select } from "@/components/ui";
import { cn } from "@/lib/cn";

const SCOPES = ["Read-only", "Read & write", "Full access"];
const SCOPE_TONE = {
  "Read-only": "bg-[#EAF1FF] text-[#3B82F6]",
  "Read & write": "bg-brand-soft text-brand-600",
  "Full access": "bg-[#F3EEFE] text-[#7C3AED]",
};

const genKey = (env) => `sk_${env}_` + Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
const mask = (full) => `${full.slice(0, 11)}${"•".repeat(10)}${full.slice(-4)}`;

const SEED = [
  { id: 1, name: "Production API", full: "sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", scope: "Full access", created: "Mar 2, 2026", lastUsed: "2m ago", status: "active" },
  { id: 2, name: "CI / Deploy", full: "sk_live_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4", scope: "Read & write", created: "Feb 18, 2026", lastUsed: "1h ago", status: "active" },
  { id: 3, name: "Analytics export", full: "sk_live_m1n2b3v4c5x6z7a8s9d0f1g2h3j4k5l6", scope: "Read-only", created: "Jan 9, 2026", lastUsed: "3d ago", status: "active" },
  { id: 4, name: "Old mobile build", full: "sk_test_q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6", scope: "Read-only", created: "Nov 4, 2025", lastUsed: "Never", status: "revoked" },
];

export default function ApiKeysSettings() {
  const [keys, setKeys] = useState(SEED);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", scope: "Read & write", env: "live" });
  const [created, setCreated] = useState(null); // {name, full}
  const [copied, setCopied] = useState(null);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const copy = (id, text) => { navigator.clipboard?.writeText(text); setCopied(id); setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400); };
  const revoke = (id) => setKeys((ks) => ks.map((k) => (k.id === id ? { ...k, status: "revoked", lastUsed: k.lastUsed } : k)));
  const remove = (id) => setKeys((ks) => ks.filter((k) => k.id !== id));
  const create = () => {
    const name = form.name.trim();
    if (!name) return;
    const full = genKey(form.env);
    const key = { id: Date.now(), name, full, scope: form.scope, created: "just now", lastUsed: "Never", status: "active" };
    setKeys((ks) => [key, ...ks]);
    setOpen(false); setForm({ name: "", scope: "Read & write", env: "live" });
    setCreated({ name, full });
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3.5">
      {created && (
        <div className="card !shadow-card p-[16px_18px] border-emerald-200 bg-emerald-50/40">
          <div className="flex items-start gap-2.5">
            <Icon name="CircleCheckBig" size={18} className="text-emerald-600 mt-0.5 flex-none" />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-emerald-700">“{created.name}” created</div>
              <p className="m-0 text-[12px] text-ink-2 mt-0.5">Copy it now — for security you won't be able to see it again.</p>
              <div className="flex items-center gap-2 mt-2.5">
                <code className="flex-1 min-w-0 truncate text-[12.5px] font-mono bg-card border border-line rounded-lg px-3 py-2">{created.full}</code>
                <Button size="sm" variant="primary" icon={<Icon name={copied === "new" ? "Check" : "Copy"} size={14} />} onClick={() => copy("new", created.full)}>{copied === "new" ? "Copied" : "Copy"}</Button>
              </div>
            </div>
            <button onClick={() => setCreated(null)} className="text-ink-3 hover:text-ink-2 flex-none"><Icon name="X" size={16} /></button>
          </div>
        </div>
      )}

      <div className="card !shadow-card">
        <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
          <div>
            <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">API Keys</h2>
            <div className="text-[12.5px] text-ink-3 mt-0.5">{keys.filter((k) => k.status === "active").length} active keys · used to authenticate API requests</div>
          </div>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />Create API key</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr>{["Name", "Key", "Scope", "Last used", "Status", ""].map((h, i) => (
                <th key={i} className={cn("text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3.5 border-b border-line", i === 5 && "text-right")}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const revoked = k.status === "revoked";
                return (
                  <tr key={k.id} className={cn("hover:bg-bg-soft", revoked && "opacity-55")}>
                    <td className="px-5 py-3 border-b border-line">
                      <div className="text-[13.5px] font-semibold">{k.name}</div>
                      <div className="text-[11.5px] text-ink-3">Created {k.created}</div>
                    </td>
                    <td className="px-5 py-3 border-b border-line">
                      <div className="flex items-center gap-2">
                        <code className="text-[12px] font-mono text-ink-2">{mask(k.full)}</code>
                        {!revoked && <button onClick={() => copy(k.id, k.full)} className="text-ink-3 hover:text-brand" title="Copy"><Icon name={copied === k.id ? "Check" : "Copy"} size={14} className={copied === k.id ? "text-emerald-500" : ""} /></button>}
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-line"><span className={cn("inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full", SCOPE_TONE[k.scope])}>{k.scope}</span></td>
                    <td className="px-5 py-3 border-b border-line text-[12.5px] text-ink-2">{k.lastUsed}</td>
                    <td className="px-5 py-3 border-b border-line">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", revoked ? "text-ink-3" : "text-emerald-600")}><span className={cn("w-[7px] h-[7px] rounded-full", revoked ? "bg-ink-3" : "bg-emerald-500")} />{revoked ? "Revoked" : "Active"}</span>
                    </td>
                    <td className="px-5 py-3 border-b border-line text-right">
                      <Dropdown align="right" width={150} trigger={({ toggle }) => (
                        <button onClick={toggle} className="text-ink-3 hover:text-ink-2"><Icon name="EllipsisVertical" size={17} /></button>
                      )}>
                        {!revoked && <MenuItem icon="Copy" onClick={() => copy(k.id, k.full)}>Copy key</MenuItem>}
                        {!revoked && <MenuItem icon="Ban" danger onClick={() => revoke(k.id)}>Revoke</MenuItem>}
                        {revoked && <MenuItem icon="Trash2" danger onClick={() => remove(k.id)}>Delete</MenuItem>}
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create API key"
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={create}>Create key</Button></>}>
        <Field label="Name"><TextInput value={form.name} onChange={setF("name")} placeholder="e.g. Production API" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Scope"><Select value={form.scope} onChange={setF("scope")}>{SCOPES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Environment"><Select value={form.env} onChange={setF("env")}><option value="live">Live</option><option value="test">Test</option></Select></Field>
        </div>
        <p className="m-0 text-[12px] text-ink-3">The key is shown once after creation. Store it somewhere safe.</p>
      </Modal>
    </div>
  );
}
