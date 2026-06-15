"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Dropdown, MenuItem, MenuSep, Modal, Field, TextInput, Select } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const ROLES = ["Admin", "Lead", "Member", "Viewer"];
const TEAMS = ["Engineering", "Product", "Design", "DevOps", "QA", "Data", "Infra"];
const ROLE_TONE = {
  Admin: "bg-brand-soft text-brand-600",
  Lead: "bg-[#F3EEFE] text-[#7C3AED]",
  Member: "bg-bg-soft text-ink-2",
  Viewer: "bg-[#EAF1FF] text-[#3B82F6]",
};
const STATUS = {
  active: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Active" },
  invited: { dot: "bg-amber-500", text: "text-amber-500", label: "Invited" },
  suspended: { dot: "bg-red-500", text: "text-red-500", label: "Suspended" },
};

const SEED = [
  { id: 1, name: "TR Mokwena", email: "tr@eclipsesoftworks.com", role: "Admin", team: "Product", status: "active", last: "Just now", av: "TM", pi: 0 },
  { id: 2, name: "Sipho Dlamini", email: "sipho@eclipsesoftworks.com", role: "Lead", team: "Engineering", status: "active", last: "5m ago", av: "SD", pi: 1 },
  { id: 3, name: "Priya Singh", email: "priya@eclipsesoftworks.com", role: "Lead", team: "Design", status: "active", last: "1h ago", av: "PS", pi: 4 },
  { id: 4, name: "Thabo Nkosi", email: "thabo@eclipsesoftworks.com", role: "Member", team: "QA", status: "active", last: "2h ago", av: "TN", pi: 3 },
  { id: 5, name: "Naledi Kgosana", email: "naledi@eclipsesoftworks.com", role: "Member", team: "Engineering", status: "active", last: "1d ago", av: "NK", pi: 2 },
  { id: 6, name: "Kabelo Mokoena", email: "kabelo@eclipsesoftworks.com", role: "Member", team: "DevOps", status: "active", last: "3d ago", av: "KM", pi: 2 },
  { id: 7, name: "Anke Visser", email: "anke@eclipsesoftworks.com", role: "Viewer", team: "Data", status: "invited", last: "—", av: "AV", pi: 1 },
  { id: 8, name: "Neo Khumalo", email: "neo@eclipsesoftworks.com", role: "Member", team: "Infra", status: "suspended", last: "2w ago", av: "NK", pi: 0 },
];

export default function UsersSettings() {
  const [users, setUsers] = useState(SEED);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "Member", team: "Engineering" });

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const invite = () => {
    const email = form.email.trim();
    if (!email) return;
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const av = (name[0] + (name.split(" ")[1]?.[0] || name[1] || "")).toUpperCase();
    setUsers((us) => [{ id: Date.now(), name, email, role: form.role, team: form.team, status: "invited", last: "—", av, pi: us.length % 5 }, ...us]);
    setOpen(false); setForm({ email: "", role: "Member", team: "Engineering" });
  };
  const toggleSuspend = (id) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u)));
  const setRole = (id, role) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, role } : u)));
  const remove = (id) => setUsers((us) => us.filter((u) => u.id !== id));

  const list = users.filter((u) =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(query.trim().toLowerCase()) || u.email.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="flex-1 min-w-0 card !shadow-card">
      <div className="flex items-center justify-between gap-3.5 p-[18px_20px] border-b border-line flex-wrap">
        <div>
          <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">Users</h2>
          <div className="text-[12.5px] text-ink-3 mt-0.5">{users.length} members · {users.filter((u) => u.status === "invited").length} pending invites</div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-bg border border-line rounded-[10px] px-3 py-2 w-[200px]">
            <Icon name="Search" size={15} className="text-ink-3" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
          </div>
          <Dropdown align="right" width={160} trigger={({ toggle }) => (
            <button onClick={toggle} className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] border border-line bg-card text-[12.5px] font-medium text-ink-2"><Icon name="SlidersHorizontal" size={14} className="text-ink-3" />{roleFilter === "All" ? "All roles" : roleFilter}<Icon name="ChevronDown" size={13} className="text-ink-3" /></button>
          )}>
            {["All", ...ROLES].map((r) => <MenuItem key={r} onClick={() => setRoleFilter(r)} trailing={roleFilter === r ? <Icon name="Check" size={14} className="text-brand" /> : null}>{r === "All" ? "All roles" : r}</MenuItem>)}
          </Dropdown>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 h-[38px] px-[15px] rounded-[10px] text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="UserPlus" size={15} />Invite member</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr>{["Member", "Role", "Team", "Status", "Last active", ""].map((h, i) => (
              <th key={i} className={cn("text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3.5 border-b border-line", i === 5 && "text-right")}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {list.map((u) => {
              const st = STATUS[u.status];
              return (
                <tr key={u.id} className="hover:bg-bg-soft">
                  <td className="px-5 py-3 border-b border-line">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center w-9 h-9 rounded-full text-white text-[11px] font-semibold flex-none" style={{ background: PAL[u.pi % PAL.length] }}>{u.av}</span>
                      <div className="min-w-0"><div className="text-[13.5px] font-semibold truncate">{u.name}</div><div className="text-[11.5px] text-ink-3 truncate">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-line">
                    <Dropdown align="left" width={150} trigger={({ toggle }) => (
                      <button onClick={toggle} className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", ROLE_TONE[u.role])}>{u.role}<Icon name="ChevronDown" size={12} /></button>
                    )}>
                      {ROLES.map((r) => <MenuItem key={r} onClick={() => setRole(u.id, r)} trailing={u.role === r ? <Icon name="Check" size={14} className="text-brand" /> : null}>{r}</MenuItem>)}
                    </Dropdown>
                  </td>
                  <td className="px-5 py-3 border-b border-line text-[13px] text-ink-2">{u.team}</td>
                  <td className="px-5 py-3 border-b border-line">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", st.text)}><span className={cn("w-[7px] h-[7px] rounded-full", st.dot)} />{st.label}</span>
                  </td>
                  <td className="px-5 py-3 border-b border-line text-[12.5px] text-ink-3">{u.last}</td>
                  <td className="px-5 py-3 border-b border-line text-right">
                    <Dropdown align="right" width={160} trigger={({ toggle }) => (
                      <button onClick={toggle} className="text-ink-3 hover:text-ink-2"><Icon name="EllipsisVertical" size={17} /></button>
                    )}>
                      <MenuItem icon="Mail" onClick={() => {}}>Email</MenuItem>
                      <MenuItem icon={u.status === "suspended" ? "CircleCheck" : "Ban"} onClick={() => toggleSuspend(u.id)}>{u.status === "suspended" ? "Reactivate" : "Suspend"}</MenuItem>
                      <MenuSep />
                      <MenuItem icon="Trash2" danger onClick={() => remove(u.id)}>Remove</MenuItem>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-[13.5px] text-ink-2">No users match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-[13px_20px] text-[12.5px] text-ink-3">
        <span>Showing {list.length} of {users.length} members</span>
        <div className="flex items-center gap-1.5">
          <button className="grid place-items-center w-[30px] h-[30px] rounded-lg border border-line bg-card text-ink-2"><Icon name="ChevronLeft" size={14} /></button>
          <button className="grid place-items-center w-[30px] h-[30px] rounded-lg bg-brand text-white text-[12.5px] font-semibold">1</button>
          <button className="grid place-items-center w-[30px] h-[30px] rounded-lg border border-line bg-card text-ink-2"><Icon name="ChevronRight" size={14} /></button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Invite member"
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={invite}>Send invite</Button></>}>
        <Field label="Email address"><TextInput value={form.email} onChange={setF("email")} placeholder="name@eclipsesoftworks.com" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Role"><Select value={form.role} onChange={setF("role")}>{ROLES.map((r) => <option key={r}>{r}</option>)}</Select></Field>
          <Field label="Team"><Select value={form.team} onChange={setF("team")}>{TEAMS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
        </div>
        <p className="m-0 text-[12px] text-ink-3">They'll receive an email invite to join Eclipse Softworks.</p>
      </Modal>
    </div>
  );
}
