"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sidebar, NavigationItem } from "@/components/ui/Sidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  Settings,
  LogOut,
  BarChart3,
  Users,
  FileText,
  Shield,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navigation items for sidebar
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Menu className="h-4 w-4" />,
      onClick: () => console.log("Dashboard clicked"),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: () => console.log("Analytics clicked"),
      badge: "New",
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
      onClick: () => console.log("Users clicked"),
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => console.log("Reports clicked"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => console.log("Settings clicked"),
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="h-4 w-4" />,
      onClick: () => console.log("Security clicked"),
    },
  ];

  return (
    <div className="min-h-dvh bg-bg text-fg flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        items={navigationItems}
        onCollapse={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-fg">Dashboard</h1>
              <p className="text-sm text-fg-muted">Welcome to MastroHUB v2.0</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
