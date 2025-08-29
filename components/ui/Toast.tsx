import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

interface ToastProps {
  id: string;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  className?: string;
}

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  className?: string;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { id, type = "info", title, message, duration = 5000, onClose, className },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleClose = useCallback(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(id);
      }, 300); // Animation duration
    }, [id, onClose]);

    // Auto-dismiss
    useEffect(() => {
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [duration, id, handleClose]);

    const typeConfig = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-500",
      },
      error: {
        icon: XCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        iconColor: "text-red-500",
      },
      warning: {
        icon: AlertCircle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-500",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        iconColor: "text-blue-500",
      },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm p-4 rounded-radius-2 border shadow-lg",
          "transform transition-all duration-300 ease-in-out",
          config.bgColor,
          config.borderColor,
          isExiting
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0",
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={cn(
            "absolute top-2 right-2 h-6 w-6",
            config.textColor,
            "hover:bg-black/5"
          )}
          aria-label="Close notification"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Content */}
        <div className="flex items-start space-x-3 pr-6">
          <Icon
            className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)}
          />

          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={cn("text-sm font-medium mb-1", config.textColor)}>
                {title}
              </h4>
            )}
            <p className={cn("text-sm", config.textColor)}>{message}</p>
          </div>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-black/10 rounded-b-radius-2 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-linear",
                config.iconColor
              )}
              style={{
                width: isExiting ? "0%" : "100%",
                transitionDuration: `${duration}ms`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ toasts, onClose, position = "top-right", className }, ref) => {
    const positionClasses = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };

    if (toasts.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col space-y-2",
          positionClasses[position],
          className
        )}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    );
  }
);

Toast.displayName = "Toast";
ToastContainer.displayName = "ToastContainer";

export { Toast, ToastContainer };
export type { ToastProps, ToastContainerProps };
