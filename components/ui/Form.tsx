import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface FormErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-fg", className)}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  )
);

const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    >
      {children}
    </p>
  )
);

const FormErrorText = React.forwardRef<HTMLParagraphElement, FormErrorTextProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-error", className)}
      role="alert"
      {...props}
    >
      {children}
    </p>
  )
);

FormField.displayName = "FormField";
FormLabel.displayName = "FormLabel";
FormHelperText.displayName = "FormHelperText";
FormErrorText.displayName = "FormErrorText";

export { FormField, FormLabel, FormHelperText, FormErrorText };
export type { FormFieldProps, FormLabelProps, FormHelperTextProps, FormErrorTextProps };
