/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'retro-paper': '#f2f0e4',
        'retro-paper-dark': '#e6e2d0',
        'retro-ink': '#1a1a1a',
        'retro-green': '#1d3b36',
        'retro-green-light': '#2c4c46',
        'retro-gold': '#c5a059',
        'retro-gold-dim': '#8c7340',
        'retro-brown': '#4a3b32',
        'retro-red': '#8f3333',
        'retro-gray': '#707070',
        'retro-black': '#0a0a0a',
      },
      fontFamily: {
        sans: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cinzel"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scan: 'scan 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(197, 160, 89, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 160, 89, 0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
