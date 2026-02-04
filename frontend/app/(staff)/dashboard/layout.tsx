import DashboardSidebar from "@/components/pos/staff/sidebar-dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default layout;
