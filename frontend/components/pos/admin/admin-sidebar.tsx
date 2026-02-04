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
import { Package, Store, LayoutDashboard, Users, Settings } from "lucide-react";
import Link from "next/link";

const AdminSidebar = async () => {
  const items = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin/dashboard",
      color: "text-blue-500",
    },
    {
      title: "Staffs",
      icon: Users,
      url: "/admin/staff",
      color: "text-orange-500",
    },
    {
      title: "Products",
      icon: Package,
      url: "/admin/product",
      color: "text-emerald-500",
    },
  ];

  const user = await getAuthUser();

  return (
    <Sidebar className="border-r border-border/50 shadow-sm">
      {/* Header with better Branding */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Store className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-foreground">
                    POS SYSTEM
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Administrator
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-2 opacity-50" />

      {/* Main Content */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 pb-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70">
            Main Menu
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="h-11 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-4 px-3"
                  >
                    {/* Increased Icon Size here */}
                    <item.icon className={`size-5 shrink-0 ${item.color}`} />
                    <span className="font-medium text-[15px]">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Optional Secondary Group for Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-11 opacity-70 hover:opacity-100"
              >
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-4 px-3"
                >
                  <Settings className="size-6 shrink-0" />
                  <span className="font-medium text-[15px]">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border/40">
        <UserFooter user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
