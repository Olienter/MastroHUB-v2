import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X, ChevronRight } from "lucide-react";

interface MobileNavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: MobileNavItem[];
  badge?: string | number;
}

interface MobileNavigationProps {
  items: MobileNavItem[];
  className?: string;
  triggerClassName?: string;
}

const MobileNavigation = React.forwardRef<
  HTMLDivElement,
  MobileNavigationProps
>(({ items, className, triggerClassName }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveItem(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setActiveItem(null);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: MobileNavItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle submenu
      setActiveItem(activeItem === item.id ? null : item.id);
    } else {
      // Execute action and close menu
      if (item.onClick) {
        item.onClick();
      }
      if (item.href) {
        console.log("Navigating to:", item.href);
      }
      setIsOpen(false);
      setActiveItem(null);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveItem(null);
    }
  };

  const renderNavItem = (item: MobileNavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;
    const isExpanded = isActive && hasChildren;

    return (
      <div
        key={item.id}
        className="border-b border-border-subtle last:border-b-0"
      >
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 text-left transition-colors",
            "hover:bg-surface-subtle focus:outline-none focus:bg-surface-subtle",
            level === 0 ? "text-fg font-medium" : "text-fg-muted text-sm pl-8",
            isActive && "bg-surface-subtle"
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className="flex-shrink-0 text-fg-muted">{item.icon}</span>
            )}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-brand text-brand-fg text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-4 w-4 text-fg-muted transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isExpanded && (
          <div className="bg-surface-subtle border-t border-border-subtle">
            {item.children?.map((childItem) =>
              renderNavItem(childItem, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className={cn("lg:hidden", className)}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className={cn("h-9 w-9", triggerClassName)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" />

          {/* Menu Panel */}
          <div
            ref={navRef}
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-surface border-l border-border shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-fg">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="space-y-1">
                {items.map((item) => renderNavItem(item))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="text-xs text-fg-muted text-center">
                MastroHUB v2.0
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

export { MobileNavigation };
export type { MobileNavigationProps, MobileNavItem };
