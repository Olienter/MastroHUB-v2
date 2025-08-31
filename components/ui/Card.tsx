"use client";

import React from "react";
import { cn } from "../../lib/utils";

// Design tokens removed - using Tailwind classes instead

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "featured";
  size?: "sm" | "md" | "lg";
  isHoverable?: boolean;
}

const cardVariants = {
  variant: {
    default: "bg-white border border-gray-200",
    elevated: "bg-white shadow-lg border-0",
    outlined: "bg-white border-2 border-gray-300",
    featured: "bg-gradient-to-br from-white to-gray-50 border-2 border-yellow-200 shadow-xl",
  },
  size: {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      size = "md",
      isHoverable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-xl",
          "transition-all duration-200",

          // Variants
          cardVariants.variant[variant],
          cardVariants.size[size],

          // Hover effects
          isHoverable && "hover:scale-[1.02] hover:shadow-lg",

          // Custom className
          className
        )}
        {...props}
      >
        {/* Featured badge for featured variant */}
        {variant === "featured" && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
            Featured
          </div>
        )}

        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card sub-components removed - not used in current implementation
