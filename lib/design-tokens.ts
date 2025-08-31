// ========================================
// MASTROHUB DESIGN TOKENS SYSTEM
// ========================================

// ===== PREMIUM COLOR SYSTEM =====
export const colors = {
  // Primary Brand - Sophisticated Red
  primary: {
    50: "#fef7f7",
    100: "#fdeaea",
    200: "#fbd5d5",
    300: "#f7b3b3",
    400: "#f08585",
    500: "#e85d5d", // Premium brand red
    600: "#d63a3a",
    700: "#b32d2d",
    800: "#942626",
    900: "#7a2323",
  },

  // Secondary Accent - Warm Terracotta
  secondary: {
    50: "#fef8f6",
    100: "#fdf0ec",
    200: "#fbe2d8",
    300: "#f7cdc0",
    400: "#f0ad94",
    500: "#e68a6b", // Sophisticated terracotta
    600: "#d46f4f",
    700: "#b15a3f",
    800: "#8f4a35",
    900: "#753e2e",
  },

  // Premium Neutrals - Gastronomy Palette
  neutral: {
    50: "#fafaf9", // Warm white
    100: "#f5f5f4", // Stone
    200: "#e7e5e4", // Warm gray
    300: "#d6d3d1", // Medium gray
    400: "#a8a29e", // Cool gray
    500: "#78716c", // Slate
    600: "#57534e", // Dark slate
    700: "#44403c", // Charcoal
    800: "#292524", // Dark charcoal
    900: "#1c1917", // Rich black
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    900: "#14532d",
  },

  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    900: "#78350f",
  },

  error: {
    50: "#fef2f2",
    500: "#ef4444",
    900: "#7f1d1d",
  },

  // Gastronomy Theme Colors
  gastronomy: {
    wine: "#722f37",
    olive: "#6b7280",
    herb: "#059669",
    spice: "#dc2626",
    cream: "#fef3c7",
  },
};

// ===== PREMIUM SPACING SYSTEM - 8pt Grid =====
export const spacing = {
  // Base spacing units (8px grid system - industry standard)
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
  "2xl": "4rem", // 64px
  "3xl": "6rem", // 96px
  "4xl": "8rem", // 128px

  // Component specific spacing - Premium density
  component: {
    padding: "1.25rem", // 20px - kompaktnejšie
    margin: "1.5rem", // 24px - optimalizované
    gap: "0.75rem", // 12px - hustejšie
    section: "2.5rem", // 40px - profesionálne
  },

  // Micro-spacing for premium feel
  micro: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
  },
};

// ===== TYPOGRAPHY SYSTEM =====
export const typography = {
  // Font sizes with consistent scale
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  // Font weights
  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Line heights
  lineHeights: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // Typography presets - Enterprise Premium 2026
  presets: {
    h1: {
      fontSize: "clamp(2.25rem, 4vw, 3.5rem)", // 36px - 56px - kompaktnejšie
      fontWeight: "700",
      lineHeight: "1.15",
      letterSpacing: "-0.02em",
      fontFamily: "'Playfair Display', serif", // Premium serif
    },
    h2: {
      fontSize: "clamp(1.75rem, 3vw, 2.25rem)", // 28px - 36px - optimalizované
      fontWeight: "600",
      lineHeight: "1.25",
      letterSpacing: "-0.015em",
      fontFamily: "'Inter', sans-serif", // Enterprise sans-serif
    },
    h3: {
      fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)", // 22px - 28px - hustejšie
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "-0.01em",
      fontFamily: "'Inter', sans-serif",
    },
    h4: {
      fontSize: "clamp(1.125rem, 2vw, 1.375rem)", // 18px - 22px - kompaktnejšie
      fontWeight: "500",
      lineHeight: "1.35",
      fontFamily: "'Inter', sans-serif",
    },
    body: {
      fontSize: "1rem", // 16px - optimalizované pre čitateľnosť
      fontWeight: "400",
      lineHeight: "1.6", // Professional line height
      fontFamily: "'Inter', sans-serif",
    },
    bodySmall: {
      fontSize: "0.875rem", // 14px - kompaktnejšie
      fontWeight: "400",
      lineHeight: "1.5",
      fontFamily: "'Inter', sans-serif",
    },
    caption: {
      fontSize: "0.75rem", // 12px - enterprise standard
      fontWeight: "500",
      lineHeight: "1.4",
      fontFamily: "'Inter', sans-serif",
    },
    button: {
      fontSize: "0.75rem", // 12px - kompaktnejšie
      fontWeight: "600",
      lineHeight: "1.3",
      letterSpacing: "0.02em",
      fontFamily: "'Inter', sans-serif",
      textTransform: "uppercase",
    },
  },
};

// ===== PREMIUM BORDER RADIUS - Refined Corners =====
export const borderRadius = {
  none: "0",
  xs: "0.125rem", // 2px - micro elements
  sm: "0.25rem", // 4px - small components
  base: "0.375rem", // 6px - standard components
  md: "0.5rem", // 8px - medium components
  lg: "0.75rem", // 12px - large components
  xl: "1rem", // 16px - premium components
  "2xl": "1.5rem", // 24px - hero elements
  "3xl": "2rem", // 32px - special elements
  full: "9999px", // pills and circles
};

// ===== PREMIUM SHADOW SYSTEM - Sophisticated Depth =====
export const shadows = {
  // Subtle shadows for premium feel
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",

  // Medium shadows for cards and components
  md: "0 3px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  lg: "0 8px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",

  // Premium shadows for elevated elements
  xl: "0 15px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl":
    "0 20px 40px -8px rgb(0 0 0 / 0.12), 0 10px 20px -6px rgb(0 0 0 / 0.12)",

  // Special shadows for premium interactions
  premium:
    "0 25px 50px -12px rgb(0 0 0 / 0.15), 0 12px 24px -6px rgb(0 0 0 / 0.15)",
  hero: "0 35px 60px -15px rgb(0 0 0 / 0.2), 0 15px 30px -8px rgb(0 0 0 / 0.2)",
};

// ===== TRANSITION SYSTEM =====
export const transitions = {
  fast: "150ms ease-in-out",
  normal: "250ms ease-in-out",
  slow: "350ms ease-in-out",
  bounce: "200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

// ===== BREAKPOINTS =====
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ===== Z-INDEX SYSTEM =====
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// ===== EXPORT ALL TOKENS =====
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
};

export default designTokens;
