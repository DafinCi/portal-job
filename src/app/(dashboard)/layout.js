import Sidebar from "@/components/sidebar/Sidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

import Navbar from "@/components/navbar/Navbar";

import {
  SidebarProvider,
} from "@/components/context/SidebarContext";

export default function DashboardLayout({
  children,
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
              <Navbar />
              <main>
                  {children}
              </main>
          </div>
      </div>
    </SidebarProvider>
  );
}