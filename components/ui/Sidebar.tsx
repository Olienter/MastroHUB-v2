"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  items: NavigationItem[];
  onCollapse: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({
  collapsed,
  items,
  onCollapse,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-surface border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-fg">MastroHUB</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapse(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={item.active ? "primary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed ? "px-2" : "px-3"
            )}
            size="sm"
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className={cn("flex-shrink-0", collapsed ? "mr-0" : "mr-3")}>
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-brand text-brand-fg text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-fg-muted text-center">
            v2.0
          </div>
        )}
      </div>
    </aside>
  );
}
