/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FAF8F2',
          100: '#F5F1E5',
          200: '#EEEAD7', // Mandatory light mode background
          300: '#E2DCBF',
          400: '#D4CCA3',
        },
        ink: {
          950: '#0B0909', // Mandatory dark mode background
          900: '#151212',
          800: '#1F1B19',
          700: '#2C2724',
          Charcoal: '#191614',
        },
        terracotta: {
          DEFAULT: '#C84B29',
          light: '#D95C38',
          dark: '#A63819',
        },
        mustard: {
          DEFAULT: '#D89B28',
          light: '#E6AC3C',
          dark: '#BA8018',
        },
        forest: {
          DEFAULT: '#285B43',
          light: '#367255',
          dark: '#1D4532',
        },
        navy: {
          50: '#f0f4f9',
          100: '#e1e8f2',
          200: '#c3d2e6',
          300: '#95b2d4',
          400: '#608cc0',
          500: '#3c6ea8',
          600: '#2b548b',
          700: '#234471',
          800: '#1b355a',
          900: '#183661',
          950: '#0B0909',
        },
      },
      boxShadow: {
        'craft-sm': '2px 2px 0px 0px var(--border-color)',
        'craft': '3px 3px 0px 0px var(--border-color)',
        'craft-lg': '5px 5px 0px 0px var(--border-color)',
        'craft-hover': '6px 6px 0px 0px var(--border-color)',
      },
    },
  },
  plugins: [],
};
