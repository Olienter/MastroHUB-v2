import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ===== COLORS FROM CSS VARS (NO HARDCODED HEX) =====
      colors: {
        // Base colors
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        "fg-subtle": "var(--color-fg-subtle)",
        "fg-muted": "var(--color-fg-muted)",

        // Brand colors
        brand: "var(--color-brand)",
        "brand-subtle": "var(--color-brand-subtle)",
        "brand-muted": "var(--color-brand-muted)",

        // Semantic colors
        focus: "var(--color-focus)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",

        // UI colors
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        surface: "var(--color-surface)",
        "surface-subtle": "var(--color-surface-subtle)",

        // Code & table colors
        "code-bg": "var(--color-code-bg)",
        "code-fg": "var(--color-code-fg)",
        "table-header": "var(--color-table-header)",
        select: "var(--color-select)",
      },

      // ===== SPACING FROM CSS VARS =====
      spacing: {
        0: "var(--space-0)",
        1: "var(--space-1)", // 4px
        2: "var(--space-2)", // 8px
        3: "var(--space-3)", // 12px
        4: "var(--space-4)", // 16px
        5: "var(--space-5)", // 20px
        6: "var(--space-6)", // 24px
        8: "var(--space-8)", // 32px
        10: "var(--space-10)", // 40px
        12: "var(--space-12)", // 48px
        16: "var(--space-16)", // 64px
        20: "var(--space-20)", // 80px
      },

      // ===== BORDER RADIUS FROM CSS VARS =====
      borderRadius: {
        0: "var(--radius-0)",
        1: "var(--radius-1)", // 6px
        2: "var(--radius-2)", // 12px
        3: "var(--radius-3)", // 16px
        4: "var(--radius-4)", // 24px
        full: "var(--radius-full)",
      },

      // ===== FONT SIZES FROM CSS VARS =====
      fontSize: {
        "step-0": "var(--step-0)", // Base
        "step-1": "var(--step-1)", // Small headings
        "step-2": "var(--step-2)", // Medium headings
        "step-3": "var(--step-3)", // Large headings
        "step-4": "var(--step-4)", // Hero headings
      },

      // ===== LINE HEIGHTS FROM CSS VARS =====
      lineHeight: {
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
        loose: "var(--leading-loose)",
      },

      // ===== FONT WEIGHTS FROM CSS VARS =====
      fontWeight: {
        light: "var(--weight-light)",
        normal: "var(--weight-normal)",
        medium: "var(--weight-medium)",
        semibold: "var(--weight-semibold)",
        bold: "var(--weight-bold)",
        extrabold: "var(--weight-extrabold)",
      },

      // ===== Z-INDEX FROM CSS VARS =====
      zIndex: {
        base: "var(--z-base)",
        sticky: "var(--z-sticky)",
        dropdown: "var(--z-dropdown)",
        popover: "var(--z-popover)",
        overlay: "var(--z-overlay)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
        modal: "var(--z-modal)",
        drawer: "var(--z-drawer)",
      },

      // ===== MAX WIDTH CLAMP =====
      maxWidth: {
        container: "var(--container-max)",
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
        "container-full": "none",
      },

      // ===== CONTAINER PADDING =====
      padding: {
        container: "var(--container-padding)",
        "container-sm": "var(--container-padding-sm)",
        "container-lg": "var(--container-lg)",
      },

      // ===== SHADOWS FROM CSS VARS =====
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
        4: "var(--shadow-4)",
        5: "var(--shadow-5)",
      },

      // ===== TRANSITION DURATIONS FROM CSS VARS =====
      transitionDuration: {
        fast: "var(--dur-fast)",
        med: "var(--dur-med)",
        slow: "var(--dur-slow)",
        slower: "var(--dur-slower)",
      },

      // ===== TRANSITION TIMING FUNCTIONS FROM CSS VARS =====
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        emphasized: "var(--ease-emphasized)",
        decelerate: "var(--ease-decelerate)",
        accelerate: "var(--ease-accelerate)",
      },

      // ===== ANIMATION KEYFRAMES =====
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },

      // ===== ANIMATION UTILITIES =====
      animation: {
        "fade-in": "fadeIn var(--dur-med) var(--ease-standard)",
        "fade-out": "fadeOut var(--dur-med) var(--ease-standard)",
        "slide-in-up": "slideInUp var(--dur-med) var(--ease-emphasized)",
        "slide-in-down": "slideInDown var(--dur-med) var(--ease-emphasized)",
        "slide-in-left": "slideInLeft var(--dur-med) var(--ease-emphasized)",
        "slide-in-right": "slideInRight var(--dur-med) var(--ease-emphasized)",
        "scale-in": "scaleIn var(--dur-med) var(--ease-emphasized)",
        "scale-out": "scaleOut var(--dur-med) var(--ease-emphasized)",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },

      // ===== CUSTOM UTILITIES =====
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      // ===== RESPONSIVE BREAKPOINTS =====
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      // ===== ASPECT RATIOS =====
      aspectRatio: {
        square: "1 / 1",
        video: "16 / 9",
        photo: "4 / 5",
        wide: "21 / 9",
        ultrawide: "32 / 9",
      },

      // ===== BACKDROP FILTERS =====
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "40px",
      },
    },
  },
  plugins: [
    // ===== CUSTOM PLUGINS =====
    function ({ addUtilities, theme }: { addUtilities: any; theme: any }) {
      const newUtilities = {
        // ===== CONTAINER QUERIES =====
        ".cq-xs": { containerType: "inline-size" },
        ".cq-sm": { containerType: "inline-size" },
        ".cq-md": { containerType: "inline-size" },
        ".cq-lg": { containerType: "inline-size" },
        ".cq-xl": { containerType: "inline-size" },

        // ===== SAFE AREA UTILITIES =====
        ".safe-top": { paddingTop: "env(safe-area-inset-top)" },
        ".safe-bottom": { paddingBottom: "env(safe-area-inset-bottom)" },
        ".safe-left": { paddingLeft: "env(safe-area-inset-left)" },
        ".safe-right": { paddingRight: "env(safe-area-inset-right)" },

        // ===== FOCUS UTILITIES =====
        ".focus-ring": {
          outline: "2px solid var(--color-focus)",
          outlineOffset: "2px",
          borderRadius: "var(--radius-1)",
        },

        // ===== SCROLL UTILITIES =====
        ".scroll-smooth": { scrollBehavior: "smooth" },
        ".scroll-auto": { scrollBehavior: "auto" },

        // ===== SELECTION UTILITIES =====
        ".selection-brand": {
          "&::selection": {
            backgroundColor: "var(--color-brand)",
            color: "white",
          },
          "&::-moz-selection": {
            backgroundColor: "var(--color-brand)",
            color: "white",
          },
        },
      };

      addUtilities(newUtilities);
    },
  ],
};

export default config;
