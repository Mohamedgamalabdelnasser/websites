import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        rex: "#f0c417",
        sale: "#f83a3a",
        soft: "#f7f7f5",
      },
      fontFamily: {
        display: ["var(--font-barlow)", "Barlow", "sans-serif"],
        sans: ["var(--font-barlow)", "Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
