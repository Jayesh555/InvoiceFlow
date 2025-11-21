import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Pill,
  Building2,
  FileText,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Doctors",
    url: "/doctors",
    icon: UserRound,
  },
  {
    title: "Medicines",
    url: "/medicines",
    icon: Pill,
  },
  {
    title: "Manufacturers",
    url: "/manufacturers",
    icon: Building2,
  },
];

interface AppSidebarProps {
  onLogout: () => void;
  userEmail?: string;
}

export function AppSidebar({ onLogout, userEmail }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-2 py-4">
            Bafana Medical
          </SidebarGroupLabel>
          <Separator className="mb-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-testid={`link-${item.title.toLowerCase()}`}
                      className={isActive ? "bg-sidebar-accent" : ""}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {userEmail && (
            <div className="text-xs text-muted-foreground px-2 truncate">
              {userEmail}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
