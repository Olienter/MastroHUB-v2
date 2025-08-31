import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  tooltipClassName?: string;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      position = "top",
      delay = 200,
      className,
      tooltipClassName,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const showTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    // Update position on mouse move
    const handleMouseMove = () => {
      if (triggerRef.current && tooltipRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let x = 0;
        let y = 0;

        switch (position) {
          case "top":
            x = rect.left + rect.width / 2 - tooltipRect.width / 2;
            y = rect.top - tooltipRect.height - 8;
            break;
          case "bottom":
            x = rect.left + rect.width / 2 - tooltipRect.width / 2;
            y = rect.bottom + 8;
            break;
          case "left":
            x = rect.left - tooltipRect.width - 8;
            y = rect.top + rect.height / 2 - tooltipRect.height / 2;
            break;
          case "right":
            x = rect.right + 8;
            y = rect.top + rect.height / 2 - tooltipRect.height / 2;
            break;
        }

        // Ensure tooltip stays within viewport
        x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
        y = Math.max(
          8,
          Math.min(y, window.innerHeight - tooltipRect.height - 8)
        );

        setCoords({ x, y });
      }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const arrowClasses = {
      top: "top-full left-1/2 transform -translate-x-1/2 border-t-surface",
      bottom:
        "bottom-full left-1/2 transform -translate-x-1/2 border-b-surface",
      left: "left-full top-1/2 transform -translate-y-1/2 border-l-surface",
      right: "right-full top-1/2 transform -translate-y-1/2 border-r-surface",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onMouseMove={handleMouseMove}
      >
        {/* Trigger */}
        <div ref={triggerRef} className="inline-block">
          {children}
        </div>

        {/* Tooltip */}
        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              "fixed z-50 px-3 py-2 text-sm text-fg bg-surface border border-border rounded-radius-2 shadow-lg",
              "max-w-xs break-words",
              tooltipClassName
            )}
            style={{
              left: coords.x,
              top: coords.y,
            }}
            role="tooltip"
          >
            {content}

            {/* Arrow */}
            <div
              className={cn(
                "absolute w-0 h-0 border-4 border-transparent",
                arrowClasses[position]
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps };
