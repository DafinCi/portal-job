// src/components/layouts/sidebar/SidebarItem.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ item, collapsed }) {
  const pathname = usePathname() || "";
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`
        relative flex items-center rounded-[6px] px-3 py-2.5 transition-all duration-150 group
        ${collapsed ? "justify-center" : "gap-3"}
        ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
        }
      `}
    >
      {/* Active Left Indicator Line */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary" />
      )}

      {/* Nav Icon */}
      <Icon
        className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}
      />

      {/* Nav Text (hidden on collapse) */}
      {!collapsed && (
        <span className="text-[14px] font-sans leading-none">{item.title}</span>
      )}

      {/* Badge integration (e.g. Matched Jobs Count) */}
      {!collapsed && item.badge && (
        <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-semibold leading-none">
          {item.badge}
        </span>
      )}

      {/* Hover Tooltip on Collapse */}
      {collapsed && (
        <div className="absolute left-14 scale-0 rounded-md border border-border bg-card px-2 py-1 text-[11px] text-foreground transition-all duration-150 group-hover:scale-100 z-50 whitespace-nowrap shadow-md">
          {item.title}
        </div>
      )}
    </Link>
  );
}
