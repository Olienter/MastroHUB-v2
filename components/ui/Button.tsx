import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-[var(--color-gastronomy-primary)] text-white hover:bg-[var(--color-gastronomy-primary)]/90 focus-visible:ring-[var(--color-gastronomy-primary)]',
      secondary: 'bg-[var(--color-gastronomy-secondary)] text-white hover:bg-[var(--color-gastronomy-secondary)]/90 focus-visible:ring-[var(--color-gastronomy-secondary)]',
      accent: 'bg-[var(--color-gastronomy-accent)] text-white hover:bg-[var(--color-gastronomy-accent)]/90 focus-visible:ring-[var(--color-gastronomy-accent)]',
      outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface)] focus-visible:ring-[var(--color-gastronomy-primary)]',
      ghost: 'hover:bg-[var(--color-surface)] focus-visible:ring-[var(--color-gastronomy-primary)]',
      destructive: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 focus-visible:ring-[var(--color-error)]'
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };