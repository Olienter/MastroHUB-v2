import React from "react";

interface ContainerProps {
  variant?: 'content' | 'wide' | 'full';
  children: React.ReactNode;
  className?: string;
}

export function Container({ 
  variant = 'wide', 
  children, 
  className = "" 
}: ContainerProps) {
  const variantClasses = {
    content: 'max-w-3xl mx-auto',
    wide: 'max-w-7xl mx-auto',
    full: 'w-full'
  };

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
