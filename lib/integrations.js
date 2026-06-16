// Integration directory — shared by the Integrations page and Settings → Integrations.
export const CATEGORIES = ["All", "Source Control", "Communication", "Productivity", "Monitoring", "Developer"];

export const INTEGRATIONS = [
  { name: "GitHub", cat: "Source Control", icon: "Github", slug: "github", color: "#181717", desc: "Sync commits, pull requests and reviews for contribution insights.", connected: true },
  { name: "GitLab", cat: "Source Control", icon: "GitBranch", slug: "gitlab", color: "#FC6D26", desc: "Track merge requests and CI pipelines across your repos." },
  { name: "Slack", cat: "Communication", icon: "MessageSquare", slug: "slack", color: "#4A154B", desc: "Post risk alerts, digests and mentions to your channels.", connected: true },
  { name: "Microsoft Teams", cat: "Communication", icon: "Video", slug: "microsoftteams", color: "#5059C9", desc: "Deliver Apex notifications straight into Teams." },
  { name: "OmniConnect SA", cat: "Communication", icon: "MessagesSquare", color: "#7C3AED", desc: "Send Apex alerts over SMS, WhatsApp & email — all SA networks, POPIA-compliant.", connected: true },
  { name: "Jira", cat: "Productivity", icon: "SquareKanban", slug: "jira", color: "#0052CC", desc: "Two-way issue sync to keep boards and tasks aligned." },
  { name: "Linear", cat: "Productivity", icon: "Activity", slug: "linear", color: "#5E6AD2", desc: "Sync issues and cycles with your engineering workflow." },
  { name: "Figma", cat: "Productivity", icon: "Figma", slug: "figma", color: "#F24E1E", desc: "Embed design files and frames directly inside tasks." },
  { name: "Notion", cat: "Productivity", icon: "FileText", slug: "notion", color: "#111827", desc: "Link docs, specs and wikis to projects and milestones." },
  { name: "Google Calendar", cat: "Productivity", icon: "Calendar", slug: "googlecalendar", color: "#4285F4", desc: "Push sprints, milestones and deadlines to your calendar.", connected: true },
  { name: "Sentry", cat: "Monitoring", icon: "TriangleAlert", slug: "sentry", color: "#362D59", desc: "Surface production errors as AI risk alerts." },
  { name: "Datadog", cat: "Monitoring", icon: "ChartNoAxesColumn", slug: "datadog", color: "#632CA6", desc: "Pull deploy and performance metrics into reports." },
  { name: "PagerDuty", cat: "Monitoring", icon: "Siren", slug: "pagerduty", color: "#06AC38", desc: "Escalate incidents and link them to affected projects." },
  { name: "CircleCI", cat: "Developer", icon: "CircleDot", slug: "circleci", color: "#343434", desc: "Show build and test status on tasks and PRs." },
  { name: "Webhooks", cat: "Developer", icon: "Webhook", slug: "webhooks", color: "#6366F1", desc: "Send any Apex event to an external URL in real time." },
];
