"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/cn";
import { generateInvoicePdf, generateStatementPdf } from "@/lib/invoice";
import { useCountry, formatMoney } from "@/lib/locale";

const SEATS = 50;
// prices in ZAR (Rand), per member / month
const PLANS = [
  { id: "starter", name: "Starter", monthly: 0, annual: 0, desc: "For small teams getting started.", features: ["Up to 10 members", "5 projects", "Community support"] },
  { id: "pro", name: "Pro", monthly: 229, annual: 2290, desc: "For growing engineering teams.", features: ["Up to 50 members", "Unlimited projects", "Priority support", "Advanced analytics"] },
  { id: "enterprise", name: "Enterprise", monthly: 549, annual: 5490, desc: "For large organizations.", features: ["Unlimited members", "SSO & SCIM", "Audit logs & feature flags", "Dedicated support"] },
];

const USAGE = [
  { label: "Members", used: 38, total: 50, unit: "" },
  { label: "Storage", used: 64, total: 100, unit: " GB" },
  { label: "API requests", used: 1.2, total: 5, unit: "M", note: "this month" },
  { label: "Active projects", used: 24, total: null, unit: "", note: "Unlimited" },
];
// total is VAT-inclusive (subscription × seats + 15% VAT)
const INVOICES = [
  { no: "INV-2026-0006", date: "Jun 1, 2026", plan: "Enterprise", seats: 50, total: 31567.50, status: "Paid" },
  { no: "INV-2026-0005", date: "May 1, 2026", plan: "Enterprise", seats: 48, total: 30304.80, status: "Paid" },
  { no: "INV-2026-0004", date: "Apr 1, 2026", plan: "Enterprise", seats: 45, total: 28410.75, status: "Paid" },
  { no: "INV-2026-0003", date: "Mar 1, 2026", plan: "Pro", seats: 42, total: 11060.70, status: "Paid" },
];

