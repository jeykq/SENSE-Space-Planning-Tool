/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        orange: {
          '600': '#dd6b20', // existing color
          '700': '#c05621', // darker shade
        },
        indigo: {
          '600': '#5a67d8', // existing color
          '700': '#4c51bf', // darker shade
        },
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'html': {fontSize:"var(--html-font-size)"}
      })
    })
  ],
}
