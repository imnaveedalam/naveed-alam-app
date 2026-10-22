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
          950: "#050505",
          900: "#0c0c0c",
          800: "#151515",
          700: "#1f1f1f",
          600: "#2c2c2c",
        },
        ember: {
          300: "#ffb36a",
          400: "#ff8a2b",
          500: "#f05a00",
        },
        flame: {
          400: "#e23d2d",
          500: "#c62828",
        },
        sand: {
          50: "#f4f1ec",
          100: "#e6e1d8",
          300: "#b8b0a4",
          400: "#8a8378",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 20px 44px -30px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        lift: "0 30px 50px -24px rgba(0, 0, 0, 0.95), 0 14px 30px -16px rgba(240, 90, 0, 0.45)",
        soft: "0 10px 28px -20px rgba(0, 0, 0, 0.85)",
        ember: "0 0 0 1px rgba(240, 90, 0, 0.35), 0 12px 28px -14px rgba(240, 90, 0, 0.55)",
      },
      backgroundImage: {
        "road-fade":
          "linear-gradient(180deg, rgba(5,5,5,0.2), rgba(5,5,5,0.75) 70%, #050505)",
        "asphalt-glow":
          "radial-gradient(ellipse at 15% 10%, rgba(240,90,0,0.22), transparent 42%), radial-gradient(ellipse at 90% 0%, rgba(198,40,40,0.14), transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(255,138,43,0.08), transparent 45%)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "road-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "road-pulse": "road-pulse 4.5s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
