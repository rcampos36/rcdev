import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'big-shoulders': ['var(--font-big-shoulders)', 'sans-serif'],
        'archivo': ['var(--font-archivo)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
