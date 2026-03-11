/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        derivity: {
          purple: '#7c3aed',
          'purple-light': '#a855f7',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          cyan: '#06b6d4',
          dark: '#0a0a0a',
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 20s ease infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 12s infinite',
        'blob-delayed': 'blob 12s infinite 4s',
        'blob-long': 'blob 16s infinite 8s',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-24px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.08)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.92)' },
        },
      },
    },
  },
  plugins: [],
}
