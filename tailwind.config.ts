import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    darkMode: "class", // Add this line!
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        dashArray: {
          "0%": { strokeDasharray: "0 1 359 0" },
          "50%": { strokeDasharray: "0 359 1 0" },
          "100%": { strokeDasharray: "359 1 0 0" },
        },
        dashOffset: {
          "0%": { strokeDashoffset: "365" },
          "100%": { strokeDashoffset: "5" },
        },
        spinDashArray: {
          "0%": { strokeDasharray: "270 90" },
          "50%": { strokeDasharray: "0 360" },
          "100%": { strokeDasharray: "270 90" },
        },
        spin: {
          "0%": { rotate: "0deg" },
          "12.5%": { rotate: "270deg" },
          "25%": { rotate: "270deg" },
          "37.5%": { rotate: "540deg" },
          "50%": { rotate: "540deg" },
          "62.5%": { rotate: "810deg" },
          "75%": { rotate: "810deg" },
          "87.5%": { rotate: "1080deg" },
          "100%": { rotate: "1080deg" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        dash: "dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite",
        spinDash:
          "spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite, dashOffset 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
