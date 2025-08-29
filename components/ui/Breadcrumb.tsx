import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    { items, separator = <ChevronRight className="h-4 w-4" />, className },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm", className)}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          {/* Home icon */}
          <li>
            <button
              onClick={() => {
                // Navigate to home or default action
              }}
              className="flex items-center text-fg-muted hover:text-fg transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </button>
          </li>

          {/* Breadcrumb items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-1 text-fg-muted" aria-hidden="true">
                  {separator}
                </span>
              )}

              {item.current ? (
                <span className="text-fg font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-fg-muted hover:text-fg transition-colors"
                >
                  {item.label}
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-fg-muted hover:text-fg transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-fg-muted">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
