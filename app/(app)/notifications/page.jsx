"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Switch } from "@/components/ui";
import { cn } from "@/lib/cn";

const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const NOTES = [
  { cat: "all", unread: true, tt: 'New pull request merged: <b class="text-brand-600">#4821 Fix authentication bug</b>', who: "Thabo Nkosi", av: "TN", pi: 3, tm: "2m ago", ic: "GitMerge", ib: "#E7F8F0", icol: "#16A34A" },
  { cat: "all", unread: true, tt: 'Task <b class="text-brand-600">"Design system update"</b> completed', who: "Priya Singh", av: "PS", pi: 4, tm: "15m ago", ic: "CircleCheckBig", ib: "#EEF0FE", icol: "#4F46E5" },
  { cat: "mentions", unread: true, tt: '<b class="text-brand-600">@TR</b> mentioned you in <b class="text-brand-600">API Gateway v2</b>', who: "Sipho Dlamini", av: "SD", pi: 1, tm: "40m ago", ic: "AtSign", ib: "#F3EEFE", icol: "#7C3AED" },
  { cat: "all", unread: true, tt: 'Milestone <b class="text-brand-600">"Apex v2.1"</b> updated · due June 30', who: "Sipho Dlamini", av: "SD", pi: 1, tm: "1h ago", ic: "Flag", ib: "#EAF1FF", icol: "#2563EB" },
  { cat: "system", unread: true, tt: 'AI risk alert: <b class="text-brand-600">2 projects</b> need attention', who: "Apex AI", av: "AI", pi: 0, tm: "2h ago", ic: "TriangleAlert", ib: "#FDECEC", icol: "#EF4444" },
  { cat: "mentions", unread: true, tt: 'New comment on <b class="text-brand-600">"Real-time activity feed"</b>', who: "Naledi Kgosana", av: "NK", pi: 2, tm: "3h ago", ic: "MessageSquare", ib: "#F3EEFE", icol: "#7C3AED" },
  { cat: "all", unread: false, tt: 'Task <b class="text-brand-600">"API rate limiting"</b> assigned to you', who: "TR Mokwena", av: "TM", pi: 0, tm: "5h ago", ic: "UserPlus", ib: "#EEF0FE", icol: "#4F46E5" },
  { cat: "all", unread: false, tt: 'Review requested on <b class="text-brand-600">#4810 Webhook signatures</b>', who: "Naledi Kgosana", av: "NK", pi: 2, tm: "8h ago", ic: "GitPullRequest", ib: "#E7F8F0", icol: "#16A34A" },
  { cat: "system", unread: false, tt: "Weekly executive summary is ready", who: "Apex AI", av: "AI", pi: 0, tm: "1d ago", ic: "FileText", ib: "#EEF0FE", icol: "#4F46E5" },
  { cat: "mentions", unread: false, tt: '<b class="text-brand-600">@TR</b> assigned in <b class="text-brand-600">Security Audit</b>', who: "Priya Singh", av: "PS", pi: 4, tm: "1d ago", ic: "AtSign", ib: "#F3EEFE", icol: "#7C3AED" },
];
const TABS = [["all", "All", 12], ["unread", "Unread", 6], ["mentions", "Mentions", 3], ["system", "System", 2]];

