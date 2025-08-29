import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
}

interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsed?: boolean;
}

interface NavigationProps {
  items?: NavigationItem[];
  groups?: NavigationGroup[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ items = [], groups = [], orientation = "vertical", className }, ref) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <nav
        ref={ref}
        className={cn(
          "flex",
          isHorizontal ? "flex-row space-x-1" : "flex-col space-y-1",
          className
        )}
        role="navigation"
      >
        {/* Direct navigation items */}
        {items.map((item) => (
          <Button
            key={item.id}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "justify-start",
              isHorizontal ? "h-9 px-3" : "w-full"
            )}
            size="sm"
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className={cn("mr-2", isHorizontal && "mr-0")}>
                {item.icon}
              </span>
            )}
            <span className={isHorizontal ? "sr-only" : ""}>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-brand text-brand-fg text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Button>
        ))}

        {/* Navigation groups */}
        {groups.map((group) => (
          <div key={group.id} className="space-y-2">
            {!group.collapsed && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
                  {group.label}
                </h3>
              </div>
            )}

            <div
              className={cn(
                "space-y-1",
                isHorizontal ? "flex flex-row space-x-1" : ""
              )}
            >
              {group.items.map((item) => (
                <Button
                  key={item.id}
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "justify-start",
                    isHorizontal ? "h-9 px-3" : "w-full"
                  )}
                  size="sm"
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <span className={cn("mr-2", isHorizontal && "mr-0")}>
                      {item.icon}
                    </span>
                  )}
                  <span className={isHorizontal ? "sr-only" : ""}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-brand text-brand-fg text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }
);

Navigation.displayName = "Navigation";

export { Navigation };
export type { NavigationProps, NavigationItem, NavigationGroup };
