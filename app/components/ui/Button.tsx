import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-radius-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-brand text-brand-fg hover:bg-brand/90",
      outline:
        "border border-border bg-transparent hover:bg-surface hover:text-fg",
      ghost: "hover:bg-surface hover:text-fg",
      link: "text-brand underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-8 px-3 text-step-0",
      md: "h-10 px-4 py-2 text-step-1",
      lg: "h-12 px-6 py-3 text-step-2",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
