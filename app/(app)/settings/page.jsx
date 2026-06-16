"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";
import ThemePicker from "@/components/ThemePicker";
import GeneralSettings from "@/components/GeneralSettings";
import UsersSettings from "@/components/UsersSettings";
import RolesSettings from "@/components/RolesSettings";
import AuditLogsSettings from "@/components/AuditLogsSettings";
import FeatureFlagsSettings from "@/components/FeatureFlagsSettings";
import ApiKeysSettings from "@/components/ApiKeysSettings";
import BillingSettings from "@/components/BillingSettings";
import IntegrationsSettings from "@/components/IntegrationsSettings";
import TeamsSettings from "@/components/TeamsSettings";

const ADMIN_NAV = [
  { label: "General", icon: "SlidersHorizontal" },
  { label: "Appearance", icon: "Palette" },
  { label: "Teams", icon: "UsersRound" },
  { label: "Users", icon: "User" },
  { label: "Roles & Permissions", icon: "Shield" },
  { label: "Audit Logs", icon: "ScrollText" },
  { label: "Feature Flags", icon: "Flag" },
  { label: "Integrations", icon: "Blocks" },
  { label: "API Keys", icon: "KeyRound" },
  { label: "Billing", icon: "CreditCard" },
];
export default function SettingsPage() {
  const [active, setActive] = useState("General");
  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="ShieldCheck" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Organization Settings</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Manage teams, members, roles, and workspace configuration.</div>
          </div>
        </div>
        <button className="flex items-center gap-2.5 card rounded-field px-3.5 py-2.5 text-[13px] font-medium"><Icon name="Building2" size={16} className="text-brand" />Eclipse Softworks<Icon name="ChevronDown" size={15} className="text-ink-3" /></button>
      </div>

      <div className="flex gap-[18px] items-start flex-col lg:flex-row">
        {/* admin sub-nav */}
        <div className="w-full lg:w-[212px] flex-none card !shadow-card p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 px-2.5 pt-1 pb-3">Admin</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-[3px]">
            {ADMIN_NAV.map((a) => (
              <button key={a.label} onClick={() => setActive(a.label)} className={cn("flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-[13px] font-medium text-left transition-colors", active === a.label ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                <Icon name={a.icon} size={16} className={active === a.label ? "text-brand" : "text-ink-3"} />{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* content per section */}
        {active === "General" && <GeneralSettings />}
        {active === "Users" && <UsersSettings />}
        {active === "Roles & Permissions" && <RolesSettings />}
        {active === "Audit Logs" && <AuditLogsSettings />}
        {active === "Feature Flags" && <FeatureFlagsSettings />}
        {active === "API Keys" && <ApiKeysSettings />}
        {active === "Billing" && <BillingSettings />}
        {active === "Integrations" && <IntegrationsSettings />}
        {active === "Teams" && <TeamsSettings />}
        {active === "Appearance" && <div className="flex-1 min-w-0"><ThemePicker /></div>}
      </div>
    </>
  );
}
