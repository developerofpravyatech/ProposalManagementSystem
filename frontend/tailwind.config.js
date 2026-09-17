/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#C81D31',
          600: '#C81D31',
          700: '#C81D31',
          800: '#C81D31',
          900: '#C81D31',
          950: '#C81D31',
        },
        dark: {
          800: '#2A2C35',
          850: '#2A2C35',
          900: '#2A2C35',
          950: '#2A2C35',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
        'glow-black': '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.08), 0 8px 12px -4px rgba(220, 38, 38, 0.06)',
      }
    },
  },
  plugins: [],
}
