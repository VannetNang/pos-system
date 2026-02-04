import { getAuthUser } from "@/actions/getAuthUser";
import UserFooter from "@/components/shared/sidebar-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Package, Store, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const AdminSidebar = async () => {
  const items = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/admin/dashboard" },
    { title: "Staffs", icon: LayoutDashboard, url: "/admin/staff" },
    { title: "Products", icon: Package, url: "/admin/product" },
  ];

  const user = await getAuthUser();

  return (
    <>
      <Sidebar>
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Store className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">POS Admin Dashboard</span>
                    <span className="text-xs text-muted-foreground">v1.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
        </SidebarHeader>

        {/* Main Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Management</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <UserFooter user={user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AdminSidebar;
