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
      rule: 'rgb(var(--color-primary) / <alpha-value>)',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    extend: {
      fontFamily: {
        ovo: ['Ovo'],
      },
      letterSpacing: {
        widest: '0.3em',
      },
      boxShadow: {
        btn: '1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;',
        box: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px',
      },
    },
  },
  plugins: [],
};
