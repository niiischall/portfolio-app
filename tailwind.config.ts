/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      light: 'rgb(var(--color-light) / <alpha-value>)',
      gray: 'rgb(var(--color-gray) / <alpha-value>)',
      muted: 'rgb(var(--color-muted) / <alpha-value>)',
      rule: 'rgb(var(--color-rule) / <alpha-value>)',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    fontFamily: {
      sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      serif: ['Newsreader', 'Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
    },
    extend: {},
  },
  plugins: [],
};
