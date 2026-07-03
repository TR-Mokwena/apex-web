// Scene 1 — Dashboard: KPIs count up, then the velocity chart wipes in.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PageScene } from "../components/PageScene";
import { Card, Pill } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { fadeUp, countUp } from "../lib/anim";
import { C } from "../lib/brand";
import { LineChart, LegendRow } from "@/components/ui/charts";

const KPIS = [
  { label: "Active sprints", to: 12, suffix: "" },
  { label: "Velocity", to: 86, suffix: " pts" },
  { label: "Open PRs", to: 24, suffix: "" },
  { label: "On-track", to: 92, suffix: "%" },
];

function Kpi({ label, to, suffix, delay, frame, fps }) {
  const v = Math.round(countUp(frame, fps, to, { delay: delay + 8, dur: 30 }));
  return (
    <Card className="flex-1 p-5" style={fadeUp(frame, fps, { delay })}>
      <div className="text-ink-2 text-[14px] font-medium">{label}</div>
      <div className="mt-2 text-heading text-[40px] font-bold leading-none">
        {v}
        {suffix}
      </div>
      <div className="mt-3">
        <Pill tone="emerald">▲ vs last week</Pill>
      </div>
    </Card>
  );
}

export function DashboardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <PageScene active="Dashboard" title="Dashboard" step={1} caption={{ kicker: "Overview", title: "Every sprint, at a glance." }}>
      <div className="h-full flex flex-col gap-5">
        <div className="flex gap-4">
          {KPIS.map((k, i) => (
            <Kpi key={k.label} {...k} delay={8 + i * 9} frame={frame} fps={fps} />
          ))}
        </div>
        <div className="flex gap-5 flex-1 min-h-0">
          <Card className="flex-[2] p-6 flex flex-col" style={fadeUp(frame, fps, { delay: 42 })}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-heading font-semibold text-[16px]">Velocity</div>
              <Pill tone="brand">This quarter</Pill>
            </div>
            <div className="text-ink-3 text-[13px] mb-4">Story points delivered per week</div>
            <Reveal delay={52} dur={58} style={{ marginTop: "auto" }}>
              <LineChart
                series={[
                  { values: [42, 55, 48, 67, 73, 86], color: C.brand },
                  { values: [40, 45, 50, 55, 60, 65], color: "#c7cdfa", dashed: true },
                ]}
                xLabels={["W1", "W2", "W3", "W4", "W5", "W6"]}
                yMax={100}
                width={740}
                height={300}
              />
            </Reveal>
          </Card>
          <Card className="flex-1 p-6 flex flex-col" style={fadeUp(frame, fps, { delay: 58 })}>
            <div className="text-heading font-semibold text-[16px] mb-4">Sprint health</div>
            <div className="flex flex-col">
              <div style={fadeUp(frame, fps, { delay: 64, dist: 14 })}><LegendRow color={C.brand} label="In progress" value="18" /></div>
              <div style={fadeUp(frame, fps, { delay: 70, dist: 14 })}><LegendRow color={C.emerald} label="Completed" value="42" /></div>
              <div style={fadeUp(frame, fps, { delay: 76, dist: 14 })}><LegendRow color={C.amber} label="At risk" value="3" /></div>
              <div style={fadeUp(frame, fps, { delay: 82, dist: 14 })}><LegendRow color={C.ink3} label="Backlog" value="27" /></div>
            </div>
            <div className="mt-auto rounded-field p-4" style={{ background: C.brandSoft, ...fadeUp(frame, fps, { delay: 92 }) }}>
              <div className="text-[13px] font-semibold" style={{ color: C.brand }}>
                AI summary
              </div>
              <div className="text-[13px] text-ink-2 mt-1 leading-snug">
                Trending 14% above planned velocity. 3 items need attention before Friday.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageScene>
  );
}
