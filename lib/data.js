// Demo fixtures for the Apex kit. No backend yet — every screen reads this.

export const TEAM = [
  { name: "Naledi Mokoena", role: "Platform", values: [4, 6, 5, 9, 7, 12, 11], delta: "18%", presence: "online", meta: "23 commits" },
  { name: "Theo Botha", role: "Mobile", values: [8, 7, 5, 4, 3, 2, 2], delta: "-9%", presence: "away", meta: "6 commits" },
  { name: "Sipho Dlamini", role: "Backend", values: [5, 5, 7, 6, 8, 9, 8], delta: "11%", presence: "online", meta: "17 commits" },
  { name: "Lena Fourie", role: "Frontend", values: [3, 6, 4, 7, 6, 8, 9], delta: "14%", presence: "online", meta: "19 commits" },
  { name: "Kabelo Nkosi", role: "Infra", values: [6, 4, 6, 5, 5, 4, 5], delta: "2%", presence: "offline", meta: "9 commits" },
];

export const MILESTONES = [
  { title: "v2 beta cutover", due: "24 Jul", progress: 68, status: "on-track", tasksDone: 17, tasksTotal: 25, owners: ["Naledi Mokoena", "Sipho Dlamini", "Lena Fourie"] },
  { title: "GitHub integration GA", due: "08 Aug", progress: 41, status: "at-risk", tasksDone: 9, tasksTotal: 22, owners: ["Theo Botha", "Kabelo Nkosi"] },
  { title: "Analytics dashboards", due: "15 Aug", progress: 12, status: "stalled", tasksDone: 3, tasksTotal: 18, owners: ["Lena Fourie"] },
  { title: "Event bus migration", due: "02 Jul", progress: 100, status: "done", tasksDone: 14, tasksTotal: 14, owners: ["Sipho Dlamini", "Kabelo Nkosi"] },
  { title: "RBAC permission scopes", due: "30 Jul", progress: 55, status: "on-track", tasksDone: 11, tasksTotal: 20, owners: ["Naledi Mokoena"] },
  { title: "Observability rollout", due: "22 Aug", progress: 27, status: "on-track", tasksDone: 4, tasksTotal: 15, owners: ["Kabelo Nkosi", "Sipho Dlamini"] },
];

export const TASKS = [
  { id: "APX-1289", title: "Migrate notification rules to event bus", priority: "high", assignee: "Naledi Mokoena", meta: "4h ago" },
  { id: "APX-1267", title: "RBAC scopes for analytics dashboards", priority: "critical", stalled: true, assignee: "Theo Botha", meta: "6d ago" },
  { id: "APX-1301", title: "Dead letter queue inspection view", priority: "low", assignee: "Lena Fourie", meta: "1d ago" },
  { id: "APX-1312", title: "Webhook signature verification", priority: "high", blocked: true, assignee: "Sipho Dlamini", meta: "2d ago" },
  { id: "APX-1320", title: "Sprint capacity planning UI", priority: "medium", assignee: "Naledi Mokoena", meta: "7h ago" },
];

export const HEAT = Array.from({ length: 84 }, (_, i) =>
  Math.max(0, Math.round(Math.sin(i / 4.7) * 3 + 3 + (i % 7 > 4 ? -3 : 1)))
);
