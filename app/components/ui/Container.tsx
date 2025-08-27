import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = "lg", padding = "md", className }, ref) => {
    const sizeClasses = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-4xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    };

    const paddingClasses = {
      none: "",
      xs: "px-2",
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
      xl: "px-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          sizeClasses[size],
          paddingClasses[padding],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
export type { ContainerProps };
