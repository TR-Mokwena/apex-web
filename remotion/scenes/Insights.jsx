// Scene 3 — Insights: donut + gauge + stats pop in, bar chart wipes in below.
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PageScene } from "../components/PageScene";
import { Card, Pill } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { fadeUp, countUp } from "../lib/anim";
import { C } from "../lib/brand";
import { Donut, Gauge, BarPairs, LegendRow } from "@/components/ui/charts";

export function InsightsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const completion = Math.round(countUp(frame, fps, 78, { delay: 28, dur: 36 }));
  return (
    <PageScene active="Insights" title="Insights" step={3} caption={{ kicker: "Analytics", title: "Insights that drive decisions." }}>
      <div className="h-full grid grid-cols-3 grid-rows-[1fr_auto] gap-5">
        <Card className="p-6 flex flex-col items-center" style={fadeUp(frame, fps, { delay: 8 })}>
          <div className="self-start text-heading font-semibold text-[16px] mb-4">Contribution split</div>
          <Donut
            size={190}
            thickness={7}
            center="248"
            centerSub="commits"
            segments={[
              { label: "Frontend", value: 42, color: C.brand },
              { label: "Backend", value: 33, color: C.violet },
              { label: "Design", value: 15, color: C.amber },
              { label: "QA", value: 10, color: C.emerald },
            ]}
          />
        </Card>
        <Card className="p-6 flex flex-col items-center" style={fadeUp(frame, fps, { delay: 18 })}>
          <div className="self-start text-heading font-semibold text-[16px] mb-4">Sprint completion</div>
          <Gauge value={completion} color={C.emerald} label="of committed scope" width={230} height={155} />
        </Card>
        <Card className="p-6 flex flex-col justify-center" style={fadeUp(frame, fps, { delay: 28 })}>
          <div className="text-heading font-semibold text-[16px] mb-2">Highlights</div>
          <LegendRow color={C.emerald} label="Cycle time" value="2.1d" />
          <LegendRow color={C.brand} label="Merged PRs" value="64" />
          <LegendRow color={C.amber} label="Review time" value="4.7h" />
          <LegendRow color={C.violet} label="Deploys" value="38" />
        </Card>
        <Card className="col-span-3 p-6" style={fadeUp(frame, fps, { delay: 38 })}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-heading font-semibold text-[16px]">Planned vs delivered</div>
            <Pill tone="brand">Last 6 sprints</Pill>
          </div>
          <Reveal delay={48} dur={46}>
            <BarPairs
              data={[
                [60, 52],
                [72, 70],
                [65, 61],
                [80, 74],
                [70, 72],
                [86, 83],
              ]}
              xLabels={["S18", "S19", "S20", "S21", "S22", "S23"]}
              width={1180}
              height={140}
            />
          </Reveal>
        </Card>
      </div>
    </PageScene>
  );
}
