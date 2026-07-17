// src/components/layouts/AppShell.jsx
"use client";

import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import { useSidebar } from "@/contexts/SidebarContext";

export default function AppShell({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Dynamic Sidebar Shell */}
      <Sidebar />

      {/* Content Area Shell */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-6 focus:outline-none custom-scrollbar">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
