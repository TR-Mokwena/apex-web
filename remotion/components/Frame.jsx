// The floating "Apex app window" the page scenes render inside: navy gradient
// sidebar rail + topbar, mirroring components/shell. Fixed 1500×800.
import {
  LayoutDashboard,
  KanbanSquare,
  Rocket,
  BarChart3,
  Users,
  Calendar,
  Search,
  Bell,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Board", icon: KanbanSquare },
  { label: "Sprints", icon: Rocket },
  { label: "Insights", icon: BarChart3 },
  { label: "Team", icon: Users },
  { label: "Calendar", icon: Calendar },
];

export function Frame({ active = "Dashboard", title = "Dashboard", children }) {
  return (
    <div className="w-[1500px] h-[800px] rounded-[22px] overflow-hidden flex bg-card border border-line shadow-pop">
      {/* sidebar */}
      <aside
        className="w-[220px] shrink-0 h-full flex flex-col gap-1 p-4"
        style={{ background: "linear-gradient(180deg,#101630,#0a0e1c)" }}
      >
        <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
          <div
            className="w-9 h-9 rounded-[11px] grid place-items-center font-bold text-white text-[18px]"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            A
          </div>
          <div className="text-white font-semibold text-[18px]">Apex</div>
        </div>
        {NAV.map(({ label, icon: Ico }) => {
          const on = label === active;
          return (
            <div
              key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-[14.5px]"
              style={{ background: on ? "rgba(99,102,241,0.18)" : "transparent", color: on ? "#fff" : "#9aa3bd" }}
            >
              <Ico size={18} />
              <span className={on ? "font-semibold" : ""}>{label}</span>
            </div>
          );
        })}
      </aside>

      {/* main */}
      <div className="flex-1 h-full flex flex-col bg-bg min-w-0">
        <header className="h-[60px] shrink-0 flex items-center gap-4 px-7 border-b border-line bg-card">
          <div className="text-[18px] font-semibold text-heading">{title}</div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-pill bg-bg-soft border border-line text-ink-3 text-[13px] w-[220px]">
              <Search size={15} /> Search…
            </div>
            <div className="w-9 h-9 rounded-pill grid place-items-center bg-bg-soft border border-line text-ink-2">
              <Bell size={16} />
            </div>
            <div className="w-9 h-9 rounded-pill" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }} />
          </div>
        </header>
        <div className="flex-1 p-7 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
