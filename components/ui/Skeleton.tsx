import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "title" | "card" | "avatar" | "button";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  if (variant === "title") {
    return <div className={`h-8 ${baseClasses} ${className}`} />;
  }

  if (variant === "card") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className={`h-48 ${baseClasses}`} />
        <div className="space-y-2">
          <div className={`h-4 ${baseClasses} w-3/4`} />
          <div className={`h-4 ${baseClasses} w-1/2`} />
        </div>
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={`w-12 h-12 ${baseClasses} rounded-full ${className}`} />
    );
  }

  if (variant === "button") {
    return (
      <div className={`h-10 w-24 ${baseClasses} rounded-lg ${className}`} />
    );
  }

  // Default text variant
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 ${baseClasses} ${
            index === lines - 1 ? "w-3/4" : "w-full"
          } ${className}`}
        />
      ))}
    </div>
  );
};
