"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Switch } from "@/components/ui";
import { cn } from "@/lib/cn";

const PERMS = [
  { group: "Projects", items: [
    { key: "projects.view", label: "View projects" },
    { key: "projects.create", label: "Create projects" },
    { key: "projects.edit", label: "Edit & archive projects" },
    { key: "projects.delete", label: "Delete projects" },
  ]},
  { group: "Tasks", items: [
    { key: "tasks.create", label: "Create & assign tasks" },
    { key: "tasks.edit", label: "Edit any task" },
    { key: "tasks.delete", label: "Delete tasks" },
  ]},
  { group: "Members", items: [
    { key: "members.invite", label: "Invite members" },
    { key: "members.manage", label: "Manage roles" },
    { key: "members.remove", label: "Remove members" },
  ]},
  { group: "Workspace", items: [
    { key: "settings.manage", label: "Manage workspace settings" },
    { key: "billing.manage", label: "Manage billing" },
    { key: "audit.view", label: "View audit logs" },
  ]},
];
const ALL_KEYS = PERMS.flatMap((g) => g.items.map((i) => i.key));
const grant = (keys) => Object.fromEntries(ALL_KEYS.map((k) => [k, keys.includes("*") || keys.includes(k)]));

const INITIAL_ROLES = [
  { id: "admin", name: "Admin", desc: "Full access to everything in the workspace.", members: 3, icon: "ShieldCheck", color: "#6366F1", locked: true, perms: grant(["*"]) },
  { id: "lead", name: "Lead", desc: "Manages their team's projects, tasks and members.", members: 5, icon: "Shield", color: "#8B5CF6", perms: grant(["projects.view", "projects.create", "projects.edit", "tasks.create", "tasks.edit", "tasks.delete", "members.invite", "audit.view"]) },
  { id: "member", name: "Member", desc: "Contributes to projects and tasks.", members: 38, icon: "User", color: "#22C55E", perms: grant(["projects.view", "projects.create", "tasks.create", "tasks.edit"]) },
  { id: "viewer", name: "Viewer", desc: "Read-only access to assigned projects.", members: 5, icon: "Eye", color: "#0EA5E9", perms: grant(["projects.view"]) },
];

export default function RolesSettings() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [sel, setSel] = useState("lead");
  const [saved, setSaved] = useState(false);
  const role = roles.find((r) => r.id === sel);

  const toggle = (key) => {
    if (role.locked) return;
    setRoles((rs) => rs.map((r) => (r.id === sel ? { ...r, perms: { ...r.perms, [key]: !r.perms[key] } } : r)));
  };
  const grantedCount = Object.values(role.perms).filter(Boolean).length;
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };

  return (
    <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-3.5 items-start">
      {/* roles list */}
      <div className="w-full lg:w-[260px] flex-none card !shadow-card p-2.5">
        <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Roles</span>
          <button className="text-brand hover:text-brand-600"><Icon name="Plus" size={16} /></button>
        </div>
        <div className="flex flex-col gap-1">
          {roles.map((r) => (
            <button key={r.id} onClick={() => setSel(r.id)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-left transition-colors", sel === r.id ? "bg-brand-soft" : "hover:bg-bg-soft")}>
              <span className="grid place-items-center w-9 h-9 rounded-[10px] text-white flex-none" style={{ background: r.color }}><Icon name={r.icon} size={16} /></span>
              <div className="flex-1 min-w-0"><div className={cn("text-[13.5px] font-semibold", sel === r.id && "text-brand-600")}>{r.name}</div><div className="text-[11.5px] text-ink-3">{r.members} members</div></div>
              {sel === r.id && <Icon name="ChevronRight" size={15} className="text-brand" />}
            </button>
          ))}
        </div>
      </div>

      {/* permissions */}
      <div className="flex-1 min-w-0 card !shadow-card">
        <div className="flex items-start justify-between gap-3 p-[18px_20px] border-b border-line flex-wrap">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-[11px] text-white flex-none" style={{ background: role.color }}><Icon name={role.icon} size={18} /></span>
            <div>
              <div className="flex items-center gap-2"><h2 className="m-0 text-[16px] font-semibold">{role.name}</h2>{role.locked && <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-3 bg-bg-soft rounded-full px-2 py-0.5"><Icon name="Lock" size={11} />System role</span>}</div>
              <p className="m-0 text-[12.5px] text-ink-3 mt-0.5">{role.desc}</p>
            </div>
          </div>
          <Button variant="primary" onClick={save} disabled={role.locked} icon={saved ? <Icon name="Check" size={15} /> : null}>{saved ? "Saved" : "Save changes"}</Button>
        </div>

        {role.locked && (
          <div className="flex items-center gap-2.5 m-[16px_20px_0] p-[12px_14px] rounded-xl bg-brand-soft text-brand-600 text-[12.5px] font-medium">
            <Icon name="ShieldCheck" size={16} />Admins always have full access. This role can't be edited.
          </div>
        )}

        <div className="p-[18px_20px] flex flex-col gap-5">
          <div className="text-[12.5px] text-ink-3">{grantedCount} of {ALL_KEYS.length} permissions granted</div>
          {PERMS.map((g) => (
            <div key={g.group}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">{g.group}</div>
              <div className="flex flex-col">
                {g.items.map((it) => (
                  <div key={it.key} className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-b-0">
                    <span className="text-[13px] font-medium text-ink">{it.label}</span>
                    <Switch checked={!!role.perms[it.key]} onChange={() => toggle(it.key)} className={cn(role.locked && "opacity-60 pointer-events-none")} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
