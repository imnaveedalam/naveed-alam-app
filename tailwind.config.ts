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
          950: "#07140f",
          900: "#0c1f17",
          800: "#143026",
          700: "#1b4334",
          600: "#2d6a4f",
        },
        ember: {
          300: "#ffc085",
          400: "#ff9f43",
          500: "#f0771a",
        },
        sand: {
          50: "#f6f1e7",
          100: "#ebe4d6",
          300: "#cfc6b4",
          400: "#a89f8e",
        },
      },
      boxShadow: {
        card: "0 18px 40px -28px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        lift: "0 28px 48px -22px rgba(0, 0, 0, 0.92), 0 16px 34px -18px rgba(240, 119, 26, 0.42)",
        soft: "0 10px 28px -20px rgba(0, 0, 0, 0.75)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
