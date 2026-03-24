import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ededed",
        border: "#333333",
        card: "#0a0a0a",
        "card-foreground": "#ededed",
        primary: {
          DEFAULT: "#ededed",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#ededed",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanner": "scanner 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        scanner: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
