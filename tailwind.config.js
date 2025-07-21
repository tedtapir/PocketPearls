/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        'cyber-blue': '#33FFCA',
        'soft-magenta': '#FF66B3',
        'deep-bg': '#0A0A14',
        'card-dark': '#1A1A28',
        'card-darker': '#101018',
        'action-bar': '#12121A',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};