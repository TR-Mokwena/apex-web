// Team roster + role-based access model shared by /team and /team/[slug].
//
// Two distinct "role" ideas live here — keep them apart:
//   • an employee's OWN role (their seat in the org) → shown as a pill on their card/profile.
//   • the VIEWER's role (whoever is looking at a profile) → gates which sections & actions
//     render. The profile page exposes a "Viewing as" switcher to preview all four.

export const PAL = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#6366F1)",
  "linear-gradient(135deg,#10B981,#22C55E)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];

// Role definitions. `tone` maps onto the Pill component tones.
export const ROLES = {
  admin: { key: "admin", label: "Admin", tone: "indigo", icon: "ShieldCheck", blurb: "Full control over people, roles, access & billing." },
  lead: { key: "lead", label: "Lead", tone: "violet", icon: "Star", blurb: "Runs a team — performance, work assignment & feedback." },
  member: { key: "member", label: "Member", tone: "blue", icon: "UserRound", blurb: "Collaborates on shared projects and can reach teammates." },
  viewer: { key: "viewer", label: "Viewer", tone: "slate", icon: "Eye", blurb: "Read-only access to public profile & activity." },
};
export const ROLE_ORDER = ["admin", "lead", "member", "viewer"];

// Capability matrix — what the VIEWER (current user) can see/do on a profile, by their role.
// Booleans (1/0) keep the render-time gating terse: `caps.compensation && …`.
export const CAPS = {
  admin: { contact: 1, employment: 1, compensation: 1, performance: 1, notes: 1, access: 1, audit: 1, assignWork: 1, editProfile: 1, changeRole: 1, deactivate: 1, message: 1 },
  lead: { contact: 1, employment: 1, compensation: 0, performance: 1, notes: 1, access: 0, audit: 0, assignWork: 1, editProfile: 0, changeRole: 0, deactivate: 0, message: 1 },
  member: { contact: 1, employment: 0, compensation: 0, performance: 0, notes: 0, access: 0, audit: 0, assignWork: 0, editProfile: 0, changeRole: 0, deactivate: 0, message: 1 },
  viewer: { contact: 0, employment: 0, compensation: 0, performance: 0, notes: 0, access: 0, audit: 0, assignWork: 0, editProfile: 0, changeRole: 0, deactivate: 0, message: 0 },
};

// Human-readable permission lines shown in the Access tab, per role.
export const PERMISSIONS = {
  admin: ["Manage members, roles & invitations", "View employment & compensation", "Configure billing & security", "Access audit log & sessions"],
  lead: ["Manage team membership", "View employment (not compensation)", "Assign work & run reviews", "Leave private notes"],
  member: ["View shared projects & activity", "Message & mention teammates", "Request code reviews", "Cannot view sensitive info"],
  viewer: ["View public profile & activity", "Read-only — no actions", "Cannot message or assign", "Cannot view contact details"],
};

