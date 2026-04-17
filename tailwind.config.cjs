/** @type {import('tailwindcss').Config} */
module.exports = {
  // ─── REQUIRED for dark mode to work ───────────────────────────────────
  darkMode: 'class',
  // ──────────────────────────────────────────────────────────────────────

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary:   '#2563EB',
        secondary: '#1E40AF',
        accent:    '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },

  plugins: [],
};