/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Dark blue base and one warm accent (see docs/DESIGN.md). Overriding these tokens restyles every class.
      colors: {
        // Channels live in CSS variables (src/index.css) so the "Ver mejor" panel can switch to high contrast.
        slate: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [n, `rgb(var(--slate-${n}) / <alpha-value>)`]),
        ),
        yellow: { 200: '#f7dc94', 300: '#f2c14e', 400: '#e5ab2c' },
      },
    },
  },
  plugins: [],
}
