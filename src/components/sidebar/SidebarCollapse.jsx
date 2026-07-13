"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SidebarCollapse({
  collapsed,
  setCollapsed,
}) {
  return (
    <div className="border-t border-sidebar-border p-4">

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-sm
          bg-sidebar-accent
          py-3
          transition-all
          duration-300
          hover:bg-primary
          hover:text-white
        "
      >
        {collapsed ? (
          <ChevronRight size={22} />
        ) : (
          <ChevronLeft size={22} />
        )}
      </button>

    </div>
  );
}