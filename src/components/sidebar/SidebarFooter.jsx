"use client";

import {
  LogOut,
  Settings,
  User,
} from "lucide-react";

export default function SidebarFooter({ collapsed }) {
  return (
    <div className="border-t border-sidebar-border p-4">

      {collapsed ? (
        <div className="flex flex-col items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-primary
              text-white"
          >
            <User size={20} />
          </div>

          <button className="rounded-sm p-2 hover:bg-sidebar-accent">
            <LogOut size={18} />
          </button>

        </div>
      ) : (
        <>

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-primary
                text-white
                font-bold
              "
            >
              EL
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sidebar-foreground">
                El
              </h4>
              <p className="text-sm text-muted-foreground">
                Frontend Developer
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">

            <button
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-sm
                px-3
                py-2
                text-red-400
                hover:bg-red-500/10
              "
            >
              <LogOut size={18} />

              Logout
            </button>

          </div>

        </>
      )}

    </div>
  );
}