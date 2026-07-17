"use client";

import React from "react";
import { MenuItems } from "@/constants/menu";
import SidebarItem from "./SidebarItem";

export default function SidebarNavigation({ collapsed }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none focus:outline-none">
      {MenuItems.map((item) => (
        <SidebarItem key={item.href} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
