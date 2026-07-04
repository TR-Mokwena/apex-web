"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/cn";
import { isAuthed } from "@/lib/auth";
import Icon from "@/components/Icon";

const COLLAPSE_KEY = "apex-sidebar-collapsed";

export default function AppShell({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Auth gate: unauthenticated visitors are bounced to the login page before any
  // app chrome renders. Also restores persisted collapse state once we're in.
  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/login");
      return;
    }
    if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    setReady(true);
  }, [router]);

  const toggleCollapse = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });

  // Hold rendering until the client-side auth check resolves — avoids a flash of
  // the dashboard before a redirect, and prevents a hydration mismatch.
  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <Icon name="LoaderCircle" size={26} className="text-brand animate-spin" />
      </div>
    );
  }

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
