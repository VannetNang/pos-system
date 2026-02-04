import AdminSidebar from "@/components/pos/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarTrigger />
      
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default layout;
