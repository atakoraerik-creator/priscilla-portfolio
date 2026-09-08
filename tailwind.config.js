/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F3ECDF',
        },
        cream: '#F7F1E7',
        chocolate: {
          50: '#F4EDE4',
          100: '#E7D8C8',
          300: '#A9825C',
          500: '#6B4423',
          600: '#58371C',
          700: '#452A16',
          800: '#331E10',
          900: '#24150B',
        },
        gold: {
          300: '#D9B36A',
          400: '#C99C4B',
          500: '#B8862F',
          600: '#9C6F24',
        },
        beige: {
          200: '#E9DCC8',
          300: '#DCC9AC',
        },
        charcoal: '#2B2622',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      boxShadow: {
        soft: '0 20px 50px -24px rgba(36, 21, 11, 0.45)',
        card: '0 14px 40px -18px rgba(36, 21, 11, 0.35)',
      },
      maxWidth: {
        content: '80rem',
      },
    },
  },
  plugins: [],
};