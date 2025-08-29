import React from "react";
import { cn } from "@/lib/utils";

interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "row-reverse" | "col" | "col-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = "row",
      justify = "start",
      align = "stretch",
      wrap = "nowrap",
      gap = "none",
      className,
    },
    ref
  ) => {
    const directionClasses = {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
    };

    const justifyClasses = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const alignClasses = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    const wrapClasses = {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    };

    const gapClasses = {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          wrapClasses[wrap],
          gapClasses[gap],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

export { Flex };
export type { FlexProps };
