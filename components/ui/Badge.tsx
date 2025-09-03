"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        destructive:
          "bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-100 dark:hover:bg-red-900/30",
        outline:
          "border border-gray-200 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
        success:
          "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-100 dark:hover:bg-green-900/30",
        warning:
          "bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:hover:bg-yellow-900/30",
        info:
          "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30",
        premium:
          "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-sm",
        ghost:
          "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        new:
          "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-100 dark:hover:bg-purple-900/30",
        hot:
          "bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-100 dark:hover:bg-orange-900/30",
        trending:
          "bg-pink-100 text-pink-900 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-100 dark:hover:bg-pink-900/30",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
