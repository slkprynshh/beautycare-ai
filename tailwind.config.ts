import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          muted: "var(--surface-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        champagne: {
          50: "#FAF7F2",
          100: "#F4EEE2",
          200: "#E8DCB9",
          300: "#DBC898",
          400: "#C5A880",
          500: "#B4976F",
          600: "#9A7E56",
          700: "#7E6542",
          800: "#5D492F",
          900: "#3E301F",
          DEFAULT: "var(--gold)",
        },
        blush: {
          50: "#FDF8F7",
          100: "#FAF2F0",
          200: "#F5E3DF",
          300: "#ECCAC3",
          400: "#E0AEA3",
          500: "#D39083",
          DEFAULT: "var(--blush)",
          surface: "var(--blush-surface)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          hover: "var(--gold-hover)",
          surface: "var(--gold-surface)",
          border: "var(--gold-border)",
        },
        charcoal: {
          50: "#71717A",
          100: "#52525B",
          200: "#3F3F46",
          300: "#27272A",
          400: "#1E1E21",
          500: "#18181B",
          DEFAULT: "var(--charcoal)",
        },
        success: {
          DEFAULT: "var(--success)",
          surface: "var(--success-surface)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          surface: "var(--warning-surface)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          surface: "var(--destructive-surface)",
        },
        info: {
          DEFAULT: "var(--info)",
          surface: "var(--info-surface)",
        },
        muted: {
          DEFAULT: "var(--surface-muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        serif: [
          "Playfair Display",
          "Cormorant Garamond",
          "Didot",
          "Bodoni MT",
          "Georgia",
          "serif",
        ],
        sans: [
          "Plus Jakarta Sans",
          "Montserrat",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        label: [
          "Montserrat",
          "Plus Jakarta Sans",
          "sans-serif",
        ],
      },
      borderRadius: {
        "apple-sm": "8px",
        "apple": "12px",
        "apple-lg": "16px",
        "apple-xl": "20px",
        "apple-2xl": "24px",
        "parisian": "28px",
      },
      boxShadow: {
        "subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "elevated": "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
        "floating": "0 20px 35px -10px rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        "luxury": "0 14px 40px -10px rgba(26, 20, 15, 0.08)",
        "luxury-hover": "0 22px 50px -12px rgba(26, 20, 15, 0.14)",
        "gold-glow": "0 4px 24px -2px rgba(197, 168, 128, 0.40)",
      },
    },
  },
  plugins: [],
};
export default config;
