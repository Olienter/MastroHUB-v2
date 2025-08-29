import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'container';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

export function Container({ 
  children, 
  className, 
  as: Component = 'div',
  maxWidth = 'container',
  padding = 'md',
  center = true
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-container-sm',
    md: 'max-w-container-md',
    lg: 'max-w-container-lg',
    xl: 'max-w-container-xl',
    full: 'max-w-none',
    container: 'max-w-container'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-container-sm',
    md: 'px-container',
    lg: 'px-container-lg'
  };

  return (
    <Component
      className={cn(
        // ===== BASE CONTAINER STYLES =====
        'w-full',
        
        // ===== MAX WIDTH =====
        maxWidthClasses[maxWidth],
        
        // ===== CENTERING =====
        center && 'mx-auto',
        
        // ===== PADDING =====
        paddingClasses[padding],
        
        // ===== SAFE AREA SUPPORT =====
        'pl-[max(var(--space-4),env(safe-area-inset-left))]',
        'pr-[max(var(--space-4),env(safe-area-inset-right))]',
        
        // ===== RESPONSIVE ADJUSTMENTS =====
        'sm:pl-[max(var(--space-6),env(safe-area-inset-left))]',
        'sm:pr-[max(var(--space-6),env(safe-area-inset-right))]',
        'lg:pl-[max(var(--space-8),env(safe-area-inset-left))]',
        'lg:pr-[max(var(--space-8),env(safe-area-inset-right))]',
        
        // ===== CUSTOM CLASSES =====
        className
      )}
    >
      {children}
    </Component>
  );
}

// ===== CONTAINER VARIANTS =====
export function ContainerNarrow({ 
  children, 
  className, 
  ...props 
}: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container 
      maxWidth="md" 
      className={cn('max-w-prose', className)} 
      {...props}
    >
      {children}
    </Container>
  );
}

export function ContainerWide({ 
  children, 
  className, 
  ...props 
}: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container 
      maxWidth="xl" 
      className={cn('max-w-7xl', className)} 
      {...props}
    >
      {children}
    </Container>
  );
}

export function ContainerFull({ 
  children, 
  className, 
  ...props 
}: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container 
      maxWidth="full" 
      className={cn('px-0', className)} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== CONTAINER WITH BACKGROUND =====
export function ContainerWithBackground({ 
  children, 
  className, 
  background = 'surface',
  ...props 
}: ContainerProps & { background?: 'surface' | 'surface-subtle' | 'brand' | 'brand-subtle' }) {
  const backgroundClasses = {
    surface: 'bg-surface',
    'surface-subtle': 'bg-surface-subtle',
    brand: 'bg-brand text-white',
    'brand-subtle': 'bg-brand-subtle text-white'
  };

  return (
    <div className={cn('w-full', backgroundClasses[background])}>
      <Container className={className} {...props}>
        {children}
      </Container>
    </div>
  );
}

// ===== CONTAINER WITH BORDER =====
export function ContainerWithBorder({ 
  children, 
  className, 
  border = 'border',
  ...props 
}: ContainerProps & { border?: 'border' | 'border-subtle' | 'none' }) {
  const borderClasses = {
    border: 'border border-border',
    'border-subtle': 'border border-border-subtle',
    none: ''
  };

  return (
    <Container 
      className={cn(
        'rounded-radius-2',
        borderClasses[border],
        className
      )} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== CONTAINER WITH SHADOW =====
export function ContainerWithShadow({ 
  children, 
  className, 
  shadow = 'shadow-2',
  ...props 
}: ContainerProps & { shadow?: 'shadow-1' | 'shadow-2' | 'shadow-3' | 'shadow-4' | 'shadow-5' }) {
  return (
    <Container 
      className={cn(
        'rounded-radius-2',
        shadow,
        className
      )} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== CONTAINER WITH PADDING =====
export function ContainerWithPadding({ 
  children, 
  className, 
  padding = 'md',
  ...props 
}: ContainerProps & { padding?: 'none' | 'sm' | 'md' | 'lg' }) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <Container 
      className={cn(
        'rounded-radius-2',
        paddingClasses[padding],
        className
      )} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== CONTAINER WITH GRID =====
export function ContainerWithGrid({ 
  children, 
  className, 
  columns = 12,
  gap = 'md',
  ...props 
}: ContainerProps & { 
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <Container 
      className={cn(
        'grid',
        gridClasses[columns],
        gapClasses[gap],
        className
      )} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== CONTAINER WITH FLEX =====
export function ContainerWithFlex({ 
  children, 
  className, 
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  ...props 
}: ContainerProps & { 
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg';
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <Container 
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        gapClasses[gap],
        className
      )} 
      {...props}
    >
      {children}
    </Container>
  );
}

// ===== DEFAULT EXPORT =====
export default Container;
