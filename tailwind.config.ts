import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        surface: "rgb(var(--surface))",
        primary: "rgb(var(--primary))",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        border: "rgb(var(--border))",
        success: {
          bg: "var(--success-bg)",
          text: "var(--success-text)",
        },
        alert: {
          bg: "var(--alert-bg)",
          text: "var(--alert-text)",
        },
      },
      borderRadius: {
        lg: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