export default function BillingSettings() {
  const [planId, setPlanId] = useState("enterprise");
  const [cycle, setCycle] = useState("monthly");
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState("enterprise");

  const country = useCountry();
  const plan = PLANS.find((p) => p.id === planId);
  const perSeat = cycle === "monthly" ? plan.monthly : Math.round(plan.annual / 12);
  const total = formatMoney(perSeat * SEATS, country);

  const apply = () => { setPlanId(pick); setOpen(false); };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3.5">
      {/* current plan */}
      <div className="card !shadow-card overflow-hidden">
        <div className="p-[20px] text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}>
          <span className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold bg-white/20 rounded-full px-2.5 py-0.5">Current plan</span>
              <div className="text-[22px] font-bold mt-2">{plan.name}</div>
              <div className="text-[12.5px] text-white/80 mt-0.5">{plan.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-[28px] font-bold leading-none">R{total}<span className="text-[14px] font-medium text-white/75">/mo</span></div>
              <div className="text-[11.5px] text-white/75 mt-1">R{perSeat}/member · {SEATS} seats</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-[14px_20px] flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex bg-bg-soft border border-line rounded-[10px] p-0.5">
              {["monthly", "annual"].map((c) => (
                <button key={c} onClick={() => setCycle(c)} className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors", cycle === c ? "bg-card shadow-card text-ink font-semibold" : "text-ink-2")}>{c}{c === "annual" && <span className="text-emerald-600 ml-1">−17%</span>}</button>
              ))}
            </div>
            <span className="text-[12.5px] text-ink-3">Renews Jul 1, 2026</span>
          </div>
          <div className="flex gap-2.5">
            <Button onClick={() => { setPick(planId); setOpen(true); }}>Change plan</Button>
            <Button variant="ghost" className="text-red-500">Cancel subscription</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3.5 items-start">
        {/* usage */}
        <div className="card !shadow-card p-[20px]">
          <h3 className="m-0 mb-4 text-[15px] font-semibold">Usage</h3>
          <div className="flex flex-col gap-4">
            {USAGE.map((u) => {
              const pct = u.total ? Math.min(100, Math.round((u.used / u.total) * 100)) : 0;
              const near = pct >= 85;
              return (
                <div key={u.label}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                    <span className="font-medium">{u.label}{u.note && u.total && <span className="text-ink-3 font-normal"> · {u.note}</span>}</span>
                    <span className="text-ink-2 tabular-nums">{u.used}{u.unit} {u.total ? `/ ${u.total}${u.unit}` : <span className="text-emerald-600 font-medium">{u.note}</span>}</span>
                  </div>
                  {u.total && <div className="h-2 bg-bg rounded-full overflow-hidden"><div className={cn("h-full rounded-full", near ? "bg-amber-500" : "bg-brand")} style={{ width: `${pct}%` }} /></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* payment */}
        <div className="card !shadow-card p-[20px]">
          <div className="flex items-center justify-between mb-4"><h3 className="m-0 text-[15px] font-semibold">Payment method</h3><Button size="sm">Update</Button></div>
          <div className="flex items-center gap-3 p-3 border border-line rounded-xl">
            <span className="grid place-items-center w-11 h-8 rounded-md bg-[#1A1F71] text-white text-[11px] font-bold italic flex-none">VISA</span>
            <div className="flex-1"><div className="text-[13px] font-semibold">•••• •••• •••• 4242</div><div className="text-[11.5px] text-ink-3">Expires 08 / 27</div></div>
          </div>
          <div className="mt-4">
            <div className="text-[12.5px] font-medium mb-1.5">Billing email</div>
            <div className="text-[13px] text-ink-2">billing@eclipsesoftworks.com</div>
          </div>
        </div>
      </div>

      {/* invoices */}
      <div className="card !shadow-card">
        <div className="flex items-center justify-between p-[18px_20px] border-b border-line"><h3 className="m-0 text-[15px] font-semibold">Billing history</h3><button onClick={() => generateStatementPdf(INVOICES)} className="text-[12.5px] font-medium text-brand hover:text-brand-600 inline-flex items-center gap-1.5"><Icon name="Download" size={13} />Download all</button></div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[560px]">
            <thead><tr>{["Date", "Description", "Amount", "Status", ""].map((h, i) => <th key={i} className={cn("text-left text-[11px] font-semibold uppercase tracking-wide text-ink-3 px-5 py-3 border-b border-line", i === 4 && "text-right")}>{h}</th>)}</tr></thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.no} className="hover:bg-bg-soft">
                  <td className="px-5 py-3 text-[13px] border-b border-line font-medium">{inv.date}</td>
                  <td className="px-5 py-3 text-[13px] border-b border-line text-ink-2">{inv.plan} · {inv.seats} seats</td>
                  <td className="px-5 py-3 text-[13px] border-b border-line tabular-nums">{fmtR(inv.total)}</td>
                  <td className="px-5 py-3 border-b border-line"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />{inv.status}</span></td>
                  <td className="px-5 py-3 border-b border-line text-right"><button onClick={() => generateInvoicePdf(inv)} className="text-ink-3 hover:text-brand" title="Download invoice"><Icon name="Download" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Change plan" width={560}
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={apply} disabled={pick === planId}>{pick === planId ? "Current plan" : `Switch to ${PLANS.find((p) => p.id === pick).name}`}</Button></>}>
        <div className="flex flex-col gap-2.5">
          {PLANS.map((p) => {
            const sel = pick === p.id, cur = planId === p.id;
            return (
              <button key={p.id} onClick={() => setPick(p.id)} className={cn("text-left p-4 rounded-xl border transition-colors", sel ? "border-brand bg-brand-soft" : "border-line hover:border-[#C7D2FE]")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><b className="text-[14px] font-semibold">{p.name}</b>{cur && <span className="text-[10px] font-semibold text-ink-3 bg-bg-soft rounded-full px-2 py-0.5">Current</span>}</div>
                  <div className="text-[15px] font-bold">R{cycle === "monthly" ? p.monthly : Math.round(p.annual / 12)}<span className="text-[11px] font-medium text-ink-3">/member/mo</span></div>
                </div>
                <p className="m-0 text-[12px] text-ink-2 mt-0.5">{p.desc}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {p.features.map((f) => <span key={f} className="inline-flex items-center gap-1 text-[11.5px] text-ink-2"><Icon name="Check" size={12} className="text-emerald-500" />{f}</span>)}
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
