"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:border-gray-300 focus-visible:border-red-500",
        error: "border-red-500 hover:border-red-600 focus-visible:border-red-500 bg-red-50",
        success: "border-green-500 hover:border-green-600 focus-visible:border-green-500 bg-green-50",
        warning: "border-yellow-500 hover:border-yellow-600 focus-visible:border-yellow-500 bg-yellow-50",
        premium: "border-red-200 bg-gradient-to-r from-white to-red-50 hover:border-red-300 focus-visible:border-red-500 shadow-sm",
        ghost: "border-transparent bg-transparent hover:bg-gray-50 focus-visible:bg-white focus-visible:border-gray-200",
      },
      inputSize: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  success?: string;
  warning?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      error,
      success,
      warning,
      leftIcon,
      rightIcon,
      label,
      helperText,
      ...props
    },
    ref
  ) => {
    // Determine variant based on state
    let inputVariant = variant;
    if (error) inputVariant = "error";
    else if (success) inputVariant = "success";
    else if (warning) inputVariant = "warning";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, inputSize, className }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || success || warning || helperText) && (
          <div className="flex items-center space-x-2 text-xs">
            {error && (
              <div className="flex items-center text-red-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}
            {warning && (
              <div className="flex items-center text-yellow-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {warning}
              </div>
            )}
            {helperText && !error && !success && !warning && (
              <div className="text-gray-500">{helperText}</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
