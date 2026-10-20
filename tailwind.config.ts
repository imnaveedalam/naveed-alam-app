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
    },
  },
  plugins: [],
};
export default config;
