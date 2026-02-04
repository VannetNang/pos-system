import StaffDashboardSidebar from "@/components/pos/staff/staff-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <StaffDashboardSidebar />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default layout;
