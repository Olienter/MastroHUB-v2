import React from "react";

interface ContainerProps {
  variant?: "content" | "wide" | "full" | "ultra-wide" | "no-padding";
  children: React.ReactNode;
  className?: string;
}

export function Container({
  variant = "wide",
  children,
  className = "",
}: ContainerProps) {
  const variantClasses = {
    content: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
    wide: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    full: "w-full px-4 sm:px-6 lg:px-8",
    "ultra-wide": "max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8",
    "no-padding": "w-full",
  };

  return (
    <div className={`w-full ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
