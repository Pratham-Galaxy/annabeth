/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        mono: ['"Rajdhani"', 'ui-monospace', 'monospace'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
      },
      colors: {
        carbon: {
          50: '#f5f6f7',
          100: '#e6e8eb',
          200: '#c4c9cf',
          300: '#9ba2ab',
          400: '#6d7680',
          500: '#4d555e',
          600: '#3a4047',
          700: '#2a2f35',
          800: '#1c2024',
          900: '#121417',
          950: '#08090b',
        },
        racing: {
          red: '#e10600',
          redDark: '#b00500',
          green: '#00d46a',
          yellow: '#ffd700',
          blue: '#0080ff',
          orange: '#ff6a00',
        },
        pinstripe: {
          gold: '#d4af37',
          goldLight: '#f0d264',
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'scroll-x': 'scrollX 30s linear infinite',
        'tyre-spin': 'tyreSpin 0.6s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.6', filter: 'brightness(1.5)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '47%': { opacity: '0.3' },
          '49%': { opacity: '1' },
          '51%': { opacity: '0.6' },
          '53%': { opacity: '1' },
        },
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tyreSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
