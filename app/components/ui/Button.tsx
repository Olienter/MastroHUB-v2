import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = "default", 
      size = "md", 
      loading = false,
      disabled,
      children, 
      ...props 
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-radius-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    const variants = {
      default: "bg-brand text-brand-fg hover:bg-brand/90 shadow-sm hover:shadow-md",
      secondary: "bg-surface text-fg hover:bg-surface/80 border border-border",
      outline: "border border-border bg-transparent hover:bg-surface hover:text-fg",
      ghost: "hover:bg-surface hover:text-fg",
      link: "text-brand underline-offset-4 hover:underline",
      destructive: "bg-error text-white hover:bg-error/90 shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "h-8 px-3 text-step-0",
      md: "h-10 px-4 py-2 text-step-1",
      lg: "h-12 px-6 py-3 text-step-2",
      icon: "h-10 w-10 p-0",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
