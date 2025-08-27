import React from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  className?: string;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, cols = 12, gap = "md", className }, ref) => {
    const gapClasses = {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    const colsClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    };

    return (
      <div
        ref={ref}
        className={cn("grid", colsClasses[cols], gapClasses[gap], className)}
      >
        {children}
      </div>
    );
  }
);

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ children, span = 1, className }, ref) => {
    const spanClasses = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    };

    return (
      <div ref={ref} className={cn(spanClasses[span], className)}>
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
GridItem.displayName = "GridItem";

export { Grid, GridItem };
export type { GridProps, GridItemProps };
