"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Button, Switch } from "@/components/ui";

const FIELD = "h-10 w-full border border-line rounded-[10px] px-3 text-sm outline-none bg-card focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]";
const TIMEZONES = ["(GMT+02:00) Johannesburg", "(GMT+01:00) Lagos", "(GMT+00:00) London", "(GMT-05:00) New York", "(GMT-08:00) Los Angeles", "(GMT+05:30) Mumbai"];
const LANGS = ["English (US)", "English (UK)", "Afrikaans", "isiZulu", "Français", "Português"];
const DATEF = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const WEEK = ["Monday", "Sunday"];

function Label({ children, hint }) {
  return <span className="text-[12.5px] font-medium text-ink-2">{children}{hint && <span className="text-ink-3 font-normal"> · {hint}</span>}</span>;
}

export default function GeneralSettings() {
  const [form, setForm] = useState({
    name: "Eclipse Softworks", sub: "eclipsesoftworks", desc: "Engineering studio building Apex and developer tooling.",
    tz: TIMEZONES[0], lang: LANGS[0], date: DATEF[0], week: WEEK[0],
  });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };

  return (
    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-start">
      <div className="lg:col-span-2 flex flex-col gap-3.5">
        {/* profile */}
        <div className="card !shadow-card p-[20px]">
          <h2 className="m-0 text-base font-semibold">Organization profile</h2>
          <p className="text-[12.5px] text-ink-3 mt-0.5 mb-4">Basic information about your workspace.</p>

          <div className="flex items-center gap-4 mb-5">
            <span className="grid place-items-center w-16 h-16 rounded-2xl text-white text-xl font-bold flex-none" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}>
              {form.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex gap-2">
              <Button size="sm" icon={<Icon name="Upload" size={14} />}>Upload logo</Button>
              <Button size="sm" variant="ghost">Remove</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5"><Label>Organization name</Label><input value={form.name} onChange={set("name")} className={FIELD} /></label>
            <label className="flex flex-col gap-1.5">
              <Label>Workspace URL</Label>
              <span className="flex items-stretch h-10 border border-line rounded-[10px] overflow-hidden focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]">
                <input value={form.sub} onChange={set("sub")} className="flex-1 min-w-0 px-3 text-sm outline-none bg-card" />
                <span className="px-3 grid place-items-center text-[13px] text-ink-3 bg-bg-soft border-l border-line">.apex.io</span>
              </span>
            </label>
            <label className="flex flex-col gap-1.5"><Label>Description</Label><textarea value={form.desc} onChange={set("desc")} rows={3} className={`${FIELD} h-auto py-2.5 resize-none`} /></label>
          </div>
        </div>

        {/* localization */}
        <div className="card !shadow-card p-[20px]">
          <h2 className="m-0 text-base font-semibold">Localization</h2>
          <p className="text-[12.5px] text-ink-3 mt-0.5 mb-4">Defaults applied across the workspace.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5"><Label>Timezone</Label><select value={form.tz} onChange={set("tz")} className={`${FIELD} cursor-pointer`}>{TIMEZONES.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label className="flex flex-col gap-1.5"><Label>Language</Label><select value={form.lang} onChange={set("lang")} className={`${FIELD} cursor-pointer`}>{LANGS.map((l) => <option key={l}>{l}</option>)}</select></label>
            <label className="flex flex-col gap-1.5"><Label>Date format</Label><select value={form.date} onChange={set("date")} className={`${FIELD} cursor-pointer`}>{DATEF.map((d) => <option key={d}>{d}</option>)}</select></label>
            <label className="flex flex-col gap-1.5"><Label>Week starts on</Label><select value={form.week} onChange={set("week")} className={`${FIELD} cursor-pointer`}>{WEEK.map((w) => <option key={w}>{w}</option>)}</select></label>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Button variant="primary" onClick={save} icon={saved ? <Icon name="Check" size={15} /> : null}>{saved ? "Saved" : "Save changes"}</Button>
          <Button>Cancel</Button>
        </div>
      </div>

      {/* side */}
      <div className="flex flex-col gap-3.5">
        <div className="card !shadow-card p-[20px]">
          <h3 className="m-0 mb-3 text-[15px] font-semibold">Workspace preferences</h3>
          {[
            ["Public project discovery", "Members can find all projects", true],
            ["Require 2-factor auth", "Enforce 2FA for everyone", false],
            ["Weekly digest email", "Sent every Monday morning", true],
          ].map(([t, s, on]) => (
            <div key={t} className="flex items-center justify-between gap-3 py-3 border-b border-line last:border-b-0">
              <div><div className="text-[13px] font-medium">{t}</div><div className="text-[11.5px] text-ink-3">{s}</div></div>
              <Switch defaultChecked={on} />
            </div>
          ))}
        </div>

        <div className="card !shadow-card p-[20px] border-red-200">
          <h3 className="m-0 mb-1 text-[15px] font-semibold text-red-500">Danger zone</h3>
          <p className="m-0 text-[12.5px] text-ink-2 mb-3">These actions affect the whole organization.</p>
          <div className="flex flex-col gap-2">
            <button className="h-10 rounded-[10px] border border-line text-[13px] font-semibold text-ink-2 hover:bg-bg-soft">Transfer ownership</button>
            <button className="h-10 rounded-[10px] bg-red-50 text-red-500 text-[13px] font-semibold hover:bg-red-100">Delete organization</button>
          </div>
        </div>
      </div>
    </div>
  );
}
