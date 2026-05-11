import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        sans: ["var(--font-open-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "blue-light": "#4A90E2",
        teal: "#00C4B4",
        "blue-dark": "#1A3C5A",
      },
      borderRadius: {
        // Используем стандартные значения Tailwind для sm, md, lg
        // Это должно обеспечить совместимость с shadcn/ui и другими компонентами
        sm: "0.375rem", // 6px
        md: "0.5rem", // 8px (стандартно для md в Tailwind)
        lg: "0.75rem", // 12px (стандартно для lg в Tailwind)
        xl: "1rem", // 16px (было 1.5rem, но 1rem более стандартно для xl)
        "2xl": "1.5rem", // 24px (было 2rem)
        "3xl": "2rem", // 32px (было 2.5rem)
        full: "9999px",
        // Оставляем возможность использовать --radius, если он где-то явно задан
        // но для стандартных sm, md, lg используем явные значения
        // radius: "var(--radius)", // Можно оставить, если нужно
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
