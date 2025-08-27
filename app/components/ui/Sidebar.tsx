import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
  items: NavigationItem[];
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ collapsed = false, items, onCollapse, className }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "bg-surface border-r border-border transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-fg">MastroHUB</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapse?.(!collapsed)}
              className="ml-auto"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2"
                )}
                size="sm"
                onClick={item.onClick}
                disabled={item.disabled}
                aria-label={collapsed ? item.label : undefined}
              >
                <span className="flex items-center">
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="ml-2">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-brand text-brand-fg text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-fg-muted text-center">
              MastroHUB v2.0
            </div>
          </div>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";

export { Sidebar };
export type { SidebarProps, NavigationItem };