const CHANNELS = [
  { ic: "Mail", b: "Email Notifications", s: "Digest & important alerts", on: true },
  { ic: "Smartphone", b: "Push Notifications", s: "Mobile & desktop push", on: true },
  { ic: "MessageSquare", b: "SMS Notifications", s: "Critical alerts only", on: false },
  { ic: "AppWindow", b: "In-App Notifications", s: "Shown in the activity bell", on: true },
];
const ACTIVITY = [
  { ic: "GitMerge", b: "Pull requests & commits", on: true },
  { ic: "AtSign", b: "Mentions & comments", on: true },
  { ic: "TriangleAlert", b: "AI risk alerts", on: true },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const data = tab === "all" ? NOTES : tab === "unread" ? NOTES.filter((n) => n.unread) : NOTES.filter((n) => n.cat === tab);

  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="relative grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft">
            <Icon name="Bell" size={19} className="text-brand" />
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 grid place-items-center rounded-lg bg-red-500 text-white text-[9.5px] font-bold border-2 border-bg">6</span>
          </span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Notifications</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Stay up to date with activity across your organization.</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button icon={<Icon name="CheckCheck" size={15} />}>Mark all read</Button>
          <Button className="!px-0 w-[38px]"><Icon name="Settings" size={15} /></Button>
        </div>
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        {/* list */}
        <div className="flex-1 min-w-0 w-full card">
          <div className="flex items-center gap-1 p-2 border-b border-line overflow-x-auto">
            {TABS.map(([id, label, ct]) => (
              <button key={id} onClick={() => setTab(id)} className={cn("flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[13px] font-medium transition-colors whitespace-nowrap", tab === id ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:bg-bg")}>
                {label}<span className={cn("text-[11px] font-semibold rounded-full px-1.5", tab === id ? "bg-brand text-white" : "bg-white border border-slate-200 text-ink-3")}>{ct}</span>
              </button>
            ))}
          </div>
          <div>
            {data.map((n, i) => (
              <div key={i} className={cn("relative flex items-start gap-3 px-[18px] py-[15px] border-b border-line last:border-b-0 cursor-pointer transition-colors hover:bg-[#FBFCFE]", n.unread && "bg-[#FAFBFF] before:content-[''] before:absolute before:left-[7px] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-brand")}>
                <span className="grid place-items-center w-[38px] h-[38px] rounded-[11px] flex-none" style={{ background: n.ib }}><Icon name={n.ic} size={18} style={{ color: n.icol }} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink leading-[1.4]" dangerouslySetInnerHTML={{ __html: n.tt }} />
                  <div className="text-xs text-ink-3 mt-1 flex items-center gap-2">
                    <span className="grid place-items-center w-[18px] h-[18px] rounded-full text-white text-[8.5px] font-semibold" style={{ background: PAL[n.pi] }}>{n.av}</span>{n.who}
                  </div>
                </div>
                <span className="text-[11.5px] text-ink-3 whitespace-nowrap flex-none">{n.tm}</span>
              </div>
            ))}
          </div>
          <div className="p-[13px] text-center"><button className="text-[12.5px] font-medium text-brand">Load earlier notifications</button></div>
        </div>

        {/* preferences */}
        <div className="w-full lg:w-[340px] flex-none card">
          <div className="p-[16px_18px] border-b border-line">
            <h3 className="m-0 text-[15px] font-semibold">Notification Preferences</h3>
            <div className="text-xs text-ink-3 mt-0.5">Choose how you want to be notified.</div>
          </div>
          <div className="px-[18px] pb-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3 pt-3.5 pb-1.5">Channels</div>
            {CHANNELS.map((p) => (
              <div key={p.b} className="flex items-center gap-3 py-[11px] border-b border-line last:border-b-0">
                <span className="grid place-items-center w-8 h-8 rounded-[9px] flex-none bg-bg"><Icon name={p.ic} size={16} className="text-ink-2" /></span>
                <span className="flex-1 min-w-0"><b className="block text-[13px] font-medium text-ink">{p.b}</b><span className="text-[11.5px] text-ink-3">{p.s}</span></span>
                <Switch defaultChecked={p.on} />
              </div>
            ))}
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3 pt-3.5 pb-1.5">Activity</div>
            {ACTIVITY.map((p) => (
              <div key={p.b} className="flex items-center gap-3 py-[11px] border-b border-line last:border-b-0">
                <span className="grid place-items-center w-8 h-8 rounded-[9px] flex-none bg-bg"><Icon name={p.ic} size={16} className="text-ink-2" /></span>
                <span className="flex-1 min-w-0"><b className="block text-[13px] font-medium text-ink">{p.b}</b></span>
                <Switch defaultChecked={p.on} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
