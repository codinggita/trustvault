/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vault: {
          base: '#0A0A0F',
          panel: '#111118',
          soft: '#171721',
          line: 'rgba(255,255,255,0.08)',
          gold: '#C9A84C',
          goldSoft: '#E8C96A',
          text: '#F6F0E3',
          muted: '#A8A3B3',
          success: '#2AB673',
          danger: '#F25F5C',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px rgba(201, 168, 76, 0.12)',
      },
      backgroundImage: {
        'vault-radial':
          'radial-gradient(circle at top, rgba(201, 168, 76, 0.18), transparent 32%), radial-gradient(circle at 80% 20%, rgba(232, 201, 106, 0.08), transparent 20%)',
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

