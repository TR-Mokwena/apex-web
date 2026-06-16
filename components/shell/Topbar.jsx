"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { Dropdown, MenuItem, MenuLabel, MenuSep } from "@/components/ui";
import { QUICK_CREATE } from "@/lib/nav";

const ORGS = [
  { name: "Eclipse Softworks", plan: "Enterprise", grad: "linear-gradient(135deg,#6366F1,#8B5CF6)", initials: "ES" },
  { name: "Nova Labs", plan: "Pro plan", grad: "linear-gradient(135deg,#0EA5E9,#38BDF8)", initials: "NL" },
  { name: "Acme Collective", plan: "Free plan", grad: "linear-gradient(135deg,#F59E0B,#FBBF24)", initials: "AC" },
];

function IconButton({ icon, badge, primary, href, label, onClick }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick || (href ? () => router.push(href) : undefined)}
      className={cn(
        "relative grid place-items-center w-10 h-10 rounded-field card cursor-pointer transition-transform hover:-translate-y-px",
        primary ? "bg-brand border-brand text-white" : "text-ink-2",
      )}
    >
      <Icon name={icon} size={18} />
      {badge != null && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 grid place-items-center rounded-full bg-red-500 text-white text-[10px] font-semibold border-2 border-white">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Topbar({ onOpenMenu }) {
  const router = useRouter();
  const [org, setOrg] = useState(ORGS[0]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        router.push("/command");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 md:px-7 py-3 bg-card/85 backdrop-blur-md border-b border-line">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="md:hidden grid place-items-center w-10 h-10 rounded-field card text-ink-2"
      >
        <Icon name="Menu" size={19} />
      </button>

      <button
        type="button"
        onClick={() => router.push("/command")}
        className="flex items-center gap-2.5 card rounded-field px-3 py-2.5 w-full max-w-[320px] text-left cursor-pointer"
      >
        <Icon name="Search" size={16} className="text-ink-3" />
        <span className="flex-1 text-[13px] text-ink-3">Search anything…</span>
        <span className="hidden sm:inline text-[11px] text-ink-3 border border-line rounded-[5px] px-1.5 py-px">⌘K</span>
      </button>

      <div className="flex-1" />

      {/* quick create */}
      <Dropdown
        align="right"
        width={208}
        trigger={({ toggle }) => (
          <button type="button" aria-label="Quick create" onClick={toggle} className="relative grid place-items-center w-10 h-10 rounded-field bg-brand border border-brand text-white cursor-pointer transition-transform hover:-translate-y-px">
            <Icon name="Plus" size={18} />
          </button>
        )}
      >
        <MenuLabel>Create new</MenuLabel>
        {QUICK_CREATE.map((q) => (
          <MenuItem key={q.label} icon={q.icon} href={q.href}>{q.label}</MenuItem>
        ))}
      </Dropdown>

      <IconButton icon="Bell" badge={6} href="/notifications" label="Notifications" />
      <IconButton icon="MessageSquare" href="/messages" label="Messages" />

      {/* org switcher */}
      <Dropdown
        align="right"
        width={272}
        className="hidden sm:block"
        trigger={({ toggle }) => (
          <button type="button" onClick={toggle} className="flex items-center gap-2.5 card rounded-field pl-2 pr-3 py-1.5 text-[13px] font-medium cursor-pointer">
            <span className="grid place-items-center w-[26px] h-[26px] rounded-lg text-white text-[10px] font-bold flex-none" style={{ background: org.grad }}>{org.initials}</span>
            <span className="max-w-[130px] truncate">{org.name}</span>
            <Icon name="ChevronsUpDown" size={15} className="text-ink-3" />
          </button>
        )}
      >
        <MenuLabel>Organizations</MenuLabel>
        {ORGS.map((o) => (
          <button key={o.name} type="button" onClick={() => setOrg(o)} className="flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-[9px] hover:bg-bg">
            <span className="grid place-items-center w-9 h-9 rounded-[10px] text-white text-[12px] font-bold flex-none" style={{ background: o.grad }}>{o.initials}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-semibold text-ink truncate">{o.name}</span>
              <span className="block text-[11px] text-ink-3">{o.plan}</span>
            </span>
            {o.name === org.name && <Icon name="Check" size={16} className="text-brand flex-none" />}
          </button>
        ))}
        <MenuSep />
        <MenuItem icon="Settings" href="/settings">Organization settings</MenuItem>
        <MenuItem icon="Plus" href="/onboarding">Create organization</MenuItem>
      </Dropdown>
    </header>
  );
}
