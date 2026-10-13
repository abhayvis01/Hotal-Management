/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bluebird: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // Brand Primary
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a", // Brand Dark
          950: "#172554",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b", // Accent
          600: "#d97706",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
