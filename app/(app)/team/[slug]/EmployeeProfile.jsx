"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Button, Card, CardLink, Tabs, Pill, Sparkline, Dropdown, MenuItem, MenuLabel, MenuSep } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getEmployee, ROLES, ROLE_ORDER, CAPS, PERMISSIONS, PAL } from "@/lib/team";

/* ---- small building blocks ---- */

function RolePill({ role, className }) {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <Pill tone={r.tone} className={cn("gap-1", className)}>
      <Icon name={r.icon} size={12} />
      {r.label}
    </Pill>
  );
}

function StatTile({ label, value, tone }) {
  return (
    <div className="border border-line rounded-[13px] p-[15px_17px]">
      <div className="text-[12.5px] text-ink-2 font-medium">{label}</div>
      <div className={cn("text-[26px] font-bold tracking-[-0.02em] leading-[1.1] mt-1.5", tone)}>{value}</div>
    </div>
  );
}

// Dashed placeholder shown where a section is hidden by the viewer's role.
function Locked({ title, note }) {
  return (
    <div className="border border-dashed border-line rounded-card p-[18px] flex items-start gap-3 bg-bg-soft/40">
      <span className="grid place-items-center w-9 h-9 rounded-[10px] flex-none bg-bg text-ink-3"><Icon name="Lock" size={16} /></span>
      <div>
        <div className="text-[13.5px] font-semibold">{title}</div>
        <div className="text-[12px] text-ink-3 mt-0.5">{note}</div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      {icon && <Icon name={icon} size={15} className="text-ink-3 flex-none" />}
      <span className="text-ink-3 w-[112px] flex-none">{label}</span>
      <span className="font-medium text-ink text-right flex-1 truncate">{value}</span>
    </div>
  );
}

