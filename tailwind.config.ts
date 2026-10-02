import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#ecfeff', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 900: '#164e63' },
        admin: { bg: '#0b1329', card: '#111e38', border: '#1e2d4d' }
      }
    }
  },
  plugins: []
};
export default config;
