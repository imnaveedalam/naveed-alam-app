import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forest: {
          950: "#030303",
          900: "#0a0a0a",
          800: "#121212",
          700: "#1a1a1a",
          600: "#262626",
        },
        ember: {
          300: "#ffb86c",
          400: "#ff8c2a",
          500: "#e85d04",
        },
        flame: {
          400: "#d62828",
          500: "#9b2226",
        },
        sand: {
          50: "#f5f2eb",
          100: "#e8e2d6",
          300: "#b3aa9c",
          400: "#857e72",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 22px 48px -32px rgba(0, 0, 0, 0.98), inset 0 1px 0 rgba(255, 255, 255, 0.035)",
        lift: "0 32px 56px -26px rgba(0, 0, 0, 0.98), 0 16px 32px -18px rgba(232, 93, 4, 0.42)",
        soft: "0 12px 30px -22px rgba(0, 0, 0, 0.9)",
        ember:
          "0 0 0 1px rgba(232, 93, 4, 0.4), 0 14px 32px -12px rgba(232, 93, 4, 0.6)",
      },
      backgroundImage: {
        "road-fade":
          "linear-gradient(180deg, rgba(3,3,3,0.15), rgba(3,3,3,0.72) 62%, #030303)",
        "asphalt-glow":
          "radial-gradient(ellipse 80% 55% at 12% 8%, rgba(232,93,4,0.28), transparent 55%), radial-gradient(ellipse 60% 45% at 92% -5%, rgba(155,34,38,0.22), transparent 50%), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(255,140,42,0.08), transparent 55%)",
        "dash-glow":
          "linear-gradient(90deg, transparent, rgba(232,93,4,0.55), transparent)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "road-pulse": {
          "0%, 100%": { opacity: "0.25", transform: "scaleX(0.92)" },
          "50%": { opacity: "0.85", transform: "scaleX(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "stripe-drift": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "48px 0" },
        },
      },
      animation: {
        "road-pulse": "road-pulse 5s ease-in-out infinite",
        "fade-up": "fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        "stripe-drift": "stripe-drift 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