function Bar({ value, color = "var(--color-brand)" }) {
  return (
    <div className="h-2 rounded-full bg-bg-soft overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ---- tab bodies ---- */

function Overview({ p, caps }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[18px] items-start">
      {/* left */}
      <div className="flex flex-col gap-[18px] min-w-0">
        <Card title="About">
          <p className="text-[13.5px] text-ink-2 leading-relaxed m-0">{p.bio}</p>
          <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
            {caps.contact ? (
              <>
                <Row icon="Mail" label="Email" value={p.email} />
                <Row icon="Phone" label="Phone" value={p.phone} />
              </>
            ) : (
              <div className="sm:col-span-2 flex items-center gap-2 text-[12.5px] text-ink-3">
                <Icon name="EyeOff" size={14} />Contact details are hidden for your role.
              </div>
            )}
            <Row icon="MapPin" label="Location" value={p.location} />
            <Row icon="Clock" label="Local time" value={`${p.localTime} · ${p.tz}`} />
          </div>
        </Card>

        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <span key={s} className="inline-flex items-center px-2.5 py-1.5 rounded-[9px] text-[12.5px] font-medium bg-bg-soft text-ink-2 border border-line">{s}</span>
            ))}
          </div>
        </Card>

        <Card title="Current projects" action={caps.assignWork ? <Button size="sm" variant="secondary" icon={<Icon name="Plus" size={14} />}>Assign work</Button> : null}>
          <div className="flex flex-col gap-2.5">
            {p.projects.map((pr) => (
              <div key={pr.key} className="flex items-center gap-3 p-[11px_13px] border border-line rounded-xl">
                <span className="grid place-items-center w-9 h-9 rounded-[10px] text-white text-[11px] font-bold flex-none" style={{ background: pr.color }}>{pr.key.slice(0, 2)}</span>
                <div className="flex-1 min-w-0">
                  <b className="block text-[13.5px] font-semibold truncate">{pr.name}</b>
                  <span className="text-[11.5px] text-ink-3">{pr.role}</span>
                </div>
                <div className="w-[92px] flex-none hidden sm:block">
                  <div className="flex items-center justify-between text-[11px] text-ink-3 mb-1"><span>Progress</span><span className="font-semibold text-ink-2">{pr.progress}%</span></div>
                  <Bar value={pr.progress} color={pr.color} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* right rail */}
      <div className="flex flex-col gap-[18px]">
        {caps.employment ? (
          <Card title="Employment">
            <div className="flex flex-col gap-3">
              <Row label="Employee ID" value={p.employeeId} />
              <Row label="Type" value={p.employmentType} />
              <Row label="Manager" value={p.manager} />
              <Row label="Joined" value={p.joined} />
              {caps.compensation ? (
                <Row label="Compensation" value={p.comp} />
              ) : (
                <div className="flex items-center justify-between gap-3 text-[13px] pt-1 border-t border-line">
                  <span className="text-ink-3">Compensation</span>
                  <span className="inline-flex items-center gap-1.5 text-ink-3"><Icon name="Lock" size={13} />Admins only</span>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Locked title="Employment details" note="Only Admins and Leads can view employment info." />
        )}

        <Card title="Teams & role">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-3">Org role</span>
              <RolePill role={p.role} />
            </div>
            <Row label="Team" value={p.team} />
            <Row label="Status" value={p.status} />
            <Row label="Handle" value={`@${p.handle}`} />
          </div>
        </Card>

        {caps.notes && (
          <Card title="Private notes" action={<span className="text-[11px] text-ink-3 inline-flex items-center gap-1"><Icon name="Lock" size={12} />Managers</span>}>
            {p.notes.length ? (
              <div className="flex flex-col gap-3">
                {p.notes.map((n, i) => (
                  <div key={i} className="text-[13px]">
                    <p className="m-0 text-ink-2 leading-relaxed">{n.body}</p>
                    <div className="text-[11.5px] text-ink-3 mt-1">— {n.by} · {n.t}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[12.5px] text-ink-3">No notes yet.</div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function Activity({ p }) {
  return (
    <Card title="Activity timeline">
      <div className="relative pl-1">
        {p.activity.map((a, i) => (
          <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
            {i < p.activity.length - 1 && <span className="absolute left-[18px] top-9 bottom-0 w-px bg-line" />}
            <span className={cn("grid place-items-center w-9 h-9 rounded-full flex-none z-10", a.tone)}><Icon name={a.ic} size={16} /></span>
            <div className="flex-1 min-w-0 pt-1.5">
              <div className="text-[13px] leading-snug"><b className="font-semibold">{p.name}</b> <span className="text-ink-2">{a.act}</span> <b className="font-semibold text-brand-600">{a.tgt}</b></div>
              <div className="text-[11.5px] text-ink-3 mt-0.5">{a.t}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Performance({ p }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <Card title="Goals & OKRs" action={<CardLink>View full review</CardLink>}>
        {p.goals.length ? (
          <div className="flex flex-col gap-4">
            {p.goals.map((g, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[13px] mb-1.5">
                  <span className="font-medium">{g.label}</span>
                  <span className="text-ink-3">{g.target} · <b className="text-ink-2">{g.progress}%</b></span>
                </div>
                <Bar value={g.progress} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[13px] text-ink-3">No goals set for this cycle.</div>
        )}
      </Card>
      <Card title="Latest review">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 text-[20px] font-bold flex-none">A</span>
          <div className="flex-1 min-w-[180px]">
            <div className="text-[14px] font-semibold">Exceeds expectations</div>
            <div className="text-[12.5px] text-ink-3 mt-0.5">H1 2026 cycle · reviewed by {p.manager}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Access({ p, viewerRole }) {
  const perms = PERMISSIONS[p.role] || [];
  return (
    <div className="flex flex-col gap-[18px]">
      <Card title="Role & permissions" action={<Button size="sm" variant="secondary" icon={<Icon name="Pencil" size={14} />}>Change role</Button>}>
        <div className="flex items-center gap-3 p-[13px_15px] rounded-xl bg-bg-soft border border-line mb-4">
          <RolePill role={p.role} />
          <span className="text-[12.5px] text-ink-2">{ROLES[p.role].blurb}</span>
        </div>
        <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
          {perms.map((perm) => (
            <li key={perm} className="flex items-center gap-2.5 text-[13px]">
              <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex-none"><Icon name="Check" size={13} strokeWidth={3} /></span>
              {perm}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Active sessions">
        <div className="flex flex-col gap-2.5">
          {[
            { d: "MacBook Pro · Chrome", loc: p.location, t: "Active now", cur: true },
            { d: "iPhone 15 · Apex iOS", loc: p.location, t: "2 hours ago" },
          ].map((s) => (
            <div key={s.d} className="flex items-center gap-3 p-[11px_13px] border border-line rounded-xl">
              <span className="grid place-items-center w-9 h-9 rounded-[10px] flex-none bg-bg text-ink-2"><Icon name="Monitor" size={16} /></span>
              <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold truncate">{s.d}</b><span className="text-[11.5px] text-ink-3">{s.loc} · {s.t}</span></div>
              {s.cur ? <Pill tone="green">This device</Pill> : <button className="text-[12px] font-semibold text-red-500">Revoke</button>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="!border-red-200">
        <h3 className="m-0 text-[15px] font-semibold text-red-600">Danger zone</h3>
        <div className="flex items-center justify-between gap-4 flex-wrap mt-3">
          <div className="text-[13px] text-ink-2">Deactivating removes access immediately. History is retained.</div>
          <button className="h-9 px-4 rounded-field border border-red-200 text-red-600 text-[13px] font-semibold hover:bg-red-50 transition-colors whitespace-nowrap">Deactivate member</button>
        </div>
      </Card>
    </div>
  );
}

/* ---- page ---- */

export default function EmployeeProfile({ slug }) {
  const p = getEmployee(slug);
  const [viewerRole, setViewerRole] = useState("admin");
  const [tab, setTab] = useState("Overview");

  if (!p) {
    return (
      <div className="card grid place-items-center py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <Icon name="UserX" size={30} className="text-ink-3" />
          <div className="text-[15px] font-semibold">Member not found</div>
          <Link href="/team" className="text-[13px] font-medium text-brand">← Back to team</Link>
        </div>
      </div>
    );
  }

  const caps = CAPS[viewerRole];
  const tabs = ["Overview", "Activity", ...(caps.performance ? ["Performance"] : []), ...(caps.access ? ["Access"] : [])];
  // keep the active tab valid when the role switch hides it
  const activeTab = tabs.includes(tab) ? tab : "Overview";
  const statusGuest = p.status !== "Active";

  return (
    <div className="flex flex-col gap-[18px]">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-[12.5px] text-ink-3">
        <Link href="/team" className="hover:text-ink-2">Team</Link>
        <Icon name="ChevronRight" size={13} />
        <span className="text-ink-2 font-medium">{p.name}</span>
      </div>

      {/* "viewing as" role switcher */}
      <div className="card !shadow-card p-[13px_16px] flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-ink-2">
          <Icon name="Eye" size={15} className="text-ink-3" />Viewing as
        </div>
        <div className="flex items-center gap-1 bg-bg-soft border border-line rounded-pill p-1">
          {ROLE_ORDER.map((r) => (
            <button
              key={r}
              onClick={() => setViewerRole(r)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12.5px] font-semibold transition-colors",
                viewerRole === r ? "bg-card text-ink shadow-card" : "text-ink-3 hover:text-ink-2",
              )}
            >
              <Icon name={ROLES[r].icon} size={13} />
              {ROLES[r].label}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-ink-3 flex-1 min-w-[180px]">{ROLES[viewerRole].blurb}</span>
      </div>

      {/* profile header */}
      <div className="card p-[20px_22px]">
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <span className="grid place-items-center w-16 h-16 rounded-2xl text-white text-[22px] font-bold flex-none shadow-card" style={{ background: PAL[p.pi % PAL.length] }}>{p.initials}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="m-0 text-[22px] font-bold tracking-[-0.02em]">{p.name}</h1>
                <span className="text-[12px] text-ink-3">{p.pronouns}</span>
                <RolePill role={p.role} />
              </div>
              <div className="text-[13.5px] text-ink-2 mt-1">{p.title}</div>
              <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-2 text-[12px] text-ink-3">
                <span className="inline-flex items-center gap-1.5"><span className={cn("w-2 h-2 rounded-full", statusGuest ? "bg-amber-500" : "bg-emerald-500")} />{p.status}</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="Users" size={13} />{p.team}</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="MapPin" size={13} />{p.location}</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="Clock" size={13} />{p.localTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {caps.message && <Button variant="primary" icon={<Icon name="MessageSquare" size={15} />}>Message</Button>}
            {caps.editProfile && <Button variant="secondary" icon={<Icon name="Pencil" size={15} />}>Edit</Button>}
            {(caps.changeRole || caps.access || caps.deactivate) && (
              <Dropdown align="right" width={216} trigger={({ toggle }) => (
                <button onClick={toggle} aria-label="More actions" className="grid place-items-center w-10 h-10 rounded-field card text-ink-2"><Icon name="EllipsisVertical" size={16} /></button>
              )}>
                <MenuLabel>Manage member</MenuLabel>
                {caps.changeRole && <MenuItem icon="ShieldCheck">Change role</MenuItem>}
                {caps.access && <MenuItem icon="KeyRound">Manage access</MenuItem>}
                {caps.assignWork && <MenuItem icon="Plus">Assign work</MenuItem>}
                {caps.deactivate && <><MenuSep /><MenuItem icon="UserX" danger>Deactivate</MenuItem></>}
              </Dropdown>
            )}
          </div>
        </div>

        {/* contribution KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <StatTile label="Commits" value={p.stats.commits} />
          <StatTile label="Pull requests" value={p.stats.prs} tone="text-brand" />
          <StatTile label="Reviews" value={p.stats.reviews} tone="text-emerald-600" />
          <div className="border border-line rounded-[13px] p-[15px_17px] flex flex-col">
            <div className="text-[12.5px] text-ink-2 font-medium">30-day trend</div>
            <div className="mt-auto pt-2"><Sparkline values={p.trend} width={160} height={40} color="var(--color-brand)" fill /></div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <Tabs items={tabs} value={activeTab} onChange={setTab} />

      {activeTab === "Overview" && <Overview p={p} caps={caps} />}
      {activeTab === "Activity" && <Activity p={p} />}
      {activeTab === "Performance" && <Performance p={p} />}
      {activeTab === "Access" && <Access p={p} viewerRole={viewerRole} />}
    </div>
  );
}
