"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
} from "@/lib/design-tokens";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "featured" | "news" | "elevated" | "outlined";
  size?: "sm" | "md" | "lg";
  isHoverable?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  variant: {
    default: `
      bg-white 
      border border-gray-200
      shadow-sm
    `,
    featured: `
      bg-gradient-to-br from-red-50 to-orange-50
      border border-red-200
      shadow-md
      relative overflow-hidden
    `,
    news: `
      bg-white 
      border border-gray-200
      shadow-sm
      hover:shadow-md
    `,
    elevated: `
      bg-white 
      border border-gray-200
      shadow-lg
    `,
    outlined: `
      bg-transparent 
      border-2 border-gray-300
      shadow-none
    `,
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
      className,
      variant = "default",
      size = "md",
      isHoverable = false,
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

// Card sub-components for better composition
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
