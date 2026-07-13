"use client";

import { useState } from "react";

import { MenuItems } from "./menu";

import SidebarItem from "./SidebarItem";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarCollapse from "./SidebarCollapse";

import { useSidebar } from "@/components/context/SidebarContext";

export default function Sidebar() {
  const {
    collapsed,
    setCollapsed,
  } = useSidebar();

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-72"}
        sticky
        top-0
        h-screen
        flex
        flex-col
        bg-sidebar
        border-b
        border-sidebar-border
        transition-all
        duration-300
      `}
    >
      {/* Logo */}
      <SidebarHeader collapsed={collapsed} />

      {/* Menu */}
      <nav className="flex-1 overflow-y-hidden overflow-x-hidden space-y-1 px-4 py-6">
        {MenuItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <SidebarFooter collapsed={collapsed} />

      {/* Collapse Button */}
      <SidebarCollapse
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    </aside>
  );
}