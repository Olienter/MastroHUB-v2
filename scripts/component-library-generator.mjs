#!/usr/bin/env node

/**
 * Component Library Generator for MastroHUB v2
 * Automated component creation with design system integration
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "fs";
import { join, dirname, basename, extname } from "path";

class ComponentLibraryGenerator {
  constructor() {
    this.componentTemplates = {
      Button: this.getButtonTemplate(),
      Input: this.getInputTemplate(),
      Card: this.getCardTemplate(),
      Badge: this.getBadgeTemplate(),
      Modal: this.getModalTemplate(),
      Dropdown: this.getDropdownTemplate(),
      Table: this.getTableTemplate(),
      Form: this.getFormTemplate(),
      Navigation: this.getNavigationTemplate(),
      Sidebar: this.getSidebarTemplate()
    };
    
    this.designTokens = {
      colors: {
        primary: 'var(--color-gastronomy-primary)',
        secondary: 'var(--color-gastronomy-secondary)',
        accent: 'var(--color-gastronomy-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-fg)',
        textSubtle: 'var(--color-fg-subtle)',
        textMuted: 'var(--color-fg-muted)'
      },
      spacing: {
        xs: 'var(--space-1)',
        sm: 'var(--space-2)',
        md: 'var(--space-4)',
        lg: 'var(--space-6)',
        xl: 'var(--space-8)',
        '2xl': 'var(--space-12)',
        '3xl': 'var(--space-16)'
      },
      typography: {
        xs: 'var(--step-0)',
        sm: 'var(--step-1)',
        md: 'var(--step-2)',
        lg: 'var(--step-3)',
        xl: 'var(--step-4)'
      },
      radius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-1)',
        lg: 'var(--radius-2)',
        xl: 'var(--radius-3)',
        full: 'var(--radius-full)'
      },
      shadows: {
        sm: 'var(--shadow-1)',
        md: 'var(--shadow-2)',
        lg: 'var(--shadow-3)',
        xl: 'var(--shadow-4)',
        '2xl': 'var(--shadow-5)'
      }
    };
  }

  getButtonTemplate() {
    return `import React from 'react';
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

export { Button, type ButtonProps };`;
  }

  getInputTemplate() {
    return `import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || \`input-\${Math.random().toString(36).substr(2, 9)}\`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? \`\${inputId}-error\` : helperText ? \`\${inputId}-helper\` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={\`\${inputId}-error\`} className="text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={\`\${inputId}-helper\`} className="text-sm text-[var(--color-fg-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };`;
  }

  getCardTemplate() {
    return `import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = 'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]';
    
    const variants = {
      default: 'shadow-sm',
      outlined: 'border-2',
      elevated: 'shadow-lg'
    };
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-[var(--color-fg)]', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-fg-muted)]', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, type CardProps };`;
  }

  getBadgeTemplate() {
    return `import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      default: 'bg-[var(--color-gastronomy-primary)] text-white focus:ring-[var(--color-gastronomy-primary)]',
      secondary: 'bg-[var(--color-gastronomy-secondary)] text-white focus:ring-[var(--color-gastronomy-secondary)]',
      accent: 'bg-[var(--color-gastronomy-accent)] text-white focus:ring-[var(--color-gastronomy-accent)]',
      success: 'bg-[var(--color-success)] text-white focus:ring-[var(--color-success)]',
      warning: 'bg-[var(--color-warning)] text-white focus:ring-[var(--color-warning)]',
      error: 'bg-[var(--color-error)] text-white focus:ring-[var(--color-error)]',
      outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-fg)] focus:ring-[var(--color-gastronomy-primary)]'
    };
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, type BadgeProps };`;
  }

  getModalTemplate() {
    return `import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full rounded-lg bg-[var(--color-surface)] shadow-xl',
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6">
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-fg)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)]"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal, type ModalProps };`;
  }

  getDropdownTemplate() {
    return `import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  onSelect?: (item: DropdownItem) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  onSelect,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    }
    
    if (onSelect) {
      onSelect(item);
    }
    
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <div
              key={item.value}
              className={cn(
                'flex cursor-pointer items-center px-4 py-2 text-sm text-[var(--color-fg)] transition-colors first:rounded-t-md last:rounded-b-md',
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-[var(--color-surface-subtle)] focus:bg-[var(--color-surface-subtle)] focus:outline-none'
              )}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
            >
              {item.icon && (
                <span className="mr-3 text-[var(--color-fg-muted)]">
                  {item.icon}
                </span>
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Dropdown, type DropdownProps, type DropdownItem };`;
  }

  getTableTemplate() {
    return `import React from 'react';
import { cn } from '@/lib/utils';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  className,
  striped = true,
  hoverable = true,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-[var(--color-surface-subtle)] rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border)]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-[var(--color-fg-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
      <table className={cn('w-full', className)}>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'transition-colors',
                striped && rowIndex % 2 === 1 && 'bg-[var(--color-surface-subtle)]',
                hoverable && 'hover:bg-[var(--color-surface-subtle)]'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-fg)]"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table, type TableProps, type TableColumn };`;
  }

  getFormTemplate() {
    return `import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: z.ZodTypeAny;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  submitLabel?: string;
  className?: string;
  loading?: boolean;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className,
  loading = false
}) => {
  // Create Zod schema from fields
  const schema = z.object(
    fields.reduce((acc, field) => {
      let fieldSchema = field.validation || z.string();
      
      if (field.required && field.type !== 'checkbox') {
        fieldSchema = fieldSchema.min(1, \`\${field.label} is required\`);
      }
      
      if (field.type === 'email') {
        fieldSchema = z.string().email('Invalid email address');
      }
      
      if (field.type === 'number') {
        fieldSchema = z.number();
      }
      
      if (field.type === 'checkbox') {
        fieldSchema = z.boolean();
      }
      
      acc[field.name] = fieldSchema;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-fg)]">
                  {field.label}
                  {field.required && <span className="text-[var(--color-error)] ml-1">*</span>}
                </label>
                <select
                  {...controllerField}
                  className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)] focus:ring-offset-2"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <p className="text-sm text-[var(--color-error)]">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );
      
      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-fg)]">
                  {field.label}
                  {field.required && <span className="text-[var(--color-error)] ml-1">*</span>}
                </label>
                <textarea
                  {...controllerField}
                  placeholder={field.placeholder}
                  rows={4}
                  className="flex w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)] focus:ring-offset-2"
                />
                {errors[field.name] && (
                  <p className="text-sm text-[var(--color-error)]">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );
      
      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...controllerField}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-gastronomy-primary)] focus:ring-[var(--color-gastronomy-primary)]"
                />
                <label className="text-sm font-medium text-[var(--color-fg)]">
                  {field.label}
                </label>
                {errors[field.name] && (
                  <p className="text-sm text-[var(--color-error)]">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );
      
      default:
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-fg)]">
                  {field.label}
                  {field.required && <span className="text-[var(--color-error)] ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  {...controllerField}
                  placeholder={field.placeholder}
                  className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)] focus:ring-offset-2"
                />
                {errors[field.name] && (
                  <p className="text-sm text-[var(--color-error)]">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      {fields.map((field) => (
        <div key={field.name}>
          {renderField(field)}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[var(--color-gastronomy-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-gastronomy-primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-gastronomy-primary)] focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};

export { Form, type FormProps, type FormField };`;
  }

  getNavigationTemplate() {
    return `import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  className,
  orientation = 'horizontal'
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderItem = (item: NavigationItem, level = 0) => {
    const active = isActive(item.href);
    
    return (
      <li key={item.href} className="relative">
        <Link
          href={item.href}
          className={cn(
            'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            active
              ? 'bg-[var(--color-gastronomy-primary)] text-white'
              : 'text-[var(--color-fg)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-fg)]',
            level > 0 && 'ml-4'
          )}
        >
          {item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-[var(--color-gastronomy-accent)] px-2 py-1 text-xs text-white">
              {item.badge}
            </span>
          )}
        </Link>
        
        {item.children && item.children.length > 0 && (
          <ul className="mt-1 space-y-1">
            {item.children.map((child) => renderItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row space-x-1' : 'flex-col space-y-1',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row space-x-1' : 'flex-col space-y-1'
      )}>
        {items.map((item) => renderItem(item))}
      </ul>
    </nav>
  );
};

export { Navigation, type NavigationProps, type NavigationItem };`;
  }

  getSidebarTemplate() {
    return `import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  className,
  collapsible = true,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    
    return (
      <li key={item.href} className="relative">
        <div className="flex items-center">
          <a
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'text-[var(--color-fg)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-fg)]',
              level > 0 && 'ml-4',
              isCollapsed && 'justify-center px-2'
            )}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {item.icon}
              </span>
            )}
            {!isCollapsed && (
              <>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-[var(--color-gastronomy-accent)] px-2 py-1 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </a>
          
          {hasChildren && !isCollapsed && (
            <button
              onClick={() => toggleItem(item.href)}
              className="ml-auto p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              aria-expanded={isExpanded}
            >
              <svg
                className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[var(--color-fg)]">
            Navigation
          </h2>
        )}
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-md p-2 text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-fg)]"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4" role="navigation" aria-label="Sidebar navigation">
        <ul className="space-y-1">
          {items.map((item) => renderItem(item))}
        </ul>
      </nav>
    </aside>
  );
};

export { Sidebar, type SidebarProps, type SidebarItem };`;
  }

  async generateComponent(componentName) {
    console.log(`🔧 Generating ${componentName} component...`);
    
    const template = this.componentTemplates[componentName];
    if (!template) {
      console.log(`❌ Template not found for ${componentName}`);
      return;
    }

    // Ensure components directory exists
    const componentsDir = 'components/ui';
    if (!existsSync(componentsDir)) {
      mkdirSync(componentsDir, { recursive: true });
    }

    // Generate component file
    const componentFile = join(componentsDir, `${componentName}.tsx`);
    writeFileSync(componentFile, template);

    // Generate index file for easy imports
    const indexFile = join(componentsDir, 'index.ts');
    const existingIndex = existsSync(indexFile) ? readFileSync(indexFile, 'utf8') : '';
    
    if (!existingIndex.includes(`export { ${componentName} }`)) {
      const newExport = `export { ${componentName}, type ${componentName}Props } from './${componentName}';\n`;
      writeFileSync(indexFile, existingIndex + newExport);
    }

    console.log(`✅ ${componentName} component generated successfully`);
  }

  async generateAllComponents() {
    console.log('🚀 Generating all components...');
    
    for (const componentName of Object.keys(this.componentTemplates)) {
      await this.generateComponent(componentName);
    }
    
    console.log('✅ All components generated successfully');
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const componentName = args[1];

    switch (command) {
      case 'generate':
        if (componentName) {
          await this.generateComponent(componentName);
        } else {
          await this.generateAllComponents();
        }
        break;
        
      case 'list':
        console.log('📋 Available component templates:');
        Object.keys(this.componentTemplates).forEach(name => {
          console.log(`  - ${name}`);
        });
        break;
        
      default:
        console.log('🧩 MastroHUB v2 Component Library Generator');
        console.log('\nUsage:');
        console.log('  node component-library-generator.mjs generate [componentName] - Generate component(s)');
        console.log('  node component-library-generator.mjs list - List available templates');
        break;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('component-library-generator.mjs')) {
  const generator = new ComponentLibraryGenerator();
  generator.run().catch(error => {
    console.error('❌ Component generation failed:', error.message);
    process.exit(1);
  });
}

export default ComponentLibraryGenerator;
