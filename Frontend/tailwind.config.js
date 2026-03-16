/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      colors: {
        // Premium dark theme colors
        background: {
          DEFAULT: "#0f172a", // deep slate
          50: "#1e293b",
          100: "#334155",
          200: "#475569",
          300: "#64748b",
          400: "#94a3b8",
          500: "#cbd5e1",
          600: "#e2e8f0",
          700: "#f1f5f9",
          800: "#f8fafc",
          900: "#fdfdfd",
        },
        primary: {
          // Electric blue for premium feel
          DEFAULT: "#0ea5e9",
          50: "#e0f2fe",
          100: "#baf7ff",
          200: "#81e6f9",
          300: "#22d3ee",
          400: "#06b6d4",
          500: "#0891b2",
          600: "#0e7490",
          700: "#155e75",
          800: "#164e63",
          900: "#083344",
        },
        accent: {
          // Emerald green for secondary accents
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#059669",
          600: "#047857",
          700: "#065f46",
          800: "#064e3b",
          900: "#03342a",
        },
        // Glassmorphism effects
        glass: {
          DEFAULT: "rgba(15, 23, 42, 0.5)",
          50: "rgba(15, 23, 42, 0.1)",
          100: "rgba(15, 23, 42, 0.2)",
          200: "rgba(15, 23, 42, 0.3)",
          300: "rgba(15, 23, 42, 0.4)",
          400: "rgba(15, 23, 42, 0.5)",
          500: "rgba(15, 23, 42, 0.6)",
          600: "rgba(15, 23, 42, 0.7)",
          700: "rgba(15, 23, 42, 0.8)",
          800: "rgba(15, 23, 42, 0.9)",
          900: "rgba(15, 23, 42, 0.95)",
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'premium': '0.75rem',
        'glass': '1rem',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}