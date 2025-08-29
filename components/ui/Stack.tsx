import React from "react";
import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ children, spacing = "md", align = "stretch", className }, ref) => {
    const spacingClasses = {
      none: "",
      xs: "space-y-1",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col",
          spacingClasses[spacing],
          alignClasses[align],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

export { Stack };
export type { StackProps };
