/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'wedding': {
          'brown': '#6b5d4f',
          'beige-light': '#f5f0e8',
          'beige': '#e8dcc8',
        },
      },
      letterSpacing: {
        'widest-plus': '0.25em',
      },
    },
  },
  plugins: [],
}

