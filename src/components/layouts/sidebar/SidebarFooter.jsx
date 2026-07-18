// src/components/layouts/sidebar/SidebarFooter.jsx
"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarFooter({ collapsed }) {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <div className="p-4 border-t border-border mt-auto">
      <div
        className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-3`}
      >
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-secondary border border-border flex items-center justify-center text-[12px] font-bold text-foreground">
                MD
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-medium text-foreground">
                  Muhammad Dafin
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Free Account
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-1.5 rounded-[6px] border border-border bg-card/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="p-2 rounded-[6px] border border-border bg-card/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
