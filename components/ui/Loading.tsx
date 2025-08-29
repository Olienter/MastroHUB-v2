import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "bars" | "pulse";
  text?: string;
  className?: string;
}

interface LoadingOverlayProps {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
  className?: string;
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "md", variant = "spinner", text, className }, ref) => {
    const sizeClasses = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    const textSizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    };

    const renderSpinner = () => (
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
    );

    const renderDots = () => (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-current rounded-full animate-bounce",
              sizeClasses[size].split(" ")[0] === "w-3"
                ? "w-1 h-1"
                : sizeClasses[size].split(" ")[0] === "w-4"
                ? "w-1 h-1"
                : sizeClasses[size].split(" ")[0] === "w-6"
                ? "w-2 h-2"
                : sizeClasses[size].split(" ")[0] === "w-8"
                ? "w-2 h-2"
                : "w-3 h-3"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );

    const renderBars = () => (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-current animate-pulse",
              sizeClasses[size].split(" ")[0] === "w-3"
                ? "w-1 h-3"
                : sizeClasses[size].split(" ")[0] === "w-4"
                ? "w-1 h-4"
                : sizeClasses[size].split(" ")[0] === "w-6"
                ? "w-1.5 h-6"
                : sizeClasses[size].split(" ")[0] === "w-8"
                ? "w-2 h-8"
                : "w-2.5 h-12"
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );

    const renderPulse = () => (
      <div
        className={cn(
          "bg-current rounded-full animate-pulse",
          sizeClasses[size]
        )}
      />
    );

    const renderVariant = () => {
      switch (variant) {
        case "dots":
          return renderDots();
        case "bars":
          return renderBars();
        case "pulse":
          return renderPulse();
        default:
          return renderSpinner();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center space-y-2",
          className
        )}
      >
        <div className="text-fg-muted">{renderVariant()}</div>

        {text && (
          <p className={cn("text-fg-muted text-center", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }
);

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ children, isLoading, text, className }, ref) => {
    if (!isLoading) {
      return <>{children}</>;
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        {children}

        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
          <Loading text={text} size="lg" />
        </div>
      </div>
    );
  }
);

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      className,
      onClick,
      disabled,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-radius-2 font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" && "bg-brand text-brand-fg hover:bg-brand/90",
          variant === "destructive" &&
            "bg-destructive text-destructive-fg hover:bg-destructive/90",
          variant === "outline" &&
            "border border-border bg-background hover:bg-surface hover:text-fg",
          variant === "secondary" && "bg-surface text-fg hover:bg-surface/80",
          variant === "ghost" && "hover:bg-surface hover:text-fg",
          variant === "link" && "text-brand underline-offset-4 hover:underline",
          // Sizes
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-radius-1 px-3",
          size === "lg" && "h-11 rounded-radius-2 px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        onClick={onClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Loading.displayName = "Loading";
LoadingOverlay.displayName = "LoadingOverlay";
LoadingButton.displayName = "LoadingButton";

export { Loading, LoadingOverlay, LoadingButton };
export type { LoadingProps, LoadingOverlayProps, LoadingButtonProps };
