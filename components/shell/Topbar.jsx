"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

function IconButton({ icon, badge, primary, href, label }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={href ? () => router.push(href) : undefined}
      className={cn(
        "relative grid place-items-center w-10 h-10 rounded-field card cursor-pointer transition-transform hover:-translate-y-px",
        primary ? "bg-brand border-brand text-white" : "text-slate-600",
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
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 md:px-7 py-3 bg-white/85 backdrop-blur-md border-b border-line">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="md:hidden grid place-items-center w-10 h-10 rounded-field card text-slate-600"
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

      <IconButton icon="Plus" primary label="Quick create" />
      <IconButton icon="Bell" badge={6} href="/notifications" label="Notifications" />
      <IconButton icon="MessageSquare" href="/messages" label="Messages" />
      <button
        type="button"
        className="hidden sm:flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium cursor-pointer"
      >
        <Icon name="Building2" size={16} className="text-brand" />
        Eclipse Softworks
        <Icon name="ChevronDown" size={15} className="text-ink-3" />
      </button>
    </header>
  );
}