export const TEAM = [
  {
    slug: "lerato-molefe",
    name: "Lerato Molefe",
    initials: "LM",
    pi: 0,
    role: "admin",
    title: "Engineering Manager",
    team: "Engineering",
    status: "Active",
    pronouns: "she/her",
    location: "Cape Town, ZA",
    tz: "SAST · UTC+2",
    localTime: "3:24 PM",
    handle: "lmolefe",
    email: "lerato@eclipsesoftworks.com",
    phone: "+27 82 555 0110",
    joined: "Jan 2020",
    employeeId: "ES-0007",
    employmentType: "Full-time",
    manager: "— (reports to CTO)",
    comp: "R1,640,000 / yr",
    bio: "Runs engineering delivery across Platform, Web and Mobile. Owns headcount, career growth and the org's technical roadmap.",
    skills: ["Leadership", "Systems Design", "Hiring", "Roadmapping", "Go", "TypeScript"],
    stats: { commits: "412", prs: "58", reviews: "204", cycle: "1.4d" },
    trend: [30, 42, 38, 55, 48, 66, 61],
    projects: [
      { name: "Apex v2.1", key: "APEX", color: "#6366F1", role: "Sponsor", progress: 68 },
      { name: "Platform Core", key: "PLT", color: "#22C55E", role: "Sponsor", progress: 82 },
    ],
    activity: [
      { ic: "UserPlus", tone: "bg-brand-soft text-brand", act: "approved a role change for", tgt: "Thabo Nkosi", t: "2h ago" },
      { ic: "GitMerge", tone: "bg-emerald-50 text-emerald-600", act: "merged PR #4821 in", tgt: "apex/api", t: "6h ago" },
      { ic: "MessageSquare", tone: "bg-violet-50 text-violet-500", act: "left a review on", tgt: "Design system v3", t: "1d ago" },
    ],
    goals: [
      { label: "Ship Apex v2.1 GA", target: "Q3 2026", progress: 68 },
      { label: "Grow Platform team to 8", target: "8 engineers", progress: 75 },
      { label: "Reduce attrition", target: "< 6% / yr", progress: 88 },
    ],
    notes: [
      { by: "CTO", t: "2 weeks ago", body: "Strong H1. Ready for Director track — revisit scope in the next cycle." },
    ],
  },
  {
    slug: "tr-mokwena",
    name: "TR Mokwena",
    initials: "TM",
    pi: 4,
    role: "lead",
    title: "Staff Engineer · Platform Lead",
    team: "Platform",
    status: "Active",
    pronouns: "he/him",
    location: "Johannesburg, ZA",
    tz: "SAST · UTC+2",
    localTime: "3:24 PM",
    handle: "tmokwena",
    email: "tr@eclipsesoftworks.com",
    phone: "+27 82 555 0148",
    joined: "Mar 2021",
    employeeId: "ES-0042",
    employmentType: "Full-time",
    manager: "Lerato Molefe",
    comp: "R1,180,000 / yr",
    bio: "Leads the Platform team building Apex's shared services, auth and the event bus. Obsessed with reliability and clean interfaces.",
    skills: ["Go", "Kubernetes", "Distributed Systems", "PostgreSQL", "gRPC", "Terraform"],
    stats: { commits: "1,248", prs: "142", reviews: "96", cycle: "1.8d" },
    trend: [25, 38, 33, 46, 42, 62, 55],
    projects: [
      { name: "Platform Core", key: "PLT", color: "#22C55E", role: "Tech Lead", progress: 82 },
      { name: "DevOps Tools", key: "OPS", color: "#EF4444", role: "Reviewer", progress: 55 },
    ],
    activity: [
      { ic: "GitCommit", tone: "bg-brand-soft text-brand", act: "pushed 4 commits to", tgt: "apex/api", t: "2h ago" },
      { ic: "GitPullRequestArrow", tone: "bg-[#EAF1FF] text-[#2563EB]", act: "opened PR #4810 in", tgt: "apex/api", t: "6h ago" },
      { ic: "CircleCheckBig", tone: "bg-emerald-50 text-emerald-600", act: "approved PR #4799 in", tgt: "apex/api", t: "1d ago" },
    ],
    goals: [
      { label: "Reduce p99 API latency", target: "< 120ms", progress: 74 },
      { label: "Migrate to event bus v2", target: "All services", progress: 60 },
      { label: "Mentor 2 mid-level engineers", target: "2 ICs", progress: 50 },
    ],
    notes: [
      { by: "Lerato Molefe", t: "1 month ago", body: "Excellent technical leadership on the auth rewrite. Coach on delegation." },
    ],
  },
  {
    slug: "priya-singh",
    name: "Priya Singh",
    initials: "PS",
    pi: 3,
    role: "member",
    title: "Senior Frontend Engineer",
    team: "Web",
    status: "Active",
    pronouns: "she/her",
    location: "Durban, ZA",
    tz: "SAST · UTC+2",
    localTime: "3:24 PM",
    handle: "psingh",
    email: "priya@eclipsesoftworks.com",
    phone: "+27 83 555 0193",
    joined: "Aug 2022",
    employeeId: "ES-0088",
    employmentType: "Full-time",
    manager: "TR Mokwena",
    comp: "R860,000 / yr",
    bio: "Builds the Apex web app — design systems, data viz and delightful interactions. Cares deeply about accessibility and performance.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Accessibility", "Data Viz"],
    stats: { commits: "742", prs: "96", reviews: "88", cycle: "1.5d" },
    trend: [20, 34, 30, 44, 40, 52, 49],
    projects: [
      { name: "Apex v2.1", key: "APEX", color: "#6366F1", role: "Contributor", progress: 68 },
      { name: "Marketing Site", key: "MKT", color: "#F59E0B", role: "Contributor", progress: 12 },
    ],
    activity: [
      { ic: "GitCommit", tone: "bg-brand-soft text-brand", act: "pushed 6 commits to", tgt: "apex/web", t: "1h ago" },
      { ic: "GitMerge", tone: "bg-emerald-50 text-emerald-600", act: "merged PR #4805 in", tgt: "apex/web", t: "3h ago" },
      { ic: "MessageSquare", tone: "bg-violet-50 text-violet-500", act: "reviewed PR #4790 in", tgt: "apex/web", t: "1d ago" },
    ],
    goals: [
      { label: "Ship new dashboard", target: "v2.1", progress: 80 },
      { label: "Raise Lighthouse score", target: "> 95", progress: 66 },
    ],
    notes: [],
  },
  {
    slug: "thabo-nkosi",
    name: "Thabo Nkosi",
    initials: "TN",
    pi: 1,
    role: "member",
    title: "Backend Engineer",
    team: "Platform",
    status: "Active",
    pronouns: "he/him",
    location: "Pretoria, ZA",
    tz: "SAST · UTC+2",
    localTime: "3:24 PM",
    handle: "tnkosi",
    email: "thabo@eclipsesoftworks.com",
    phone: "+27 82 555 0176",
    joined: "Feb 2023",
    employeeId: "ES-0121",
    employmentType: "Full-time",
    manager: "TR Mokwena",
    comp: "R720,000 / yr",
    bio: "Works on Apex APIs, webhooks and the ingestion pipeline that turns raw GitHub events into contribution insights.",
    skills: ["Go", "PostgreSQL", "Redis", "gRPC", "REST", "Docker"],
    stats: { commits: "980", prs: "74", reviews: "62", cycle: "2.1d" },
    trend: [18, 28, 26, 38, 34, 47, 41],
    projects: [
      { name: "Platform Core", key: "PLT", color: "#22C55E", role: "Contributor", progress: 82 },
    ],
    activity: [
      { ic: "GitPullRequestArrow", tone: "bg-[#EAF1FF] text-[#2563EB]", act: "opened PR #4820 in", tgt: "apex/api", t: "4h ago" },
      { ic: "GitCommit", tone: "bg-brand-soft text-brand", act: "pushed 2 commits to", tgt: "apex/api", t: "1d ago" },
    ],
    goals: [
      { label: "Webhook signature verification", target: "Ship", progress: 90 },
      { label: "Cut API error rate", target: "< 0.1%", progress: 55 },
    ],
    notes: [],
  },
  {
    slug: "naledi-kgasana",
    name: "Naledi Kgasana",
    initials: "NK",
    pi: 2,
    role: "lead",
    title: "Design Lead",
    team: "Design",
    status: "Active",
    pronouns: "she/her",
    location: "Cape Town, ZA",
    tz: "SAST · UTC+2",
    localTime: "3:24 PM",
    handle: "nkgasana",
    email: "naledi@eclipsesoftworks.com",
    phone: "+27 83 555 0129",
    joined: "Jun 2021",
    employeeId: "ES-0055",
    employmentType: "Full-time",
    manager: "Lerato Molefe",
    comp: "R1,020,000 / yr",
    bio: "Owns the Apex design language and leads the design team. Bridges product, brand and engineering into one cohesive system.",
    skills: ["Product Design", "Design Systems", "Figma", "Prototyping", "UX Research", "Brand"],
    stats: { commits: "654", prs: "48", reviews: "71", cycle: "1.6d" },
    trend: [22, 30, 34, 40, 44, 50, 47],
    projects: [
      { name: "Apex v2.1", key: "APEX", color: "#6366F1", role: "Design Lead", progress: 68 },
      { name: "Marketing Site", key: "MKT", color: "#F59E0B", role: "Design Lead", progress: 12 },
    ],
    activity: [
      { ic: "MessageSquare", tone: "bg-violet-50 text-violet-500", act: "shared new mockups in", tgt: "Design system v3", t: "5h ago" },
      { ic: "CircleCheckBig", tone: "bg-emerald-50 text-emerald-600", act: "approved PR #4805 in", tgt: "apex/web", t: "1d ago" },
    ],
    goals: [
      { label: "Roll out design system v3", target: "All screens", progress: 58 },
      { label: "Run 6 user studies", target: "6 sessions", progress: 66 },
    ],
    notes: [
      { by: "Lerato Molefe", t: "3 weeks ago", body: "Design system adoption is up. Great cross-team influence this half." },
    ],
  },
  {
    slug: "sipho-dlamini",
    name: "Sipho Dlamini",
    initials: "SD",
    pi: 0,
    role: "viewer",
    title: "Security Auditor (Contract)",
    team: "External",
    status: "Guest",
    pronouns: "he/him",
    location: "Nairobi, KE",
    tz: "EAT · UTC+3",
    localTime: "4:24 PM",
    handle: "sdlamini",
    email: "sipho@auditpartners.co",
    phone: "+254 70 555 0044",
    joined: "May 2026",
    employeeId: "—",
    employmentType: "Contractor",
    manager: "Lerato Molefe",
    comp: "—",
    bio: "External security consultant with read-only access for the current compliance audit. Reviews code and infrastructure, no write access.",
    skills: ["Security", "Threat Modeling", "SOC 2", "Pen Testing", "Cryptography"],
    stats: { commits: "0", prs: "0", reviews: "34", cycle: "—" },
    trend: [4, 6, 5, 8, 7, 9, 8],
    projects: [
      { name: "Platform Core", key: "PLT", color: "#22C55E", role: "Auditor", progress: 82 },
    ],
    activity: [
      { ic: "MessageSquare", tone: "bg-violet-50 text-violet-500", act: "left an audit note on", tgt: "apex/api", t: "3h ago" },
      { ic: "Eye", tone: "bg-bg-soft text-ink-2", act: "reviewed access logs in", tgt: "Platform Core", t: "1d ago" },
    ],
    goals: [],
    notes: [],
  },
];

export const getEmployee = (slug) => TEAM.find((p) => p.slug === slug);

export const roleCounts = () =>
  ROLE_ORDER.reduce((acc, r) => ({ ...acc, [r]: TEAM.filter((p) => p.role === r).length }), {});
