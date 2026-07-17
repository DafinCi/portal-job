import AppShell from "@/components/layouts/AppShell";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
