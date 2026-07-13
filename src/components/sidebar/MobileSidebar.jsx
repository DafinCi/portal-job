"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-50
          rounded-sm
          bg-primary
          p-3
          text-white
          lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          <div
            className="
              fixed
              inset-0
              z-40
              bg-black/50
            "
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed
              left-0
              top-0
              z-50
              h-screen
              w-72
              bg-sidebar
              shadow-2xl
            "
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}