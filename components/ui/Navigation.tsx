"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { colors, spacing, transitions, typography } from "@/lib/design-tokens";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

export interface NavigationProps {
  items: NavigationItem[];
  variant?: "horizontal" | "vertical" | "tabs";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const navigationVariants = {
  variant: {
    horizontal: "flex space-x-8",
    vertical: "flex flex-col space-y-4",
    tabs: "flex border-b border-gray-200",
  },
  size: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  },
};

export const Navigation: React.FC<NavigationProps> = ({
  items,
  variant = "horizontal",
  size = "md",
  className,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const renderNavigationItem = (item: NavigationItem, index: number) => {
    const isActive = activeItem === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={index} className="relative group">
        <a
          href={item.href}
          className={cn(
            // Base styles
            "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",

            // Variant specific styles
            variant === "horizontal" && "hover:text-gray-900 hover:bg-gray-100",
            variant === "vertical" && "hover:text-gray-900 hover:bg-gray-100",
            variant === "tabs" && [
              "border-b-2 border-transparent",
              "hover:text-gray-700 hover:border-gray-300",
              isActive && "border-red-500 text-red-600",
            ],

            // Size styles
            navigationVariants.size[size],

            // State styles
            isActive && "text-red-600 bg-red-50",
            !isActive && "text-gray-600",

            // Hover effects
            "hover:scale-105 transition-transform duration-200"
          )}
          onMouseEnter={() => setActiveItem(item.href)}
          onMouseLeave={() => setActiveItem(null)}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </a>

        {/* Dropdown for items with children */}
        {hasChildren && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              {item.children!.map((child, childIndex) => (
                <a
                  key={childIndex}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                >
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={cn("relative", navigationVariants.variant[variant], className)}
    >
      {items.map((item, index) => renderNavigationItem(item, index))}
    </nav>
  );
};

// Specialized navigation components
export const MainNavigation: React.FC<{ items: NavigationItem[] }> = ({
  items,
}) => (
  <Navigation
    items={items}
    variant="horizontal"
    size="md"
    className="hidden md:flex items-center space-x-8"
  />
);

export const MobileNavigation: React.FC<{ items: NavigationItem[] }> = ({
  items,
}) => (
  <Navigation
    items={items}
    variant="vertical"
    size="md"
    className="md:hidden space-y-2"
  />
);

export const TabNavigation: React.FC<{ items: NavigationItem[] }> = ({
  items,
}) => (
  <Navigation
    items={items}
    variant="tabs"
    size="md"
    className="border-b border-gray-200"
  />
);
