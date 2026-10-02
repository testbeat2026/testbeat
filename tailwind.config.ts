import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        healthians: {
          blue: '#002B49',
          orange: '#FF5A00',
          darkOrange: '#E04E00',
          teal: '#00A896',
          lightBlue: '#EBF4F6',
          bgGrey: '#F4F7F9'
        }
      }
    }
  },
  plugins: []
};
export default config;
