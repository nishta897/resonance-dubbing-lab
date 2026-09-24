import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1b33",
        cloud: "#f2f5f9",
        lime: "#d8f58f",
        cobalt: "#2857d6",
      },
      boxShadow: {
        lift: "0 24px 70px rgba(14, 27, 51, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
