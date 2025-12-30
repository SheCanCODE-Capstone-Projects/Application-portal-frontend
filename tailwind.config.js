/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        'aurora-move': 'aurora-move 30s linear infinite',
        'aurora-move-slow': 'aurora-move-slow 60s linear infinite',
        aurora: 'aurora 40s linear infinite',
      },
    },
  },
  plugins: [],
};