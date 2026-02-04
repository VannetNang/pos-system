import AdminSidebar from "@/components/pos/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default layout;
