// Scene 2 — Board: kanban columns fade in, then cards spring up in a stagger.
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PageScene } from "../components/PageScene";
import { KanbanCard } from "../components/ui";
import { fadeUp } from "../lib/anim";

const COLUMNS = [
  {
    name: "Backlog",
    cards: [
      { title: "Refactor auth middleware", tag: "Backend", tone: "slate", who: 3 },
      { title: "Design empty states", tag: "Design", tone: "amber", who: 4 },
    ],
  },
  {
    name: "In progress",
    cards: [
      { title: "Sprint board drag & drop", tag: "Frontend", tone: "brand", who: 0 },
      { title: "Webhook retries", tag: "Backend", tone: "slate", who: 2 },
      { title: "Onboarding wizard", tag: "Design", tone: "amber", who: 4 },
    ],
  },
  {
    name: "Review",
    cards: [
      { title: "Velocity chart API", tag: "Backend", tone: "slate", who: 3 },
      { title: "Command palette ⌘K", tag: "Frontend", tone: "brand", who: 0 },
    ],
  },
  {
    name: "Done",
    cards: [
      { title: "Notifications center", tag: "Frontend", tone: "emerald", who: 1 },
      { title: "Team settings", tag: "Backend", tone: "emerald", who: 2 },
    ],
  },
];

export function BoardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <PageScene active="Board" title="Board" step={2} caption={{ kicker: "Kanban", title: "Move work forward, together." }}>
      <div className="h-full flex gap-4">
        {COLUMNS.map((col, ci) => (
          <div
            key={col.name}
            className="flex-1 rounded-card border border-line p-3 flex flex-col gap-3"
            style={{ ...fadeUp(frame, fps, { delay: 6 + ci * 6 }), background: "var(--color-bg-soft)" }}
          >
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-[14px] font-semibold text-ink">{col.name}</span>
              <span className="text-[13px] text-ink-3 font-medium">{col.cards.length}</span>
            </div>
            {col.cards.map((c, i) => {
              const delay = 18 + ci * 6 + i * 10;
              const s = spring({ frame: frame - delay, fps, config: { damping: 17, mass: 0.7 } });
              return (
                <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * 22}px)` }}>
                  <KanbanCard {...c} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </PageScene>
  );
}
