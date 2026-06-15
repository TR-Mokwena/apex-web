"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ACCENTS, DEFAULT_ACCENT, applyAccent, saveAccent, getStoredAccent, applyMode, saveMode, getStoredMode } from "@/lib/theme";

const MODES = [
  { id: "light", label: "Light", icon: "Sun" },
  { id: "dark", label: "Dark", icon: "Moon" },
];

export default function ThemePicker() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [mode, setMode] = useState("light");
  useEffect(() => { setAccent(getStoredAccent()); setMode(getStoredMode()); }, []);

  const choose = (hex) => { applyAccent(hex); saveAccent(hex); setAccent(hex.toUpperCase()); };
  const chooseMode = (id) => { applyMode(id); saveMode(id); setMode(id); };
  const isPreset = ACCENTS.some((a) => a.hex.toUpperCase() === accent.toUpperCase());

  return (
    <div className="flex flex-col gap-3.5">
      {/* mode */}
      <div className="card p-[18px]">
        <h3 className="m-0 text-[15px] font-semibold">Appearance</h3>
        <p className="m-0 text-[12.5px] text-ink-2 mt-1 mb-3">Switch between light and dark.</p>
        <div className="inline-flex gap-1 bg-bg-soft border border-line rounded-[11px] p-1">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => chooseMode(m.id)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-colors", mode === m.id ? "bg-card shadow-card text-ink font-semibold" : "text-ink-2 font-medium hover:text-ink")}>
              <Icon name={m.icon} size={15} />{m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <div className="card p-[18px] lg:col-span-2">
          <h3 className="m-0 text-[15px] font-semibold">Accent color</h3>
          <p className="m-0 text-[12.5px] text-ink-2 mt-1 mb-4">Pick the color used across buttons, links, highlights and charts.</p>

          <div className="flex flex-wrap gap-2.5">
            {ACCENTS.map((a) => {
              const on = a.hex.toUpperCase() === accent.toUpperCase();
              return (
                <button key={a.hex} onClick={() => choose(a.hex)} title={a.name}
                  className={cn("relative grid place-items-center w-10 h-10 rounded-full transition-transform hover:scale-110", on && "ring-2 ring-offset-2 ring-offset-card")}
                  style={{ background: a.hex, boxShadow: on ? `0 0 0 2px ${a.hex}` : undefined }}>
                  {on && <Icon name="Check" size={18} className="text-white" />}
                </button>
              );
            })}

            <label className={cn("relative grid place-items-center w-10 h-10 rounded-full cursor-pointer border-2 border-dashed border-ink-3/50 text-ink-3 hover:border-brand hover:text-brand", !isPreset && "ring-2 ring-offset-2 ring-offset-card border-solid")}
              style={!isPreset ? { background: accent, borderColor: accent } : undefined} title="Custom color">
              {isPreset ? <Icon name="Plus" size={18} /> : <Icon name="Check" size={18} className="text-white" />}
              <input type="color" value={accent} onChange={(e) => choose(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-[12.5px] text-ink-2">Current: <b className="font-mono text-ink">{accent.toUpperCase()}</b></span>
            {accent.toUpperCase() !== DEFAULT_ACCENT && (
              <button onClick={() => choose(DEFAULT_ACCENT)} className="text-[12.5px] font-medium text-brand inline-flex items-center gap-1"><Icon name="RotateCcw" size={13} />Reset to default</button>
            )}
          </div>
        </div>

        {/* live preview */}
        <div className="card p-[18px]">
          <h3 className="m-0 mb-4 text-[15px] font-semibold">Preview</h3>
          <div className="flex flex-col gap-3">
            <Button variant="primary">Primary button</Button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-soft text-brand-600">Badge</span>
              <a className="text-[13px] font-medium text-brand cursor-pointer">A link →</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-brand text-white"><Icon name="Folder" size={18} /></span>
              <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-brand-soft text-brand"><Icon name="Flag" size={18} /></span>
              <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden"><div className="h-full w-2/3 rounded-full bg-brand" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
