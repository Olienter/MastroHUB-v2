"use client";

import React from "react";
import { cn } from "@/lib/utils";
// Design tokens removed - using Tailwind classes instead

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  variant: {
    primary: `
      bg-red-500 hover:bg-red-600 
      text-white 
      shadow-md hover:shadow-xl
      border border-transparent
      focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      transform hover:scale-105 active:scale-95
      transition-all duration-200 ease-out
    `,
    secondary: `
      bg-orange-500 hover:bg-orange-600 
      text-white 
      shadow-md hover:shadow-xl
      border border-transparent
      focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
      transform hover:scale-105 active:scale-95
      transition-all duration-200 ease-out
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 
      text-gray-700 hover:text-gray-900
      border border-transparent
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    `,
    outline: `
      bg-transparent 
      text-gray-700 hover:text-gray-900
      border border-gray-300 hover:border-gray-400
      hover:bg-gray-50
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    `,
    danger: `
      bg-red-600 hover:bg-red-700 
      text-white 
      shadow-md hover:shadow-lg
      border border-transparent
      focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    `,
  },
  size: {
    sm: `
      px-3 py-1.5 
      text-sm font-medium
      rounded-md
    `,
    md: `
      px-4 py-2 
      text-base font-medium
      rounded-lg
    `,
    lg: `
      px-6 py-3 
      text-lg font-semibold
      rounded-lg
    `,
    xl: `
      px-8 py-4 
      text-xl font-semibold
      rounded-xl
    `,
    icon: `
      p-2
      text-base font-medium
      rounded-lg
      aspect-square
    `,
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",

          // Variants
          buttonVariants.variant[variant],
          buttonVariants.size[size],

          // Custom className
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading state */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}

        {/* Content */}
        {children}

        {/* Right icon */}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
