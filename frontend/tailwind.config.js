/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        success: {
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
          700: "#15803d",
        },
        warning: {
          100: "#fef9c3",
          400: "#facc15",
          500: "#eab308",
          700: "#a16207",
        },
        danger: {
          100: "#fee2e2",
          400: "#f87171",   // ✅ FIXED
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
        "soft-lg": "0 10px 30px rgba(0,0,0,0.1)",
        colored: "0 4px 20px rgba(99,102,241,0.25)",
        "colored-lg": "0 10px 30px rgba(99,102,241,0.35)",
      },

      animation: {
        "pulse-soft": "pulse 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-in-out",
        "slide-down": "slideDown 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },

  plugins: [],
};