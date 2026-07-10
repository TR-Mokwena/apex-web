"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { PageHeader, Button, Pill, Sparkline } from "@/components/ui";
import { cn } from "@/lib/cn";
import { TEAM, ROLES, ROLE_ORDER, PAL, roleCounts } from "@/lib/team";

const FILTERS = ["All", ...ROLE_ORDER.map((r) => ROLES[r].label)];

// Static tone classes for the role summary tiles (Tailwind can't see interpolated names).
const ROLE_TILE = {
  indigo: { box: "bg-brand-soft", icon: "text-brand" },
  violet: { box: "bg-violet-50", icon: "text-violet-600" },
  blue: { box: "bg-[#EAF1FF]", icon: "text-[#2563EB]" },
  slate: { box: "bg-bg-soft", icon: "text-ink-2" },
};

export default function TeamPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const counts = roleCounts();

  const people = TEAM.filter((p) => {
    const matchesRole = filter === "All" || ROLES[p.role].label === filter;
    const s = q.trim().toLowerCase();
    const matchesQ = !s || [p.name, p.title, p.team, p.handle].some((v) => v.toLowerCase().includes(s));
    return matchesRole && matchesQ;
  });

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="People, roles & access across Eclipse Softworks."
        actions={<Button variant="primary" icon={<Icon name="UserPlus" size={15} />}>Invite member</Button>}
      />

      {/* role summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-[18px]">
        {ROLE_ORDER.map((r) => {
          const role = ROLES[r];
          const tile = ROLE_TILE[role.tone] || ROLE_TILE.slate;
          return (
            <button
              key={r}
              onClick={() => setFilter(filter === role.label ? "All" : role.label)}
              className={cn(
                "card p-[15px_17px] flex items-center gap-3 text-left transition-[transform,border-color] hover:-translate-y-0.5",
                filter === role.label && "!border-brand",
              )}
            >
              <span className={cn("grid place-items-center w-11 h-11 rounded-[13px] flex-none", tile.box)}>
                <Icon name={role.icon} size={20} className={tile.icon} />
              </span>
              <div>
                <div className="text-[24px] font-bold leading-none tracking-[-0.02em]">{counts[r]}</div>
                <div className="text-[12px] text-ink-3 mt-1">{role.label}{counts[r] === 1 ? "" : "s"}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-3 flex-wrap mb-[18px]">
        <span className="flex items-center gap-2.5 card rounded-field px-3 py-2.5 w-full max-w-[320px]">
          <Icon name="Search" size={16} className="text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people…" className="flex-1 bg-transparent outline-none text-[13px] text-ink placeholder:text-ink-3" />
        </span>
        <div data-testid="role-filter" className="flex items-center gap-1 bg-bg-soft border border-line rounded-pill p-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 rounded-pill text-[12.5px] font-semibold whitespace-nowrap transition-colors", filter === f ? "bg-card text-ink shadow-card" : "text-ink-3 hover:text-ink-2")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* roster grid */}
      {people.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {people.map((p) => {
            const guest = p.status !== "Active";
            return (
              <Link key={p.slug} href={`/team/${p.slug}`} className="card p-[17px] flex flex-col gap-3.5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(16,24,40,0.28)]">
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl text-white text-[16px] font-bold flex-none" style={{ background: PAL[p.pi % PAL.length] }}>{p.initials}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <b className="text-[14.5px] font-semibold truncate">{p.name}</b>
                      <span className={cn("w-2 h-2 rounded-full flex-none", guest ? "bg-amber-500" : "bg-emerald-500")} />
                    </div>
                    <div className="text-[12.5px] text-ink-3 truncate">{p.title}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-ink-3 flex-none" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Pill tone={ROLES[p.role].tone} className="gap-1"><Icon name={ROLES[p.role].icon} size={12} />{ROLES[p.role].label}</Pill>
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-3"><Icon name="Users" size={13} />{p.team}</span>
                </div>

                <div className="flex items-end justify-between gap-3 pt-1 border-t border-line">
                  <div className="flex gap-4 text-[12px]">
                    <div><div className="font-semibold text-ink tabular-nums">{p.stats.commits}</div><div className="text-[11px] text-ink-3">commits</div></div>
                    <div><div className="font-semibold text-ink tabular-nums">{p.stats.prs}</div><div className="text-[11px] text-ink-3">PRs</div></div>
                  </div>
                  <Sparkline values={p.trend} width={96} height={30} color="var(--color-brand)" fill dot={false} className="w-[96px] flex-none" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card grid place-items-center py-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Icon name="SearchX" size={26} className="text-ink-3" />
            <div className="text-[14px] font-semibold">No people match</div>
            <div className="text-[12.5px] text-ink-3">Try a different search or filter.</div>
          </div>
        </div>
      )}
    </>
  );
}
