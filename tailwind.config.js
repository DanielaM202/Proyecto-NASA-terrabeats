/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // One restrained palette (see docs/DESIGN.md): a deep blue-black "observatory" base
      // and a single warm accent. Overriding these tokens restyles every existing class.
      colors: {
        slate: {
          50: '#f4f6fa', 100: '#e6ebf4', 200: '#cbd4e3', 300: '#aab6ca', 400: '#8b99b1',
          500: '#66758f', 600: '#44526b', 700: '#26324a', 800: '#161f31', 900: '#0d1422', 950: '#060a12',
        },
        yellow: { 200: '#f7dc94', 300: '#f2c14e', 400: '#e5ab2c' },
      },
    },
  },
  plugins: [],
}
