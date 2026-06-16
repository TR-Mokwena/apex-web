"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import BrandLogo from "@/components/BrandLogo";
import { Modal, Field, TextInput, Select, Textarea, Switch, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CATEGORIES, INTEGRATIONS } from "@/lib/integrations";

const FREQS = ["Real-time", "Every 15 min", "Hourly", "Daily"];

// Per-category authorize scopes + configure options for the connection workflow.
const CONNECT_CFG = {
  "Source Control": { scopes: ["Read repository metadata", "Read commits, PRs & reviews", "Read organisation members"], repos: ["apex/web", "apex/api", "apex/mobile", "apex/infra", "apex/docs"] },
  Communication: { scopes: ["Post messages to channels", "Read channel list"], channels: ["#engineering", "#alerts", "#general", "#leadership"], alerts: ["Risk alerts", "Mentions", "Daily digest"] },
  Productivity: { scopes: ["Read & write issues", "Read projects & boards"], boards: ["Apex v2.1", "Platform", "Mobile App"] },
  Monitoring: { scopes: ["Read alerts & events", "Read service metrics"], surface: ["Production errors → AI risk alerts", "Deploys → reports", "Incidents → linked projects"] },
  Developer: { scopes: ["Receive Apex events"], events: ["task.updated", "sprint.completed", "risk.detected", "member.invited"] },
};
const STEPS = ["Authorize", "Configure", "Done"];

