export const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
export const INIT = ["TM", "SD", "TN", "PS", "NK"];

export const STATUS = {
  done: { node: "bg-emerald-50 border-emerald-500 text-emerald-600", icon: "Check", badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", label: "Completed", fill: "#22C55E" },
  active: { node: "bg-brand-soft border-brand text-brand", icon: "Loader", badge: "bg-brand-soft text-brand-600", dot: "bg-brand", label: "On track", fill: "var(--color-brand)" },
  risk: { node: "bg-amber-50 border-amber-500 text-amber-500", icon: "TriangleAlert", badge: "bg-amber-50 text-[#B45309]", dot: "bg-amber-500", label: "At risk", fill: "#F59E0B" },
  stalled: { node: "bg-red-50 border-red-500 text-red-500", icon: "OctagonX", badge: "bg-red-50 text-[#DC2626]", dot: "bg-red-500", label: "Stalled", fill: "#EF4444" },
};

export const MILESTONES = [
  { slug: "event-bus-migration", t: "Event bus migration", proj: "Platform Core", due: "Completed June 2", prog: 100, st: "done", done: 14, total: 14, owners: [1, 0], desc: "Move all notification and audit pipelines onto the shared event bus and retire the legacy queue." },
  { slug: "v2-1-beta-cutover", t: "v2.1 Beta cutover", proj: "Apex v2.1", due: "Due June 24", prog: 68, st: "active", done: 17, total: 25, owners: [0, 1, 4], desc: "Cut the beta cohort over to v2.1 — feature flags, data migration and rollback plan." },
  { slug: "rbac-permission-scopes", t: "RBAC permission scopes", proj: "Platform Core", due: "Due June 30", prog: 55, st: "active", done: 11, total: 20, owners: [0], desc: "Fine-grained permission scopes for analytics dashboards and admin actions." },
  { slug: "mobile-app-launch", t: "Mobile App Launch", proj: "Apex v2.1", due: "Due June 24", prog: 41, st: "risk", done: 9, total: 22, owners: [1, 3], desc: "Ship the native mobile client to the app stores with parity on core flows." },
  { slug: "analytics-module-ga", t: "Analytics Module GA", proj: "Analytics", due: "Due Jul 15", prog: 12, st: "stalled", done: 3, total: 18, owners: [3], desc: "General availability of the analytics module, blocked on the data partitioning work." },
  { slug: "observability-rollout", t: "Observability rollout", proj: "Infra", due: "Due Aug 2", prog: 27, st: "active", done: 4, total: 15, owners: [2, 1], desc: "Tracing, metrics and structured logging across every service." },
];

export const getMilestone = (slug) => MILESTONES.find((m) => m.slug === slug);

const SAMPLE = ["Spec & design review", "Data migration script", "Feature-flag rollout", "Integration tests", "Security review", "Docs & runbook", "Stakeholder demo", "Rollback plan", "Performance pass", "Beta feedback triage", "Telemetry dashboards", "Final QA sweep"];
export function milestoneTasks(m) {
  return Array.from({ length: m.total }, (_, i) => ({
    id: `${m.slug.toUpperCase().slice(0, 4)}-${100 + i}`,
    t: SAMPLE[i % SAMPLE.length],
    done: i < m.done,
    av: m.owners[i % m.owners.length],
  }));
}
