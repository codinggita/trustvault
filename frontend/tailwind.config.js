/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // blue-600
        secondary: '#10b981', // emerald-500
        accent: '#f59e0b', // amber-500
        dark: '#1e293b', // slate-800
        light: '#f8fafc', // slate-50
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}