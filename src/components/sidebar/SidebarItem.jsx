"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";

export default function SidebarItem({
  item,
  collapsed,
}) {
  const pathname = usePathname();

  const active = pathname === item.href;

  const Icon = item.icon;

  return (
    <Tooltip text={item.title}>
      <Link
        href={item.href}
        className={`
          group
          relative
          flex
          items-center
          gap-4
          rounded-sm
          px-4
          py-3
          transition-all
          duration-500
          ease-out
          overflow-hidden

          ${
            active
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }
        `}
      >
        {/* Active Indicator */}
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary opacity-0 transition-all group-hover:opacity-100" />
        )}

        <Icon
          size={20}
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-6"
        />

        {!collapsed && (
          <>
            <span className="flex-1 font-medium truncate">
              {item.title}
            </span>

            {item.badge && (
              <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-semibold ml-auto">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    </Tooltip>
  );
}