"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import { NAV, QUICK_CREATE } from "@/lib/nav";
import { Dropdown, MenuItem, MenuLabel, MenuSep } from "@/components/ui";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "z-60 flex flex-col gap-[18px] flex-none text-[#CDD3E0]",
        "w-[236px] h-screen sticky top-0 px-3.5 py-5",
        "bg-gradient-to-b from-sidebar-top to-sidebar-bottom",
        "transition-transform duration-300 ease-[var(--ease-out)]",
        // mobile drawer
        "max-md:fixed max-md:top-0 max-md:left-0 max-md:w-[264px] max-md:shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
        open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        collapsed && "md:w-[66px] md:px-2.5",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="md:hidden absolute top-4 right-3.5 grid place-items-center w-[30px] h-[30px] rounded-lg bg-white/[0.06] text-[#9AA3B8]"
      >
        <Icon name="X" size={17} />
      </button>

      {/* brand */}
      <div className={cn("flex items-center gap-[11px] px-2 pb-1.5", collapsed && "md:justify-center md:px-0")}>
        <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand text-white flex-none">
          <Icon name="MountainSnow" size={20} />
        </span>
        <div className={cn(collapsed && "md:hidden")}>
          <div className="font-bold text-xl leading-none text-white">Apex</div>
          <div className="text-[10.5px] text-[#8590A8] mt-[3px]">by Eclipse Softworks</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-[18px] -mx-1 px-1">
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[13.5px] font-medium transition-colors",
                  active
                    ? "bg-brand text-white shadow-[0_6px_16px_-6px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]"
                    : "text-[#9AA3B8] hover:bg-white/5 hover:text-[#E8EBF2]",
                  collapsed && "md:justify-center md:gap-0 md:px-0 md:py-2.5",
                )}
              >
                <Icon name={item.icon} size={18} className="flex-none" />
                <span className={cn(collapsed && "md:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={cn("rounded-[14px] p-3 flex flex-col gap-[9px] bg-white/[0.035] border border-white/[0.06]", collapsed && "md:hidden")}>
          <div className="flex items-center justify-between">
            <b className="text-xs font-semibold text-[#E8EBF2]">Quick Create</b>
            <span className="grid place-items-center w-5 h-5 rounded-md bg-brand text-white">
              <Icon name="Plus" size={13} />
            </span>
          </div>
          {QUICK_CREATE.map((q) => (
            <Link key={q.label} href={q.href} onClick={onClose} className="flex items-center gap-2.5 text-[12.5px] text-[#9AA3B8] hover:text-[#E8EBF2] transition-colors py-0.5">
              <Icon name={q.icon} size={15} className="text-[#737E97]" />
              {q.label}
            </Link>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="flex flex-col gap-3.5">
        <Dropdown
          placement="top"
          width={224}
          trigger={({ toggle }) => (
            <button type="button" onClick={toggle} className={cn("w-full flex items-center gap-[11px] p-[9px] rounded-[13px] bg-white/[0.04] border border-white/[0.06] text-left hover:bg-white/[0.08] transition-colors", collapsed && "md:justify-center md:px-0")}>
              <span className="grid place-items-center w-[38px] h-[38px] rounded-full flex-none text-white font-semibold text-sm bg-gradient-to-br from-brand to-violet-500">
                TM
              </span>
              <span className={cn("flex-1 min-w-0", collapsed && "md:hidden")}>
                <span className="block text-[13px] font-semibold text-[#F3F5FA] truncate">TR Mokwena</span>
                <span className="block text-[11px] text-[#8590A8] mt-px">Product Manager</span>
              </span>
              <Icon name="ChevronsUpDown" size={15} className={cn("text-[#737E97]", collapsed && "md:hidden")} />
            </button>
          )}
        >
          <div className="px-2.5 py-2">
            <div className="text-[13px] font-semibold text-ink">TR Mokwena</div>
            <div className="text-[11.5px] text-ink-3">tshepiso@eclipsesoftworks.com</div>
          </div>
          <MenuSep />
          <MenuItem icon="User" href="/settings" onClick={onClose}>Profile</MenuItem>
          <MenuItem icon="Settings" href="/settings" onClick={onClose}>Account settings</MenuItem>
          <MenuItem icon="Bell" href="/notifications" onClick={onClose}>Notifications</MenuItem>
          <MenuSep />
          <MenuItem icon="LogOut" href="/onboarding" onClick={onClose} danger>Sign out</MenuItem>
        </Dropdown>
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn("flex items-center gap-[9px] text-[#737E97] text-[12.5px] px-2 py-1 hover:text-[#E8EBF2] transition-colors", collapsed && "md:justify-center md:px-0")}
        >
          <Icon name="ChevronLeft" size={15} className={cn(collapsed && "md:rotate-180")} />
          <span className={cn(collapsed && "md:hidden")}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
