import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MegaMenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  description?: string;
  icon?: React.ReactNode;
  children?: MegaMenuItem[];
  featured?: boolean;
}

interface MegaMenuProps {
  items: MegaMenuItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const MegaMenu = React.forwardRef<HTMLElement, MegaMenuProps>(
  ({ items, className, orientation = "horizontal" }, ref) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setActiveItem(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (item: MegaMenuItem) => {
      if (item.onClick) {
        item.onClick();
      }
      if (item.href) {
        // Handle navigation
        // Navigation logic will be implemented
      }
      setIsOpen(false);
      setActiveItem(null);
    };

    const handleMouseEnter = (itemId: string) => {
      setActiveItem(itemId);
      setIsOpen(true);
    };

    const handleMouseLeave = () => {
      setActiveItem(null);
      setIsOpen(false);
    };

    const renderMenuItem = (item: MegaMenuItem, isTopLevel = false) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeItem === item.id;

      return (
        <div
          key={item.id}
          className={cn("relative", isTopLevel && "group")}
          onMouseEnter={() => isTopLevel && handleMouseEnter(item.id)}
          onMouseLeave={() => isTopLevel && handleMouseLeave()}
        >
          <button
            className={cn(
              "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors",
              "hover:text-brand focus:outline-none focus:text-brand",
              isTopLevel && "text-fg hover:text-brand",
              isActive && "text-brand"
            )}
            onClick={() => !hasChildren && handleItemClick(item)}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {hasChildren && (
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            )}
          </button>

          {/* Mega Menu Dropdown */}
          {hasChildren && isTopLevel && isActive && (
            <div className="absolute left-0 top-full z-50 w-screen max-w-4xl transform -translate-x-1/2">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-surface border border-border rounded-radius-3 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                    {/* Featured Items */}
                    {item.children
                      ?.filter((child) => child.featured)
                      .map((featuredItem) => (
                        <div key={featuredItem.id} className="lg:col-span-2">
                          <div className="group relative rounded-radius-2 p-4 hover:bg-surface-subtle">
                            <div className="flex items-center space-x-3">
                              {featuredItem.icon && (
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-brand/10 rounded-radius-2 flex items-center justify-center">
                                    {featuredItem.icon}
                                  </div>
                                </div>
                              )}
                              <div className="flex-1">
                                <button
                                  onClick={() => handleItemClick(featuredItem)}
                                  className="text-left"
                                >
                                  <p className="text-sm font-medium text-fg group-hover:text-brand">
                                    {featuredItem.label}
                                  </p>
                                  {featuredItem.description && (
                                    <p className="text-xs text-fg-muted mt-1">
                                      {featuredItem.description}
                                    </p>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Regular Items */}
                    {item.children
                      ?.filter((child) => !child.featured)
                      .map((childItem) => (
                        <div key={childItem.id}>
                          <button
                            onClick={() => handleItemClick(childItem)}
                            className="group relative rounded-radius-2 p-3 w-full text-left hover:bg-surface-subtle"
                          >
                            <div className="flex items-center space-x-3">
                              {childItem.icon && (
                                <div className="flex-shrink-0">
                                  <div className="w-6 h-6 bg-surface-subtle rounded-radius-1 flex items-center justify-center">
                                    {childItem.icon}
                                  </div>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-fg group-hover:text-brand">
                                  {childItem.label}
                                </p>
                                {childItem.description && (
                                  <p className="text-xs text-fg-muted mt-1">
                                    {childItem.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nested Menu Items */}
          {hasChildren && !isTopLevel && (
            <div className="absolute left-full top-0 z-50 min-w-48 bg-surface border border-border rounded-radius-2 shadow-lg">
              {item.children?.map((childItem) => (
                <button
                  key={childItem.id}
                  onClick={() => handleItemClick(childItem)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-left hover:bg-surface-subtle transition-colors"
                >
                  {childItem.icon && (
                    <span className="flex-shrink-0">{childItem.icon}</span>
                  )}
                  <span>{childItem.label}</span>
                  {childItem.children && childItem.children.length > 0 && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "relative",
          orientation === "vertical"
            ? "flex flex-col space-y-1"
            : "flex items-center space-x-1",
          className
        )}
      >
        <div ref={menuRef} className="flex items-center space-x-1">
          {items.map((item) => renderMenuItem(item, true))}
        </div>
      </nav>
    );
  }
);

MegaMenu.displayName = "MegaMenu";

export { MegaMenu };
export type { MegaMenuProps, MegaMenuItem };
