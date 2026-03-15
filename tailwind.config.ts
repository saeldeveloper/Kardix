import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F8F8F6",
        primary: "#b539ff", // Acento primario morado
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
        },
        border: "#E5E7EB",
        success: {
          bg: "#ECFDF5",
          text: "#059669",
        },
        alert: {
          bg: "#FFFBEB",
          text: "#D97706",
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
