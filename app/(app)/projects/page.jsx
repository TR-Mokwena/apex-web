"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { Button, Modal, Field, TextInput, Textarea, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PROJECTS, PAL, INITIALS, STATUS_TONE, getStoredProjects, addStoredProject, slugify } from "@/lib/projects";

const FILTERS = ["All", "Active", "On Track", "Planning", "At Risk"];
const SWATCHES = ["#6366F1", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];
const STATUSES = ["Active", "On Track", "Planning", "At Risk"];

export default function ProjectsDirectory() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState(PROJECTS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", key: "", desc: "", status: "Active", color: "#6366F1" });

  useEffect(() => { setProjects([...getStoredProjects(), ...PROJECTS]); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const create = () => {
    const name = form.name.trim();
    if (!name) return;
    const p = {
      slug: slugify(name), name, desc: form.desc.trim() || "No description yet.", status: form.status, color: form.color,
      key: (form.key.trim() || name.slice(0, 3)).toUpperCase(), progress: 0, done: 0, total: 0, members: [0], star: false, sprint: "Backlog", due: "—",
    };
    addStoredProject(p);
    setProjects((ps) => [p, ...ps]);
    setOpen(false);
    setForm({ name: "", key: "", desc: "", status: "Active", color: "#6366F1" });
    router.push(`/projects/${p.slug}`);
  };

  const list = projects.filter(
    (p) => (filter === "All" || p.status === filter) && p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Folder" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Projects</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Every project across the organization.</div>
          </div>
        </div>
        <Button variant="primary" icon={<Icon name="Plus" size={15} />} onClick={() => setOpen(true)}>New Project</Button>
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex gap-1.5 bg-card border border-line rounded-[11px] p-1 shadow-card overflow-x-auto max-w-full">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-colors", filter === f ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:text-ink")}>{f}</button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-card border border-line rounded-field px-3 py-2.5 w-full sm:w-[240px] shadow-card">
          <Icon name="Search" size={15} className="text-ink-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {list.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="card p-[18px] flex flex-col gap-3.5 transition-[border-color,box-shadow] hover:border-[#D6DCEA] hover:shadow-[0_12px_30px_-16px_rgba(16,24,40,0.28)]">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-[12px] text-white text-[13px] font-bold flex-none" style={{ background: p.color }}>{p.key.slice(0, 2)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <b className="text-[15px] font-semibold truncate">{p.name}</b>
                  {p.star && <Icon name="Star" size={14} className="text-amber-500 fill-amber-500 flex-none" />}
                </div>
                <span className={cn("inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1", STATUS_TONE[p.status])}>{p.status}</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-ink-3 flex-none" />
            </div>

            <p className="m-0 text-[12.5px] text-ink-2 leading-relaxed line-clamp-2 flex-1">{p.desc}</p>

            <div>
              <div className="flex items-center justify-between text-[11.5px] mb-1.5">
                <span className="text-ink-3">{p.done}/{p.total} tasks</span>
                <span className="font-semibold text-heading tabular-nums">{p.progress}%</span>
              </div>
              <div className="h-2 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} /></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex">
                {p.members.map((m, i) => (
                  <span key={i} className="grid place-items-center w-7 h-7 rounded-full text-white text-[10px] font-semibold border-2 border-card" style={{ background: PAL[m % PAL.length], marginLeft: i ? -8 : 0 }}>{INITIALS[m]}</span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-[11.5px] text-ink-3"><Icon name="CalendarRange" size={13} />{p.sprint}</span>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="card grid place-items-center py-16 text-center mt-1">
          <div className="flex flex-col items-center gap-2"><Icon name="SearchX" size={28} className="text-ink-3" /><div className="text-[13.5px] text-ink-2">No projects match your search.</div></div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New project"
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={create}>Create project</Button></>}>
        <Field label="Project name"><TextInput value={form.name} onChange={set("name")} placeholder="e.g. Billing Service" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Key"><TextInput value={form.key} onChange={set("key")} placeholder="BILL" maxLength={5} /></Field>
          <Field label="Status"><Select value={form.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        </div>
        <Field label="Description"><Textarea value={form.desc} onChange={set("desc")} rows={3} placeholder="What is this project about?" /></Field>
        <Field label="Color">
          <div className="flex gap-2">
            {SWATCHES.map((c) => (
              <button key={c} onClick={() => setForm((f) => ({ ...f, color: c }))} className={cn("w-7 h-7 rounded-full transition-transform hover:scale-110", form.color === c && "ring-2 ring-offset-2 ring-offset-card")} style={{ background: c }} />
            ))}
          </div>
        </Field>
      </Modal>
    </>
  );
}
