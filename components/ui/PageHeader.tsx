import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "./Button";
import { Container } from "./Container";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <Container>
        <div className="py-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-1 text-sm text-fg-muted mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-fg-muted hover:text-fg"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="h-4 w-4" />
              </Button>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="h-4 w-4 text-fg-muted" />
                  {item.href || item.onClick ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-fg-muted hover:text-fg"
                      onClick={
                        item.onClick ||
                        (() => (window.location.href = item.href!))
                      }
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <span className="text-fg-muted">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Header Content */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-fg mb-2">{title}</h1>
              {description && (
                <p className="text-lg text-fg-muted max-w-3xl">{description}</p>
              )}
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex items-center space-x-3 ml-6">{actions}</div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
