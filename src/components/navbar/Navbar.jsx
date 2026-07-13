"use client";

import {
  Bell,
  Menu,
} from "lucide-react";

import Breadcrumb from "./Breadcrumb";
import NotificationButton from "./NotificationButton";
import AvatarDropdown from "./AvatarDropdown";

import { useSidebar } from "@/components/context/SidebarContext";

export default function Navbar() {

  const {
    toggleSidebar,
  } = useSidebar();

  return (
    <header
      className="
      sticky
      top-0
      z-40
      flex
      items-center
      justify-between
      border-b
      border-border
      bg-background/70
      px-8
      py-5
      backdrop-blur-xl
      shadow-sm
    "
    >

      <div className="flex items-center gap-5">

        <button
          onClick={toggleSidebar}
          className="
            rounded-sm
            p-2
            hover:bg-sidebar-accent
          "
        >
          <Menu />
        </button>

        <Breadcrumb />

      </div>

      <div className="flex items-center gap-3">
            <NotificationButton />
            <AvatarDropdown />
      </div>

    </header>
  );
}