// Project directory + board data shared by /projects and /projects/[slug].

export const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
export const INITIALS = ["SD", "TN", "KM", "PS", "TM"];

export const TAG_STYLE = {
  Design: "bg-[#FCE7F3] text-[#DB2777]",
  Analytics: "bg-[#CFFAFE] text-[#0891B2]",
  Platform: "bg-brand-soft text-[#4F46E5]",
  DevOps: "bg-[#FFEDD5] text-[#EA580C]",
  Backend: "bg-[#DBEAFE] text-[#2563EB]",
  Quality: "bg-[#FEE2E2] text-[#DC2626]",
  Feature: "bg-brand-soft text-[#4F46E5]",
  Integration: "bg-[#CCFBF1] text-[#0D9488]",
  AI: "bg-[#EDE9FE] text-[#7C3AED]",
};

export const STATUS_TONE = {
  Active: "bg-brand-soft text-brand-600",
  "On Track": "bg-emerald-50 text-emerald-600",
  Planning: "bg-[#EAF1FF] text-[#2563EB]",
  "At Risk": "bg-amber-50 text-[#B45309]",
  Done: "bg-emerald-50 text-emerald-600",
};

export const PROJECTS = [
  { slug: "apex-v2-1", name: "Apex v2.1", desc: "Next-generation engineering operating system", status: "Active", color: "#6366F1", key: "APEX", progress: 68, done: 41, total: 60, members: [0, 1, 2, 3], star: true, sprint: "Sprint 12", due: "June 25, 2026" },
  { slug: "mobile-app", name: "Mobile App", desc: "Native iOS & Android client for Apex", status: "Active", color: "#0EA5E9", key: "MOB", progress: 41, done: 18, total: 44, members: [1, 3, 4], star: false, sprint: "Sprint 8", due: "July 10, 2026" },
  { slug: "platform-core", name: "Platform Core", desc: "Shared services, auth & the event bus", status: "On Track", color: "#22C55E", key: "PLT", progress: 82, done: 96, total: 117, members: [0, 2], star: true, sprint: "Sprint 21", due: "June 30, 2026" },
  { slug: "marketing-site", name: "Marketing Site", desc: "Public website and content platform", status: "Planning", color: "#F59E0B", key: "MKT", progress: 12, done: 4, total: 33, members: [3], star: false, sprint: "Backlog", due: "Aug 15, 2026" },
  { slug: "devops-tools", name: "DevOps Tools", desc: "Internal CI/CD and infrastructure tooling", status: "At Risk", color: "#EF4444", key: "OPS", progress: 55, done: 21, total: 38, members: [2, 4], star: false, sprint: "Sprint 14", due: "June 28, 2026" },
];

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

/* user-created projects (no backend → localStorage) */
export const PROJECTS_KEY = "apex-projects";
export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;
export function getStoredProjects() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]"); } catch { return []; }
}
export function addStoredProject(p) {
  const all = getStoredProjects();
  all.unshift(p);
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(all)); } catch {}
  return all;
}
export const findProject = (slug) => getProject(slug) || getStoredProjects().find((p) => p.slug === slug);

export const BOARD = [
  { name: "Backlog", color: "#94A3B8", add: true, cards: [
    { id: "APEX-215", t: "Design system audit", tag: "Design", a: 0 },
    { id: "APEX-216", t: "Implement analytics events", tag: "Analytics", a: 1 },
    { id: "APEX-217", t: "Offline sync architecture", tag: "Platform", a: 2 },
    { id: "APEX-218", t: "Error tracking integration", tag: "DevOps", a: 3 },
  ]},
  { name: "To Do", color: "#3B82F6", add: true, cards: [
    { id: "APEX-201", t: "Create API rate limiting", tag: "Backend", a: 1 },
    { id: "APEX-202", t: "User roles & permissions", tag: "Backend", a: 2 },
    { id: "APEX-203", t: "Push notification setup", tag: "Platform", a: 0 },
    { id: "APEX-204", t: "Create unit tests", tag: "Quality", a: 3 },
  ]},
  { name: "In Progress", color: "#6366F1", add: true, cards: [
    { id: "APEX-187", t: "Implement task comments", tag: "Feature", a: 0, sub: "2/5", sel: true },
    { id: "APEX-188", t: "Real-time activity feed", tag: "Feature", a: 2, sub: "3/5" },
    { id: "APEX-189", t: "Milestone progress tracking", tag: "Feature", a: 1, sub: "4/6" },
    { id: "APEX-190", t: "GitHub integration v2", tag: "Integration", a: 3, sub: "1/3" },
    { id: "APEX-191", t: "Advanced search", tag: "Feature", a: 4, sub: "1/3" },
  ]},
  { name: "In Review", color: "#F59E0B", add: true, cards: [
    { id: "APEX-172", t: "Kanban board enhancement", tag: "Feature", a: 1, sub: "5/5" },
    { id: "APEX-173", t: "AI risk prediction", tag: "AI", a: 2, sub: "2/2" },
    { id: "APEX-174", t: "Sprint burndown widget", tag: "Feature", a: 0, sub: "2/2" },
    { id: "APEX-175", t: "Export reports", tag: "Feature", a: 3, sub: "1/1" },
  ]},
  { name: "Done", color: "#22C55E", add: false, cards: [
    { id: "APEX-160", t: "Authentication flow", tag: "Backend", a: 0, done: true },
    { id: "APEX-161", t: "Project creation flow", tag: "Backend", a: 1, done: true },
    { id: "APEX-162", t: "Team management", tag: "Backend", a: 2, done: true },
    { id: "APEX-163", t: "File upload service", tag: "Platform", a: 3, done: true },
    { id: "APEX-164", t: "Email notifications", tag: "Platform", a: 4, done: true },
  ]},
];