function ConnectWizard({ it, onClose, onDone }) {
  const c = CONNECT_CFG[it.cat] || {};
  const [step, setStep] = useState(0);
  const [authorizing, setAuthorizing] = useState(false);
  const [repos, setRepos] = useState(() => new Set((c.repos || []).slice(0, 2)));
  const [channel, setChannel] = useState(c.channels?.[0] || "");
  const [board, setBoard] = useState(c.boards?.[0] || "");
  const [twoWay, setTwoWay] = useState(true);
  const [alerts, setAlerts] = useState(() => new Set(c.alerts || []));
  const [surface, setSurface] = useState(() => new Set(c.surface || []));
  const [events, setEvents] = useState(() => new Set(c.events || []));
  const [url, setUrl] = useState("");
  const [freq, setFreq] = useState("Real-time");
  const [secret] = useState(() => "whsec_" + Math.random().toString(36).slice(2, 14));

  const flip = (setter) => (v) => setter((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n; });

  const summary = () => {
    switch (it.cat) {
      case "Source Control": return `${repos.size} repo${repos.size === 1 ? "" : "s"} · ${freq.toLowerCase()}`;
      case "Communication": return `${channel} · ${alerts.size} alert type${alerts.size === 1 ? "" : "s"}`;
      case "Productivity": return `${board}${twoWay ? " · two-way sync" : ""}`;
      case "Monitoring": return `${surface.size} signal${surface.size === 1 ? "" : "s"} · ${freq.toLowerCase()}`;
      case "Developer": return `${events.size} event${events.size === 1 ? "" : "s"}`;
      default: return freq.toLowerCase();
    }
  };
  const canConfigure = it.cat === "Source Control" ? repos.size > 0 : it.cat === "Developer" ? url.trim().length > 0 : true;

  const footer = step === 0
    ? <><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={authorizing} onClick={() => { setAuthorizing(true); setTimeout(() => { setAuthorizing(false); setStep(1); }, 1000); }}>{authorizing ? <><Icon name="Loader" size={15} className="animate-spin" />Authorizing…</> : <>Authorize {it.name}</>}</Button></>
    : step === 1
      ? <><Button onClick={() => setStep(0)}>Back</Button><Button variant="primary" disabled={!canConfigure} onClick={() => setStep(2)}>Connect</Button></>
      : <Button variant="primary" onClick={() => onDone(it.name, summary())}>Finish</Button>;

  return (
    <Modal open onClose={onClose} title={`Connect ${it.name}`} width={500} footer={footer}>
      {/* stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={cn("flex items-center gap-2", i < STEPS.length - 1 && "flex-1")}>
            <span className={cn("grid place-items-center w-6 h-6 rounded-full text-[11px] font-bold flex-none", i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand text-white" : "bg-bg text-ink-3 border border-line")}>{i < step ? <Icon name="Check" size={13} /> : i + 1}</span>
            <span className={cn("text-[12px] font-medium whitespace-nowrap", i === step ? "text-ink" : "text-ink-3")}>{s}</span>
            {i < STEPS.length - 1 && <span className="flex-1 h-px bg-line" />}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-line">
        <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none mt-3" style={{ background: it.color }}><BrandLogo slug={it.slug} icon={it.icon} /></span>
        <div className="min-w-0 mt-3"><b className="text-[14.5px] font-semibold">{it.name}</b><div className="text-[11.5px] text-ink-3">{it.cat}</div></div>
      </div>

      {step === 0 && (
        <>
          <p className="m-0 text-[13px] text-ink-2">Apex will request the following access on your {it.name} account:</p>
          <div className="flex flex-col gap-2">
            {(c.scopes || ["Connect to your account"]).map((s) => (
              <div key={s} className="flex items-center gap-2.5 text-[13px]"><Icon name="ShieldCheck" size={16} className="text-emerald-600 flex-none" />{s}</div>
            ))}
          </div>
          <p className="m-0 text-[11.5px] text-ink-3">You'll be redirected to {it.name} to authorize, then back to Apex.</p>
        </>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          {it.cat === "Source Control" && (
            <Field label="Repositories to track">
              <div className="flex flex-col gap-0.5">
                {c.repos.map((r) => (
                  <label key={r} className="flex items-center gap-2.5 text-[13px] cursor-pointer px-1 py-1.5 rounded-lg hover:bg-bg"><input type="checkbox" checked={repos.has(r)} onChange={() => flip(setRepos)(r)} className="accent-[var(--color-brand)] w-4 h-4" /><span className="font-mono text-[12.5px]">{r}</span></label>
                ))}
              </div>
            </Field>
          )}
          {it.cat === "Communication" && (
            <>
              <Field label="Default channel"><Select value={channel} onChange={(e) => setChannel(e.target.value)}>{c.channels.map((ch) => <option key={ch}>{ch}</option>)}</Select></Field>
              <Field label="Send these alerts">
                <div className="flex flex-col gap-0.5">{c.alerts.map((a) => <label key={a} className="flex items-center justify-between text-[13px] py-1.5"><span>{a}</span><Switch checked={alerts.has(a)} onChange={() => flip(setAlerts)(a)} /></label>)}</div>
              </Field>
            </>
          )}
          {it.cat === "Productivity" && (
            <>
              <Field label="Board / project to sync"><Select value={board} onChange={(e) => setBoard(e.target.value)}>{c.boards.map((b) => <option key={b}>{b}</option>)}</Select></Field>
              <label className="flex items-center justify-between text-[13px] py-1"><span>Two-way sync<span className="block text-[11.5px] text-ink-3 font-normal">Mirror status changes both directions</span></span><Switch checked={twoWay} onChange={setTwoWay} /></label>
            </>
          )}
          {it.cat === "Monitoring" && (
            <Field label="Surface in Apex">
              <div className="flex flex-col gap-0.5">{c.surface.map((s) => <label key={s} className="flex items-center justify-between gap-3 text-[13px] py-1.5"><span>{s}</span><Switch checked={surface.has(s)} onChange={() => flip(setSurface)(s)} /></label>)}</div>
            </Field>
          )}
          {it.cat === "Developer" && (
            <>
              <Field label="Endpoint URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/apex-hook" /></Field>
              <Field label="Events">
                <div className="flex flex-col gap-0.5">{c.events.map((ev) => <label key={ev} className="flex items-center gap-2.5 text-[13px] cursor-pointer px-1 py-1.5 rounded-lg hover:bg-bg"><input type="checkbox" checked={events.has(ev)} onChange={() => flip(setEvents)(ev)} className="accent-[var(--color-brand)] w-4 h-4" /><span className="font-mono text-[12.5px]">{ev}</span></label>)}</div>
              </Field>
              <Field label="Signing secret"><TextInput value={secret} readOnly /></Field>
            </>
          )}
          {(it.cat === "Source Control" || it.cat === "Monitoring") && (
            <Field label="Sync frequency"><Select value={freq} onChange={(e) => setFreq(e.target.value)}>{FREQS.map((fq) => <option key={fq}>{fq}</option>)}</Select></Field>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center text-center gap-2 py-3">
          <span className="grid place-items-center w-14 h-14 rounded-full bg-emerald-50"><Icon name="CircleCheckBig" size={30} className="text-emerald-600" /></span>
          <h3 className="m-0 text-[17px] font-bold">{it.name} is ready</h3>
          <p className="m-0 text-[13px] text-ink-2 max-w-[320px]">{summary()} · authorized for the Eclipse Softworks workspace. You can change this anytime from the integration's settings.</p>
        </div>
      )}
    </Modal>
  );
}

export default function IntegrationsPage() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [connected, setConnected] = useState(() => new Set(INTEGRATIONS.filter((i) => i.connected).map((i) => i.name)));
  const [config, setConfig] = useState(null); // integration being configured
  const [prefs, setPrefs] = useState({}); // { [name]: { freq, alerts } }
  const [reqOpen, setReqOpen] = useState(false);
  const [reqForm, setReqForm] = useState({ name: "", cat: "Source Control", use: "" });
  const [toast, setToast] = useState("");
  const [wizard, setWizard] = useState(null); // integration being connected via the workflow

  const toggle = (name) => setConnected((c) => { const n = new Set(c); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const disconnect = (name) => { setConnected((c) => { const n = new Set(c); n.delete(name); return n; }); flash(`${name} disconnected`); };
  const finishConnect = (name, summary) => { setConnected((c) => new Set(c).add(name)); setWizard(null); flash(`${name} connected — ${summary}`); };
  const pref = (name) => prefs[name] || { freq: "Real-time", alerts: true };
  const setPref = (name, k, v) => setPrefs((p) => ({ ...p, [name]: { ...pref(name), [k]: v } }));
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2600); };
  const submitRequest = () => {
    if (!reqForm.name.trim()) return;
    setReqOpen(false);
    flash(`Request sent for “${reqForm.name.trim()}” — we’ll review it.`);
    setReqForm({ name: "", cat: "Source Control", use: "" });
  };

  const filtered = INTEGRATIONS.filter((i) =>
    (cat === "All" || i.cat === cat) && i.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[10px] bg-brand-soft"><Icon name="Blocks" size={19} className="text-brand" /></span>
          <div>
            <h1 className="m-0 text-[23px] font-bold tracking-[-0.02em]">Integrations</h1>
            <div className="text-[13px] text-ink-2 mt-0.5">Connect Apex to the tools your team already uses.</div>
          </div>
        </div>
        <button onClick={() => setReqOpen(true)} className="flex items-center gap-2 h-10 px-4 rounded-field text-white text-[13px] font-semibold shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]" style={{ background: "linear-gradient(135deg,var(--color-brand),var(--color-brand-600))" }}><Icon name="Plus" size={15} />Request integration</button>
      </div>

      {toast && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-field bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-medium">
          <Icon name="CircleCheckBig" size={16} className="text-emerald-600 flex-none" />{toast}
        </div>
      )}

      {/* summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-4">
        {[
          { icon: "PlugZap", tone: "bg-emerald-50 text-emerald-600", v: connected.size, l: "Connected" },
          { icon: "Blocks", tone: "bg-brand-soft text-brand", v: INTEGRATIONS.length, l: "Available" },
          { icon: "ShieldCheck", tone: "bg-amber-50 text-amber-500", v: CATEGORIES.length - 1, l: "Categories" },
        ].map((s) => (
          <div key={s.l} className="card !rounded-[14px] !shadow-card p-[15px_16px] flex items-center gap-3">
            <span className={cn("grid place-items-center w-[42px] h-[42px] rounded-xl flex-none", s.tone)}><Icon name={s.icon} size={20} /></span>
            <div><div className="text-2xl font-bold tracking-[-0.02em] leading-none">{s.v}</div><div className="text-xs text-ink-2 mt-0.5">{s.l}</div></div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex gap-1.5 bg-card border border-line rounded-[11px] p-1 shadow-card overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-colors", cat === c ? "bg-brand-soft text-brand-600 font-semibold" : "text-ink-2 hover:text-ink")}>{c}</button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-card border border-line rounded-field px-3 py-2.5 w-full sm:w-[240px] shadow-card">
          <Icon name="Search" size={15} className="text-ink-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search integrations..." className="bg-transparent outline-none text-[13px] flex-1 min-w-0" />
        </div>
      </div>

      {/* grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filtered.map((it) => {
          const on = connected.has(it.name);
          return (
            <div key={it.name} className="card p-[18px] flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none" style={{ background: it.color }}><BrandLogo slug={it.slug} icon={it.icon} /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <b className="text-[14.5px] font-semibold">{it.name}</b>
                    {on && <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active</span>}
                  </div>
                  <div className="text-[11.5px] text-ink-3 mt-0.5">{it.cat}</div>
                </div>
              </div>
              <p className="m-0 text-[12.5px] text-ink-2 leading-relaxed flex-1">{it.desc}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (on ? disconnect(it.name) : setWizard(it))}
                  className={cn("flex-1 h-9 rounded-field text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors",
                    on ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 group/btn" : "bg-brand text-white hover:bg-brand-600")}
                >
                  {on ? <><Icon name="Check" size={15} className="group-hover/btn:hidden" /><Icon name="Unplug" size={15} className="hidden group-hover/btn:inline" /><span className="group-hover/btn:hidden">Connected</span><span className="hidden group-hover/btn:inline">Disconnect</span></>
                    : <><Icon name="Plus" size={15} />Connect</>}
                </button>
                <button onClick={() => setConfig(it)} title="Configure" className="grid place-items-center w-9 h-9 rounded-field border border-line bg-card text-ink-2 hover:border-[#C7D2FE]"><Icon name="Settings" size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card grid place-items-center py-16 text-center mt-1">
          <div className="flex flex-col items-center gap-2"><Icon name="SearchX" size={28} className="text-ink-3" /><div className="text-[13.5px] text-ink-2">No integrations match your search.</div></div>
        </div>
      )}

      {/* connection workflow */}
      {wizard && <ConnectWizard it={wizard} onClose={() => setWizard(null)} onDone={finishConnect} />}

      {/* configure */}
      <Modal open={!!config} onClose={() => setConfig(null)} title={config ? `${config.name} settings` : ""}
        footer={<Button variant="primary" onClick={() => setConfig(null)}>Done</Button>}>
        {config && (() => {
          const on = connected.has(config.name);
          const p = pref(config.name);
          const isDev = config.cat === "Developer";
          const isComms = config.cat === "Communication";
          return (
            <>
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-[12px] flex-none" style={{ background: config.color }}><BrandLogo slug={config.slug} icon={config.icon} /></span>
                <div className="flex-1 min-w-0"><b className="text-[14.5px] font-semibold">{config.name}</b><div className="text-[11.5px] text-ink-3">{config.cat}</div></div>
                <span className={cn("inline-flex items-center gap-1 text-[10.5px] font-semibold rounded-full px-2 py-0.5", on ? "text-emerald-600 bg-emerald-50" : "text-ink-3 bg-bg")}><span className={cn("w-1.5 h-1.5 rounded-full", on ? "bg-emerald-500" : "bg-slate-300")} />{on ? "Active" : "Not connected"}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-line">
                <span className="text-[13px] font-medium">Connection</span>
                <Switch checked={on} onChange={() => toggle(config.name)} />
              </div>

              {isDev ? (
                <Field label="Endpoint URL"><TextInput value={p.url || ""} onChange={(e) => setPref(config.name, "url", e.target.value)} placeholder="https://example.com/apex-hook" /></Field>
              ) : (
                <Field label="Sync frequency">
                  <Select value={p.freq} onChange={(e) => setPref(config.name, "freq", e.target.value)}>{FREQS.map((f) => <option key={f} value={f}>{f}</option>)}</Select>
                </Field>
              )}

              {isComms && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-[13px] font-medium">Send Apex alerts here<span className="block text-[11.5px] text-ink-3 font-normal">Risk warnings, mentions & digests</span></span>
                  <Switch checked={p.alerts !== false} onChange={(v) => setPref(config.name, "alerts", v)} />
                </div>
              )}

              <p className="m-0 text-[11.5px] text-ink-3 leading-relaxed">Demo settings — saved for this session. Real connections will run an OAuth flow.</p>
            </>
          );
        })()}
      </Modal>

      {/* request integration */}
      <Modal open={reqOpen} onClose={() => setReqOpen(false)} title="Request an integration"
        footer={<>
          <Button onClick={() => setReqOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={submitRequest} disabled={!reqForm.name.trim()}>Send request</Button>
        </>}>
        <Field label="Tool name"><TextInput value={reqForm.name} onChange={(e) => setReqForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Asana" autoFocus /></Field>
        <Field label="Category">
          <Select value={reqForm.cat} onChange={(e) => setReqForm((f) => ({ ...f, cat: e.target.value }))}>{CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}</Select>
        </Field>
        <Field label="What would you use it for?"><Textarea rows={3} value={reqForm.use} onChange={(e) => setReqForm((f) => ({ ...f, use: e.target.value }))} placeholder="Tell us how this would fit your workflow…" /></Field>
      </Modal>
    </>
  );
}
