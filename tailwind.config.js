/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0e101c",
          light: "#f5f5f5",
        },
        primary: {
          DEFAULT: "#00ffc3",
          50: "#f0fffe",
          100: "#ccfff7",
          200: "#99ffef",
          300: "#5cfee4",
          400: "#22f5d3",
          500: "#00ffc3",
          600: "#00cc9c",
          700: "#00a07d",
          800: "#007a63",
          900: "#006352",
        },
        secondary: {
          DEFAULT: "#3f3cbb",
          50: "#f3f2ff",
          100: "#e9e7ff",
          200: "#d5d2ff",
          300: "#b8b0ff",
          400: "#9580ff",
          500: "#7c5cff",
          600: "#6d3cff",
          700: "#5f2be8",
          800: "#4f23c4",
          900: "#3f3cbb",
        },
        danger: "#ff4f4f",
        success: "#20e3b2",
        "text-light": "#f5f5f5",
        "text-muted": "#b0b0b0",
      },
      fontFamily: {
        sans: ["var(--font-fira-code)", "Fira Code", "monospace"],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 195, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 195, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
