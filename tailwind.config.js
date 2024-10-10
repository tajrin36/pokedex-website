/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    fontFamily:{
      'roboto':["Roboto", "sans-serif"],
    },
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
