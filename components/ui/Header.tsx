import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MegaMenu, MegaMenuItem } from "@/components/ui/MegaMenu";
import {
  MobileNavigation,
  MobileNavItem,
} from "@/components/ui/MobileNavigation";
import { User, Settings, LogOut, Bell, Search } from "lucide-react";

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      showSearch = true,
      showNotifications = true,
      showUserMenu = true,
    },
    ref
  ) => {
    // Navigation items for Mega Menu
    const megaMenuItems: MegaMenuItem[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <div className="w-4 h-4 bg-brand rounded-radius-1" />,
        children: [
          {
            id: "overview",
            label: "Overview",
            description: "Get a quick overview of your data",
            featured: true,
            icon: <div className="w-4 h-4 bg-blue-500 rounded-radius-1" />,
          },
          {
            id: "analytics",
            label: "Analytics",
            description: "Deep dive into your metrics",
            icon: <div className="w-4 h-4 bg-green-500 rounded-radius-1" />,
          },
          {
            id: "reports",
            label: "Reports",
            description: "Generate and view reports",
            icon: <div className="w-4 h-4 bg-purple-500 rounded-radius-1" />,
          },
        ],
      },
      {
        id: "users",
        label: "Users",
        href: "/users",
        icon: <div className="w-4 h-4 bg-blue-500 rounded-radius-1" />,
        children: [
          {
            id: "all-users",
            label: "All Users",
            description: "Manage all user accounts",
            featured: true,
            icon: <div className="w-4 h-4 bg-blue-500 rounded-radius-1" />,
          },
          {
            id: "roles",
            label: "Roles & Permissions",
            description: "Configure user roles and access",
            icon: <div className="w-4 h-4 bg-yellow-500 rounded-radius-1" />,
          },
          {
            id: "invites",
            label: "Invitations",
            description: "Send and manage user invites",
            icon: <div className="w-4 h-4 bg-green-500 rounded-radius-1" />,
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: <div className="w-4 h-4 bg-gray-500 rounded-radius-1" />,
        children: [
          {
            id: "general",
            label: "General",
            description: "Basic application settings",
            featured: true,
            icon: <div className="w-4 h-4 bg-gray-500 rounded-radius-1" />,
          },
          {
            id: "security",
            label: "Security",
            description: "Security and authentication settings",
            icon: <div className="w-4 h-4 bg-red-500 rounded-radius-1" />,
          },
          {
            id: "integrations",
            label: "Integrations",
            description: "Third-party service connections",
            icon: <div className="w-4 h-4 bg-purple-500 rounded-radius-1" />,
          },
        ],
      },
    ];

    // Navigation items for Mobile Navigation
    const mobileNavItems: MobileNavItem[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <div className="w-4 h-4 bg-brand rounded-radius-1" />,
        children: [
          { id: "overview", label: "Overview", href: "/dashboard" },
          { id: "analytics", label: "Analytics", href: "/analytics" },
          { id: "reports", label: "Reports", href: "/reports" },
        ],
      },
      {
        id: "users",
        label: "Users",
        href: "/users",
        icon: <div className="w-4 h-4 bg-blue-500 rounded-radius-1" />,
        children: [
          { id: "all-users", label: "All Users", href: "/users" },
          { id: "roles", label: "Roles & Permissions", href: "/roles" },
          { id: "invites", label: "Invitations", href: "/invites" },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: <div className="w-4 h-4 bg-gray-500 rounded-radius-1" />,
        children: [
          { id: "general", label: "General", href: "/settings" },
          { id: "security", label: "Security", href: "/security" },
          { id: "integrations", label: "Integrations", href: "/integrations" },
        ],
      },
    ];

    return (
      <header
        ref={ref}
        className={cn(
          "bg-surface border-b border-border sticky top-0 z-40",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-fg">MastroHUB</h1>
              </div>

              {/* Desktop Mega Menu */}
              <div className="hidden lg:block">
                <MegaMenu items={megaMenuItems} />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {showSearch && (
                <div className="hidden sm:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-64 bg-surface-subtle border border-border rounded-radius-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Notifications */}
              {showNotifications && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                </Button>
              )}

              {/* User Menu */}
              {showUserMenu && (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>John Doe</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Navigation */}
              <MobileNavigation items={mobileNavItems} />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export { Header };
export type { HeaderProps };
