import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function for conditional class names
 * Usage: classNames({ 'bg-red-500': isError, 'bg-green-500': isSuccess })
 */
export function classNames(
  ...classes: (string | boolean | undefined | null)[]
) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Utility function for creating responsive class names
 * Usage: responsiveClasses({ base: 'text-sm', md: 'text-base', lg: 'text-lg' })
 */
export function responsiveClasses(classes: Record<string, string>) {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === "base") return className;
      return `${breakpoint}:${className}`;
    })
    .join(" ");
}

/**
 * Utility function for creating variant class names
 * Usage: variantClasses('button', { size: 'lg', variant: 'primary' })
 */
export function variantClasses(
  base: string,
  variants: Record<string, string | undefined>
) {
  const variantClasses = Object.values(variants).filter(Boolean).join(" ");

  return cn(base, variantClasses);
}

/**
 * Utility function for creating state-based class names
 * Usage: stateClasses('button', { active: isActive, disabled: isDisabled })
 */
export function stateClasses(
  base: string,
  states: Record<string, boolean | undefined>
) {
  const stateClasses = Object.entries(states)
    .filter(([, isActive]) => isActive)
    .map(([state]) => `${base}--${state}`)
    .join(" ");

  return cn(base, stateClasses);
}

/**
 * Utility function for creating data attribute selectors
 * Usage: dataAttr('state', 'loading') -> 'data-state="loading"'
 */
export function dataAttr(attr: string, value: string | boolean | undefined) {
  if (value === undefined) return "";
  return `data-${attr}="${value}"`;
}

/**
 * Utility function for creating aria attributes
 * Usage: ariaAttr('label', 'Close menu') -> 'aria-label="Close menu"'
 */
export function ariaAttr(attr: string, value: string | boolean | undefined) {
  if (value === undefined) return "";
  return `aria-${attr}="${value}"`;
}

/**
 * Utility function for creating style objects
 * Usage: styleObj({ '--color-primary': 'red', '--spacing': '1rem' })
 */
export function styleObj(styles: Record<string, string | number>) {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string | number>);
}

/**
 * Utility function for creating CSS custom property values
 * Usage: cssVar('color-primary', 'red') -> 'var(--color-primary, red)'
 */
export function cssVar(name: string, fallback?: string) {
  if (fallback) {
    return `var(--${name}, ${fallback})`;
  }
  return `var(--${name})`;
}

/**
 * Utility function for creating responsive values
 * Usage: responsiveValue({ base: '1rem', md: '1.5rem', lg: '2rem' })
 */
export function responsiveValue(values: Record<string, string | number>) {
  return Object.entries(values)
    .map(([breakpoint, value]) => {
      if (breakpoint === "base") return value;
      return `@media (min-width: ${breakpoint}) { ${value} }`;
    })
    .join(" ");
}
