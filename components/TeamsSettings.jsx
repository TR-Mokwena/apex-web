"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Modal, Field, TextInput, Select, Dropdown, MenuItem, Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const TEAM_ICONS = ["CodeXml", "Box", "Palette", "Server", "Bug", "Database", "Rocket", "Shield"];
const GRADS = [
  "linear-gradient(135deg,#6366F1,#818CF8)", "linear-gradient(135deg,#0EA5E9,#38BDF8)",
  "linear-gradient(135deg,#8B5CF6,#A78BFA)", "linear-gradient(135deg,#10B981,#34D399)",
  "linear-gradient(135deg,#F59E0B,#FBBF24)", "linear-gradient(135deg,#EC4899,#F472B6)",
];
const initials = (n) => n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const SEED = [
  { name: "Engineering", ic: "CodeXml", ib: GRADS[0], mem: 18, proj: 8, lead: "Sipho Dlamini", pi: 0, st: "active" },
  { name: "Product", ic: "Box", ib: GRADS[1], mem: 9, proj: 4, lead: "TR Mokwena", pi: 1, st: "active" },
  { name: "Design", ic: "Palette", ib: GRADS[2], mem: 6, proj: 3, lead: "Priya Singh", pi: 4, st: "active" },
  { name: "DevOps", ic: "Server", ib: GRADS[3], mem: 5, proj: 2, lead: "Neo Kgosana", pi: 2, st: "active" },
  { name: "QA", ic: "Bug", ib: GRADS[4], mem: 4, proj: 2, lead: "Thabo Nkosi", pi: 3, st: "paused" },
  { name: "Data", ic: "Database", ib: GRADS[5], mem: 9, proj: 5, lead: "Anke Visser", pi: 1, st: "active" },
];
const BLANK = { name: "", lead: "", icon: "CodeXml", status: "active" };

export default function TeamsSettings() {
  const [teams, setTeams] = useState(SEED);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const visible = teams.filter((t) =>
    (filter === "All" || t.st === filter.toLowerCase()) &&
    `${t.name} ${t.lead}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const create = () => {
    if (!form.name.trim()) return;
    const i = teams.length;
    setTeams((s) => [...s, { name: form.name.trim(), ic: form.icon, ib: GRADS[i % GRADS.length], mem: 0, proj: 0, lead: form.lead.trim() || "Unassigned", pi: i % PAL.length, st: form.status }]);
    setForm(BLANK);
    setOpen(false);
  };
  const setStatus = (name, st) => setTeams((s) => s.map((t) => (t.name === name ? { ...t, st } : t)));
  const remove = (name) => setTeams((s) => s.filter((t) => t.name !== name));

  return (
    <div className="flex-1 min-w-0 card !shadow-card">
      <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
        <div>
          <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Teams</h2>
          <div className="text-[12.5px] text-ink-3 mt-0.5">{teams.length} teams · {teams.reduce((s, t) => s + t.mem, 0)} members across the organization</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-3 py-2 w-[200px]"><Icon name="Search" size={15} className="text-ink-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search teams..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" /></div>
          <Dropdown align="right" width={150} trigger={({ toggle }) => (
            <button onClick={toggle} title="Filter" className={cn("grid place-items-center w-[38px] h-[38px] rounded-[10px] border bg-card", filter !== "All" ? "border-brand text-brand" : "border-line text-ink-2")}><Icon name="SlidersHorizontal" size={16} /></button>
          )}>
            {["All", "Active", "Paused"].map((f) => <MenuItem key={f} onClick={() => setFilter(f)} trailing={f === filter ? <Icon name="Check" size={14} className="text-brand" /> : null}>{f}</MenuItem>)}
          </Dropdown>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />New Team</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              {["Team", "Members", "Projects", "Lead", "Status", ""].map((h, i) => (
                <th key={i} className={cn("text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3.5 border-b border-line", i === 5 && "text-right")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.name} className="hover:bg-bg-soft">
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                  <div className="flex items-center gap-3 font-semibold"><span className="grid place-items-center w-[34px] h-[34px] rounded-[9px] flex-none" style={{ background: t.ib }}><Icon name={t.ic} size={16} className="text-white" /></span>{t.name}</div>
                </td>
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-ink-2">{t.mem}</td>
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-ink-2">{t.proj}</td>
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                  <div className="flex items-center gap-2.5"><span className="grid place-items-center w-[26px] h-[26px] rounded-full text-white text-[10px] font-semibold flex-none" style={{ background: PAL[t.pi] }}>{initials(t.lead)}</span>{t.lead}</div>
                </td>
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line">
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", t.st === "active" ? "text-emerald-600" : "text-amber-500")}><span className={cn("w-[7px] h-[7px] rounded-full", t.st === "active" ? "bg-emerald-500" : "bg-amber-500")} />{t.st[0].toUpperCase() + t.st.slice(1)}</span>
                </td>
                <td className="px-5 py-3.5 text-[13.5px] border-b border-line text-right">
                  <Dropdown align="right" width={170} trigger={({ toggle }) => <button onClick={toggle} className="text-ink-3 hover:text-ink"><Icon name="EllipsisVertical" size={17} /></button>}>
                    {t.st === "active"
                      ? <MenuItem icon="Pause" onClick={() => setStatus(t.name, "paused")}>Pause team</MenuItem>
                      : <MenuItem icon="Play" onClick={() => setStatus(t.name, "active")}>Activate team</MenuItem>}
                    <MenuItem icon="Trash2" danger onClick={() => remove(t.name)}>Delete team</MenuItem>
                  </Dropdown>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-14 text-center text-[13.5px] text-ink-2">No teams match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-[13px_20px] text-[12.5px] text-ink-3">
        <span>Showing {visible.length} of {teams.length} teams</span>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New team"
        footer={<>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={create} disabled={!form.name.trim()}>Create team</Button>
        </>}>
        <Field label="Team name"><TextInput value={form.name} onChange={set("name")} placeholder="e.g. Platform" autoFocus /></Field>
        <Field label="Team lead"><TextInput value={form.lead} onChange={set("lead")} placeholder="e.g. Sipho Dlamini" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Icon"><Select value={form.icon} onChange={set("icon")}>{TEAM_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</Select></Field>
          <Field label="Status"><Select value={form.status} onChange={set("status")}><option value="active">Active</option><option value="paused">Paused</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}
