import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fbf6f6",
          100: "#f6eded",
          200: "#ebd9d9",
          300: "#d9b8b8",
          400: "#c18d8f",
          500: "#a66568",
          600: "#8b4b4f",
          700: "#70393d",
          800: "#531b23", // Primary SEU Royal Burgundy
          900: "#44171d",
          950: "#270a0f",
        },
        gold: {
          50: "#fdfbf4",
          100: "#faf5e5",
          200: "#f3e7bd",
          300: "#ebd48a",
          400: "#e0bd53",
          500: "#c9a227", // Royal Gold
          600: "#b0851e",
          700: "#8c6219",
          800: "#744e1b",
          900: "#63421c",
          950: "#39220c",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tajawal", "system-ui", "sans-serif"],
      },
      borderRadius: {
        app: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
