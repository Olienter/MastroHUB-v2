"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:border-gray-300",
        elevated: "border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300",
        outline: "border-2 border-gray-200 hover:border-gray-300",
        premium: "border-red-200 bg-gradient-to-br from-white to-red-50 hover:border-red-300 shadow-lg hover:shadow-xl",
        dark: "border-gray-700 bg-gray-900 text-white hover:border-gray-600",
        glass: "border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20",
        interactive: "border-gray-200 hover:border-red-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      animation: {
        none: "",
        hover: "hover:scale-105",
        lift: "hover:-translate-y-2",
        glow: "hover:shadow-red-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

const cardHeaderVariants = cva("flex flex-col space-y-1.5", {
  variants: {
    size: {
      sm: "pb-3",
      default: "pb-4",
      lg: "pb-6",
      xl: "pb-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const cardTitleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const cardDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const cardContentVariants = cva("", {
  variants: {
    size: {
      sm: "pt-3",
      default: "pt-4",
      lg: "pt-6",
      xl: "pt-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const cardFooterVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "pt-3",
      default: "pt-4",
      lg: "pt-6",
      xl: "pt-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, animation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, animation, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(cardTitleVariants({ size, className }))}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {
  children: React.ReactNode;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(cardDescriptionVariants({ size, className }))}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
