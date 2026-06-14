"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/cn";

const COLLAPSE_KEY = "apex-sidebar-collapsed";

export default function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // restore persisted collapse state
  useEffect(() => {
    if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
  }, []);

  const toggleCollapse = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={drawerOpen}
        collapsed={collapsed}
        onClose={() => setDrawerOpen(false)}
        onToggleCollapse={toggleCollapse}
      />

      {/* mobile scrim */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "md:hidden fixed inset-0 z-55 bg-[rgba(8,11,20,0.5)] transition-opacity",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 min-w-0 px-4 md:px-7 py-6">{children}</main>
      </div>
    </div>
  );
}
