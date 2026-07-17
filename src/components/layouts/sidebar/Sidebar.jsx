"use client";

import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import SidebarCollapse from "./SidebarCollapse";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`
        relative sticky top-0 h-screen flex flex-col bg-sidebar border-r border-border transition-all duration-200 ease-in-out z-40 shrink-0 group
        ${collapsed ? "w-[80px]" : "w-[260px]"}
      `}
    >
      {/* Brand Header */}
      <SidebarHeader collapsed={collapsed} />

      {/* Main Trajectory Navigation */}
      <SidebarNavigation collapsed={collapsed} />

      {/* User Context Footer */}
      <SidebarFooter collapsed={collapsed} />

      {/* Edge Micro-Interaction Collapse Trigger */}
      <SidebarCollapse />
    </aside>
  );
}
