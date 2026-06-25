/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    colors: {
      primary: 'rgb(52, 55, 60)',
      secondary: 'rgb(186, 38, 92)',
      light: 'rgb(238, 234, 227)',
      gray: 'rgb(228, 228, 228)',
      rule: 'rgb(52, 55, 60)',
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
