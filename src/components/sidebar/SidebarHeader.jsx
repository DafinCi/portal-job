"use client";

import { BriefcaseBusiness } from "lucide-react";

export default function SidebarHeader({ collapsed }) {
  return (
    <div className="border-b border-sidebar-border px-5 py-6">

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-sm
            bg-gradient-to-br
          from-blue-500
          to-indigo-700
            text-primary-foreground
            shadow-blue-500/40
          "
        >
          <BriefcaseBusiness size={24} />
        </div>

        {!collapsed && (
          <div className="overflow-hidden">

            <h1 className="truncate text-lg font-bold text-sidebar-foreground">
              JobMatch AI
            </h1>

            <p className="text-sm text-muted-foreground overflow-x-hidden">
              Smart Career Platform
            </p>

          </div>
        )}

      </div>

    </div>
  );
}